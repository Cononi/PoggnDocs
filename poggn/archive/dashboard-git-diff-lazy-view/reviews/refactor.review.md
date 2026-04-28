---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "refactor"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-28T06:05:03Z"
---

# Refactor Review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | implementation index parser의 row shape를 `ImplementationIndexRow` 타입으로 분리하고 separator 정규식을 상수화해 lazy diff parsing 경계를 명확히 했다. | 없음 |
| 코드 리뷰어 | 96 | `rows.indexOf(row)` fallback을 순회 index로 바꿔 중복 row에서도 안정적인 id fallback을 사용한다. 동작 변경 범위는 parser 내부로 제한되어 회귀 위험이 낮다. | 없음 |

## Cleanup Evidence

- `packages/core/src/index.ts`의 inline implementation index row 타입을 이름 있는 타입으로 분리했다.
- markdown table separator 판별 정규식을 `IMPLEMENTATION_INDEX_SEPARATOR_PATTERN` 상수로 분리했다.
- row id fallback이 배열 검색 대신 순회 index를 사용하도록 정리했다.
- dist 산출물은 `pnpm --filter @pgg/core test`의 build 단계에서 갱신했다.

## Mandatory Criteria Check

- 중복 제거: pass, row shape 중복을 이름 있는 타입으로 정리했다.
- 단일 책임: pass, separator 판별과 row parsing 책임이 더 명확해졌다.
- 가독성: pass, parser 조건과 fallback id 생성이 명시적이다.
- 추상화: pass, implementation index row 계약이 타입으로 드러난다.
- 일관성: pass, 기존 lazy diff metadata 계약을 유지했다.
- 테스트에 좋은 코드: pass, core test와 history model regression이 통과했다.
- 예외 처리 필수: pass, 기존 path/ref guard를 변경하지 않았다.
- 작은 단위 처리: pass, parser 내부 cleanup에 한정했다.
- 의존성 관리: pass, 신규 의존성 없음.
- 확장성: pass, row 필드 추가 시 타입에서 확인 가능하다.
- 네이밍: pass, `ImplementationIndexRow`와 `IMPLEMENTATION_INDEX_SEPARATOR_PATTERN`이 역할을 드러낸다.

## Verification

- `pnpm --filter @pgg/core test`: pass, 61 tests
- `node scripts/dashboard-history-model.test.mjs`: pass, 3 tests

## Residual Risk

- 없음. 후속 optional audit에서 token/performance 측정을 이어간다.
