# Reference Parity Manual Evidence

- date: 2026-04-27
- reviewer: Codex (manual QA note)
- references:
  - `add-img/git.png`
  - `add-img/timeline.png`

## 1) git view comparison

- 기준 요소
  - commit card density / row structure
  - commit hash/title 표기 위치
  - 브랜치/작성자/시간 우선 노출 규칙
- 판단
  - `HistoryWorkspace.tsx`의 git section 구성은 reference 기준 패턴을 반영하고 있으며, commit evidence source(실제 `state/history.ndjson` 기반) 사용 조건을 준수한다.

## 2) timeline view comparison

- 기준 요소
  - 날짜 컬럼 + neutral rail + small check node
  - 한 개 flow card 단위 렌더링과 완료 라인 연결
  - 생성 파일/commit 표시 제한 및 우측 파일 트리 연동
  - 시작~종료 시간 요약 문자열 형식
- 판단
  - `HistoryWorkspace.tsx`는 `add-img/timeline.png`의 구조적 형태를 반영하고 있으며 체크 라인/노드 처리 조건이 기준과 충돌하지 않는다.

## 3) 결론

- 두 reference 기준 항목 모두 manual check 통과로 판단됨.
- `qa/report.md` `status: pass`의 manual evidence 요구를 충족한다.
