# AGENTS.md

## Codex 전용 작업 원칙

- 모든 작업은 `.codex/add/WOKR-FLOW.md`를 따른다.
- 모든 topic은 `poggn/active/<topic>` 안에서만 진행한다.
- 구현 전에는 반드시 `proposal.md`, `plan.md`, `task.md`를 확인한다.
- 구현 단계에서는 `spec/*/*.md` 기준을 위반하지 않는다.
- 다음 단계로 넘길 때는 전체 문맥이 아니라 `state/current.md`만 우선 전달한다.
- 파일 생성/수정/삭제는 `implementation/index.md`와 `Changed Files`에 CRUD, path, taskRef, diffSource, gitRef 또는 commitRange, diffCommand, status로 기록하며 `implementation/diffs/*.diff` 본문 파일은 legacy/opt-in artifact로만 유지한다.
- 검증이 통과된 topic은 `poggn/archive/<topic>`으로 이동한다.
- archive 처리된 topic은 다시 active로 되돌리지 않는다.

## Skill Flow

1. `pgg-add`
2. `pgg-plan`
3. `pgg-code`
4. `pgg-qa`

## 금지

- `proposal.md`, `plan.md`, `task.md` 없이 구현하지 않는다.
- auto mode가 `off`일 때 불확실한 요구사항을 임의 확정하지 않는다.
- 전체 파일 내용을 불필요하게 다음 단계에 전달하지 않는다.
- diff로 충분한 경우 전체 파일을 복사하지 않는다.
