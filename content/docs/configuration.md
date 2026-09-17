---
title: Site configuration
description: Set your site address, metadata, navigation, and contact details.
group: Get started
weight: 2
---
## Set your production URL

In `hugo.toml`, replace the example `baseURL` with your domain, including the trailing slash. Canonical links, sitemap entries, and social metadata use this value.

```toml
baseURL = 'https://your-domain.com/'
title = 'Your brand — Your promise'
```

## Make it your brand

Update the title, description, author, email, and social image in the `[params]` block. Update `layouts/partials/logo.html` to replace the NamahNest wordmark.

## Configure contact delivery

The default form validates required fields and opens the visitor's email app with a prepared message. Set `params.email` to a real inbox before launch. To send directly to a form service, set `params.contactEndpoint` to the HTTPS form endpoint provided by your service. The form then uses a native POST submission.

## Connect your repository

Set `params.github` to your repository URL, for example `https://github.com/your-team/your-site`. Documentation pages will show an “Edit this page on GitHub” link for the main branch. Leave it empty to show a local feedback link instead.

## Navigation and metadata

The `menus.main` entries define the primary navigation. Each content file can override the default description. Keep page descriptions specific and useful to readers.
