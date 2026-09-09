# prices — Cost-Benefit Calculator

Compare supermarket products by unit price and instantly find the best value — offline, in English or Portuguese, light or dark.

**Live demo:** https://prices-mauve.vercel.app

## Why this project

A portfolio-grade, mobile-first SPA + PWA that answers a real aisle question: *2 L for $10.00 vs 1.5 L for $7.50 — which is cheaper?* Type two prices, tap the unit buttons (no keyboard needed for units), and the cheapest option is highlighted with savings vs the most expensive one.

## Features

- Compare 2+ products by normalized unit price (L, mL, kg, g, unit).
- One-tap unit selector (segmented buttons, keyboard-friendly radio pattern).
- Instant best-value badge with savings percentage; ties and mixed-unit cases handled explicitly.
- Offline-first PWA (precached app shell, update prompt, installable with maskable icons).
- Light/dark theme with fluid transitions, persisted, system-aware on first run.
- English default with PT-BR toggle, persisted; currency follows locale (USD/BRL via `Intl`).
- Local comparison history (last 20, restore/clear, persisted).
- Accessible: semantic landmarks, labeled controls, visible focus, live regions, `prefers-reduced-motion` respected.

## Tech stack

| Layer     | Choice                                            |
| --------- | ------------------------------------------------- |
| Language  | TypeScript (strict)                               |
| Framework | React 19 + Vite 8                                 |
| Styling   | Tailwind CSS 4 (class-based dark mode + tokens)   |
| State     | Zustand (`persist` for calculator/history)        |
| i18n      | i18next + react-i18next + browser detection       |
| PWA       | Workbox-based Vite plugin (precache + fallback)   |
| Icons     | lucide-react (tree-shaken)                        |
| Tests     | Vitest + Testing Library + jsdom (33 tests)       |

## Getting started (under 5 minutes)

Prerequisites: Node.js 20+ and npm.

```bash
npm install
npm run dev      # local dev server (online; offline works on served builds)
npm test         # unit suite (Vitest)
npm run lint     # ESLint
npm run build    # typecheck + production build to dist/
npx vite preview # serve the production build locally (PWA fully active)
```

To try offline mode: open the preview (or demo) URL once, wait for the app to load, then enable *Offline* in DevTools → Network and reload.

## Project structure

```text
src/
  main.tsx                 # bootstrap: styles, i18n, PWA registration
  app/
    App-level composition: providers, PWA update flow, preferences store
  features/calculator/
    CalculatorPage.tsx     # mobile-first single view with sticky results
    components/            # ProductCard, UnitSelector, ResultsList, ...
    hooks/                 # thin selector layer over the stores
    store/                 # zustand stores (calculator, history)
    lib/                   # pure domain math (units, parsing) + tests
  components/ui/           # reusable primitives (Button-like controls, toggles, badges)
  i18n/locales/            # en.json, pt-BR.json (no hardcoded UI strings)
  lib/                     # Intl currency helpers + tests
public/icons/              # PWA icons (192/512 + maskable + Apple touch)
docs/                      # living documentation (brief, architecture, roadmap, backlog)
```

State strategy: thin UI over persisted Zustand stores; all unit math lives in pure, unit-tested functions outside React; components subscribe selectively to avoid re-renders.

## Key decisions

- **Zustand over Context** — fine-grained subscriptions + persist middleware, less boilerplate.
- **Pure `lib/units.ts`** — conversions/ranking/savings isolated from React for testing.
- **Cross-family comparison blocked** — liters vs kilos is meaningless; a localized message replaces wrong math.
- **Per-product units over a global family switch** — fewer taps, no migration problem; revisit only with user evidence.
- **Class-based dark theme + pre-paint guard** — persisted, system-aware, no flash.
- **Explicit locale persistence** — the detector does not persist manual switches, so changes are mirrored to storage directly.

## Accessibility & quality

- `npm test` (33 tests), `npm run lint`, `npm run build` (typecheck) all green.
- Keyboard-only flow: Tab enters each option group once, arrows move/select.
- Lighthouse targets (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90.

## Roadmap

Single-view calculator (v1.0) → polish/i18n/history → offline + a11y hardening → portfolio release. See `docs/04-management/roadmap.md` and `initial-backlog.md` for phases, milestones, and the full backlog; `docs/02-architecture/architecture-review.md` for the architecture record.

## Screenshots

> Pending: capture mobile screenshots (light/dark, EN/PT-BR) after the release deploy and place them under `docs/03-design/screenshots/`.
