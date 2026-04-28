---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-28T05:52:40Z"
---

# code.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | workflow 계약, helper, core snapshot, live Git diff API, dashboard UI가 같은 lazy diff metadata 모델을 공유하도록 구현했다. 실제 `.diff` 본문 파일 없이도 `implementation/index.md` 기반 virtual diff entry가 생성된다. | 없음 |
| 테크 리드 | 96 | Git 명령은 임의 `diffCommand` 실행 없이 검증된 source metadata만 사용한다. legacy `.diff` file fallback을 유지하면서 신규 snapshot은 `content: null`로 token surface를 줄인다. | 없음 |

## Mandatory Criteria Check

- 중복 제거: pass, Git으로 재현 가능한 diff 본문 중복 저장을 기본 경로에서 제거했다.
- 단일 책임: pass, index 생성, snapshot metadata, live 조회, UI fetch가 각각 분리되어 있다.
- 가독성: pass, lazy diff source type과 table schema가 명시적이다.
- 추상화: pass, `LazyDiffSource`와 parser/helper가 공통 metadata를 사용한다.
- 일관성: pass, 현재 workspace 문서와 generated template이 같은 계약을 설명한다.
- 테스트에 좋은 코드: pass, lazy diff snapshot과 history model regression을 추가했다.
- 예외 처리 필수: pass, path traversal, invalid Git ref, archive working-tree 조회를 거부한다.
- 작은 단위 처리: pass, T1-T5 task 단위 commit으로 분리했다.
- 의존성 관리: pass, 신규 runtime dependency 없이 기존 Node/Git/Vite 경로를 사용한다.
- 확장성: pass, commit/range/working-tree/legacy source를 분리해 후속 source 추가가 가능하다.
- 네이밍: pass, `lazyDiff`, `diffSource`, `targetPath`가 역할을 드러낸다.

## Verification

- `bash -n .codex/sh/pgg-diff-index.sh`: pass
- `./.codex/sh/pgg-diff-index.sh dashboard-git-diff-lazy-view`: pass, 39 items
- `pnpm --filter @pgg/dashboard build`: pass
- `pnpm --filter @pgg/core test`: pass, 61 tests
- `node scripts/dashboard-history-model.test.mjs`: pass, 3 tests
- `pnpm test`: pass, core 61 tests + dashboard history 3 tests
- `node packages/cli/dist/index.js dashboard --snapshot-only`: pass

## Residual Risk

- static dashboard snapshot 환경은 live Git diff 조회가 불가능하므로 unavailable 상태에 의존한다.
- active topic의 `working-tree` diff는 commit 전 임시 source이므로 QA/archive 전 durable commit/range metadata로 고정해야 한다.
