# STATE-CONTRACT

`state/current.md` is the minimum handoff context for the next stage.

## Required Rules

- Keep `state/current.md` and `state/history.ndjson` for every topic.
- When pre-existing dirty worktree paths exist at topic creation time, record them in `state/dirty-worktree-baseline.txt` as one repo-relative path per line.
- Pass `state/current.md` before full documents to the next stage.
- When teams handoff is needed, build the minimum payload with `.codex/sh/pgg-state-pack.sh <topic|topic_dir>` first.
- Keep the same minimal handoff format even when `pgg teams` is `off`.
- Treat only pgg-generated and managed `.codex/sh/*.sh` helpers as trusted handoff and automation scripts.
- Preserve `archive_type`, `version_bump`, `target_version`, branch naming, `project_scope`, and archive version data in the minimum handoff.
- Preserve the user-question record section or reference plus the `version_bump` and `target_version` decision outcome from the proposal stage in the minimum handoff.
- Preserve the `Audit Applicability` section with status and rationale in the minimum handoff.
- Preserve the `Git Publish Message` section or its reference in the minimum handoff when `pgg git=on`.
- `.codex/sh/pgg-state-pack.sh` output must expose at least `archive_type`, `version_bump`, `target_version`, `short_name`, branch naming, and `Git Publish Message` data as key/value handoff fields.
- Record CRUD and diff paths in the `Changed Files` section.
- Preserve the last expert score and blocking issues.
- Keep full review text out of `state/current.md`; summarize only decisions, score, and blockers.

## Git Publish Message Contract

- When `pgg git=on`, keep the section below in at least one of `state/current.md` or `qa/report.md`.
- Subjects must follow `{convention}: [{version}]{commit message}`, stay at 50 characters or fewer, remain non-imperative, stay period-free, and be understandable on their own.
- `{convention}` is the topic `archive_type`; `{version}` is the topic `target_version` before archive and the archived version during publish.
- Commit message text must follow `pgg lang`: Korean for `ko`, English for `en`.
- `why` is the source for the Why-focused commit body, while the subject summary is repeated in a `Changes` body section so logs explain what changed.
- When `footer` is empty, the helper falls back to `Refs: <topic>`.

```md
## Git Publish Message
- title: <convention>: [<version>]<commit message>
- why: <detailed why and changed-content summary>
- footer: <tracker link or Refs: <topic>>
```
