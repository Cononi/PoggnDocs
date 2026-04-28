---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-28T00:39:11Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "major"
  target_version: "3.0.0"
  short_name: "token-commit-contract"
  working_branch: "ai/feat/3.0.0-token-commit-contract"
  release_branch: "release/3.0.0-token-commit-contract"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "workflow process 모바일 표시, token 측정 계약, task 행 단위 commit, pgg lang 문서화 규칙을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg workflow token commit contract

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `major`
- target_version: `3.0.0`
- short_name: `token-commit-contract`
- working_branch: `ai/feat/3.0.0-token-commit-contract`
- release_branch: `release/3.0.0-token-commit-contract`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- workflow에서 workflow process가 모바일에서 세로로 가는게 아니라 형태 유지를 하고 사이즈가 동적으로 작아지게 해야 합니다.
- workflow에서 `(LLM 실사용 : 기록 없음 / Local : 0)` 이 아니라 clip으로 llm 따로 local 따로 입니다.
- pgg에서 각 workflow마다 계산되는 토큰은 llm은 codex에서 response로 주는 데이터를 기반으로 실제 사용되는 토큰 수를 측정해야 요금 계산할 수 있습니다. local은 codex가 아닌 사용자 시스템에서 사용되는 shell 실행이나 특정 cli를 실행하며, codex가 response로 주지 않은 모든 기능에서 만들어진 토큰 입니다.
- 토큰 측정은 정확해야 하며, 중요한 요금 계산 지표로 쓰일 수 있습니다.
- pgg-code에서 task.md의 Task 목록 항목에서 ID T1...N까지, 즉 목록의 테스크 행 1개당 작업이 완료되면 commit 처리해야 합니다.
- pgg-code에서 테스크당 commit 처리할 때 제목은 작업 내용으로 하고 body에는 최상단에 dependencies, 그 아래에는 완료 조건, 푸터에는 완료 조건에 명시된 각 테스크 내용이 기입되야 합니다.
- pgg-*로 이루어진 모든 flow는 pgg lang에 설정된 언어로 문서가 작성되야 합니다. 코드의 주석마저도 마찬가지 입니다.

## 4. 문제 정의

현재 workflow process UI가 모바일에서 세로 재배치되면 사용자는 desktop과 같은 workflow 구조를 추적하기 어렵다. 사용자는 flow 형태를 유지한 채 가용 폭에 맞춰 동적으로 축소되는 표시를 원한다.

token 표시는 `LLM 실사용`과 `Local`이 하나의 문장처럼 묶여 있고, 값이 없을 때 `기록 없음` 또는 `0`으로 보이는 방식이라 요금 계산 지표로 사용하기 어렵다. LLM token은 Codex 응답 usage metadata에서 나온 실제 사용량이어야 하며, Local token은 Codex 응답이 아닌 shell/CLI/local parser/helper 등 사용자 시스템 실행에서 만들어진 비용성 token으로 별도 clip에 표시되어야 한다.

`pgg-code`의 task commit 계약도 더 정밀해야 한다. `task.md`의 Task 목록에서 `T1...N` 각 행은 독립 완료 단위이며, 행 하나가 끝날 때마다 commit이 만들어져야 한다. commit message는 작업 내용 제목, dependencies 우선 body, 완료 조건 body, 완료 조건에 명시된 task 내용 footer로 구성되어야 한다.

마지막으로 pgg flow 산출물 언어는 `pgg lang`이 단일 source of truth여야 한다. 모든 pgg-* 문서뿐 아니라 pgg가 새로 생성하거나 수정하는 코드 주석도 같은 언어를 따라야 한다.

## 5. 범위

