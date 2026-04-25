---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S3. PGG Stage Event Recording

## 목적

pgg stage 실행 절차가 dashboard에서 실시간 flow 상태로 계산될 수 있는 evidence를 남기게 한다.

## Event Contract

- stage 시작: `{"stage":"<stage>","event":"stage-started","source":"pgg-<skill>"}`
- 중간 진행: `{"stage":"<stage>","event":"stage-progress","source":"pgg-<skill>","summary":"..."}`
- 추가 요구: `{"stage":"<stage>","event":"requirements-added","source":"user","summary":"..."}`
- 완전 종료: `{"stage":"<stage>","event":"stage-completed","source":"verified|final|gate|qa","summary":"..."}`
- git-on governed completion: `.codex/sh/pgg-stage-commit.sh`의 `stage-commit`

## 규칙

- stage 작업 시작 전에 `stage-started`가 먼저 남아야 한다.
- work-in-progress 산출물 정리는 `stage-progress`로 남긴다.
- verification 전에는 `stage-completed`를 남기지 않는다.
- 사용자 추가 요구가 있으면 해당 stage 작업 전에 `requirements-added`를 append한다.
- `stage-completed`는 stage별 완료 조건과 review/gate가 끝난 뒤에만 verified/final source로 남긴다.

## 구현 경계

- 대상 후보: `.codex/sh/*.sh`, `.codex/skills/pgg-*`, `packages/core/src/templates.ts`
- generated contract와 runtime helper contract가 달라지면 안 된다.

## Acceptance

- 새 topic과 후속 stage에서 dashboard가 `stage-started`/`stage-progress`를 읽어 `진행 중`을 계산할 수 있다.
- pgg update/init 후 생성되는 문서와 helper template에도 같은 event contract가 유지된다.
