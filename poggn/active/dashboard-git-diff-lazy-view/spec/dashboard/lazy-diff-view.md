---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "spec"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T05:30:44Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Dashboard Lazy Diff View

## 목적

dashboard가 code flow에서 변경 파일명 목록을 먼저 표시하고, 사용자가 특정 파일을 선택할 때 local Git에서 해당 파일 diff를 조회해 보여주도록 한다.

## 데이터 계약

- snapshot의 topic file entry는 lazy diff 항목에서 diff 본문을 포함하지 않는다.
- lazy diff 항목은 `relativePath`, `sourcePath`, `kind`, `diffSource`, `gitRef` 또는 `commitRange`, `targetPath`, `content: null`을 표현할 수 있어야 한다.
- 기존 `.diff` 파일 entry는 `kind: "diff"`와 embedded content fallback을 유지할 수 있다.
- `WorkflowDetailPayload`는 Git에서 조회한 diff와 파일에서 읽은 diff를 모두 `contentType: "text/x-diff"`로 표시할 수 있어야 한다.

## API 계약

- live dashboard는 현재 프로젝트 내부 Git repository에서만 diff를 조회한다.
- endpoint는 topic bucket, topic name, target path, diff source metadata를 받아 path traversal을 차단한다.
- `git show <commit> -- <path>`와 `git diff <base>..<head> -- <path>`를 지원한다.
- working tree fallback은 active topic에서만 허용하고 archive topic에서는 unavailable로 처리한다.
- static snapshot 모드에서는 live Git 조회가 불가능하므로 UI가 unavailable 상태를 표시한다.

## UI 계약

- code/implementation 영역은 diff 본문 대신 변경 파일명과 CRUD/status를 우선 표시한다.
- 파일 클릭 시 loading 상태를 표시한다.
- 조회 성공 시 기존 `DiffViewer`로 diff를 표시한다.
- Git ref 없음, commit 없음, path 없음, live API 없음은 서로 구분 가능한 메시지나 상태로 표시한다.
- 기존 legacy `.diff` 파일은 현재 preview 흐름으로 계속 열 수 있다.

## 수용 기준

- diff 본문이 snapshot에 없어도 변경 파일 목록이 비어 보이지 않는다.
- 파일 선택 전에는 대형 diff content를 로드하지 않는다.
- lazy 조회 실패가 전체 dashboard snapshot 로딩 실패로 번지지 않는다.
- mobile/desktop에서 파일명, status, error text가 버튼 영역을 넘치지 않는다.

## 확인 대상

- `packages/core/src/index.ts`
- `apps/dashboard/vite.config.ts`
- `apps/dashboard/src/shared/api/dashboard.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/utils/dashboard.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx`
