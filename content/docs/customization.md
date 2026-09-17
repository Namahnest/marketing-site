---
title: Customize your kit
description: Make the design, content, and components feel like your own brand.
group: Customization
weight: 6
---
## Change your palette

Update the Tailwind colors in `tailwind.config.js`. Light and dark theme surface colors live in `assets/css/main.css` as CSS variables.

## Adjust typography

The kit includes a self-hosted Inter variable font, with its Open Font License in `static/fonts/OFL.txt`. To use another branded font, add licensed WOFF2 files locally and update the `@font-face` rule in `assets/css/main.css` and the preload in `layouts/partials/head.html`.

## Compose your pages

Hugo templates live in `layouts/`. Shared components such as the header, footer, cards, and previews live in `layouts/partials/`. Reuse these partials to keep your pages consistent.

## Rebuild your styles

Tailwind scans templates, Markdown, and JavaScript for utility classes. After changing classes, regenerate the stylesheet:

```sh
npm run css
hugo --minify
```

## Keep things fast

Use Hugo's image processing for new photographic assets, specify image dimensions, and lazy-load below-the-fold images. Test your deployed content with Lighthouse; kit performance targets are not a guarantee for every customization.
