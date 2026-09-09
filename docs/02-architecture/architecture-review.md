# ARCHITECTURE REVIEW — prices (Cost-Benefit Calculator)

**Status:** Proposed — Pending Owner Approval
**Date:** 2026-09-08
**Related:** `docs/04-management/project-brief.md` v0.2.1

---

# 1. Solution Overview

A static, installable SPA+PWA with no backend. All logic runs client-side:

- User adds 2+ products (price + quantity + unit).
- App normalizes each entry to a base unit within its family (Volume: L; Mass: kg; Count: un).
- App computes `pricePerBase = price / quantityInBase`, ranks entries, highlights the cheapest, shows savings % vs the most expensive.
- Cross-family comparison (e.g. L vs kg) is blocked with a localized message.
- Theme, locale, and history persist in `localStorage`. App shell is precached for offline use.

Main components: Calculator Form, Unit Selector (one-tap buttons), Results List with winner badge, Theme Toggle, Language Toggle, History (local only), Install prompt.

---

# 2. Proposed Architecture

**Style:** Modular monolith front-end — feature-sliced, component-driven, offline-first.

- `src/app/` — composition root: providers (Theme, I18n), PWA registration, global styles.
- `src/features/calculator/` — domain: store, hooks, pure unit math, components.
- `src/components/ui/` — dumb reusable primitives (Button, Card, SegmentedControl, Input, Badge).
- `src/lib/` — pure utilities (units, currency, formatting). Zero React imports → fully unit-testable.
- `src/i18n/` — locale resources (`en`, `pt-BR`), no hardcoded strings elsewhere.
- No router needed for MVP (single view). Add a router only if a `/history` or `/about` page is required later.

**Justification:** Keeps domain logic pure and portable, UI thin, and state colocated. Matches the portfolio goal (clean componentization) and scales to 2–3 features without micro-frontend overhead.

---

# 3. Technology Stack

| Category | Choice | Rationale / Alternative considered |
| -------- | ------ | ---------------------------------- |
| Language | TypeScript (strict, already in repo) | Type safety for unit math |
| Framework | React 19 + Vite 8 (keep baseline) | Fast HMR/build; no SSR framework — static PWA needs no server rendering |
| Styling | Tailwind CSS 4 (keep) + CSS variables | Mobile-first, `dark:` variant, fluid theme transitions |
| State | Zustand + `persist` middleware | Minimal boilerplate, hook-based, selective subscriptions; React Context considered but causes unnecessary re-renders without splitting |
| Internationalization | i18next + react-i18next + browser language detection | Industry standard; English default, PT-BR toggle; `Intl.NumberFormat` for currency |
| PWA | Workbox-based PWA plugin for Vite | Manifest + precache + runtime cache + offline fallback; zero custom service-worker code |
| Icons | lucide-react | Tree-shakable, consistent with minimalist UI |
| Class utils | clsx + tailwind-merge | Conditional classes without conflicts |
| Validation | zod (light use for price/quantity schema) | Optional; a form library only if form complexity grows |
| Tests | Vitest + Testing Library (unit); Lighthouse CI / manual airplane test (PWA) | End-to-end tooling deferred to Hardening if time allows |
| Quality | ESLint (existing) + `tsc --noEmit` | Typecheck + lint in CI before merge |

**Decisions to record as ADRs:** ADR-01 Zustand over Context; ADR-02 Workbox-based PWA offline strategy; ADR-03 Tailwind dark-class theming; ADR-04 i18next with English default.

---

# 4. Core Components

| Component | Responsibility |
| --------- | -------------- |
| `ProductCard` | Price + quantity inputs, unit selector, remove |
| `UnitSelector` | Segmented one-tap buttons: L / kg / g / un (large touch targets, `aria-pressed`) |
| `ResultsList` / `WinnerBadge` | Ranked unit prices, best-value highlight, savings % |
| `ThemeToggle` | Light/dark switch, persists, respects `prefers-color-scheme` initially |
| `LanguageToggle` | EN ⇄ PT-BR segmented control, persists |
| `HistoryPanel` | Local comparison history (persisted store, clear-all) |
| `InstallPrompt` | `beforeinstallprompt` handler + iOS manual-install hint |
| `OfflineBadge` | `navigator.onLine` indicator for the supermarket context |

---

# 5. Dependencies

| Dependency | Purpose | Criticality |
| ---------- | ------- | ----------- |
| zustand | App + domain store | High |
| i18next, react-i18next, browser language detector | Translations | High |
| PWA plugin for Vite (+ Workbox) | Offline + installability | High |
| lucide-react, clsx, tailwind-merge | UI kit | Low |
| zod | Input schema | Low (removable) |
| vitest, @testing-library/react | Tests | Medium (dev only) |

Update strategy: pin majors; automated dependency updates deferred to post-v1.0.

---

# 6. Architectural Decisions

