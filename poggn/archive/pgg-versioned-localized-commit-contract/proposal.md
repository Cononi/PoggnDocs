---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 97
  updated_at: "2026-04-24T01:08:01Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "major"
  target_version: "1.0.0"
  short_name: "commit-contract"
  working_branch: "ai/feat/1.0.0-commit-contract"
  release_branch: "release/1.0.0-commit-contract"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "pgg commit message and semver governance must include versioned, localized subjects and clearer change classification."
  next: "pgg-plan"
---

# Proposal

## 1. Title

pgg-versioned-localized-commit-contract

## 2. Change Classification

- archive_type: `feat`
- version_bump: `major`
- target_version: `1.0.0`
- short_name: `commit-contract`
- working_branch: `ai/feat/1.0.0-commit-contract`
- release_branch: `release/1.0.0-commit-contract`
- project_scope: `current-project`

## 3. User Questions

- `$pgg-add 버전 관리 방식을 변경 하겠습니다. 변경 내용은 기능, 문서 모두 반영해서 차 후 다른 프로젝트에서도 이어져야 합니다.`
- `commit할때 변경 내용이 너무 단순해서 뭐가 바뀐건지 제목만으로 알 수 없습니다.`
- `commit 메시지를 pgg lang이 ko면 한글로, en이면 영어로 해주셔야 합니다.`
- `commit 규격이 {convention}: [{version}]{commit message} 입니다.`
- `commit body에는 상세하게 어떤 내용이 바뀐지 적혀 있어야 합니다.`
- `work flow에서 하는 테스크당 코밋은 기존대로 유지합니다.`
- `앞으로 major 버전은 기존 사용자가 쓰던 방식이 깨졌다면 올려야 합니다. minor, patch는 그대로 유지 합니다.`
- `feat, fix, docs, refactor, chore, remove 를 명확하게 구분합니다.`
- `feat: 기능 추가, 변경등`
- `fix: 버그, 오류, 장애 수정`
- `docs: 문서 수정, 문서 파일 수정, 변경`
- `chore: eslint같은 설정 파일 수정시`
- `refactor: 함수 분리, 반복 코드 제거, 그외 개선 처리시`
- `remove: 파일 삭제, 기능 삭제 등`

## 4. Why

- Current stage and publish commit subjects use the simpler `<archive_type>: <summary>` shape, which can hide the exact version context and make commit lists too terse for later project handoff. [.codex/add/WOKR-FLOW.md](/config/workspace/poggn-ai/.codex/add/WOKR-FLOW.md:44)
- Current state contract still defines Git Publish Message subjects as `<archive_type>: <short subject>`, so the new `{convention}: [{version}]{commit message}` rule must be reflected in workflow docs, generated templates, helper validation, and state handoff together. [.codex/add/STATE-CONTRACT.md](/config/workspace/poggn-ai/.codex/add/STATE-CONTRACT.md:25)
- The existing version-bump contract separates `archive_type` and `version_bump`, but the user is tightening the major rule: major is required when the existing user-facing usage pattern is broken. That decision needs to become explicit in proposal, plan, archive, and README surfaces.
- The current project language is `en`, but pgg can be switched between `ko` and `en`; commit message generation must respect that setting instead of using one fixed language. [.pgg/project.json](/config/workspace/poggn-ai/.pgg/project.json:4)
- Because generated assets are copied into other projects through `pgg update`, this change must be implemented in both runtime behavior and generator-managed documentation so later projects inherit the same commit and version semantics.

## 5. What Will Change

- Update stage-local task commits and release publish commits to use `{convention}: [{version}]{commit message}` as the canonical subject shape.
- Resolve `{convention}` from the clear change categories `feat`, `fix`, `docs`, `refactor`, `chore`, and `remove`.
- Generate or validate the `{commit message}` language from `.pgg/project.json` language: Korean when `language=ko`, English when `language=en`.
- Require detailed commit bodies that explain what changed, not only why the commit exists.
- Preserve the existing workflow cadence: pgg-code and pgg-refactor still commit per completed task, and QA still creates a completion commit only when QA artifacts leave additional changes.
- Make the major/minor/patch rule explicit: `major` when existing user usage is broken, while existing minor and patch behavior remains unchanged.
- Update functional helpers, generated docs/templates, skills, README, state contract, tests, and version/history surfaces so the rule carries into future projects.

