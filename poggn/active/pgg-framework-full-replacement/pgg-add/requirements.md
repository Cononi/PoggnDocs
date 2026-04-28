---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "add"
  status: "draft"
  skill: "pgg-add"
  updated_at: "2026-04-28T12:27:32Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "4.0.0"
---

# Requirements: PGG Framework Full Replacement

## 사용자 입력

- 목표: 전면 교체
- 교체 대상: 앞서 예시로 든 전체 범위
- 최소 성공 동작: 사용자가 의미를 모르겠다고 답했으므로 pgg-add가 관찰 가능한 완료 기준으로 해석한다.
- 유지해야 하는 public API/CLI/file path: 없음
- 반드시 막아야 하는 실패 결과: 없음

## 기능 목적

기존 PGG workflow, generated docs 구조, CLI entry, dashboard workflow model, git workflow를 신규 TypeScript Skill Framework source of truth 기준으로 전면 교체한다.

## 포함 범위

- 신규 Skill Framework Core
- TypeScript Skill 정의와 registry
- generated Markdown generator
- generated Skill 문서
- public API export와 CLI adapter routing
- POGGN workspace artifact 계약
- pgg git mode와 branch lifecycle
- versioning과 commit message convention
- completion message contract
- token accounting
- next flow routing
- dashboard workflow model과 snapshot surface
- legacy adapter 또는 deprecated compatibility layer 분류
- tests와 generated docs 안정성 검증

## 제외 범위

- pgg-add 단계에서 구현 코드, 테스트 코드, generator 코드, dashboard 코드 수정
- 사용자가 명시하지 않은 외부 repository migration
- QA PASS 전 archive, release branch 전환, working branch 제거, push

## 관찰 가능한 최소 성공 동작

이 topic에서 "최소 성공 동작"은 다음을 뜻한다.

1. 신규 TypeScript Skill Framework가 source of truth로 동작한다.
2. 모든 PGG flow 문서가 generator로 재생성되고 한국어 기본 문서를 유지한다.
3. CLI/public API가 신규 core를 사용한다.
4. dashboard가 신규 workflow/status/token/git/version 정보를 읽을 수 있다.
5. tests/build/docs generation이 통과한다.
6. pgg-qa가 PASS일 때만 archive/release/push lifecycle로 이동한다.

## 가정

- "예시 전체"는 legacy workflow, generated docs, CLI entry, dashboard workflow model, git workflow 전체를 포함한다.
- 기존 public API/CLI/file path 보존 요구가 없으므로 breaking change를 허용한다.
- 최신 release 기준은 `poggn/version-history.ndjson`의 `3.2.0`이다.
- `package.json` version `0.1.0`은 workspace package version으로 관찰되지만 이 topic의 release versionSource는 기존 POGGN release ledger를 우선한다.

## 리스크

- 전면 교체 범위가 넓어 pgg-plan에서 task를 2~5분 단위로 강하게 분해하지 않으면 pgg-code가 불안정해진다.
- legacy adapter 제거 시 dashboard snapshot, CLI update, generated docs, tests가 동시에 깨질 수 있다.
- generated Markdown을 직접 수정하면 source-of-truth 계약이 깨진다.
- package.json version과 POGGN release ledger가 다르므로 versionSource를 혼동할 위험이 있다.

## pgg-performance 후보

- 현재는 `not_required`.
- 성능 기준, benchmark, 응답 시간, 처리량, 메모리 요구가 추가되면 `pgg-plan`에서 `pgg-performance` 필요성을 다시 판단한다.
