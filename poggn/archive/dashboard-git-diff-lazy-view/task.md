---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T05:30:44Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "3.2.0"
  short_name: "dashboard-view"
  working_branch: "ai/feat/3.2.0-dashboard-view"
  release_branch: "release/3.2.0-dashboard-view"
  project_scope: "current-project"
state:
  summary: "Git 기반 lazy diff 전환 작업을 spec 경계별 task로 분해한다."
  next: "pgg-code"
---

# Task

## Task 목록

| Task ID | Spec | Dependencies | Completion Criteria |
|---|---|---|---|
| T1 | `spec/workflow/git-diff-artifact-contract.md` | 없음 | workflow 문서, skill 문서, template에서 `.diff` 본문 기본 저장 요구가 제거되고 Git diff metadata 계약이 명시된다. |
| T2 | `spec/workflow/git-diff-artifact-contract.md` | T1 | `.codex/sh/pgg-diff-index.sh`와 template 출력이 diff 파일 스캔 대신 Changed Files/Git metadata 기반 index를 만들 수 있다. |
| T3 | `spec/dashboard/lazy-diff-view.md` | T1 | core dashboard model과 snapshot이 diff 본문 없이 변경 파일명과 lazy diff metadata를 전달한다. |
| T4 | `spec/dashboard/lazy-diff-view.md` | T3 | live dashboard API와 UI가 선택한 변경 파일의 Git diff를 조회하고 loading/error/unavailable 상태를 표시한다. |
| T5 | `spec/verification/storage-and-regression.md` | T1, T2, T3, T4 | 테스트, generated asset update, storage/token/performance 확인 기준이 통과하고 결과가 implementation 문서에 기록된다. |

## Task 상세

### T1. Workflow 계약 갱신

- 대상: `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/add/IMPLEMENTATION.md`, `.codex/skills/pgg-code/SKILL.md`, `.codex/skills/pgg-refactor/SKILL.md`, `packages/core/src/templates.ts`.
- `implementation/diffs/*.diff`를 필수 본문 산출물로 요구하지 않도록 표현을 바꾼다.
- `Changed Files`와 `implementation/index.md`가 `CRUD`, `path`, `taskRef`, `gitRef` 또는 `commitRange`, `diffCommand`, `status`를 담도록 계약을 확정한다.

### T2. Diff index helper 갱신

- 대상: `.codex/sh/pgg-diff-index.sh`, `packages/core/src/templates.ts`.
- 기존 diff 파일 glob 기반 index 생성을 제거하거나 호환 fallback으로 낮춘다.
- 현재 topic의 `state/current.md` 또는 stage commit evidence에서 변경 파일 목록과 Git ref를 읽어 index를 만들도록 한다.
- 기존 `.diff` 파일이 있는 topic은 마이그레이션 없이도 읽을 수 있게 legacy fallback을 유지한다.

### T3. Dashboard model/snapshot 갱신

- 대상: `packages/core/src/index.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `apps/dashboard/src/shared/utils/dashboard.tsx`.
- `WorkflowDetailPayload` 또는 별도 타입에 lazy diff source metadata를 추가한다.
- snapshot builder는 신규 lazy diff 항목에 `content: null`을 유지하고 token estimate가 diff 본문을 포함하지 않도록 한다.
- archive/active topic 모두 path traversal 없이 현재 프로젝트 내부 Git path만 허용한다.

### T4. Dashboard API/UI lazy-load 구현

- 대상: `apps/dashboard/vite.config.ts`, `apps/dashboard/src/shared/api/dashboard.ts`, `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts`, `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx`.
- live API에 topic Git diff 조회 endpoint 또는 기존 file detail endpoint의 lazy diff 분기를 추가한다.
- UI는 변경 파일명을 클릭할 때 diff를 요청하고, 요청 중/loading, ref 없음/unavailable, 조회 실패/error 상태를 보여준다.
- 기존 `.diff` 파일 content가 snapshot에 포함된 archive topic은 기존 preview fallback으로 유지한다.

### T5. 검증과 산출물 갱신

- 대상: `packages/core/test/*`, `scripts/dashboard-history-model.test.mjs`, dashboard 관련 테스트, generated dashboard snapshot.
- `.diff` 파일 없는 topic fixture와 legacy `.diff` fixture를 모두 테스트한다.
- `pnpm build`, `pnpm test`, dashboard history model test, generated asset update를 현재 verification contract에 맞춰 실행 후보로 둔다.
- pgg-token과 pgg-performance audit가 required인 이유와 측정 항목을 implementation state에 유지한다.

## Audit Applicability

- [pgg-token]: required | diff 본문 제거 후 topic 파일 token surface와 snapshot content 포함 여부를 검증한다.
- [pgg-performance]: required | 선택 시 Git diff 조회가 dashboard 사용성을 해치지 않는지 확인한다.

## Git Publish Message

- title: feat: 3.2.0.Git 기반 diff 지연 조회
- why: pgg code flow의 diff 본문 중복 저장을 줄이고 dashboard가 변경 파일 선택 시 Git에서 필요한 diff만 조회하도록 전환한다.
- footer: Refs: dashboard-git-diff-lazy-view
