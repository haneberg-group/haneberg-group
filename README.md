# Haneberg Group — haneberg-group.com.cy

Single-page site for **Haneberg Group LTD** (HE 486285), Paphos, Cyprus.
Consulting for business development, digital transformation, process enhancement,
marketing & sales development and trend identification — plus management services
for related companies, online research, market analysis and business intelligence.

## Stack

Static HTML/CSS/JS, no build step.

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site — one page, hash-linked sections |
| `assets/css/style.css` | "Aurora" theme; palette derived from the HG logo |
| `assets/js/nav.js` | Mobile nav, hash routing into `<details>`, scroll spy |
| `assets/icons/` | Brand icons (favicon, Android, Apple, MS tiles) |
| `assets/images/og-cover.png` | 1200×630 social share card |
| `sw.js` | Service worker — offline shell, network-first navigation |
| `manifest.webmanifest` | PWA manifest (installable, standalone) |

## Deploying anywhere

Every path the browser loads is **relative**, so the same files work unchanged at
a domain root (`https://haneberg-group.com.cy/`) and at a sub-path
(`https://<user>.github.io/<repo>/`). Nothing needs rewriting between the two:

- `index.html` references `assets/…`, `sw.js` and `manifest.webmanifest` relatively.
- The service worker registers as `sw.js`, so its scope is simply the directory
  it sits in, and its precache list is relative to that scope. It also ignores
  requests outside that scope, which matters on a shared host like
  `<user>.github.io` where other sites live at other paths.
- `manifest.webmanifest` uses `"scope": "./"`, `"start_url": "./"` and relative
  icon `src`s — manifest members resolve against the manifest's own URL.

The only absolute URLs left are the ones the specs require to be absolute:
`<link rel="canonical">`, the `og:*` tags, and the JSON-LD `url`/`image`/`logo`.
They are authored against the production domain, and a short inline script
repoints them at the current host whenever the page is served from somewhere
else. Social scrapers generally do not run JS, so a link shared from a preview
host will still preview using the production URLs.

`robots.txt` and `sitemap.xml` are deployment-specific and still name
`haneberg-group.com.cy`. Update both if the production domain changes.

## Navigation

All navigation is hash-based (`#services`, `#intelligence`, `#approach`,
`#notice`, `#terms`, `#contact`), so deep links survive a static host with no
rewrite rules. `assets/js/nav.js` additionally expands the matching `<details>`
when a hash points inside a collapsed legal section.

## Working on it

Serve the root over HTTP — the service worker and the manifest need a real
origin, `file://` will not do:

```sh
python3 -m http.server 8000
```

After changing any precached file, bump `VERSION` in `sw.js`, otherwise
returning visitors keep the previous copy.
