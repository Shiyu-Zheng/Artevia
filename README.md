# ArteVia

Arts Operations Partner — marketing site for musicians and music organisations.

Static HTML. No build step, no dependencies, no framework, and **no third-party
requests at all** — fonts, styles and scripts are all served from this repo. The
privacy policy says so, so keep it true.

---

## Layout

```
site/                     ← the only thing published
  index.html              homepage — everything except the blog and the form
  blog.html               "Coming soon" — no posts exist
  enquiry.html            contact form, posts to Formspree as plain HTML
  privacy.html            DRAFT — see below
  terms.html              DRAFT — see below
  post-template.html      copy, rename, fill in
  site.css                all styling, every page
  site.js                 all behaviour, every page
  fonts/                  Marcellus + Jost, woff2, SIL OFL
  logos/                  client logos
  portrait.jpg
  favicon.svg             single Marcellus A, olive on sand
  favicon-32.png
  apple-touch-icon.png
  CNAME                   arte-via.uk
  .nojekyll               stops GitHub running Jekyll over it

.github/workflows/
  deploy.yml              publishes site/ on every push to main
```

Anything outside `site/` stays in the repo and is never published, so working
files and notes can live here without appearing on the website.

### How the CSS is organised

One stylesheet for every page, in this order: tokens → reset → layout → nav →
footer → homepage → about section → legal pages → blog → form → media queries.
Page differences are a class on `<body>`, not a separate file.

| Page | body class | Measure |
| --- | --- | --- |
| Homepage | *(none)* | 1080px |
| Blog index | `page-blog` | 860px |
| Privacy, terms, enquiry, posts | `page-legal` | 760px |

`site.js` guards each feature by checking its markup exists, so the same file is
safe everywhere. A page without a hamburger just skips that block.

### Two rules that will bite you

- **Paths stay relative.** The site is served from a subpath until DNS moves it,
  so a leading `/` on any `href` or `src` breaks it.
- **Links never wrap.** Any hyperlink that is a short phrase or a call to action
  gets `white-space:nowrap`. There's a standing rule block near the top of
  `site.css`.

### Two pieces of CSS that size themselves

Don't replace either with a fixed number — both were fixed numbers once and both
were wrong within a day.

- **The portrait** in the About section has no aspect ratio in the two-column
  layout. It stretches to the height of the text beside it, so editing a
  paragraph in or out keeps the columns level. Only the width is set.
- **The pull quote** is capped at 38ch, inside a window about 3ch wide, so the
  two sentences get a line each. Re-measure if the wording changes.

---

## Before the first publish

**`privacy.html` and `terms.html` are unreviewed drafts, and they are committed.**
Both still contain a visible box reading *"Note for Shiyu — delete this box
before publishing"*, and both name **Shiyu Zheng** as the legal operator while
the rest of the site reads **Alina Zheng**.

They are in `main` and linked from every footer, so they publish — note boxes
and all — the moment Pages is enabled. Resolve them or remove the footer links
before switching Pages on.

---

## Deploying

Publishes automatically on every push to `main`.

**One-time setup:** Settings → Pages → Build and deployment → Source, choose
**GitHub Actions**. Without this the workflow runs and then fails at the deploy
step.

Currently serves from `https://shiyu-zheng.github.io/Artevia/`.

### Moving to arte-via.uk

`site/CNAME` already contains `arte-via.uk`. Still to do:

1. At the registrar, point DNS at GitHub — four `A` records for the apex, or an
   `ALIAS`/`ANAME` if the registrar supports it, plus a `CNAME` on `www`. Take
   the current IPs from GitHub's own docs rather than from memory.
2. Settings → Pages → Custom domain, then tick **Enforce HTTPS** once the
   certificate is issued.

Because every path is relative, moving off the subpath needs no HTML changes.

---

## Working on it

Open `site/index.html` in a browser. That's the whole workflow.

**When a change looks like it didn't apply, it's the CSS cache.** Private window,
or disable cache in devtools.

**Edit in place.** No versioned filenames, no dated backups — git holds every
previous state.

---

## Known gaps

- No meta description or Open Graph tags, so a shared link previews as a bare URL
  with no card. Needs absolute `arte-via.uk` URLs, so DNS comes first.
- The nav wordmark is a placeholder, not a logo.
- No 404 page, no analytics, no link checking or HTML validation in CI.
- Some dead CSS from removed sections — `.beliefs`, `.facts`, several `.pkg-`
  rules. Worth one pass before this stylesheet forks to a second site.
