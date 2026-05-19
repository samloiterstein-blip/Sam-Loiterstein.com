# Sam Loiterstein

Personal website for Sam Loiterstein. Vite plus React on the frontend with Tailwind CSS and Framer Motion. Express backend handles the contact form.

All copy on the site complies with `AI-Policy.md`, `config-tone.txt`, and `STYLE-GUIDE.md`.

## Layout

```
sam-loiterstein.com/
  AI-Policy.md
  config-tone.txt
  STYLE-GUIDE.md
  package.json            workspace scripts
  client/                 Vite, React, TypeScript, Tailwind, Framer Motion
    index.html            SEO metadata
    public/
      favicon.svg
      Sam-Loiterstein-Resume.pdf
      Headshot.jpeg       optional names listed in content.ts
    tailwind.config.js    sage and ink palette
    src/
      App.tsx
      components/
      data/content.ts     single source of truth for copy
      hooks/
      lib/
  server/                 Express API
    .env.example
    src/
      index.ts            CORS, rate limit, production static serving
      routes/contact.ts
```

## Requirements

Node 18.18 or later. Node 20 or later is recommended.

## Quick start

1. Install everything (root, client, server):

   ```
   npm run install:all
   ```

2. Optional. Configure mail. Without SMTP, the server logs contact submissions to the console.

   ```
   cp server/.env.example server/.env
   ```

3. Run client and server together. Frontend on port 5173. API on port 4000.

   ```
   npm run dev
   ```

The Vite dev server proxies `/api/*` to Express. The contact form works in development without extra setup.

Open `http://localhost:5173`.

## Scripts

From the repo root:

- `npm run dev`: client and server in parallel
- `npm run dev:client`: frontend only
- `npm run dev:server`: backend only
- `npm run build`: build client and server for production
- `npm run start`: run the production server, which serves the built client
- `npm run preview`: preview the built client with Vite
- `npm run lint`: lint the client

## Contact form

`POST /api/contact` accepts `{ name, email, message }`. The server validates the payload, rate limits per IP, and ignores honeypot submissions. If `SMTP_HOST` is set in `server/.env`, the message is sent through `nodemailer` using the configured provider. Without SMTP, the message is written to the server console.

Set `CONTACT_TO` to the destination address. Set `CONTACT_FROM` to a sender address that the provider has verified. See `server/.env.example` for every variable.

## Production

`npm run build` produces:

- `client/dist/` static frontend
- `server/dist/` compiled Express server

Run `npm start` (or `node server/dist/index.js`) with `NODE_ENV=production`. Express then serves `client/dist` directly. The result is a single Node process that can sit behind any reverse proxy.

The frontend can also be deployed to a static host with the server hosted separately. Configure CORS through `ALLOWED_ORIGINS`.

## Editing content

Almost all visible copy lives in `client/src/data/content.ts`:

- `site`: name, tagline, email, social links
- `hero`: hero stats and eyebrow
- `about`: bio, values, headshot card
- `resume`: experience and education timelines
- `linkedin`: card content
- `projects`: project grid
- `media`: press, podcasts, mentions
- `services`: service tiles and CTA
- `insights`: scaffolded blog list
- `contact`: contact section copy

## Static assets

Vite serves files from `client/public/` at the site root (`/`).

- Resume PDF: place `Sam-Loiterstein-Resume.pdf` in `client/public/`. The download button uses `site.resumeUrl` in `content.ts` (`/Sam-Loiterstein-Resume.pdf`).
- Headshot: the About section imports `client/src/assets/Headshot.jpeg` first (Vite emits a hashed file in `dist/assets/`). Replace that file when you update the photo. A copy also belongs in `client/public/Headshot.jpeg` for direct URLs and fallbacks listed in `about.headshot.sources` inside `content.ts`.

Verify in dev: open `http://localhost:5173/Headshot.jpeg` if the file is in `client/public/`. The About card uses the bundled asset from `src/assets/` so it still renders if `public/` is empty.

If you use two folders on disk (for example Desktop `Code Files` and another clone), keep `Headshot.jpeg` in sync or edit only the repo folder that Cursor has open.

## Writing rules

Read `AI-Policy.md` and `STYLE-GUIDE.md` before editing copy. Em dashes, en dashes, interpuncts, ellipses, subjective qualifiers, and rhetorical framing are not permitted in site copy or documentation.
