# SEO and website changes – 18 November 2026

This covers the work done for the Sussex Tech Rescue SEO brief. Everything is on the local branch `claude/project-thread-fs3hom` in five commits. **Nothing has been pushed or deployed.** You can preview it at http://localhost:8081/.

The baseline is the Search Console export from 18 Nov 2026: 732 impressions, 9 clicks, average position about 60. The home page had 7 clicks from 43 impressions at position 4.5.

---

## 1. Summary of changes (DONE)

**Stage 1 – Focus on home tech help** (commit `e1b7a7c`)
- Services are reordered to follow the brief. The menu, footer and homepage now show only the main services:
  - Home computer help
  - Computer repairs and upgrades
  - Wi-Fi help and installation
  - Scam and security help
  - Tech lessons
  - Smart home help
  - Data recovery
  - Help for your parents
  - Tech help at your own pace
  - Remote help
- Five services are now marked as **secondary**: Microsoft 365 and Google, Custom PC builds, PS5 clean, Small business IT, and Web design and local SEO. They're gone from the menu and the homepage card grid, and they appear only in a small "Also available" list in the footer. Their pages are still live and their URLs haven't changed.
- On the homepage, the "Who I help" section's "For my business" card is replaced by "To learn it myself", which links to Tech lessons. The heading is now "Help for you and your family".
- Under "What else can I do?", one line now mentions Microsoft 365, custom PCs and PS5 cleaning. Business IT and web design aren't mentioned on the homepage at all.
- Three labels are clearer: "Repairs and upgrades" is now "Computer repairs and upgrades", "Wi-Fi installation" is now "Wi-Fi help and installation", and "Been scammed?" is now "Scam and security help" in menus. The scam page itself still opens with "Been scammed?".

**Stage 2 – Homepage and contact** (commit `c19c47b`)
- New homepage title, description and H1 (see section 5).
- "Computer playing up? I can help." stays as the line under the H1, with the rotating gadget word.
- The intro now says what you do (computers, laptops, Wi-Fi, printers, phones, tablets), where (Eastbourne, Bexhill, Hastings or nearby) and that people deal with you, not a call centre.
- The trust chips now include "Fully DBS checked".
- The booking form intro on every page now starts with: "Not sure what's wrong? That's absolutely fine. Just describe what you're experiencing and I'll take it from there. No technical knowledge needed." The contact page has a similar line, and a new title and description.
- Phone and WhatsApp were already prominent on mobile, in the fixed Call / WhatsApp / Book bar and in each hero, so they're unchanged.

**Stage 3 – Town pages** (commit `1940bb9`)
- **Eastbourne, Hastings and Bexhill** each now have their own title, meta description and H1, plus three sections written for that town:
  - **Eastbourne:** repairs (including drop-off at 42 Commercial Road); Wi-Fi, printers, phones and tablets; lost files and scams.
  - **Hastings:** repairs across Old Town, Ore and Hollington; Wi-Fi in older homes with thick walls; help for parents.
  - **Bexhill:** laptop and computer repair; Wi-Fi, printers and new devices; scams.
- The Hastings "local" paragraph used to lead on websites and Google listings. It now talks about home help.
- The other town pages had "Computer repair and IT support in [town]" as their title. They now use "Computer help at home in [town]", because "IT support" was drawing business searches.

**Stage 4 – Technical SEO and structured data** (commit `9d29207`)
- LocalBusiness schema now has a stable `@id`, `sameAs` (Facebook and your Google Maps profile) and `hasMap`. It still has no street address (see section 8).
- Every inner page now has BreadcrumbList schema (Home › Page, or Home › Areas › Town for town pages).
- Each main service page now has Service schema linked to the business. The secondary services don't get any.
- All the JSON-LD on all 30 pages checks out as valid. There's one LocalBusiness block per page and nothing contradicts anything else.
- The 404 and thank-you pages are now `noindex`. They were already left out of the sitemap.
- Three meta descriptions that went over about 160 characters were shortened.
- `TODO.md` now ticks off sameAs and noindex.

**Final commit** (this report)
- The Help for your parents page has a new title, "Computer help for elderly parents in Eastbourne, Bexhill and Hastings", and its description mentions Hastings.

## 2. Pages updated

