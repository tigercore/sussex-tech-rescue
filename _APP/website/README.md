# Sussex Tech Rescue website

A calm, coastal version of the Sunshine Coast Tech site. Colours and fonts live in `src/assets/css/theme.css`; the finishing styles live in `src/assets/css/coastal.css`.

Friendly tech help site for Eastbourne, Bexhill and the East Sussex coast. Built with [Eleventy](https://www.11ty.dev/) and hosted on Netlify.

## Run it locally

```
npm install
npm start          # http://localhost:8080, reloads on save
npm run build      # outputs to _site/
```

## Where to change things

| What | File |
| --- | --- |
| Business name, phone, WhatsApp, email, hours, site URL | `src/_data/site.json` |
| Prices | `src/_data/prices.json` |
| Colours, fonts, corner radius | `src/assets/css/theme.css` |
| Towns and town page wording | `src/_data/towns.json` (one page is generated per town) |
| Services menu and homepage service cards | `src/_data/services.json` |
| "What we fix" cards | `src/_data/fixes.json` |
| Reviews (section stays hidden while empty) | `src/_data/reviews.json`, e.g. `[{ "name": "Jane", "town": "Bexhill", "text": "..." }]` |
| Remote help download links | `src/_data/remote.json` |
| Service page wording | `src/services/*.md` |
| Logo | `src/_includes/partials/logo.njk` and `src/assets/img/favicon.svg` |
| Photo of Ryan | replace `src/assets/img/ryan-placeholder.svg` |

## Deploying to Netlify

Connect the folder (or its Git repo) in Netlify. The settings come from `netlify.toml`: build command `npm run build`, publish directory `_site`.

The booking form uses Netlify Forms. After the first deploy, open **Site configuration > Forms** in Netlify, check the `booking` form appears, and add an email notification so submissions reach you.

## Placeholders to replace before launch

- Logo (the name is set in site.json)
- Phone/WhatsApp number in `site.json`
- Photo of Ryan
- Splashtop SOS links: swap in your own branded SOS download link
- Privacy notice: review the draft
