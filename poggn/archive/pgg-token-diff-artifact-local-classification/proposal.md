---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-28T03:06:19Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.4"
  short_name: "token-classification"
  working_branch: "ai/fix/3.0.4-token-classification"
  release_branch: "release/3.0.4-token-classification"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "git diff 산출물을 LLM token에서 제외하고 local token으로 분류한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-token-diff-artifact-local-classification

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `3.0.4`
- short_name: `token-classification`
- working_branch: `ai/fix/3.0.4-token-classification`
- release_branch: `release/3.0.4-token-classification`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- git diff 파일은 llm이 만들어준 코드가 아닙니다.
- 변경된 사항을 보여준거지 실제 코드를 받아서 적은 토큰이 llm token 입니다.

## 4. 문제 정의

현재 flow artifact baseline을 LLM token으로 계산하면서 `implementation/diffs/*.diff` 같은 git diff 산출물까지 LLM token에 포함될 수 있다. 이는 사용자의 token 정의와 맞지 않는다. diff 파일은 변경 내용을 보여 주는 local command 산출물이며, LLM이 생성해서 실제 파일에 적은 코드나 문서 자체가 아니다.

LLM token은 LLM과 소통해 받아 실제 코드/문서 파일에 반영한 내용의 token이어야 한다. local token은 `git diff`, shell, build/test, state-pack처럼 local 실행으로 만들어진 출력의 token이다.

## 5. 범위

- `implementation/diffs/*.diff`와 `.diff` artifact를 LLM artifact baseline에서 제외한다.
- diff artifact token estimate는 local token baseline으로 분류한다.
- Timeline flow row와 Overview topic total 모두 같은 분류를 사용한다.
- LLM record가 명시적으로 `.diff` artifact를 가리켜도 기본적으로 local artifact로 취급한다.
- 이후 생성 프로젝트도 같은 core/dashboard snapshot semantics를 사용하도록 dist를 동기화한다.

## 6. 제외 범위

- diff 내부에서 실제 코드 hunk만 추출해 LLM token으로 재분류하는 정밀 parser.
- 외부 billing API 연동.
- prompt/response 전문 저장.

## 7. 제약 사항

- LLM/local token은 서로 다른 영역으로 유지한다.
- diff 파일은 local output이며 LLM 산출물 token에 섞지 않는다.
- 실제 작성된 코드/문서 파일은 기존 LLM artifact baseline 규칙을 유지한다.

## 8. 성공 기준

- `implementation/diffs/*.diff` file estimate는 LLM token에 합산되지 않는다.
- diff artifact estimate는 local token에 합산된다.
- Overview와 Timeline이 같은 diff classification을 사용한다.
- regression test가 diff artifact local classification을 검증한다.

## 9. Audit Applicability

- `pgg-token`: `required` | token source classification semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | file classification 분기 추가이며 별도 성능 민감 path는 없다.

## 10. Git Publish Message

- title: fix: 3.0.4.diff token 분류
- why: git diff 파일은 LLM이 생성해 실제로 적은 코드가 아니라 local command 출력이므로 LLM token에서 제외하고 local token으로 계산해야 한다.
- footer: Refs: pgg-token-diff-artifact-local-classification

## 11. 전문가 평가 요약

- 프로덕트 매니저: 사용자의 정의상 diff는 코드 산출물이 아니라 증거/표시 산출물이므로 local token으로 분류해야 지표 신뢰가 유지된다.
- UX/UI 전문가: Overview와 Timeline에서 LLM token이 실제 작성물, local token이 실행 출력이라는 구분을 일관되게 보여야 한다.