- Every page, through shared parts: header menu, footer, booking form intro, structured data
- `/` (homepage)
- `/contact/`
- `/computer-help-eastbourne/`, `/computer-help-hastings/`, `/computer-help-bexhill/` (new content)
- `/computer-help-st-leonards/`, `/computer-help-polegate/`, `/computer-help-hailsham/`, `/computer-help-pevensey/`, `/computer-help-westham/`, `/computer-help-willingdon/` (title and H1 only)
- `/help-for-your-parents/` (title and description)
- `/tech-lessons/` (shorter description)
- `/computer-repairs-upgrades/`, `/wifi-installation/` (form preselect labels only)
- `/404.html`, `/thanks/` (noindex)

## 3. Pages deliberately left unchanged

- **Service pages** (repairs, Wi-Fi, data recovery, Microsoft 365, lessons, smart home, scams, remote help, own pace). Their titles and wording were already updated for local searches earlier today and are already aimed at home users. They only pick up the shared changes.
- **`/business-it-support/` and `/web-design-local-seo/`**. They're kept live and unchanged, but taken out of the menu and the homepage. They aren't redirected, because they have no close match on the site, and the brief says not to send unrelated pages to the homepage. See section 4.
- **`/custom-pc-builds/`, `/ps5-cleaning/`, `/microsoft-365-google-help/`**. These are still useful, but secondary, so they're linked from the footer and one homepage line.
- **`/about/`, `/areas/`, `/privacy/`**. They were already accurate and personal, so I made no changes.
- **Prices, plans, promises, reviews, forms, phone and WhatsApp links**. None of these changed.
- **Smaller town pages** (St Leonards, Polegate, Hailsham, Pevensey, Westham, Willingdon). Each already has its own intro, local paragraph and list of areas, so none of them is a thin copy. I kept them all and only changed the title and H1.

## 4. URLs retired, redirected or marked for review

- **No URLs were removed or changed** in this work.
- **Already redirected (live since earlier today):** `/computer-help-seaford/` → `/areas/` (301). See the question in section 8.
- **"Page with redirect" in Search Console (3 pages).** I checked the live site. These redirects all work and look intentional:
  - `http://sussextechrescue.co.uk/` → `https://sussextechrescue.co.uk/`
  - `https://www.sussextechrescue.co.uk/` → `https://sussextechrescue.co.uk/`
  - `http://www.…` → `https://www.…` → `https://sussextechrescue.co.uk/`
  - Netlify also adds a trailing slash, for example `/about` → `/about/`.

  Your export was taken before the Seaford redirect went live, so Seaford isn't one of the three. The exact three URLs are listed under Search Console → Pages → "Page with redirect". If any of them isn't one of the redirects above, let me know.
- **Marked for review:** `/business-it-support/` and `/web-design-local-seo/`. Between them they get 415 of the 732 impressions, but from people you're not trying to reach. These are the options, safest first (my recommendation):
  1. **Leave them as they are now** for 4–8 weeks: live, but out of the menu and homepage. Then see whether home-help searches start to grow.
  2. **Add `noindex`** so Google stops showing them, while the URLs keep working for anyone with a link. This is the cleanest way to retire them later without breaking anything.
  3. Once they've dropped out of Google, either remove them with a 410 or keep them as unlisted pages.

## 5. New homepage title, description and H1

- **Title:** Computer Help at Home in Eastbourne, Hastings & Bexhill | Sussex Tech Rescue
- **Meta description:** Need computer help at home in Eastbourne, Bexhill or Hastings? Friendly support for laptops, Wi-Fi, printers and phones. Clear prices, no jargon. Call today.
- **H1:** Computer help at home across East Sussex
- **Supporting line:** "Computer playing up? I can help." (with the rotating word)

## 6. Structured data changes

