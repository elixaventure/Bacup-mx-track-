# Bacup MX website

Website for Bacup MX, a motocross track in Bacup, Lancashire. Open riding for kids and adults, track rules, prices, and a kit list with SaddMX affiliate links.

It's a plain static site (HTML, CSS, a little JavaScript) with no build step. It deploys to Netlify straight from this repo.

## Files

| File | What it's for |
| --- | --- |
| `index.html` | All page content: hero, how it works, prices, rules, flags, kit list, find us, FAQ |
| `styles.css` | Colours, fonts and layout. Light and dark mode follow the visitor's phone setting |
| `js/config.js` | **The file you edit:** affiliate links and the track status sheet link |
| `js/kit.js` | Builds the kit list cards |
| `js/status.js` | Reads the track status from Google Sheets |

## Things still to fill in

Search `index.html` for `class="tbc"`. Each one is a placeholder shown in yellow on the site:

- Adult and youth prices, payment methods
- Open days, hours, sign-on closing time (default text; the sheet overrides these)
- Noise limit
- Address, postcode, what3words, phone, email
- Licence and insurance requirements, first-aid cover (FAQ)

## Affiliate links

Open `js/config.js` and replace each `REPLACE_ME` with the full SaddMX affiliate URL for that item. Real links open in a new tab and are marked `rel="sponsored"`, which is what Google expects for affiliate links. Keep the affiliate disclosure on the kit section and in the footer.

## Track status from your phone (Google Sheet)

1. Create a Google Sheet with these headers in row 1 and today's values in row 2:

   | status | message | days | hours | sign_on | date |
   | --- | --- | --- | --- | --- | --- |
   | open | Track watered, all jumps open | Sat–Sun | 10:00–16:00 | 14:00 | 04/10/2026 |

   - `status` must be `open`, `closed` or `check`. Add a dropdown with Data → Data validation so it can't be mistyped.
   - `message` is optional and shows in bold under the status.
   - `date` is the day the status is for. **If it isn't today, the site shows "Not updated today"** instead of an open/closed light, so riders never act on yesterday's status.
2. File → Share → **Publish to web** → pick the sheet → **Comma-separated values (.csv)** → Publish. Copy the link.
3. Paste that link into `statusSheetCsvUrl` in `js/config.js`.
4. From then on, update row 2 from the Google Sheets app on your phone. Google can take up to 5 minutes to publish a change.

If the sheet link is empty or the sheet can't be reached, the site falls back to "Check before you travel".

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to Netlify

Netlify → Add new site → Import from GitHub → pick this repo. Leave the build command empty; `netlify.toml` sets the publish folder. Every push to `main` redeploys.
