# al-folio Academic Website - AI Coding Agent Instructions

## Project Overview

This is an **al-folio** academic website built with Jekyll - a static site generator for academic portfolios. The site is deployed to GitHub Pages and features publications, projects, CV, and blog posts.

## Architecture & Key Components

### Jekyll Collections System
- **Collections** (`_projects/`, `_books/`) generate individual pages from markdown files with frontmatter
- Enable/disable collections in `_config.yml` → `collections:` section
- Each collection needs: a directory, frontmatter in files, and a corresponding layout in `_layouts/`
- Access collections in templates via `site.COLLECTION_NAME` (e.g., `site.projects`)

### Content Organization
```
_pages/          → Static pages (about, cv, projects index)
_projects/       → Project collection entries
_books/          → Book review collection
_layouts/        → Page templates (about.liquid, page.liquid, post.liquid, distill.liquid, book-review.liquid)
_includes/       → Reusable template components
_data/           → YAML data files (cv.yml, socials.yml, repositories.yml)
_sass/           → Styling (_themes.scss for dark/light themes, _variables.scss for config)
_plugins/        → Custom Ruby plugins (cache-bust.rb, external-posts.rb, details.rb)
assets/          → Static assets (images, PDFs, HTML embeds, videos)
_site/           → Generated site output (auto-built, never edit directly)
```

### Frontmatter Patterns

**Projects** (`_projects/*.md`):
```yaml
---
layout: page
title: Project Title
description: Brief description
img: assets/img/project.jpg  # thumbnail
---
```

**Pages** (`_pages/*.md`):
```yaml
---
layout: page
permalink: /path/
title: Page Title
---
```

**Book Reviews** (`_books/*.md`):
```yaml
---
layout: book-review
title: Book Title
author: Author Name
cover: assets/img/book_covers/cover.jpg
isbn: 1234567890  # for auto-fetching cover
started: 2024-08-23
finished: 2024-09-07
stars: 5
---
```

## Development Workflow

### Local Development (Docker - RECOMMENDED)
```bash
# Start development server (uses prebuilt image)
docker compose pull
docker compose up

# Or use slim image (<100MB)
docker compose -f docker-compose-slim.yml up

# Rebuild custom image
docker compose up --build

# Debug container
docker compose logs
docker compose exec -it jekyll /bin/bash
./bin/entry_point.sh
```
Access at `http://localhost:8080` with live reload enabled.

### Local Development (Native - Legacy)
```bash
# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Build only
bundle exec jekyll build
```

### File Visibility Control
- To **exclude** pages/projects from build: add to `_config.yml` → `exclude:` list
- To **include** in build: remove from `exclude:` or comment out the line
- Example: `_projects/1_project.md` is excluded by default (see lines 176-184 in `_config.yml`)

## Critical Configuration (`_config.yml`)

### Essential Settings
- `url:` → Must be `https://<username>.github.io` for GitHub Pages
- `baseurl:` → Leave empty for root deployment (not blank, just `baseurl:`)
- `title:`, `first_name:`, `last_name:` → Site identity

### Plugin Ecosystem
Key plugins (see `plugins:` section):
- `jekyll-scholar` → Bibliography/publications from BibTeX
- `jekyll-imagemagick` → Responsive WebP image generation (requires ImageMagick)
- `jekyll-jupyter-notebook` → Embed Jupyter notebooks
- `jekyll-minifier` → Minify HTML/CSS
- `jekyll-terser` → Minify JavaScript (custom fork)
- `jemoji` → Emoji support

### Feature Flags
Toggle features in `_config.yml`:
- `enable_darkmode: true` → Light/dark theme switching
- `enable_math: true` → MathJax for equations
- `enable_medium_zoom: true` → Image zoom on click
- `lazy_loading_images: true` → Lazy load for performance
- `imagemagick.enabled: true` → Generate responsive images

## Styling & Theming

### Color Themes
- Light/dark themes defined in `_sass/_themes.scss` using CSS variables
- Theme colors: `--global-theme-color`, `--global-hover-color`, etc.
- Override defaults in `_sass/_variables.scss`

### Custom Styling
- Main styles in `_sass/_base.scss`
- Component styles: `_sass/_layout.scss`, `_sass/_cv.scss`, `_sass/_distill.scss`
- Assets compiled via Sass (`sass.style: compressed` in config)

## Deployment

### GitHub Pages (Automatic)
1. Push to `main` branch triggers `.github/workflows/deploy.yml`
2. Site builds and deploys to `gh-pages` branch (~4 min)
3. GitHub Pages serves from `gh-pages` (~45s)
4. **NEVER edit `gh-pages` directly** - it's auto-overwritten

### Deployment Triggers
Watches these paths (see `deploy.yml`):
- `assets/**`, `_sass/**`, `_scripts/**`
- `**.bib`, `**.html`, `**.js`, `**.liquid`, `**/*.md`, `**.yml`
- `Gemfile`, `Gemfile.lock`

## Common Tasks

### Adding a New Project
1. Create `_projects/my-project.md` with frontmatter
2. Add thumbnail to `assets/img/`
3. If embedding HTML: put in `assets/projects/my-project/index.html`
4. Ensure NOT in `exclude:` list in `_config.yml`

### Embedding Interactive Content
Projects can embed HTML/JS applications:
```html
<iframe src="{{ '/assets/projects/pendulum/index.html' | relative_url }}" 
        width="100%" style="aspect-ratio: 1 / 1; border:none;">
</iframe>
```

### Adding CV Information
Two methods (precedence: JSON > YAML):
1. **JSON Resume** (standard): `assets/json/resume.json` (JSON Resume format)
2. **YAML fallback**: `_data/cv.yml` (used if JSON not found)

Delete `assets/json/resume.json` to use YAML format.

### Working with Publications
- Add BibTeX entries to `_bibliography/papers.bib`
- Supported fields: `pdf`, `code`, `abstract`, `arxiv`, `doi`, `slides`, `video`, `website`
- Place PDFs in `assets/pdf/`

## Important Conventions

### Liquid Template Syntax
- Use `.liquid` extension for templates (not `.html`)
- Variables: `{{ variable }}`, Logic: `{% if condition %}...{% endif %}`
- Includes: `{% include component.liquid param=value %}`
- Relative URLs: `{{ '/path' | relative_url }}`

### Custom Plugins
- `cache-bust.rb` → Adds version hashes to assets for cache invalidation
- `external-posts.rb` → Fetch posts from RSS feeds or URLs
- `file-exists.rb` → Check file existence in templates

### Asset Management
- Images: `assets/img/` (auto-converted to WebP if `imagemagick.enabled`)
- PDFs: `assets/pdf/`
- Projects: `assets/projects/<project-name>/`
- Responsive image widths: 480px, 800px, 1400px

## Troubleshooting

### Build Issues
- Check terminal for Jekyll errors during `bundle exec jekyll serve`
- Verify frontmatter YAML syntax (must start/end with `---`)
- Ensure required gems installed: `bundle install`

### Docker Issues
- Permission errors: Set `USERID`, `GROUPID` in `docker-compose.yml` (see comments)
- Port conflicts: Change `8080:8080` to different port

### GitHub Actions Deployment
- Enable "Read and write permissions" in Settings → Actions → Workflow permissions
- Set Pages source to "Deploy from a branch" → `gh-pages` branch
- Check Actions tab for build failures

## References
- Full docs: `README.md`, `CUSTOMIZE.md`, `INSTALL.md`, `FAQ.md`
- al-folio GitHub: https://github.com/alshedivat/al-folio
- Jekyll docs: https://jekyllrb.com/docs/
