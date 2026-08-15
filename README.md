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