| Block | Where | What |
|---|---|---|
| LocalBusiness | Every page | Added `@id`, `sameAs` (https://www.facebook.com/sussextechrescue, https://maps.google.com/?cid=6377038136499278513) and `hasMap`. Name, phone, email, opening hours, price range and the 9 service towns are unchanged. The address is town and county only. |
| BreadcrumbList | Every page except the homepage | New |
| Service | Main service pages (repairs, Wi-Fi, scams, lessons, smart home, data recovery, parents, own pace, remote) | New. Each one is linked to the business by `@id`. |

Your Google Place ID (`ChIJ_z9LDbjbQwoRsZIo7WXKf1g`) isn't used in the schema, because schema.org has no field for it. The Maps link does the same job.

## 7. Analytics and tracking (checked, not changed)

**What's on the site now:**
- **Umami** loads on every page and doesn't use cookies.
- **Google Tag Manager** (`GTM-WR9BS752`) loads only after a visitor clicks Accept on the cookie banner. I didn't find any GA4 tag in the site code, so if GA4 is set up, it's inside the GTM container.

**What you can measure today, in Umami:**

| What | Measured? | How |
|---|---|---|
| Phone link clicks | Yes | A "Call" event on every `tel:` link, recording which page and which part of it |
| WhatsApp clicks | Yes | A "WhatsApp" event on every `wa.me` link, the same way |
| Form submissions | Yes | A "Form submit" event when the browser sends a form with its required fields filled in. Opening or starting the form doesn't count. |
| Successful enquiries | Yes | Page views of `/thanks/`. Netlify only shows that page after it has accepted the form. This is your best "enquiry received" number. Count the views from inside Umami: `/thanks/` is now noindex, so search won't send traffic there. |

A click on a phone or WhatsApp link shows that someone intended to get in touch. It doesn't prove a call or message happened.

**I didn't add anything**, so nothing is counted twice. If you want the same numbers in GA4, do it in GTM rather than in the site code:

1. In GTM, open **Variables → Configure** and turn on the built-in **Click URL** and **Page Path** variables.
2. Create the triggers:
   - **Phone:** Click – Just Links, where Click URL starts with `tel:`
   - **WhatsApp:** Click – Just Links, where Click URL contains `wa.me`
   - **Enquiry sent:** Page View, where Page Path equals `/thanks/`
3. Create three **GA4 Event** tags (`phone_click`, `whatsapp_click`, `generate_lead`), one on each trigger. Use your GA4 measurement ID, or the existing Google tag if one is already in the container.
4. Preview, check that each event fires, then **Submit/Publish** the container.
5. In GA4, go to **Admin → Events** and mark `generate_lead` (and the click events, if you like) as **key events**.

Only visitors who accept cookies will show up in GA4. Umami counts everyone.

## 8. Questions for you (RECOMMENDED / needs your decision)

1. **Seaford.** Your brief lists Seaford in the service area, but the Seaford town page was removed on 11 Nov ("Remove Seaford from the towns…"), and today `/computer-help-seaford/` was redirected to `/areas/`. The page had been getting 15 impressions at position 26. **Do you cover Seaford?** If you do, I'll bring the page back with its own content and remove the redirect. If you don't, the redirect stays.
2. **42 Commercial Road.** Is this a public-facing premises that customers can visit, or just a drop-off point? I've left it out of the schema until you confirm. If it's public-facing, adding it (with a postcode) to the schema and your Google profile can help in map results.
3. **Business IT and web design pages.** Which of the options in section 4 do you want, and when?
4. **"Lots of my Eastbourne customers are retired…"** This line on the Eastbourne page was already there and I kept it. The same paragraph also mentions helping shops, guest houses and holiday lets with Wi-Fi and card machines. Is that still something you want to promote?

## 9. Recommended next steps (not done)

1. Review on http://localhost:8081/ and say when to push. Then use **URL Inspection → Request indexing** in Search Console for `/`, `/computer-help-eastbourne/`, `/computer-help-hastings/` and `/computer-help-bexhill/`.
2. Keep building your **Google Business Profile**: photos, the list of services, weekly posts, and asking happy customers for reviews. It's the biggest lever for "computer repair near me".
3. Consider a **"Printer, phone and tablet help" page**. It's number 4 on your list but doesn't have its own page yet; the menu currently sends it to the homepage section.
4. Add a **share image (`og:image`)** that shows you rather than just the logo. This is still on `TODO.md`.
5. Add **FAQPage schema** to the FAQ sections (also still on `TODO.md`).
6. Check Search Console again in **4–6 weeks**, and compare against the 18 Nov baseline:
   - home-help searches: impressions and position
   - the clicks-to-impressions ratio for the Eastbourne, Hastings and Bexhill pages
   - whether "it support" and "seo" impressions are falling
7. Look at the smaller town pages again at the same time. If Westham (position 91) or Willingdon (position 70) still get almost nothing, merge them into a neighbouring page (Westham into Pevensey, Willingdon into Polegate) with 301 redirects.
