---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "add"
  status: "draft"
  skill: "pgg-add"
  updated_at: "2026-04-28T12:27:32Z"
---

# Acceptance Criteria Draft

## AC1 Source of Truth

Given PGG flow 정의가 필요할 때,
When repository를 확인하면,
Then TypeScript Skill 정의가 source of truth이고 generated Markdown은 generator 결과여야 한다.

## AC2 Full Replacement Scope

Given 전면 교체 migration을 수행할 때,
When pgg-plan이 task를 작성하면,
Then Skill Framework Core, generated docs, CLI/public API adapter, dashboard workflow model, git lifecycle, token accounting, tests를 모두 범위에 포함해야 한다.

## AC3 Generated Docs

Given generated Markdown이 변경될 때,
When docs generator를 두 번 실행하면,
Then 두 번째 실행은 추가 변경 없이 stable해야 하며 Markdown을 직접 patch하지 않아야 한다.

## AC4 Korean Documentation

Given `.pgg/project.json` language가 `ko`일 때,
When PGG managed docs를 생성하면,
Then 설명 문서와 section label은 기본 한국어여야 하며 code identifier, command, path만 영어를 유지할 수 있다.

## AC5 Public Compatibility Decision

Given 사용자가 public API/CLI/file path 유지 요구가 없다고 답했을 때,
When legacy adapter 또는 deprecated 파일을 분류하면,
Then keep, replace, deprecated, removable-after-migration 중 하나로 명시하고 제거는 pgg-qa PASS 이후로 제한해야 한다.

## AC6 Versioning

Given 최신 POGGN release ledger가 `3.2.0`일 때,
When pgg-add version을 결정하면,
Then targetVersion은 전면 교체 major bump인 `4.0.0`이어야 한다.

## AC7 Git Mode

Given `pgg git = on`이고 현재 repository가 git 저장소일 때,
When pgg-add가 시작되면,
Then working branch `ai/feat/4.0.0-framework-replacement`를 생성하거나 전환하고 state에 기록해야 한다.

## AC8 Completion Contract

Given pgg-add가 완료될 때,
When completion message를 출력하면,
Then 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-plan` 또는 요구사항 미완료 시 `다음 flow를 실행하세요: pgg-add`여야 하고 이후 문장은 없어야 한다.

## AC9 Token Accounting

Given pgg-add가 LLM 작성 artifact를 만들 때,
When 산출물을 저장하면,
Then `poggn/active/pgg-framework-full-replacement/metrics/token-usage.jsonl`에 token record를 JSONL로 남겨야 한다.

## 승인 상태

- 요구사항: draft
- Acceptance Criteria: draft
- 사용자가 현재 초안을 승인하면 다음 flow는 `pgg-plan`이다.
