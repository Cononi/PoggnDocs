---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "add"
  status: "reviewed"
  skill: "pgg-add"
  updated_at: "2026-04-28T12:27:32Z"
---

# Proposal Review

## Product Manager 관점

- 전면 교체 목적은 명확하다.
- 사용자가 public compatibility를 요구하지 않았으므로 major bump 판단은 타당하다.
- 최소 성공 동작은 사용자가 용어를 모른다고 답했으므로 pgg-add가 관찰 가능한 AC로 번역했다.

## UX/UI Expert 관점

- dashboard workflow model이 범위에 포함되므로 pgg-plan에서 사용자 흐름 변경과 visual regression 기준을 분리해야 한다.
- generated docs 한국어 기본 정책은 사용자-facing 문서 품질 기준으로 유지해야 한다.

## Blocking Issues

- 없음. 단, pgg-plan에서 legacy adapter 유지/제거 순서를 명확히 해야 한다.

## Decision

- draft 승인 가능
- next flow: `pgg-plan`
