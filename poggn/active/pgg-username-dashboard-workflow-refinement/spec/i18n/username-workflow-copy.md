---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: I18n Copy Coverage

## Scope

신규 CLI/dashboard 사용자-facing copy는 ko/en을 모두 제공한다.

## Required Copy Groups

- username settings labels and empty state
- username missing init gate
- `pgg config username {name}` help
- `pgg settings` help/menu
- Workflow Progress token heading
- Workflow Progress detail helper
- token source labels: exact, measured, estimated
- flow token and file token labels
- git/timeline empty commit evidence
- project add Stepper labels
- pgg init/gate/defer status messages
- sidebar username card labels
- speed dial labels after version removal
- Sprint Progress deduped status labels

## Rules

- No newly added dashboard visible string may be hard-coded outside dictionary usage.
- CLI messages may be inline only when they are selected through a ko/en branching helper.
- Existing hard-coded strings touched by this work should be moved to dictionary if they appear in the changed UI area.

## Acceptance Criteria

- ko/en dictionaries compile with the same key set.
- TypeScript catches missing keys.
- Manual UI review confirms new labels change when project language switches.
