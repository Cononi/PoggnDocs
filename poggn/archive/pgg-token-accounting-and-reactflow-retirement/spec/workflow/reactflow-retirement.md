---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T03:23:52Z"
  archive_type: "fix"
  project_scope: "current-project"
state:
  summary: "React Flow workflow JSON 생성을 중단하고 optional legacy artifact로 취급한다."
  next: "pgg-code"
---

# Spec S2: React Flow Retirement

## 요구사항

1. 새 topic 생성 helper는 `workflow.reactflow.json`을 쓰지 않는다.
2. generated project template도 `workflow.reactflow.json` 생성 문자열과 `pgg-reactflow-build.sh` managed entry를 포함하지 않는다.
3. workflow artifact summary는 `workflow.reactflow.json`이 없어도 missing required로 계산하지 않는다.
4. 과거 archive/active topic에 파일이 있으면 기존 parser는 계속 읽을 수 있다.
5. pgg 문서와 skill 설명은 `workflow.reactflow.json`을 필수 산출물로 요구하지 않는다.

## 수용 기준

- 새 topic 생성 후 `workflow.reactflow.json`이 없다.
- dashboard snapshot이 workflow JSON 부재를 topic health partial 원인으로 삼지 않는다.
- 기존 workflow JSON이 있는 topic의 read path는 깨지지 않는다.
