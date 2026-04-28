---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "performance"
  status: "pass"
  skill: "pgg-performance"
  updated_at: "2026-04-28T15:10:00Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# pgg-performance Report

## 1. 성능 측정 필요성 판단

- Decision: required
- Trigger: 사용자가 workflow 진행 시간이 너무 오래 걸린다고 명시했고, pgg-plan이 `pgg-performance: required`로 workflow cycle time 측정을 요구했다.
- 호출 위치: pgg-code 이후.
- 결론: 성능 기준을 통과했으며 구현 수정은 필요하지 않다. 다음 flow는 `pgg-refactor`다.

## 2. 측정 대상

| 대상 | 이유 | Applicability |
|---|---|---|
| `node --test scripts/dashboard-history-model.test.mjs` | dashboard workflow status/duration model의 직접 회귀 테스트 | applicable |
| `pnpm test:dashboard` | dashboard test script wrapper 포함 실행 시간 | applicable |
| `pnpm build:dashboard` | dashboard build와 bundle 생성 시간 | applicable |
| `pnpm build` | typecheck/build verification | applicable |
| `pnpm build:readme` | generated docs stability verification | applicable |
| active working time 또는 LLM 응답 시간 | repository-local benchmark로 재현할 수 없음 | not_applicable |

## 3. 측정 지표와 기준

- dashboard model test: wall-clock median과 p95가 5초 이내여야 한다.
- dashboard test script: wall-clock median과 p95를 기록한다. 동일 기준 5초를 참고 기준으로 사용한다.
- dashboard build: Vite 내부 build time이 pgg-code baseline `1.35s` 대비 20% 초과 증가하지 않아야 한다.
- build/typecheck와 docs generation: exit code 0이어야 한다.

## 4. Baseline

- `node --test scripts/dashboard-history-model.test.mjs`: `1.621s`
- `pnpm test:dashboard`: `1.684s`
- `pnpm build:dashboard`: Vite internal build `1.35s`
- baseline source: `poggn/active/dashboard-workflow-timing-sync/pgg-code/verify.md`

## 5. 측정 방법

- 성능 대상 명령은 각각 3회 반복 실행했다.
- 기록값은 wrapper wall-clock seconds와 command output tail이다.
- `pnpm build:dashboard`는 wrapper overhead와 Vite internal build time을 분리해 해석했다.
- 외부 네트워크, DB, browser interaction은 사용하지 않았다.

## 6. Benchmark Results

| Command | Runs seconds | Median | P95 | Baseline | Result |
|---|---:|---:|---:|---:|---|
| `node --test scripts/dashboard-history-model.test.mjs` | `1.577`, `1.625`, `1.663` | `1.625s` | `1.663s` | `1.621s` | PASS |
| `pnpm test:dashboard` | `2.050`, `1.888`, `1.894` | `1.894s` | `2.050s` | `1.684s` | PASS |
| `pnpm build:dashboard` wrapper | `2.188`, `2.104`, `2.136` | `2.136s` | `2.188s` | not comparable | INFO |
| `pnpm build:dashboard` Vite internal | `1.08`, `1.02`, `1.02` | `1.02s` | `1.08s` | `1.35s` | PASS |

## 7. Verification Commands

| Command | Result | Notes |
|---|---|---|
| `node --test scripts/dashboard-history-model.test.mjs` x3 | PASS | 11/11 tests each run. |
| `pnpm test:dashboard` x3 | PASS | 11/11 tests each run. |
| `pnpm build:dashboard` x3 | PASS | Existing chunk-size warning only. |
| `pnpm build` | PASS | core, dashboard, CLI build completed; existing chunk-size warning only. |
| `pnpm build:readme` | PASS | Ran twice for docs generation stability. |

## 8. 결과 비교와 판정

- dashboard model test median `1.625s`와 p95 `1.663s`는 5초 기준을 통과했다.
- dashboard model test median은 baseline `1.621s`와 사실상 동일한 범위다.
- `pnpm test:dashboard` wrapper median `1.894s`는 5초 참고 기준을 통과했다.
- Vite internal dashboard build median `1.02s`는 baseline `1.35s`보다 낮다.
- wrapper build time `2.136s`는 pnpm startup overhead가 포함되어 Vite baseline과 직접 비교하지 않았다.
- 기능 구현으로 인한 성능 회귀는 확인되지 않았다.

## 9. Not Applicable 항목

- active working time: LLM interaction, human approval, git/network state, local machine load가 섞여 repository-local benchmark로 분리 측정할 수 없다.
- browser rendering FPS: 이번 변경은 timeline text formatting과 generated snapshot이며 runtime animation/render loop 변경이 아니다.
- memory/CPU profiling: 대량 데이터 처리나 long-running runtime path 변경이 아니므로 required 지표로 보지 않는다.

## 10. Review

### QA/테스트 엔지니어

- 측정 대상이 pgg-plan 성능 기준과 직접 연결된다.
- 3회 반복 측정으로 단일 noisy run만 근거로 결론 내리지 않았다.
- test/build 결과가 모두 PASS이므로 기능 회귀와 성능 회귀가 동시에 확인됐다.

### SRE/운영 엔지니어

- Vite bundle chunk-size warning은 기존 경고이며 이번 변경에서 새 dependency나 bundle-heavy import가 추가되지 않았다.
- dashboard duration formatter는 O(1) timestamp 계산이며 대량 반복 처리 위험이 낮다.
- wrapper overhead는 운영 성능 지표로 보지 않고 command startup cost로 분리한 해석이 타당하다.

## 11. 다음 Flow

- 성능 기준: PASS
- 성능 회귀: not_detected
- 구현 수정 필요: no
- 다음 flow: `pgg-refactor`
