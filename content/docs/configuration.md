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

The contact form is connected to Web3Forms. Set `params.contactEndpoint` to `https://api.web3forms.com/submit` and `params.web3formsAccessKey` to your Web3Forms access key in `hugo.toml`. Enquiries are delivered to the inbox associated with that key. The key is a public form identifier and is included in the generated HTML.

Visitors see sending, success, and error messages on the page. Failed requests preserve their details for retry, and hidden honeypot fields help reject spam. Without JavaScript, the form submits directly to Web3Forms and opens its confirmation page. Set `params.email` for the alternative email link. Other form endpoints use native POST submission; removing the endpoint restores the email-draft fallback.

## Connect your repository

Set `params.github` to your repository URL, for example `https://github.com/your-team/your-site`. Documentation pages will show an “Edit this page on GitHub” link for the main branch. Leave it empty to show a local feedback link instead.

## Navigation and metadata

The `menus.main` entries define the primary navigation. Each content file can override the default description. Keep page descriptions specific and useful to readers.
