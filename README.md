# ngfizzy.github.io

Personal site and static blog.

## Develop locally

Run the repository-owned server:

```sh
npm run dev
```

Open <http://localhost:4000>. The server listens on localhost only and serves
the checked-in static files, including the blog pages; no VS Code extension is
required.

This site has no client-side build or bundle step. Its published HTML, CSS,
JavaScript, images, and blog pages are committed directly, so GitHub Pages can
serve the same files unchanged.

Use `PORT=<port> npm run dev` only when port 4000 is already in use.

## Analytics

Every public HTML page loads Umami Cloud once, using a deferred script in its
`<head>`. The `data-domains="ngfizzy.github.io"` attribute limits tracking to the
published hostname and excludes local previews. This browser-side filter helps
avoid accidental tracking when a page is copied; it does not authenticate events.

When adding a page, preserve this script in its HTML head:

```html
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="25e5abc4-591f-470b-8c81-c0cb05ffc38a"
  data-domains="ngfizzy.github.io"
></script>
```

Keep article Markdown sources free of this script. Run `npm test` to check every
public HTML page for a single tracker with the expected configuration.
