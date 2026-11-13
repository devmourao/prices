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
| 1 | DevTools → Application → Service Workers shows active SW | Precache present | ☐ manual |
| 2 | Network → Offline; reload `/` | List shell loads from cache | ☐ manual |
| 3 | Add item → Mark bought with price → Add to receipt | List shrinks; toast; chip shows total; `prices-purchase` persists | ✅ covered by ListPage + purchase store tests |
| 4 | Open `/receipt` via bottom nav (still offline) | Cupom lines + sticky total | ☐ manual (route + SPA rewrite present) |
| 5 | End purchase → confirm | Open clears; history entry with frozen total | ✅ ReceiptPage tests |
| 6 | Open archived cupom from Past purchases | Read-only sheet; Esc closes | ✅ ReceiptPage history test |
| 7 | Hard-refresh `/receipt` while offline | SPA fallback serves app shell | ☐ manual |
| 8 | `/compare` handoff: Apply and mark bought offline | Returns home; receipt line created | ✅ HandoffBar tests |

**Notes:** SPA rewrites (`vercel.json`, `public/_redirects`) + Workbox `navigateFallback` cover deep links after first visit.

---

## Accessibility (keyboard + semantics)

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | Single `<main>` landmark | Yes | ✅ App.tsx |
| 2 | Bottom nav: List / Compare / Receipt; `aria-current` on active | Yes | ✅ BottomNav tests |
| 3 | Confirm sheet: price required; focus trap + Esc | Yes | ✅ Sheet + ItemSheet tests |
| 4 | Confirm toast: `role="status"` + `aria-live="polite"` (+ Undo) | Yes | ✅ ConfirmToast |
| 5 | Receipt total region `aria-live="polite"` | Yes | ✅ ReceiptTotal |
| 6 | Remove line / End purchase: named ≥ 44px targets | Yes | ✅ ReceiptPage tests |
| 7 | History rows open sheet; Tab trap; Esc restores focus | Yes | ✅ history + Sheet tests |
| 8 | List chip link to `/receipt` labeled | Yes | ✅ ListPage confirm test |
| 9 | `prefers-reduced-motion` respected | Yes | ✅ index.css |
| 10 | Lighthouse mobile Accessibility ≥ 95 | Record on https://prices.mourao.info | ☐ manual |

**Automated evidence:** `npm test` covers purchase store, migration, ReceiptPage (end/remove/history), List confirm, handoff + SL-22 save winner, undo confirm, BottomNav three tabs.

---

## Sign-off

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Agent (Sprint R2) | 2026-11-13 |
| Owner | Marcos Ferreira Mourão | TBD after preview pass |

---

*Complete the ☐ rows on a phone-width preview before tagging `v1.2.0`.*
