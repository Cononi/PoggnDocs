---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
reactflow:
  node_id: "spec-file-tree"
  node_type: "doc"
  label: "spec/ui/file-tree-navigation-and-folder-layout.md"
state:
  summary: "files surface를 folder tree explorer 기준으로 재정의한다."
  next: "task.md 승인"
---

# File Tree Navigation And Folder Layout Spec

## Goal

- files surface를 flat file list에서 folder tree explorer로 바꿔 topic artifact 탐색성을 높인다.

## Layout Requirements

- files surface는 좌측 tree explorer와 우측 preview/editor의 split layout이어야 한다.
- 좌측 explorer visual direction은 `add-img/3.png`처럼 dense tree indentation, 선택된 row 강조, explorer rail 감각을 참고할 수 있다.
- reference image의 분위기를 참고하되 픽셀 단위 복제는 요구하지 않는다.

## Tree Requirements

- tree는 topic `relativePath`를 folder/file hierarchy로 materialize 해야 한다.
- folder node는 expand/collapse를 지원해야 한다.
- selected file과 현재 preview/editor 대상은 같은 source path를 공유해야 한다.
- tree row는 folder/file 타입을 식별할 수 있어야 하고, current workflow 관련 파일은 보조 강조를 줄 수 있다.

## Editing Guardrails

- edit/delete는 기존과 동일하게 live mode + topic root guard 안에서만 허용해야 한다.
- tree selection이 곧 edit permission을 의미하면 안 되고, editable 여부는 파일 metadata contract를 따라야 한다.
- path normalization은 tree builder와 mutation API 모두에서 일관되게 유지해야 한다.

## Non-Requirements

- topic 밖 arbitrary filesystem browsing
- IDE 수준의 multi-tab editor
