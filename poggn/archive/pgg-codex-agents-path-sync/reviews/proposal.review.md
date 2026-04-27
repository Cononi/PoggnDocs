---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "review"
  status: "reviewed"
  score: 91
  updated_at: "2026-04-26T15:11:15Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 92 | 사용자의 질문은 단순 파일 이동이 아니라 `pgg init`과 `pgg update`가 같은 Codex 설정 계약을 지키는지 확인하는 요구다. scope를 current-project의 generated template, managed manifest, docs, state-pack, tests로 잡는 것이 적절하다. | 없음 |
| UX/UI 전문가 | 90 | dashboard와 handoff에서 보이는 routing reference가 루트 `agents/`와 `.codex/agents/`로 갈라지면 사용자에게 설정 위치가 불명확해진다. 표시 텍스트와 생성 경로를 함께 맞추는 기준이 필요하다. | 없음 |

## Decision

pass

## Notes

- proposal은 `fix`/`patch`가 적절하다. 기존 기능의 위치 계약 오류를 바로잡는 변경이며 public workflow semantics는 유지한다.
- plan 단계에서는 루트 `agents/`의 migration/cleanup 조건을 명시해야 한다. pgg-managed 파일만 있을 때와 사용자 파일이 섞인 경우를 구분해야 한다.
