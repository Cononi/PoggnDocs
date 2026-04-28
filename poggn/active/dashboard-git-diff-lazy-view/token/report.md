---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "token"
  status: "done"
  skill: "pgg-token"
  updated_at: "2026-04-28T06:26:37Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Token Audit Report

## Decision

pass

## Scope

- 대상: pgg workflow 산출물, implementation index, dashboard snapshot의 diff 저장 방식
- 제외: LLM 실제 token 청구량 측정. 이번 topic은 local artifact와 generated snapshot 저장량 중심으로 audit한다.

## Measurements

| Item | Result | Evidence |
|---|---:|---|
| `implementation/diffs/*.diff` body artifacts | 0 files | `find poggn/active/dashboard-git-diff-lazy-view/implementation -maxdepth 3 -type f -printf '%p %s\n'` |
| `implementation/index.md` size | 9,058 bytes | `wc -c` |
| implementation metadata rows | 40 rows | index table parse |
| dashboard topic files | 53 files | `apps/dashboard/public/dashboard-data.json` parse |
| dashboard lazy diff entries | 39 entries | `apps/dashboard/public/dashboard-data.json` parse |
| stored lazy diff body bytes | 0 bytes | all lazy diff entries have `content: null` |
| eager stored diff entries for topic | 0 entries | no diff file body copied into snapshot |

## Ledger Coverage

- `state/token-usage.ndjson`는 이번 topic에서 생성되지 않았다.
- 이번 audit는 local artifact estimate이며 `llm` actual usage로 기록하지 않는다.
- dashboard summary는 `tokenSource: "none"`인 lazy diff entry를 token estimate에 포함하지 않는 regression test로 확인했다.

## Optimization Result

- `.diff` 본문을 topic 산출물과 dashboard snapshot에 중복 저장하지 않고, `implementation/index.md`의 Git metadata로 대체했다.
- 변경 파일별 diff는 dashboard 선택 시 Git에서 조회한다.
- lazy diff entry는 파일명, source path, commit range, diff command metadata만 보관하며 본문은 저장하지 않는다.

## Verification

| Command | Result |
|---|---|
| `pnpm --filter @pgg/core test` | pass, 61 tests |
| `node scripts/dashboard-history-model.test.mjs` | pass, 3 tests |

## Expert Notes

- 테크 리드: diff 본문을 snapshot에서 제거한 설계가 token 비용과 저장량을 모두 줄이는 핵심 경로다.
- 코드 리뷰어: `implementation/index.md`가 metadata 중심으로 유지되어 다음 flow handoff에서 전체 diff 본문을 읽을 필요가 없다.
