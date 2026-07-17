# dankdeliver

A mock cannabis storefront web app styled after the **Checkers Sixty60** grocery delivery app — "Delivered in 60 minutes".

## Features
- Sixty60-style UI: red hero banner, location bar, search, category pills, product grid with `+` add buttons, and a sticky cart dock.
- Product ranges built from the supplied catalog PDFs:
  - **Greenhouse** flower (GH Bud) — R50/g, R55 pre-roll
  - **Indoor** flower (AAA/AA) — R120/g, R125 pre-roll
  - **Edibles** — gummies, chocolate, cookies, drinks
  - **CBD** — oils, gummies, balm, flower
- Client-side cart with live item count and total.

## Run
Open `index.html` in a browser (no build step required).

```
# or serve locally
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Files
- `index.html` — page structure
- `styles.css` — Sixty60-inspired styling
- `data.js` — product catalog
- `app.js` — rendering, search, filtering, cart logic

> Demo / educational project. Not a real store.
