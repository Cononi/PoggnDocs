---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T06:08:10Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.5.0"
  short_name: "project-onboarding"
  working_branch: "ai/feat/2.5.0-project-onboarding"
  release_branch: "release/2.5.0-project-onboarding"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "project-scoped settings와 git onboarding 구현을 spec 기준 task로 분해한다."
  next: "pgg-code"
---

# Task

## 1. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S2` | project manifest와 dashboard snapshot model에 git connection/setup state를 추가하고 git 기본값을 유지한다. | proposal, S2 | 기존 manifest가 normalize되고 provider/owner/repo/auth/setupStatus/defaultBranch/remote summary가 안전하게 표현되며 `origin`/`ai`/`release` 기본값이 유지됨 |
| T2 | `S1` | CLI localized help와 init language/checklist interactive flow를 구현한다. | T1, S1 | help가 ko/en 설명을 출력하고 init checklist 선택 또는 flag path가 manifest에 반영됨 |
| T3 | `S3` | FAST PATH/SETUP PATH git onboarding engine과 remote URL parser/provider adapter 경계를 구현한다. | T1, S3 | 기존 origin 파싱, no-origin setup, auth method 선택, owner/repo/visibility/create/default branch flow가 service contract로 동작함 |
| T4 | `S3` | git setup 중간 취소를 deferred completion으로 처리하고 init/`pgg git` 재개 경로를 연결한다. | T3 | 취소해도 project 생성은 완료되고 manifest/snapshot에 deferred 상태와 재개 안내가 남음 |
| T5 | `S4` | dashboard 전역 settings에서 lang/auto/teams/git을 제거하고 project detail settings sidebar/menu를 추가한다. | T1, S4 | 전역 settings는 dashboard-level 항목만 남고 project detail에서 settings 메뉴로 진입 가능함 |
| T6 | `S4` | project settings `기본`/`git` MUI Tabs와 git setup Stepper modal을 구현한다. | T5, T3, T4 | 기본 탭은 language/auto/teams, git 탭은 toggle/summary/disabled/deferred/setup button/branch prefix를 제공함 |
| T7 | `S5` | CLI/core/dashboard regression tests와 manual verification 기록을 추가하고 실행한다. | T1-T6, S5 | build/test가 통과하고 실제 provider push는 manual verification required로 QA에 남길 수 있음 |

## 2. 구현 메모

- T1은 모든 후속 task의 타입/상태 기반이므로 가장 먼저 처리한다.
- T3/T4는 CLI와 dashboard가 공유하는 core service로 두어 flow drift를 막는다.
- `취소하고 나중에 등록`은 error path가 아니라 success-with-deferred-status path로 모델링한다.
- dashboard live mode가 아니면 mutation button은 disabled/read-only로 유지한다.
- provider token은 절대 manifest, snapshot, topic 산출물에 저장하지 않는다.

## 3. 검증 체크리스트

- `pgg` help가 한국어/영어 기능 설명을 출력한다.
- `pgg init` flag path와 interactive checklist path가 같은 manifest 결과를 만든다.
- GitHub/GitLab HTTPS/SSH remote URL parser가 provider/owner/repo를 정확히 추출한다.
- git 설정 확장 후에도 `defaultRemote=origin`, `workingBranchPrefix=ai`, `releaseBranchPrefix=release` 기본값이 유지된다.
- git setup 취소 후 `.pgg/project.json`은 생성되고 git setup status는 deferred로 남는다.
- dashboard 전역 settings에는 lang/auto/teams/git controls가 없다.
- project settings 기본/git tab과 Stepper modal이 locale 누락 없이 렌더된다.
- `pnpm build`와 `pnpm test` 또는 동등 current-project verification이 통과한다.

## 4. Audit Applicability

- `pgg-token`: `not_required` | workflow token/handoff 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 audit가 필요한 변경이 아니다
