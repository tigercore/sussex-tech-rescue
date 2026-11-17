// Rebuilds the live site once a day so new Google reviews show up (see src/_data/google.js).
// Needs REVIEWS_BUILD_HOOK set to a Netlify build hook URL for the main branch
// (Site configuration > Build & deploy > Build hooks). Scheduled functions only run on the
// published site, not on deploy previews.
export default async () => {
  const hook = process.env.REVIEWS_BUILD_HOOK;
  if (!hook) {
    console.log("REVIEWS_BUILD_HOOK not set, skipping the daily review refresh");
    return new Response("No build hook set", { status: 200 });
  }
  const res = await fetch(`${hook}?trigger_title=${encodeURIComponent("Daily Google reviews refresh")}`, { method: "POST" });
  console.log(`Build hook answered ${res.status}`);
  return new Response(`Build hook answered ${res.status}`, { status: res.ok ? 200 : 502 });
};

// Every day at 5am UTC, a quiet time for the site
export const config = { schedule: "0 5 * * *" };
