# azhir.com

A Jekyll site: Markdown posts, MathJax for LaTeX, custom design, ready
for GitHub Pages with the custom domain `azhir.com` already wired up.

## 1. Push it to GitHub (5 min)

```bash
cd azhir-site
git init
git add .
git commit -m "Initial site"
gh repo create azhir-site --public --source=. --push
# no gh CLI? create a repo on github.com called azhir-site, then:
# git remote add origin https://github.com/YOURNAME/azhir-site.git
# git branch -M main
# git push -u origin main
```

## 2. Turn on GitHub Pages

1. On GitHub: repo → **Settings → Pages**
2. Source: **Deploy from a branch** → branch `main`, folder `/ (root)`
3. Save. GitHub builds it automatically (Jekyll is native to Pages —
   no CI config needed). Give it 1–2 minutes.
4. It'll be live at `https://YOURNAME.github.io/azhir-site/` first.

## 3. Point azhir.com at it (5–10 min, up to 24h to propagate)

At your domain registrar (wherever you bought azhir.com), add these DNS
records:

**For the apex domain (azhir.com):**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

**For www (optional, recommended — so www.azhir.com also works):**
```
CNAME   www   YOURNAME.github.io.
```

Then back in **Settings → Pages → Custom domain**, type `azhir.com` and
save (this repo already has a `CNAME` file with `azhir.com` in it, so
GitHub should pick it up automatically — but setting it in the UI once
confirms it and lets you tick "Enforce HTTPS").

DNS can take anywhere from a few minutes to 24 hours to propagate.
Check status anytime with:
```bash
dig azhir.com +noall +answer
```

## 4. Writing posts

Drop a new file in `_posts/` named `YYYY-MM-DD-slug.md`:

```markdown
---
title: "Your title"
date: 2026-09-01
tags: [math, notes]
---

Inline math: $E = mc^2$

Display math:
$$ \int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2} $$
```

MathJax renders both automatically — no extra setup per post.

## 5. Local preview (optional)

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Structure

```
_config.yml       site settings
_layouts/         page templates (default, post)
_includes/         head/header/footer partials
_posts/           blog posts (Markdown, LaTeX-ready)
about.md          about page — edit your bio + links here
assets/css/       the site's design (style.scss)
CNAME             tells GitHub Pages to serve azhir.com
```

## Customizing

- **Bio / links** → edit `about.md`
- **Colors / fonts** → edit `assets/css/style.scss` (`:root` block at top)
- **Site name / tagline** → edit `_config.yml`
