# S3. Generated Project Propagation

## 규칙

- core dist와 dashboard model/test를 source와 동기화한다.
- 이후 생성/업데이트 프로젝트의 dashboard snapshot도 diff artifact를 local token으로 분류한다.

## 수용 기준

- core build 산출물이 갱신되고 regression test가 통과한다.
