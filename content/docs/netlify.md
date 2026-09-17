---
title: Netlify
description: Ship your Hugo website with continuous deployment on Netlify.
group: Deployment
weight: 5
---
## Connect your source

Import your Git repository into a new Netlify project. Keep your package lockfile committed for reproducible dependency installs.

## Set build options

Set the build command, output folder, and Hugo version:

```text
Build command: npm ci && npm run css && hugo --minify
Publish directory: public
HUGO_VERSION: 0.145.0
```

Check your build logs to verify that the Hugo Extended binary is in use.

## Configure your custom domain

Add your production domain in Netlify, configure DNS as instructed, and set the same address in `hugo.toml`.

## Verify your release

Visit your deployed site, submit a test enquiry using your configured delivery method, and verify the generated sitemap before sharing it.
