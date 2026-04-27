---
name: "pgg-qa"
description: "구현 결과를 검증하고 QA 산출물을 남긴 뒤 archive 여부를 결정한다."
---

# Skill: pgg-qa

## Purpose

`qa/report.md`에 테스트 계획, 결과, 전문가 평가, audit applicability 판단, 최종 판정을 함께 기록하고 통과 시 archive한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `{"stage":"qa","event":"stage-started","source":"pgg-qa"}`를 남긴다.
- 테스트 준비, evidence 정리, 검증 중 상태는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 QA 작업 전에 `requirements-added`를 남긴다.
- QA report pass, required audit 확인, archive/release outcome 처리가 끝난 뒤에만 final completion evidence를 남긴다.
- QA fail, release blocked, publish blocked는 Done completed가 아니라 실패/차단 evidence로 남긴다.

## Expert Roster

- QA/테스트 엔지니어: 테스트 설계와 실행 증거
- SRE / 운영 엔지니어: 런타임과 운영 위험 검토

## Rules

- 실패한 topic은 archive하지 않는다
- 현재 프로젝트 내부 QA 기록과 archive bookkeeping은 자동 처리한다
- 현재 프로젝트 밖 경로나 시스템을 건드리는 작업은 자동 처리하지 않는다
- 테스트 근거와 전문가 attribution이 있는 review note를 `qa/report.md`에 남긴다
- 실패 시 필요한 최소 이전 단계로만 회귀한다
- pass면 `.codex/sh/pgg-archive.sh <topic|topic_dir>`를 실행하고 archive version을 기록하며, `pgg git=on`이면 `release/<target-version>-<short-name>` publish와 ai branch cleanup 기록까지 이어간다
- `pgg git=on`이면 QA 산출물 뒤 변경이 남을 때 archive helper가 publish 전에 `qa completion` commit을 먼저 남기고, publish commit source는 `qa/report.md` 또는 `state/current.md`의 `## Git Publish Message`를 사용한다
- `Audit Applicability`를 읽고 `required` audit만 blocking report로 판단한다
- 대상 프로젝트 검증은 선언된 current-project verification contract가 있을 때만 실행하고, 없으면 `manual verification required`를 기록한다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.
