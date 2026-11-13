# Release Notes — prices v1.3.0

**Date:** 2026-11-13  
**Tag:** `v1.3.0` (create after this PR merges)  
**Demo:** https://prices.mourao.info  
**Previous:** [v1.2.0](./release-notes-v1.2.0.md)

---

## Highlights

Polish pass on top of the v1.2 receipt track: reverse Compare→List flow, safer confirms, shareable cupom, and trip budget.

- **Save winner to list** from standalone Compare (match/create by name).
- **Undo** on the confirm toast (restores receipt line + list item).
- **Share receipt** via Web Share API or clipboard.
- **Trip budget** on Receipt (remaining / overspend).
- Canonical demo URL **prices.mourao.info** + Receipt/Compare screenshots.

## What’s new since receipt v1.2

| Area | Change |
| ---- | ------ |
| SL-22 | Standalone Compare → Save winner to list (bought or price-only) |
| RC-21 | Confirm toast **Undo** |
| RC-22 | Share open + archived cupom text |
| RC-24 | Optional persisted trip budget + progress |
| Docs | Canonical URL; Print04/Print05 screenshots; verification notes |
| Tests | 107 Vitest cases |

## How to demo (&lt; 5 minutes)

1. `/compare` → two packs → **Save winner to list** → Add and mark bought → toast with **Undo**.  
2. `/receipt` → set budget `20` → confirm a few lines → remaining/over + **Share receipt**.  
3. **End purchase** → open Past purchases → share archived cupom.  
4. Reload offline after one online visit (see `receipt-mvp-verification.md`).

## Upgrade / install

```bash
npm install
npm run build
npx vite preview
```

No migration beyond v1.2 (`migratedFromListV11` + new optional `budget` field on `prices-purchase`).

## Tagging / GitHub Release

After merge:

```bash
git tag -a v1.3.0 -m "prices v1.3.0 — share, budget, undo, save winner"
git push origin v1.3.0
gh release create v1.3.0 --title "prices v1.3.0" --notes-file docs/04-management/release-notes-v1.3.0.md
```

## Follow-ups (not in v1.3.0)

RC-20 price×qty, SL-20/21 multi-list/categories, sync/OCR — see backlogs.
