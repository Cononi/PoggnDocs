---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "add"
  status: "draft"
  skill: "pgg-add"
  updated_at: "2026-04-28T12:27:32Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "4.0.0"
---

# Proposal: PGG Framework Full Replacement

## Summary

PGG의 기존 workflow, generated docs 구조, CLI/public API routing, dashboard workflow model, git lifecycle, token accounting, QA 계약을 신규 TypeScript Skill Framework 기준으로 전면 교체한다.

## Topic

- topic_name: `pgg-framework-full-replacement`
- active path: `poggn/active/pgg-framework-full-replacement`
- archive path: `poggn/archive/pgg-framework-full-replacement`
- working branch: `ai/feat/4.0.0-framework-replacement`
- release branch: `release/4.0.0-framework-replacement`

## Version

- currentVersion: `3.2.0`
- targetVersion: `4.0.0`
- bumpType: `major`
- convention: `feat`
- versionSource: `poggn/version-history.ndjson latest archived version`
- versionReason: 전면 교체는 기존 시스템 기능과 public behavior를 크게 바꾸는 migration이다.

## User Question Record

1. 무엇을 전면 교체하나요?
   - 답변: 예시 전체
2. 최소 성공 동작은 무엇인가요?
   - 답변: 의미를 모르겠음
   - pgg-add 해석: 관찰 가능한 완료 기준으로 AC를 제시한다.
3. 기존 동작 중 유지해야 하는 public API/CLI/file path가 있나요?
   - 답변: 없음
4. 이 교체가 실패했을 때 반드시 막아야 하는 결과는 무엇인가요?
   - 답변: 없음

## Decision

- pgg-add 초안은 `PASS`로 정리 가능하다.
- 다음 단계에서 pgg-plan은 전면 교체 범위를 작은 task로 분해해야 한다.

## Audit Applicability

- `pgg-performance`: `not_required` | 성능 기준이 아직 없다.
