# Haneberg Group — haneberg-group.com.cy

Single-page site for **Haneberg Group LTD** (HE 486285), Paphos, Cyprus.
Consulting for business development, digital transformation, process enhancement,
marketing & sales development and trend identification — plus management services
for related companies, online research, market analysis and business intelligence.

## Stack

Static HTML/CSS/JS, no build step. Deployed as GitHub Pages from the repository root.

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site — one page, hash-linked sections |
| `assets/css/style.css` | "Aurora" theme; palette derived from the HG logo |
| `assets/js/nav.js` | Mobile nav, hash routing into `<details>`, scroll spy |
| `assets/icons/` | Brand icons (favicon, Android, Apple, MS tiles) |
| `assets/images/og-cover.png` | 1200×630 social share card |
| `sw.js` | Service worker — offline shell, network-first navigation |
| `manifest.webmanifest` | PWA manifest (installable, standalone) |

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
