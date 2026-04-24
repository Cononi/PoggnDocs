---
spec:
  id: "S3"
  topic: "pgg-versioned-localized-commit-contract"
  title: "Generated Workflow Commit Contract"
  status: "ready"
---

# Generated Workflow Commit Contract

## Intent

Runtime behavior and documentation must not drift. Every generated or checked-in workflow surface should describe the same versioned, localized commit contract.

## Requirements

1. Root workflow docs must replace canonical `<archive_type>: <summary>` wording with `{convention}: [{version}]{commit message}`.
2. `STATE-CONTRACT` must update the `Git Publish Message` example and validation language.
3. `pgg-code`, `pgg-refactor`, and `pgg-qa` skill docs must describe the new subject/body contract.
4. README text in Korean and English must describe versioned subjects, language-specific commit text, detailed bodies, and convention categories.
5. `packages/core/src/templates.ts` must generate the updated workflow docs, skills, helpers, and examples for new or updated projects.
6. `packages/core/src/readme.ts` must generate the updated README text.
7. Generated docs must continue to warn that only pgg-managed `.codex/sh/*.sh` helpers are trusted.
8. Generated docs must continue to preserve version ledger content during `pgg update`.

## Acceptance

- No generated or root docs present `<archive_type>: <summary>` as the new canonical commit subject.
- `Git Publish Message` examples include the versioned subject shape.
- Korean and English generated docs both mention the language-specific commit message rule.
- `pgg update` continues to preserve `poggn/version-history.ndjson`.

## Non-Requirements

- Reformatting unrelated README sections is not required.
- Changing dashboard UI text is not required unless it directly repeats the old commit contract.
