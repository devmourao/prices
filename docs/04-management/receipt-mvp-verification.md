# Receipt MVP verification — offline + accessibility (RC-12)

**Date:** 2026-11-13  
**Milestone:** M-14  
**Build:** production (`npm run build` + `npx vite preview`) or deployed preview  
**Related:** `receipt-backlog.md` RC-12

---

## Offline / PWA (three routes)

Prereq: open the app once online so the service worker precaches the shell.

| # | Step | Expected | Result |
| - | ---- | -------- | ------ |
| 1 | DevTools → Application → Service Workers shows active SW | Precache present | ☐ |
| 2 | Network → Offline; reload `/` | List shell loads from cache | ☐ |
| 3 | Add item → Mark bought with price → Add to receipt | List shrinks; toast; chip shows total; `prices-purchase` persists | ☐ |
| 4 | Open `/receipt` via bottom nav (still offline) | Cupom lines + sticky total | ☐ |
| 5 | End purchase → confirm | Open clears; history entry with frozen total | ☐ |
| 6 | Open archived cupom from Past purchases | Read-only sheet; Esc closes | ☐ |
| 7 | Hard-refresh `/receipt` while offline | SPA fallback serves app shell | ☐ |
| 8 | `/compare` handoff: Apply and mark bought offline | Returns home; receipt line created | ☐ |

**Notes:** SPA rewrites (`vercel.json`, `public/_redirects`) + Workbox `navigateFallback` cover deep links after first visit.

---

## Accessibility (keyboard + semantics)

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | Single `<main>` landmark | Yes | ☐ |
| 2 | Bottom nav: List / Compare / Receipt; `aria-current` on active | Yes | ☐ |
| 3 | Confirm sheet: price required; focus trap + Esc | Yes | ☐ |
| 4 | Confirm toast: `role="status"` + `aria-live="polite"` | Yes | ☐ |
| 5 | Receipt total region `aria-live="polite"` | Yes | ☐ |
| 6 | Remove line / End purchase: named ≥ 44px targets | Yes | ☐ |
| 7 | History rows open sheet; Tab trap; Esc restores focus | Yes | ☐ |
| 8 | List chip link to `/receipt` labeled | Yes | ☐ |
| 9 | `prefers-reduced-motion` respected | Yes | ☐ |
| 10 | Lighthouse mobile Accessibility ≥ 95 | Record score: ___ | ☐ |

**Automated evidence:** `npm test` covers purchase store, migration, ReceiptPage (end/remove/history), List confirm, handoff apply bought vs price-only, BottomNav three tabs.

---

## Sign-off

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Agent (Sprint R2) | 2026-11-13 |
| Owner | Marcos Ferreira Mourão | TBD after preview pass |

---

*Complete the ☐ rows on a phone-width preview before tagging `v1.2.0`.*
