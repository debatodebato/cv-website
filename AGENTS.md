# cv-website

React + Vite + Tailwind CSS frontend with a small Node/Express API serving CV content.

## Development

Run `npm run dev` — starts Vite (port 5173) and the Express API (port 4000) together, with Vite proxying `/api` to Express.

- `npm run dev:web` - Vite only
- `npm run dev:api` - Express only

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component; fetches CV content from `/api/cv` and merges it with local image imports by `key`
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `server/index.js` - Express server exposing `GET /api/cv` for local development
- `server/data/cv.json` - CV content (experience, press, honours) — edit this to update the site's text
- `api/cv.js` - Vercel serverless function equivalent of `server/index.js`, used in production
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, the `@` alias for `src`, and a dev proxy from `/api` to the Express server

## Dependencies

- Runtime: React 19, React DOM 19, Express 4
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`.

## Deployment

Deployed to Vercel. `vercel.json` sets the build command and output directory; the `api/` directory is auto-detected as Vercel serverless functions, so no separate server process is needed in production.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
