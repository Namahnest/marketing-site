# Open-source components and licenses

Original NamahNest templates, styles, scripts, sample content, logo artwork,
favicon, and social-card artwork are licensed under the root MIT `LICENSE`.
Third-party components retain the licenses and copyright notices listed below;
the project license does not relicense them.

## Inter font

- Authors: The Inter Project Authors.
- License: SIL Open Font License 1.1.
- Source: https://github.com/rsms/inter
- Distribution source: `@fontsource-variable/inter` (unmodified Latin variable WOFF2).
- Asset: `static/fonts/inter-latin.woff2`.
- Full notices: `static/fonts/OFL.txt` and `static/licenses/inter-OFL.txt`.
- Commercial web embedding is permitted. Preserve the font license and notices.
  The font itself cannot be sold on its own under this license.

## Heroicons 2.2.0

- Copyright (c) Tailwind Labs, Inc.
- License: MIT.
- Source: https://github.com/tailwindlabs/heroicons/tree/v2.2.0
- Assets: 18 unmodified SVGs from `optimized/24/outline`, saved in `assets/icons/`
  under local component names. `layouts/partials/icon.html` renders their paths
  with the project's SVG wrapper and sizing classes.
- Full notice: `static/licenses/heroicons-MIT.txt`.
- Commercial use, modification, and redistribution are permitted with notices.
- No Lucide or Feather icon assets remain in the project.

## Tailwind CSS 3.4.17

- Copyright (c) Tailwind Labs, Inc.
- License: MIT.
- Source: https://github.com/tailwindlabs/tailwindcss/tree/v3.4.17
- Full notice: `static/licenses/tailwindcss-MIT.txt`.
- Build dependency; generated CSS is included in the deployed site.

## Hugo Extended

- License: Apache License 2.0.
- Source and license: https://github.com/gohugoio/hugo/blob/master/LICENSE
- External build tool, not bundled as a binary or source in this project.
  Building a website with Hugo does not make its generated content Apache-licensed.

## Distribution and names

The deployed site includes the licenses in `/licenses/` and links to a license
overview. Preserve those files when distributing the project or build output.
Node development dependencies retain their own bundled license files; keep them
if distributing those dependencies. `node_modules/` is not part of the website.

Technology providers are identified using plain text, with no third-party logo
graphics or implied endorsement. Names and trademarks remain their owners'
property. Open-source software licenses do not grant trademark clearance for
NamahNest or any other brand name.
