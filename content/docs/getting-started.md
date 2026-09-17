---
title: Getting started
description: From an empty folder to your first local website in a few simple steps.
group: Get started
weight: 1
---
## Before you begin

Install Hugo Extended version 0.145 or later, Node.js 20 or later, and Git. Hugo Extended supports the asset pipeline used by our kits.

## Install your dependencies

Download your kit source and open a terminal in its directory. Install the pinned Tailwind development dependency:

```sh
npm install
npm run css
```

## Preview your website

Run the local Hugo development server:

```sh
hugo server --disableFastRender
```

Open the address displayed in your terminal, usually `http://localhost:1313`. Hugo watches your content and template files. After changing Tailwind classes, run `npm run css` again.

## Add your first content

Edit the Markdown files in `content/`. The front matter at the top contains page titles, descriptions, and other template settings. The text below becomes your page content.

## Next steps

Update your site settings in the [configuration guide](/docs/configuration/), then choose a deployment provider such as [Cloudflare Pages](/docs/cloudflare/).