| ID | Decision | Justification | Impact |
| -- | -------- | ------------- | ------ |
| AD-01 | Zustand (not Context) for state | Fine-grained subscriptions, persist middleware, less boilerplate | Faster renders; testable stores |
| AD-02 | Pure `lib/units.ts` with no React imports | Unit math must be unit-tested in isolation | Prevents conversion bugs (highest domain risk) |
| AD-03 | Block cross-family comparison | L vs kg is physically meaningless | Clear UX message instead of wrong math |
| AD-04 | PWA cache-first app shell + versioned precache | Supermarket offline requirement | Stale-cache risk → mitigated by versioning + update prompt |
| AD-05 | Tailwind `dark:` class on `<html>` + CSS vars | Fluid transitions, persisted, no flash of unstyled content | Single theming mechanism |

---

# 7. Architectural Risks

| Risk | Mitigation |
| ---- | ---------- |
| Stale PWA serving old bundle | Revisioned precache; show "Update available" toast |
| iOS PWA quirks (install, theme-color) | Manual-install guidance; `apple-touch-icon` + meta tags |
| Float rounding in BRL (e.g. 7.50/1.5) | Integer-cents math or `toFixed` only at display; unit tests with BRL cases |
| Keyboard opens too often | `inputmode="decimal"`, unit buttons (no keyboard), large inputs |

---

# 8. Architectural Criteria (govern future decisions)

- Prefer purity: math/formatting in `lib/`, side effects in stores/effects.
- Prefer native: semantic HTML + native inputs before custom controls (accessibility first).
- Minimize taps: every new field must justify its interaction cost.
- No hardcoded strings, colors, or units outside tokens/locales/lib.
- Offline must never break: every feature works in airplane mode after first load.

---

# 9. Ideal Folder Structure (target)

```text
src/
  main.tsx                 # bootstrap: i18n, theme init, PWA register
  app/
    App.tsx                # composition: layout + feature
    providers.tsx          # Theme + I18n providers
    pwa.ts                 # service-worker registration + update flow
  features/
    calculator/
      CalculatorPage.tsx
      components/
        ProductCard.tsx
        UnitSelector.tsx
        ResultsList.tsx
        WinnerBadge.tsx
      hooks/
        useCalculator.ts   # thin selector layer over store
      store/
        calculatorStore.ts # zustand: products, actions, derived selectors
        preferencesStore.ts# theme, locale (or single store w/ slices)
      lib/
        units.ts           # toBaseUnit(), pricePerBase(), rank(), savings
        units.test.ts
  components/
    ui/
      Button.tsx
      Card.tsx
      SegmentedControl.tsx
      TextField.tsx
      Badge.tsx
      ThemeToggle.tsx
      LanguageToggle.tsx
      InstallPrompt.tsx
      OfflineBadge.tsx
  i18n/
    index.ts
    locales/
      en.json
      pt-BR.json
  styles/
    index.css              # tailwind + css vars + transitions
  lib/
    currency.ts            # Intl.NumberFormat helpers
    clsxm.ts               # clsx + twMerge
public/
  manifest.webmanifest
  icons/
    icon-192.png
    icon-512-maskable.png
  offline.html (fallback, if needed)
docs/
  01-business/ 02-architecture/ 03-design/ 04-management/
```

Existing template files (`App.css`, starter hero) are removed in Sprint Zero and replaced by the structure above.

---

# 10. State Strategy (Zustand)

```ts
// Domain slice
type Unit = 'L' | 'kg' | 'g' | 'un';
type Product = { id: string; label: string; price: number; quantity: number; unit: Unit };
type CalculatorState = {
  products: Product[];
  addProduct: () => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
};
// Derived (selectors, not stored): toBaseUnit(), pricePerBase(), ranked[], winnerId, savingsPct
// Preferences slice (persisted): theme: 'light'|'dark', locale: 'en'|'pt-BR'
// History slice (persisted, capped at e.g. 20): snapshots of comparisons
```

- One store with slices (or two small stores: `useCalculator`, `usePreferences`) — prefer slices to avoid cross-store imports.
- Persist only `theme`, `locale`, `history` (not transient inputs, or persist inputs too for aisle-interruption resilience — decide in MVP).
- Components subscribe selectively: `useCalculator(s => s.products)` to avoid re-renders.
- All math in pure functions; store holds data + actions only.

---

# 11. Review Checklist

- [x] Architecture defined (modular SPA+PWA, feature-sliced)
- [x] Stack registered (table §3)
- [x] Components identified (§4)
- [x] Dependencies registered (§5)
- [x] Decisions documented (§6)
- [x] Risks recorded (§7)
- [x] Criteria defined (§8)
- [ ] Approval — pending Owner

---

*Next: Initial Roadmap → Milestones → Initial Backlog → Sprint Zero (milestone gate before Sprint Planning).*
