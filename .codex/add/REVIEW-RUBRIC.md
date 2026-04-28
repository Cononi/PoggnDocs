# REVIEW-RUBRIC

## 공통 기준

- 범위가 proposal/plan/spec와 일치하는가
- 테스트와 검증 계획이 충분한가
- `pgg-code`와 `pgg-refactor` 결과가 필수 구현 기준을 충족하는가
- 회귀 위험과 미해결 이슈가 기록되었는가
- 다음 단계로 넘길 수 있는 최소 상태가 정리되었는가

## 필수 형식

- 각 review 문서는 `Expert Notes` 섹션에서 전문가 이름, 점수, 핵심 판단, blocking issue를 분리한다.
- `proposal`, `plan`, `task`, `code`, `refactor` review는 `reviews/*.review.md` 패턴을 사용한다.
- QA는 `qa/report.md` 안에 테스트 계획, 실행 결과, 전문가 검토, 최종 판정을 함께 기록한다.
- `token/report.md`는 optional audit가 실제로 열렸을 때만 만들고, 측정값, 최적화 액션, 개선 결과를 함께 기록한다.
- token audit는 `state/token-usage.ndjson` 또는 동등 ledger의 coverage, `llm`/`local` source 분리, actual/estimated 표시, dashboard summary 사용 가능성을 확인한다.
- `performance/report.md`는 optional audit가 실제로 열렸을 때만 만들고, applicability, baseline, target, actual result 또는 제외 근거를 함께 기록한다.
- code review와 QA는 pgg 생성/수정 문서와 코드 주석이 `pgg lang`을 따르는지 확인한다.
- QA는 `Audit Applicability` 섹션을 기준으로 `required` audit만 blocking으로 판단한다.
- archive가 포함되는 QA는 `archive_type`, version 기록 여부, ledger 경로를 검증 근거에 남긴다.
- verification contract가 선언되지 않은 프로젝트는 framework 명령을 추론하지 않고 `manual verification required`를 QA 근거에 남긴다.
- `state/current.md`에는 review 원문을 반복하지 않고 score, blocking issue, next action만 남긴다.
