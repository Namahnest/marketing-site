# NamahNest — Hugo + Tailwind marketing site

A complete static marketing site for documentation kits, SaaS landing pages, and custom static architecture. Built with Hugo Extended, Go templates, Tailwind CSS 3, self-hosted Inter, MIT-licensed Heroicons SVGs, and small vanilla JavaScript enhancements.

## Free and open-source licensing

The original project code and graphic assets use the [MIT License](LICENSE), permitting personal and commercial use, modification, hosting, and redistribution. There is no per-site code-license limit. Preserve the copyright and license notices with copies.

- Font: **Inter**, SIL Open Font License 1.1; notices in `static/fonts/OFL.txt` and `static/licenses/inter-OFL.txt`.
- Icons: **Heroicons 2.2.0**, MIT; canonical local SVGs in `assets/icons/` and notice in `static/licenses/heroicons-MIT.txt`.
- CSS tooling: **Tailwind CSS 3.4.17**, MIT; notice in `static/licenses/tailwindcss-MIT.txt`.
- Static generator: **Hugo Extended**, Apache 2.0; installed separately, not shipped in the generated website.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for provenance and scope. Full runtime asset notices are shipped with the generated site and linked from `/licenses/`. Third-party technology logo graphics have been replaced with plain-text names. Software licenses do not grant trademark rights or guarantee brand-name availability.

## Run locally

The compiled Tailwind stylesheet is committed, so the site renders immediately:

```sh
hugo server --disableFastRender
```

For development, install Node.js 20+ and Hugo Extended 0.145+:

```sh
npm ci
npm run css
npm run dev
```

Run `npm run css:watch` in a second terminal when editing Tailwind classes. Hugo watches templates and Markdown; the Tailwind watcher regenerates `assets/css/compiled.css`.

## Build and verify

```sh
npm run build
npm run check
```

The production build writes static files to `public/`. The link check verifies local assets, page links, anchor targets, canonical metadata, and JSON-LD syntax. No frontend framework, webfont request, or runtime CDN is needed.

With the development server running, `node scripts/browser-check.mjs` checks the main pages at five viewport widths and verifies the interactive components in headless Chrome. On other operating systems, set `CHROME_PATH` to your Chrome executable. Add `--audit` when Lighthouse is installed locally to produce a mobile audit in `.reports/lighthouse.json`.

## Pages

- `/`: hero, technology badges, categories, CMS comparison, featured kits, illustrative testimonials, FAQs, and conversion CTA.
- `/plans/`: category-filtered products, with bookmarkable query filters.
- `/plans/atlas/`, `/plans/launchpad/`, `/plans/mono/`: product previews, galleries, feature lists, support options, and sticky purchase enquiry panels.
- `/docs/`: searchable guide hub, grouped navigation, breadcrumbs, and article tables of contents.
- `/pricing/`: one-time kit and monthly support pricing switch.
- `/contact/`: validated enquiry form, including product and support preselection.

Dark/light preference is persisted locally. Native FAQ disclosure widgets, keyboard focus indicators, a skip link, live result announcements, and reduced-motion support are included.

## Configure for launch

Edit `hugo.toml`:

- Set `baseURL` to the real HTTPS production domain.
- Replace the example brand metadata and `params.email` with your business details.
- Contact enquiries use Web3Forms: configure `params.contactEndpoint` and `params.web3formsAccessKey` in `hugo.toml`. Messages go to the inbox associated with the key. The form shows delivery status, preserves input on failure, and includes spam honeypots. Without an endpoint, it opens an email draft instead.
- Newsletter signup opens an email request. Connect your email platform before running a newsletter campaign.
- Set `params.github` to your real repository to enable “Edit this page on GitHub” links on the `main` branch. Without it, documentation offers a local feedback link.
- Product buy buttons currently create purchase enquiries. Connect your checkout provider when real payment links are available.
- Replace clearly labeled illustrative testimonials with approved customer quotes.
- Update product front matter in `content/plans/` to change prices, categories, features, and inclusions.

The site includes canonical URLs, Open Graph/Twitter metadata, a 1200×630 share image, WebSite/Product/TechArticle JSON-LD, `sitemap.xml`, `robots.txt`, and RSS feeds. A 95+ Lighthouse score is a target; verify the deployed domain after adding your production content and integrations.

## Deployment

Cloudflare Pages, Vercel, and Netlify guides are provided in `content/docs/`. Use `npm ci && npm run build` as the build command and `public` as the output directory. Ensure the build environment uses Hugo Extended. No server-side application is required for hosting.
