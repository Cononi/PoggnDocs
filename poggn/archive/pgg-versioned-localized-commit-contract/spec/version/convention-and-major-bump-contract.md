---
spec:
  id: "S4"
  topic: "pgg-versioned-localized-commit-contract"
  title: "Convention And Major Bump Contract"
  status: "ready"
---

# Convention And Major Bump Contract

## Intent

pgg must clearly separate change convention from semver impact and must treat broken existing user usage as a major version bump.

## Requirements

1. `archive_type` remains the change category and maps to the commit `{convention}`.
2. Allowed conventions are exactly `feat`, `fix`, `docs`, `refactor`, `chore`, and `remove`.
3. `feat` means functionality added or changed.
4. `fix` means bug, error, or failure correction.
5. `docs` means documentation-only changes or documentation file updates.
6. `chore` means configuration/tooling changes such as ESLint settings.
7. `refactor` means function extraction, duplicate removal, or internal structure improvement without intended behavior change.
8. `remove` means file deletion, feature deletion, or capability removal.
9. `version_bump` remains separate from `archive_type`.
10. `major` is required when an existing user-facing workflow, command contract, generated file contract, helper interface, or expected output format is broken.
11. Existing `minor` and `patch` semantics remain: minor for non-breaking feature additions/changes, patch for compatible fixes, docs, small refactors, and chores unless they break usage.
12. Proposal and state templates must preserve `archive_type`, `version_bump`, and `target_version` as distinct fields.

## Acceptance

- A `refactor` topic can still choose `major` if it breaks existing usage.
- A `feat` topic can choose `minor` when it is non-breaking.
- A docs-only topic can choose `patch` unless it changes a generated contract in a breaking way.
- The new commit subject convention is derived from `archive_type`, while version is derived from `version_bump` and `target_version`.

## Non-Requirements

- Removing `archive_type` is not required.
- Deriving semver solely from convention is not allowed.
- Adding prerelease or build metadata semantics is not required.
