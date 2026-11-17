// Google reviews, fetched from the Google Places API each time the site is built.
//
// Netlify rebuilds the site once a day (netlify/functions/refresh-reviews.mjs), so new reviews
// appear within a day without anyone touching the code. Visitors' browsers never contact Google:
// the reviews are baked into the page as plain HTML, so no cookies and no consent needed.
//
// Needs two environment variables (Netlify: Site configuration > Environment variables):
//   GOOGLE_PLACES_API_KEY  a Google Cloud API key with the "Places API (New)" enabled
//   GOOGLE_PLACE_ID        the Place ID of the Google Business Profile
// Without them, or if Google can't be reached, the build carries on and the reviews section
// falls back to src/_data/reviews.json (and stays hidden if that is empty too).
//
// To preview the design locally without a key: REVIEWS_PREVIEW=1 npm start
import fs from "node:fs";

const CACHE_FILE = ".cache/google-reviews.json";
const CACHE_HOURS = 6; // local only: stops `npm start` calling Google on every save
const MAX_CHARS = 450; // longer reviews are shortened, with a link to read them in full

const sample = {
  rating: 5,
  count: 1,
  url: "https://maps.google.com/",
  writeUrl: "https://maps.google.com/",
  reviews: [
    {
      name: "Sample Reviewer",
      rating: 5,
      date: "November 2026",
      text: "This is a preview of how a Google review will look. Ryan came round the same day, sorted out the printer and the Wi-Fi, and explained everything without any jargon. Would definitely recommend.",
      shortened: false,
      url: "https://maps.google.com/",
    },
  ],
};

function shorten(text) {
  if (text.length <= MAX_CHARS) return { text, shortened: false };
  const cut = text.slice(0, MAX_CHARS).replace(/\s+\S*$/, "").replace(/[,;:.\s]+$/, "");
  return { text: `${cut}…`, shortened: true };
}

function tidy(place) {
  const url = place.googleMapsLinks?.reviewsUri || place.googleMapsUri || null;
  const reviews = (place.reviews || [])
    .map((r) => ({ r, text: (r.originalText?.text || r.text?.text || "").trim() }))
    // A star rating with no words doesn't make a quote, so show the written ones. Don't filter
    // by stars: UK consumer law (DMCC Act 2024) treats hiding bad reviews as misleading.
    .filter(({ text }) => text)
    .map(({ r, text }) => ({
      name: r.authorAttribution?.displayName || "A Google reviewer",
      rating: r.rating,
      date: r.publishTime ? new Date(r.publishTime).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "",
      url: r.authorAttribution?.uri || url,
      ...shorten(text),
    }));
  return {
    rating: place.rating || null,
    count: place.userRatingCount || 0,
    url,
    writeUrl: place.googleMapsLinks?.writeAReviewUri || url,
    reviews,
  };
}

function readCache(maxHours) {
  try {
    const { savedAt, data } = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    if (Date.now() - savedAt < maxHours * 3600e3) return data;
  } catch {}
  return null;
}

export default async function () {
  if (process.env.REVIEWS_PREVIEW) return sample;

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    console.log("[google reviews] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set, skipping");
    return null;
  }

  const onNetlify = process.env.NETLIFY === "true";
  if (!onNetlify) {
    const cached = readCache(CACHE_HOURS);
    if (cached) return cached;
  }

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en-GB&regionCode=GB`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
    const data = tidy(await res.json());
    console.log(`[google reviews] ${data.count} ratings, ${data.reviews.length} written reviews shown`);
    if (!onNetlify) {
      fs.mkdirSync(".cache", { recursive: true });
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ savedAt: Date.now(), data }));
    }
    return data;
  } catch (err) {
    // Never break the build over reviews: fall back to the last copy, or hide the section
    console.warn(`[google reviews] couldn't fetch, carrying on without them: ${err.message}`);
    return onNetlify ? null : readCache(24 * 365);
  }
}
