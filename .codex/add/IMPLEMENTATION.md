# IMPLEMENTATION

- `pgg-code`와 `pgg-refactor`는 승인된 proposal, plan, task, spec 기준과 필수 구현 기준에 따라 구현한다.
- `pgg-token`과 `pgg-performance`는 optional audit로 실제로 열린 경우에만 각각 `token/report.md`, `pgg-performance/report.md`에 결과를 남긴다.
- audit applicability가 `required`인 경우에만 후속 gate와 QA에서 해당 report를 필수로 본다.
- 파일 생성/수정/삭제 또는 flow 작업 token usage를 기록할 때는 `state/token-usage.ndjson`에 append-only record로 남기고 `source: llm | local`, actual/estimated 여부, artifact path를 구분한다.
- 모든 변경은 `CREATE`, `UPDATE`, `DELETE`로 분류한다.
- `implementation/index.md`와 `Changed Files`에는 변경 파일의 CRUD, path, taskRef, diffSource, gitRef 또는 commitRange, diffCommand, status를 유지한다.
- `implementation/diffs/*.diff` 본문 파일은 legacy/opt-in artifact로만 유지하고 기본 산출물로 생성하지 않는다.
- React Flow에는 diff 본문 대신 Git diff 조회 metadata나 legacy `diffRef`만 연결한다.
