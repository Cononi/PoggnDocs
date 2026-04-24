---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "review"
  status: "reviewed"
  score: 97
  updated_at: "2026-04-24T01:08:01Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 97 | The requirement is correctly framed as a cross-project workflow feature because commit subjects, body detail, language, and semver decisions all affect user-facing release auditability. | none |
| UX/UI expert | 96 | Adding `[version]` to the subject directly addresses scanability, while preserving task-by-task commits avoids a disruptive workflow cadence change. | none |
| Domain expert | 98 | Treating the subject format change as `major` is consistent with the clarified rule because existing users and helpers can depend on the old `<archive_type>: <summary>` contract. | none |

## Evidence Checked

- `.codex/add/WOKR-FLOW.md` current stage and publish commit wording
- `.codex/add/STATE-CONTRACT.md` current Git Publish Message subject contract
- `.pgg/project.json` current language, teams, git, and verification metadata
- `poggn/version-history.ndjson` latest archived version baseline

## Decision

Approved for `pgg-plan` with `archive_type=feat`, `version_bump=major`, and `target_version=1.0.0`.
