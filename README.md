# yourpasswordsucks.com

A private, client-side password strength checker. The site is built with React and
Vite, and GitHub Pages serves the generated static files. Password checks happen
in the browser; there is no application server or analytics.

Strength estimates use the local zxcvbn-ts pattern matcher. The displayed
effective bits are `log2(estimated guesses)`; the familiar character-set formula
is shown as the idealized case for truly random strings, not used to overrate
human-chosen passwords.

## Local development

Requires Node.js 22.12 or newer (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Create the production site with:

```sh
npm run build
```

Vite writes the static site to `dist/`. Pushes to `main` build and deploy that
directory to GitHub Pages through the workflow in `.github/workflows/static.yml`.
