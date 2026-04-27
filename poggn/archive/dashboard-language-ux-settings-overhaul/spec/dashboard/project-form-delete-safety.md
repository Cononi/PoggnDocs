---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-dashboard-project-form-delete-safety"
  node_type: "spec"
  label: "spec/dashboard/project-form-delete-safety.md"
state:
  summary: "project add form과 delete double confirmation 계약"
  next: "pgg-code"
---

# Spec: Project Form And Delete Safety

## 목적

프로젝트 추가 form은 dashboard 품질에 맞게 정돈되어야 하고, 실제 프로젝트 폴더 삭제는 되돌릴 수 없는 작업이므로 두 단계 확인이 필요하다.

## 요구사항

1. project add dialog는 root directory input과 category select가 같은 높이와 visual density를 가져야 한다.
2. category select는 full width를 사용하고 label/helper/error spacing이 input과 일관되어야 한다.
3. form은 desktop과 mobile 모두에서 자연스럽게 보이는 card layout을 사용한다.
4. 실제 프로젝트 폴더 삭제 checkbox를 체크하면 두 번째 확인 checkbox가 나타난다.
5. 두 번째 확인 문구는 “외부에 백업하지 않았다면 다시는 프로젝트를 되돌릴 수 없습니다. 정말 삭제 하시겠습니까?” 의미를 포함해야 한다.
6. 실제 folder delete payload는 두 체크가 모두 true일 때만 전송한다.
7. dashboard 등록만 제거하는 경우 두 번째 확인은 요구하지 않는다.

## 구현 기준

- `dangerousDeleteRoot`와 별도로 `confirmedNoExternalBackup` 같은 state를 둔다.
- `closeDeleteProjectDialog`는 두 체크 state를 모두 reset한다.
- delete button disabled 조건은 root 삭제 선택 시 두 번째 체크를 포함한다.
- locale key는 ko/en 모두 추가한다.

## 검증 기준

- root 삭제 미선택: 등록 제거만 가능하다.
- root 삭제 선택 + 두 번째 체크 미선택: 삭제 버튼이 비활성화된다.
- root 삭제 선택 + 두 번째 체크 선택: `{ dangerousDeleteRoot: true }` payload가 전송된다.
- dialog close 후 다시 열면 체크 상태가 초기화된다.
