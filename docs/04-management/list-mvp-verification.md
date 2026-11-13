# List MVP verification — offline + accessibility (SL-15 / SL-16)

**Date:** 2026-11-13  
**Milestone:** M-10  
**Build:** production (`npm run build` + `npx vite preview`) or deployed preview  
**Related:** `shopping-list-backlog.md` SL-15, SL-16

---

## SL-15 — Offline / PWA (both routes)

Prereq: open the app once online so the service worker precaches the shell.

| # | Step | Expected | Result |
| - | ---- | -------- | ------ |
| 1 | DevTools → Application → Service Workers shows active SW | Precache present | ☐ |
| 2 | Network → Offline; reload `/` | List shell loads from cache | ☐ |
| 3 | Add item, check off, mark bought with price | Persists in `localStorage` (`prices-list`) | ☐ |
| 4 | Navigate to `/compare` via bottom nav (still offline) | Compare loads; calculator usable | ☐ |
| 5 | From a list item: Compare options → enter 2 prices → Use this price → Apply and mark bought | Returns to `/`; item updated | ☐ |
| 6 | Hard-refresh `/compare` while offline | SPA fallback serves app shell | ☐ |
| 7 | Go online; if update toast appears, Reload works | Fresh bundle activates | ☐ |

**Notes:** Static host must rewrite SPA routes to `index.html` (`vercel.json`, `public/_redirects`). Workbox `navigateFallback: index.html` covers offline navigations after first visit.

---

## SL-16 — Accessibility (keyboard + semantics)

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | Page has a single `<main>` landmark | Yes (`App.tsx`) | ☐ |
| 2 | Bottom nav: Tab to List/Compare; `aria-current="page"` on active | Yes | ☐ |
| 3 | Add item: label associated; Enter submits; focus stays in field | Yes | ☐ |
| 4 | Checkbox: `role="checkbox"` + `aria-checked` + named control | Yes | ☐ |
| 5 | Open item sheet: focus moves into dialog; Esc closes; focus restored | Yes | ☐ |
| 6 | Sheet: Tab cycles within dialog (focus trap) | Yes | ☐ |
| 7 | Progress region `aria-live="polite"` announces done/total changes | Yes | ☐ |
| 8 | Compare handoff bar: Back link + apply button labeled | Yes | ☐ |
| 9 | Unit selector: radiogroup + arrow keys | Yes (existing) | ☐ |
| 10 | `prefers-reduced-motion` respected | Yes (`index.css`) | ☐ |
| 11 | Lighthouse mobile Accessibility ≥ 95 (manual run on preview) | Record score: ___ | ☐ |

**Automated evidence:** `npm test` includes Sheet Esc/Tab trap, ListPage flows, HandoffBar apply path, BottomNav current page (67+ tests).

---

## Sign-off

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Agent (Sprint L3) | 2026-11-13 |
| Owner | Marcos Ferreira Mourão | TBD after preview pass |

---

*Complete the ☐ rows on a phone-width preview before tagging `v1.1.0`.*
