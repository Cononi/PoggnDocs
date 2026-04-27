---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-27T14:28:42Z"
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
- follow-up `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up `pnpm test:dashboard`: pass, 2 tests
- follow-up timeline controls `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up timeline controls `pnpm test:dashboard`: pass, 2 tests
- follow-up flow file tree `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up flow file tree `pnpm test:dashboard`: pass, 2 tests
- follow-up file tree tokens `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up file tree tokens `pnpm test:dashboard`: pass, 2 tests
- follow-up file modal `pnpm --filter @pgg/core build`: pass
- follow-up file modal `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up file modal `pnpm test:dashboard`: pass, 2 tests
- follow-up order/time `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up order/time `pnpm test:dashboard`: pass, 2 tests
- follow-up reverse/tone `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up reverse/tone `pnpm test:dashboard`: pass, 2 tests
- follow-up blue rail/check and commit modal `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up blue rail/check and commit modal `pnpm test:dashboard`: pass, 2 tests
- follow-up vertical Stepper overview-completed connector `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning 유지
- follow-up vertical Stepper overview-completed connector `pnpm test:dashboard`: pass, 2 tests
- `./.codex/sh/pgg-gate.sh pgg-refactor pgg-username-dashboard-workflow-refinement`: pass

## 잔여 리스크

- timeline은 `add-img/timeline.png`의 세로 축, 날짜 컬럼, 단계 카드, 생성 파일/Git Commit split 구조에 맞추고, flow rail과 완료 check 색상을 overview completed 색상으로 정렬했다. completed check는 overview node와 같은 success soft 배경/테두리/그림자 스타일을 사용하고, rail은 check 원 아래 edge부터 이어지도록 조정했다. row는 최신 flow가 위로 오도록 내림차순 정렬했다. 다만 실제 browser screenshot/manual visual evidence는 QA/refactor 이후 최종 판정한다.
- timeline header의 filter/show more/collapse action은 제거했고, 우측 file tree folder row는 클릭으로 접고 펼칠 수 있다.
- timeline card의 파일 보기 action은 우측 file tree를 선택 flow 파일 목록으로 전환한다. 초기 우측 file tree는 topic 전체 파일을 보여주고, flow/search filter가 걸리면 검색창 옆 reset button으로 전체 파일 상태를 복구한다.
- timeline card 내부 생성 파일 목록은 최대 3개로 제한했고, 우측 file tree의 file row 클릭 시 file content modal에서 LLM/Local token과 file 내용을 볼 수 있다. 우측 file tree의 file row에서는 LLM/Local token chip을 제거했다. timeline rail은 row별 선분이 아니라 단일 수직 rail로 이어지며, row 순서와 시간은 실제 workflow 순서와 flow completion evidence를 따른다.
- timeline row는 실제 workflow 역순으로 표시하고, flow rail/check는 MUI vertical Stepper의 custom connector/step icon 구조로 전환했다. completed 상태는 overview completed node와 같은 success soft fill, success border, success shadow를 공유하고, 마지막/bottom flow에는 아래로 내려가는 rail을 만들지 않는다. 생성 파일 row의 file-level LLM/Local chip은 제거했으며 flow header의 total LLM/Local token은 유지했다.
- commit panel은 flow card에서 최대 3개 commit만 보여주고, 4개 이상이면 `모든 커밋 보기` modal로 전체 commit list를 확인한다.
- token 표시는 LLM 실사용과 Local 추정치를 분리했다. 현재 LLM 실사용 evidence가 없는 topic은 `기록 없음`으로 표시하고 local estimate는 file content 기반 deterministic estimate로 표시한다. spec/QA 문서는 신규/기존 project snapshot 모두에서 두 값을 분리 측정하도록 갱신했다.
- dashboard project add Stepper는 local/defer path 중심으로 구현되어 remote FAST/SETUP의 세부 credential 입력 UX는 후속 개선 여지가 있다.
