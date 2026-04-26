---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-24T23:36:18Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 95 | 기존 workflow dashboard fix 이후에도 탭 reference 불일치와 flow 상태 전환 실패가 남아 있다는 follow-up으로 분리한 판단이 적절하다. dashboard 문제와 pgg evidence 기록 절차 문제를 둘 다 확인하도록 범위를 잡아야 한다. | none |
| UX/UI 전문가 | 96 | `add-img/9.png` 기준은 selected tab의 bottom line 제거, panel top line 연결, inactive tab unboxed 처리까지 구체적이다. 후속 구현은 source-level 수정만으로 끝내지 말고 desktop/mobile screenshot 또는 pixel acceptance를 남겨야 한다. | none |
| 도메인 전문가 | 97 | `pgg-xx` 실행 시작 시 `stage-started`/`stage-progress` evidence가 없으면 dashboard가 `진행 중`을 안정적으로 계산할 수 없다. Done을 release outcome 전용으로 제한하고 QA fail/release blocked를 완료와 분리하는 기준도 타당하다. | none |

## Decision

pass

## Notes

- archive_type `fix`, version_bump `patch`, target_version `2.2.4`가 적절하다.
- 후속 `pgg-plan`은 UI tab spec과 state evidence spec을 분리해야 한다.
- `pgg-xx` 시작 시 event append가 실제 helper/skill/template에 존재하는지 검증해야 한다.
- 완료 상태는 `reviewed` 또는 artifact 존재만으로 확정하지 말고 governed completion evidence를 기준으로 삼아야 한다.
- Done flow는 release completed, QA failed, release blocked/publish blocked를 분리해 정의해야 한다.
- 추가 요구에 따라 각 flow는 stage별 필수 산출물, review, verification, commit/release evidence가 완전히 끝나기 전까지 완료로 표시되지 않아야 한다.
- 중간 산출물 생성, `reviewed` frontmatter, workflow node 존재, `updatedAt` fallback은 완료가 아니라 `진행 중` 또는 `추가 진행` evidence로 취급해야 한다.
- 현재 단계 blocking issue는 없다.
