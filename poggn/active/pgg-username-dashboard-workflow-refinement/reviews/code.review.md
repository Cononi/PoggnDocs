---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-27T13:35:33Z"
---

# Code Review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 94 | 전역 user config를 core API로 분리했고 CLI init gate와 dashboard live API가 같은 저장소를 사용한다. token estimate와 commit evidence projection은 deterministic fallback으로 동작하며 fake commit title을 만들지 않는다. | 없음 |
| 테크 리드 | 94 | 구현은 기존 project manifest와 global user scope를 분리했고 dashboard model/API/UI 변경도 같은 contract로 연결했다. project add Stepper는 MVP 수준으로 init/local/defer path를 제공하지만 FAST/SETUP remote 세부 입력은 refactor/후속 polish에서 더 확장할 여지가 있다. | 없음 |

## 결정

- implementation status: `reviewed`
- overall score: `94`
- next: `pgg-refactor`
- blocking issue: `none`
- required audits: `pgg-token`, `pgg-performance`

## 검증

- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/cli build`: pass
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- `pnpm test:core`: pass, 53 tests
- `pnpm test:dashboard`: pass, 2 tests
- `pnpm build`: pass, Vite chunk-size warning 유지
- manual CLI check: username missing blocks `pgg init`; `pgg config username 홍길동` 이후 init succeeds
- additional `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- additional `pnpm test:dashboard`: pass, 2 tests

## 잔여 리스크

- timeline은 `add-img/timeline.png`의 세로 축, 날짜 컬럼, 단계 카드, 생성 파일/Git Commit split 구조에 맞추고, flow rail과 완료 check 색상을 overview completed 색상으로 정렬했다. 다만 실제 browser screenshot/manual visual evidence는 QA/refactor 이후 최종 판정한다.
- token 표시는 LLM 실사용과 Local 추정치를 분리했다. 현재 LLM 실사용 evidence가 없는 topic은 `기록 없음`으로 표시하고 local estimate는 file content 기반 deterministic estimate로 표시한다. spec/QA 문서는 신규/기존 project snapshot 모두에서 두 값을 분리 측정하도록 갱신했다.
- dashboard project add Stepper는 local/defer path 중심으로 구현되어 remote FAST/SETUP의 세부 credential 입력 UX는 후속 개선 여지가 있다.
