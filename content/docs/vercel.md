---
title: Vercel
description: Publish your Hugo website with Git-based deployments and preview URLs.
group: Deployment
weight: 4
---
## Import your repository

Create a new Vercel project and import the Git repository containing your website. Choose Hugo as the framework preset when available.

## Configure the build

Use the following build command and output directory:

```text
Build command: npm ci && npm run css && hugo --minify
Output directory: public
```

Pin Hugo 0.145.0 Extended or a later compatible version in your build environment. Check the deployment logs to confirm the version used.

## Set your domain

Add your domain in project settings, follow the DNS instructions provided by Vercel, and update `baseURL` in your site configuration.

## Publish updates

Push commits to your production branch to deploy changes. Use pull-request previews to review the site before publishing.
