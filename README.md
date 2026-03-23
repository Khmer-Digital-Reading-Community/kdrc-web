# KDRC Frontend

Frontend application for KDRC built with Vue 3, TypeScript, Vite, and Tailwind CSS v4.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Tailwind CSS v4
- Axios

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm

## Install

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

Default local URL is usually:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Type-check and build production bundle
- `npm run preview`: Preview the built app locally

## Tailwind CSS v4 Notes

This project uses Tailwind v4 via Vite plugin integration.

- Tailwind is enabled in [src/style.css](src/style.css) using:
	- `@import "tailwindcss";`
- Vite plugin is configured in [vite.config.ts](vite.config.ts).

Important:

- Do not use old v3 setup commands such as `npx tailwindcss init -p`.
- Tailwind v4 in this project does not require that init flow.

## Troubleshooting

### TypeScript cannot find a `.vue` component

If you renamed or removed a component and TypeScript still complains:

1. Fix stale imports in the consuming file.
2. Restart TypeScript server in VS Code.
3. Rebuild once:

```bash
npm run build
```

### Fresh install issues

Try a clean reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```