- dashboard workflow process 모바일 표시가 세로 stack으로 바뀌지 않고 원래 graph/process 형태를 유지하며 container 폭에 맞춰 scale down 된다.
- workflow process scale은 text overlap, edge/node clipping, 터치 접근성, desktop layout regression을 함께 고려한다.
- dashboard token 표시를 LLM clip과 Local clip으로 분리한다.
- LLM token은 Codex 응답 usage metadata에서 얻은 실제 token 값만 `actual`로 기록한다.
- Codex usage metadata가 없는 LLM record는 요금 계산용 actual 값으로 합산하지 않고, `unavailable` 또는 이에 준하는 상태로 표시한다.
- Local token은 shell 실행, 특정 CLI 실행, local parser/generator/helper, Codex 응답이 아닌 local 기능에서 발생한 token 또는 token-equivalent processing 값을 별도 source로 기록한다.
- token ledger와 dashboard summary는 `llm`과 `local`을 절대 합쳐 한 문구로 표현하지 않고 source별 clip과 합계를 제공한다.
- `pgg-code`는 `task.md`의 Task 목록에서 `Task ID`가 `T1...N`인 각 행 완료 시점마다 task-scoped commit을 처리한다.
- task commit title은 해당 task의 작업 내용이어야 한다.
- task commit body 최상단에는 dependencies를 쓰고, 그 아래에 완료 조건을 쓴다.
- task commit footer에는 완료 조건에 명시된 각 task 내용을 기입한다.
- 모든 pgg-* flow 문서와 pgg가 생성/수정하는 코드 주석은 `.pgg/project.json`의 `language` 또는 pgg lang 설정을 따른다.
- `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, core templates/update path, dashboard model/UI/test에 새 계약을 반영해 후속 `pgg init`/`pgg update` 프로젝트에도 전파한다.

## 6. 제외 범위

- 외부 billing API와 직접 결제 금액을 정산하는 기능.
- provider별 token 단가표 관리.
- 사용자가 직접 작성한 일반 애플리케이션 코드 주석을 일괄 번역하는 작업.
- workflow process 자체의 단계 의미나 core workflow 순서 변경.
- archive된 topic을 active로 되돌리는 작업.

## 7. 제약 사항

- token 측정은 요금 계산 지표로 쓰일 수 있으므로 LLM actual 값과 local estimated/token-equivalent 값을 같은 의미로 섞지 않는다.
- LLM actual token은 Codex response usage metadata 같은 provider/codex 응답 기반 데이터가 있을 때만 actual로 인정한다.
- Local token은 Codex가 response로 반환하지 않은 shell/CLI/local 생성 산출물에서 비롯된 값을 의미하며, 추정치인 경우 추정 여부를 명시한다.
- `pgg-code` task commit은 `task.md` 표의 행 단위를 기준으로 하며, 여러 task를 한 commit으로 묶지 않는다.
- commit message 구조는 pgg lang을 따르되 `dependencies` 같은 필드명은 spec에서 canonical label을 확정한다.
- pgg lang이 `ko`인 현재 프로젝트에서는 문서와 pgg 생성 주석을 한국어로 작성한다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Mobile workflow process | process 형태를 유지하고 viewport/container에 맞춰 scale down | resolved |
| Token display | LLM clip과 Local clip을 분리 표시 | resolved |
| LLM token measurement | Codex response usage metadata 기반 actual 값만 요금용으로 인정 | resolved |
| Local token measurement | shell/CLI/local helper 등 Codex 응답 외 시스템 실행 token을 별도 source로 기록 | resolved |
| Token accuracy | actual/unavailable/estimated를 분리해 부정확한 합산을 금지 | resolved |
| pgg-code commit cadence | `task.md` Task 목록의 `T1...N` 행 1개 완료마다 commit | resolved |
| Task commit message | 제목=작업 내용, body=dependencies 후 완료 조건, footer=완료 조건에 명시된 task 내용 | resolved |
| Language contract | 모든 pgg-* 문서와 pgg 생성/수정 코드 주석은 pgg lang 기준 | resolved |

## 9. 성공 기준

- 모바일 viewport에서 workflow process가 세로 stack으로 재배치되지 않고 기존 process 형태를 유지한 채 동적으로 축소된다.
- desktop workflow process 표시가 기존 사용성을 잃지 않는다.
- token UI가 LLM과 Local을 별도 clip으로 표시하며 `LLM 실사용 : 기록 없음 / Local : 0` 같은 결합 문구를 쓰지 않는다.
- LLM actual token은 Codex response usage metadata 기반 값만 합산한다.
- usage metadata가 없는 LLM token은 요금 계산 actual 값으로 표시되지 않는다.
- Local token은 shell/CLI/local helper 등 Codex 외 실행에서 발생한 값으로 별도 기록된다.
- token ledger schema가 source, measurement, actual/estimated/unavailable, stage, task, artifact ref를 구분한다.
- `pgg-code`에서 Task 목록의 `T1...N` 각 행 완료마다 task-scoped commit이 생성되거나, 생성 불가 사유가 stage evidence에 남는다.
- task commit message가 작업 내용 제목, dependencies body, 완료 조건 body, 완료 조건 기반 footer 구조를 만족한다.
- pgg lang이 `ko`이면 pgg-* 산출 문서와 pgg 생성/수정 코드 주석이 한국어로 작성된다.
- `pgg init` 또는 `pgg update` 후 생성되는 프로젝트에도 동일한 workflow/token/commit/language 계약이 적용된다.

## 10. Audit Applicability

- `pgg-token`: `required` | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- `pgg-performance`: `not_required` | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 11. Git Publish Message

- title: feat: 3.0.0.token commit contract
- why: workflow process는 모바일에서도 같은 형태를 유지해야 하고, token 비용 지표는 LLM actual과 Local source를 분리해야 하며, pgg-code task 행 단위 commit과 pgg lang 문서/주석 계약이 workflow 신뢰성을 결정한다.
- footer: Refs: pgg-workflow-token-commit-contract

## 12. 전문가 평가 요약

- 프로덕트 매니저: 이번 요구는 dashboard 표시와 pgg workflow governance를 동시에 바꾸는 major feature다. 특히 token actual 정의와 task 행 단위 commit은 비용/감사 지표의 핵심 계약이므로 명시적 spec 분해가 필요하다.
- UX/UI 전문가: 모바일 workflow process는 사용자가 구조를 비교하는 표면이므로 형태 유지와 scale down이 우선이다. LLM/Local token은 별도 clip으로 나뉘어야 사용자가 비용성 지표와 local 처리 지표를 혼동하지 않는다.

## 13. 다음 단계

`pgg-plan`에서 mobile workflow process scaling, token measurement ledger, dashboard token clip UI, task-row commit governance, pgg lang documentation/comment contract, init/update propagation을 별도 spec으로 분리한다.
