# Worker's Assist — website

Static, mobile-first, no build step. Hosted on GitHub Pages.

## Status

- ✅ **Home** (`index.html`) — hero + three-beat scrollytelling, trilingual, schedule renders from `classes.json`.
- ⬜ **Volunteer** (`volunteer.html`) — intro + form. *Not built yet.*
- ⬜ **Student** (`students.html`) — intro + form with referrer logic. *Not built yet.*
- ⬜ **Backend** — Apps Script `doPost` for both forms. *Not built yet.*

## Run locally

No build step. Serve the folder over HTTP (needed so `fetch("classes.json")` works — `file://` blocks it):

```sh
python -m http.server 8000
# then open http://127.0.0.1:8000/
```

## Structure

```
workers-assist/
├── index.html          Home (hero + scrollytelling)
├── classes.json        Class list, trilingual — edit here, no HTML changes
├── assets/
│   ├── css/styles.css  Design system
│   ├── js/
│   │   ├── i18n.js     Dictionary (en / zh-hans / zh-hant) + switcher + schedule
│   │   └── scroll.js   Scrollytelling enhancement (degrades without JS)
│   ├── img/            logo.svg + beat-*.svg placeholders
│   └── fonts/          (add SmileySans-Oblique.woff2 here)
└── README.md
```

## To do / notes

- **Smiley Sans (得意黑)** for Simplified headlines: download `SmileySans-Oblique.woff2`
  from [atelier-anchor/smiley-sans](https://github.com/atelier-anchor/smiley-sans)
  releases into `assets/fonts/`. Until then it falls back to Noto Sans SC.
- **Photos**: `assets/img/beat-*.svg` are branded placeholders — swap for real
  event photos (keep descriptive `alt` text via the `beatN.alt` i18n keys).
- **Chinese copy** in `i18n.js` and `classes.json` is a first-pass translation —
  have a native speaker review before launch.
- **Hero tagline** ("Learn English in your own language") is the candidate from
  the brief; remove the `.hero__tagline` line if not wanted.
- Header/footer markup is duplicated per page (a consequence of no build step) —
  keep the three pages in sync by hand when they exist.
