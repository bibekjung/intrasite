# Modern React + TypeScript + Tailwind Boilerplate

This project is a production-ready, fast, and clean boilerplate for modern React apps. It includes:

- React 19, React Router v7
- TypeScript (strict)
- Vite (fast dev/build)
- TailwindCSS (JIT, autoprefixer, postcss)
- ESLint (TypeScript, Prettier, React plugins)
- Prettier (auto-formatting)
- Husky (pre-commit hooks)
- lint-staged (optional, for staged file checks)

---

## Scripts (`package.json`)
- `dev`: Vite dev server
- `build`: TypeScript build + Vite build
- `lint`: ESLint all files
- `preview`: Vite preview
- `prepare`: Husky install

---

## ESLint (`.eslintrc.js`)
- TypeScript and Prettier integrated
- No `console.log` allowed (only `warn`/`error`)
- No unused variables allowed

---

## Prettier (`.prettierrc`)
- 2 spaces, single quotes, 80 char line, semicolons

---

## Husky Pre-commit Hook
- Runs `pnpm lint --format codeframe` (shows exact error lines)
- Runs `pnpm prettier --check .` (blocks on formatting issues)

---

## Tailwind (`tailwind.config.js`)
- Scans all `src/**/*.{js,ts,jsx,tsx}` and `index.html`

---

## Vite (`vite.config.ts`)
- Uses `@vitejs/plugin-react` for fast HMR and TSX support

---

## TypeScript (`tsconfig.json`)
- Uses project references for modularity

---

## Optimization & Best Practices
- All configs are minimal and modern
- Husky blocks bad code before commit
- ESLint/Prettier keep code clean and consistent
- Fast dev/build with Vite and Tailwind JIT
- Modular React structure

---

## How to Use
1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Commit code: Husky will block on lint/format errors
4. Build: `pnpm build`

---

## Ready for production and scalable for any React project!
