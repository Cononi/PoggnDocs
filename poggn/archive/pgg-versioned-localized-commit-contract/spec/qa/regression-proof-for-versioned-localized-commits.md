---
spec:
  id: "S5"
  topic: "pgg-versioned-localized-commit-contract"
  title: "Regression Proof For Versioned Localized Commits"
  status: "ready"
---

# Regression Proof For Versioned Localized Commits

## Intent

The implementation needs tests that prove runtime behavior, generated docs, language handling, and semver guidance stay aligned.

## Required Test Coverage

1. Stage commit helper accepts `{convention}: [{version}]{commit message}` subjects and records them in git history and `state/history.ndjson`.
2. Stage commit helper rejects legacy `<archive_type>: <summary>` subjects where the new validation path applies.
3. Publish helper accepts versioned `Git Publish Message` titles from `qa/report.md` or `state/current.md`.
4. Publish helper rejects legacy `Git Publish Message` titles.
5. QA completion commit fallback uses a versioned localized subject.
6. Korean project fixtures accept Korean commit message text and reject English-only message text.
7. English project fixtures accept English commit message text and reject Korean message text.
8. Commit bodies include detailed changed-content text and footer.
9. Generated README, workflow docs, state contract, and skills contain the new subject format and language rule.
10. Version/convention tests prove `version_bump=major` remains independent from `archive_type`.

## Verification Commands

- `pnpm test`
- `pnpm build`
- `bash ./.codex/sh/pgg-gate.sh pgg-qa pgg-versioned-localized-commit-contract` during QA

## Manual Evidence

- Confirm no root/generated workflow docs still present `<archive_type>: <summary>` as the canonical new commit format.
- Confirm `poggn/version-history.ndjson` remains append-only and is not rewritten by generated asset sync.

## Non-Requirements

- Browser or dashboard visual QA is not required.
- Performance measurement is not required.