## 6. Scope

### Included

- `.codex/sh/pgg-stage-commit.sh` subject/body generation and validation contract
- `.codex/sh/pgg-git-publish.sh` subject/body generation and validation contract
- `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, skill docs, generated templates, and README wording
- Package core templates/tests that install this workflow into future projects
- Commit convention classification guidance for `feat`, `fix`, `docs`, `refactor`, `chore`, and `remove`
- Semver decision guidance for breaking existing usage as `major`
- Regression tests for Korean and English commit message language behavior

### Excluded

- Changing the one-task-one-commit workflow cadence
- Rewriting existing historical commits
- Adding new convention values outside `feat|fix|docs|refactor|chore|remove`
- Changing git publish branch naming, archive movement, or release branch promotion semantics except where commit messages need the new versioned format
- Translating all existing archived topic documents

## 7. Constraints

- project scope stays `current-project`.
- `pgg git=on` paths must enforce the same subject/body contract for task commits, QA completion commits, and publish commits.
- The new subject format intentionally supersedes the old `<archive_type>: <summary>` contract.
- Existing `minor` and `patch` semantics should stay compatible; only the major decision rule is clarified around broken existing usage.
- Body text must be detailed enough to identify concrete changed behavior, docs, config, or removed capability.
- Empty-change commits remain disallowed.
- The new contract must not bypass dirty-worktree baseline handling.
- Generated assets must preserve version history and not reset `poggn/version-history.ndjson`.

## 8. Auto Mode Handling

- poggn auto mode: `on`
- auto mode is on, so this proposal resolves the change as `archive_type=feat`, `version_bump=major`, `target_version=1.0.0`, and `short_name=commit-contract`.

## 9. Baseline Decisions

| Item | Decision | Status |
|---|---|---|
| archive_type | `feat`, because this changes workflow functionality and generated behavior. | resolved |
| version_bump | `major`, because the canonical commit subject format changes and can break existing user expectations or helper validation. | resolved |
| subject format | `{convention}: [{version}]{commit message}` is the new canonical commit subject shape. | resolved |
| language | Use `ko` commit text for `pgg lang=ko` and English commit text for `pgg lang=en`. | resolved |
| task cadence | Keep task-by-task commits in workflow stages. | resolved |
| body detail | Commit body must describe concrete changed content in detail, not only repeat a terse summary. | resolved |
| conventions | Use only `feat`, `fix`, `docs`, `refactor`, `chore`, and `remove` and document their selection criteria. | resolved |
| downstream projects | Update generator-managed assets so `pgg update` carries the rule forward. | resolved |

## 10. Success Criteria

- New automatic task, QA completion, and publish commits use `{convention}: [{version}]{commit message}`.
- Commit subjects are produced in Korean for `pgg lang=ko` and English for `pgg lang=en`.
- Commit bodies include detailed descriptions of changed functionality, docs, configuration, refactor, fixes, or removals.
- Workflow docs and generated project assets describe the same commit subject, body, convention, and semver rules.
- Regression tests prove both legacy-format rejection and new-format acceptance where helper validation applies.
- Major version guidance is explicit: breaking an existing user workflow requires a major version bump.

## 11. Expert Review Summary

- Product manager: This is a major feature-level workflow governance change because it changes how users read and audit every generated commit across projects.
- UX/UI expert: The new format improves scanability by putting both convention and version in the subject, but it must keep task cadence unchanged to avoid disrupting existing workflow rhythm.
- Domain expert: The work must update helper validation and generator-managed docs together; otherwise future projects will drift between old and new commit contracts.

## 12. Next Step

`pgg-plan` should split this into runtime helper behavior, generated documentation/templates, semver guidance, language-specific commit message generation, and regression tests.
