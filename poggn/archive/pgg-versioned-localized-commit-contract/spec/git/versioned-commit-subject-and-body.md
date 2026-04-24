---
spec:
  id: "S1"
  topic: "pgg-versioned-localized-commit-contract"
  title: "Versioned Commit Subject And Body"
  status: "ready"
---

# Versioned Commit Subject And Body

## Intent

Stage-local, QA completion, and publish commits must expose the change convention and target version directly in the subject, while the body explains the concrete content changed.

## Requirements

1. The canonical commit subject format is `{convention}: [{version}]{commit message}`.
2. `{convention}` must be one of `feat`, `fix`, `docs`, `refactor`, `chore`, or `remove`.
3. `{version}` must come from the topic `target_version` or archive `version.json` value that the helper is committing for.
4. Stage-local commits from `.codex/sh/pgg-stage-commit.sh` must use the topic proposal/state version metadata before archive.
5. Publish commits from `.codex/sh/pgg-git-publish.sh` must use the archived topic `version.json` values.
6. QA completion commits triggered by `.codex/sh/pgg-archive.sh` must use the same versioned subject contract as other stage-local commits.
7. The old `<archive_type>: <summary>` subject is legacy and must not pass helper validation where the new contract is expected.
8. Commit bodies must include detailed changed-content information, not only a terse title restatement.
9. Commit body output should keep a stable shape, such as a Why section plus a Details/Changes section, so logs remain readable.
10. Empty-change commit protection, dirty baseline filtering, changed-files scoping, and governed branch recovery must remain unchanged.

## Acceptance

- `fix: [1.0.0]release branch publish validation` is accepted when `archive_type=fix` and `target_version=1.0.0`.
- `fix: release branch publish validation` is rejected by new helper validation.
- A generated commit message contains the subject, a detailed body, and a footer.
- Stage commit history records the versioned `commitTitle`.
- Existing no-empty-commit and unrelated-dirty blockers still work.

## Non-Requirements

- Rewriting historical commits is not required.
- Changing branch names, archive paths, or release promotion order is not required.
- Adding new convention names is not required.
