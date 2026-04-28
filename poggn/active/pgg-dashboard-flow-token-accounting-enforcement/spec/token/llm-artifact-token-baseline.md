# S1. LLM Artifact Token Baseline

## 규칙

- pgg topic file artifact의 content token estimate는 기본적으로 LLM token이다.
- LLM source record가 있으면 해당 artifact의 direct/fallback token과 file baseline이 중복 합산되지 않아야 한다.
- ledger가 없어도 flow artifact가 있으면 LLM token은 0이 아니다.

## 수용 기준

- proposal/plan/task/review/report/diff artifact는 Timeline과 Overview에서 LLM token 산정 근거가 된다.
