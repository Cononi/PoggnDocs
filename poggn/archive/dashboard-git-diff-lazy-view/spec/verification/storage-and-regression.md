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

# Spec: Storage And Regression Verification

## 목적

diff 본문 중복 저장 제거가 저장량과 token surface를 줄이면서 기존 archive/topic 조회 흐름을 깨지 않는지 확인한다.

## 필수 검증

- 신규 lazy diff fixture는 `implementation/diffs/*.diff` 파일 없이도 dashboard code flow 파일 목록을 만든다.
- legacy fixture는 기존 `.diff` 파일을 계속 읽고 표시한다.
- snapshot JSON에 신규 lazy diff 본문이 포함되지 않는다.
- topic token estimate가 대형 diff 본문을 local estimated token으로 합산하지 않는다.
- live API가 잘못된 path, topic 밖 path, 없는 Git ref를 거부하거나 unavailable로 반환한다.
- `pgg-diff-index.sh`와 generated template이 같은 table/schema를 만든다.

## 실행 후보

- `pnpm build`
- `pnpm test`
- `scripts/dashboard-history-model.test.mjs` 실행 경로 또는 기존 test suite 내 포함 확인
- `bash -n .codex/sh/pgg-diff-index.sh`
- generated asset update command
- dashboard manual smoke: live API mode에서 변경 파일 클릭 후 diff 표시 확인

## Audit 기준

- `pgg-token`: 기존 `.diff` 본문 fixture 대비 snapshot/topic token surface 감소량을 기록한다.
- `pgg-performance`: lazy diff API 응답 시간, 대형 diff 표시 지연, UI loading 상태를 기록한다.

## 수용 기준

- 전체 test suite가 통과한다.
- legacy archive topic에서 기존 diff preview가 regression 없이 유지된다.
- 신규 lazy diff topic에서 파일 선택 전 diff content가 snapshot에 없다.
- Git 조회 실패는 사용자가 이해할 수 있는 상태로 표시되고 앱 crash를 만들지 않는다.
