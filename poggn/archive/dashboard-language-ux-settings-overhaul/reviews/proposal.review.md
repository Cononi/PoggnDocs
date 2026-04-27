---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-27T11:56:14Z"
---

# Proposal Review

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 96 | 사용자 요구는 문서 언어 정책, dashboard 전역 action, mobile UX, settings category, workflow 상태 신뢰성으로 명확히 분해된다. minor feature로 묶는 것이 release note 관점에서 자연스럽다. | 없음 |
| UX/UI 전문가 | 96 | navigation 줄바꿈, SpeedDial tooltip, 모바일 bottom navigation 제거, project add form 정돈, 삭제 double confirmation은 모두 같은 사용성 문제군이다. Settings에 category를 배치하는 것도 사용자의 기대 경로와 맞다. | 없음 |

## 범위 판단

- `feat`가 적절하다. 새 settings category panel과 SpeedDial/version display, pgg 문서 언어 계약은 단순 patch보다 크다.
- `minor`가 적절하다. 기존 workflow와 data contract를 깨지 않고 compatible 기능과 UX를 확장한다.
- `target_version`은 latest `2.6.1` 다음 minor인 `2.7.0`이 적절하다.

## Risk

- dashboard category management가 Project 화면과 Settings 화면에 중복되면 사용자가 진입점을 혼동할 수 있다. plan 단계에서 source component를 재사용하거나 route를 명확히 합쳐야 한다.
- workflow 상태 계산 수정은 archive topic과 active topic 양쪽에 영향을 주므로 fixture 기반 회귀 테스트가 필요하다.
- `pgg lang` 문서 언어 강제는 helper와 template이 섞여 있어 생성 경로별 검증이 필요하다.

## Recommendation

`pgg-plan`으로 진행한다. plan 단계에서는 아래 spec을 최소 단위로 분리한다.

- pgg language document generation contract
- dashboard shell navigation and SpeedDial contract
- dashboard settings category management contract
- dashboard mobile workflow UX contract
- workflow status evidence contract
- project deletion safety contract
