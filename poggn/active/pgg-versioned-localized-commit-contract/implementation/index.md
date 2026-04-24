---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 97
  updated_at: "2026-04-24T03:06:39Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/001_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | `T1,T2` | stage commits now generate `{convention}: [{version}]{commit message}`, validate localized text, and write `Why` plus `Changes` body sections |
| 002 | UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/002_UPDATE__codex_sh_pgg-git-publish_sh.diff` | `T1,T2` | publish commits validate versioned titles, localized message text, and detailed body content |
| 003 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/003_UPDATE_packages_core_src_templates_ts.diff` | `T1,T2,T3,T4` | generated helpers, workflow docs, state contract, and skill templates now carry the new commit convention and semver guidance |
| 004 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/004_UPDATE__codex_add_WOKR-FLOW_md.diff` | `T3,T4` | workflow contract documents versioned localized commit subjects and breaking-change major guidance |
| 005 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/005_UPDATE__codex_add_STATE-CONTRACT_md.diff` | `T3` | Git Publish Message contract now uses the new subject shape and detailed body expectation |
| 006 | UPDATE | `AGENTS.md` | `implementation/diffs/006_UPDATE_AGENTS_md.diff` | `T3` | working rules now point to the versioned localized commit message contract |
| 007 | UPDATE | `README.md` | `implementation/diffs/007_UPDATE_README_md.diff` | `T3,T4` | user-facing README explains localized versioned commits and major/minor/patch selection |
| 008 | UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/008_UPDATE_packages_core_src_readme_ts.diff` | `T3,T4` | generated README text matches the root README contract |
| 009 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/009_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T5` | git helper tests cover versioned subjects, detailed bodies, legacy rejection, and ko/en language checks |
| 010 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/010_UPDATE_packages_core_test_skill-generation_test_mjs.diff` | `T5` | generated asset test verifies workflow/state/README generated wording and ledger preservation |
| 011 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/011_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T4,T5` | semver handoff test uses the versioned Git Publish Message shape |
| 012 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/012_UPDATE_packages_core_dist_templates_js.diff` | `T1,T2,T3,T4` | built template output updated from source changes |
| 013 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/013_UPDATE_packages_core_dist_templates_js_map.diff` | `T1,T2,T3,T4` | source map updated by build |
| 014 | UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/014_UPDATE_packages_core_dist_readme_js.diff` | `T3,T4` | built README generator output updated from source changes |
| 015 | UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_readme_js_map.diff` | `T3,T4` | source map updated by build |

## Verification

- `pnpm build`: pass
- `pnpm test`: pass

## Notes

- The ignored generated `.codex/sh/pgg-archive.sh` and `.codex/skills/*` local assets were updated in the workspace for current-project behavior; the tracked generator source in `packages/core/src/templates.ts` is the durable source for future projects.
