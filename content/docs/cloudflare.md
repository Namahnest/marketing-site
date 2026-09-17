---
title: Cloudflare Pages
description: Deploy your static website to Cloudflare's global edge network.
group: Deployment
weight: 3
---
## Prepare your repository

Commit your content, templates, `package-lock.json`, and compiled CSS to a Git repository. Verify that `hugo --minify` produces the `public/` directory locally.

## Connect your project

Create a Pages project in Cloudflare and connect your repository. Choose your production branch and configure these build settings:

```text
Build command: npm ci && npm run css && hugo --minify
Build output directory: public
HUGO_VERSION: 0.145.0
```

Use the Extended Hugo binary if installing Hugo yourself. Provider build images may change; confirm the available Hugo version in your build log.

## Add your domain

Connect your custom domain in the Pages dashboard. Update `baseURL` in `hugo.toml` to match the final HTTPS domain and rebuild so your canonical links and sitemap are correct.

## Preview changes

Use branch previews to review content before merging. Keep production metadata pointed at your production domain.
