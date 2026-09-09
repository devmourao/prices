# Development Standards — prices

**Status:** Active
**Date:** 2026-09-08
**Related:** `docs/04-management/project-brief.md`, `initial-backlog.md`

This document records the team conventions for branches, commits, and pull requests.
All contributors (including automated assistants) must follow it. It is written with
standard software-industry terminology.

---

# 1. Branching

- Base branch: `main` (protected, always releasable).
- Short-lived feature branches, one backlog item per branch.
- Naming: `<type>/CB-<id>-<short-description>` (lowercase, hyphens).
  - Types: `feat` (new behavior), `fix` (bug fix), `chore` (tooling, scaffolding, deps),
    `docs` (documentation only), `refactor`, `test`.
  - Examples: `feat/CB-12-unit-selector`, `fix/CB-14-tie-message`, `chore/CB-03-core-deps`.
- Delete the branch after merging. Never commit directly to `main`.

---

# 2. Commits

- Format (Conventional Commits): `<type>(<scope>): <description>`
  - `type`: feat | fix | chore | docs | refactor | test | style.
  - `scope`: backlog item (`CB-01`) or area (`calculator`, `i18n`, `pwa`, `theme`, `deps`).
  - `description`: imperative, lowercase, no trailing period, max ~72 chars.
- One logical change per commit. Reference the backlog item in every message.
- Examples:
  - `chore(CB-01): clean vite starter baseline and scaffold folder structure`
  - `feat(CB-11): add calculator store with product actions`
  - `docs(CB-25): rewrite README with demo and architecture map`
- Verify before committing: `npm run build` green (and `lint` / `typecheck` once CB-08 lands).

---

# 3. Pull Requests / Merges

- Even as a single developer, integrate via merge commits (`--no-ff`) so history stays readable.
- Merge checklist (all must hold):
  - [ ] Build green (`npm run build`; plus lint/typecheck when available).
  - [ ] Linked backlog item(s) with acceptance criteria met.
  - [ ] Docs updated alongside code when business rules, architecture, or setup change
        (`docs/01-business/`, `02-architecture/`, `03-design/`, `04-management/` as applicable).
  - [ ] UI changes include a screenshot or short clip.
  - [ ] No hardcoded user-facing strings (use `src/i18n/locales/`).
  - [ ] No dead code, assets, or commented-out blocks.
- Squash small fixup commits before merging; keep milestone merges explicit.

---

# 4. Definition of Done (per milestone)

A milestone is done only when its Roadmap gate holds: scope complete, checks green,
docs current, offline/manual verification passed where applicable, and demo evidence
recorded. See `roadmap.md` §4.

---

# 5. Revision History

| Version | Date | Change | Author |
| ------- | ---- | ------ | ------ |
| 1.0.0 | 2026-09-08 | Initial standards (branches, commits, merges, DoD) | Tech Lead |
