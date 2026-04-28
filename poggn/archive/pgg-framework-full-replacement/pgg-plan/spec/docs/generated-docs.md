---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: Generated Documentation

## 목적

generated Markdown을 TypeScript Skill 정의와 generator 결과로만 생성하고, 한국어 기본 문서와 공통 계약 섹션을 보장한다.

## 대상 파일

- `packages/core/src/templates.ts`
- `.codex/skills/pgg-add/SKILL.md`
- `.codex/skills/pgg-plan/SKILL.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/skills/pgg-performance/SKILL.md`
- `.codex/skills/pgg-qa/SKILL.md`
- `.pgg/project.json`

## 요구사항

1. 모든 generated Skill Markdown은 `## 공통 Skill 정의`를 포함한다.
2. 한국어 문서의 section label은 기본 한국어다.
3. code identifier, command, file path는 영어 유지 가능하다.
4. `pgg-add`도 검증 요구사항, QA 요구사항, 생성 문서 섹션을 포함한다.
5. generator는 두 번 실행해 안정성을 증명한다.

## 검증

- `node packages/cli/dist/index.js update`
- `node packages/cli/dist/index.js update`
- `rg -n "## 공통 Skill 정의|### 검증 요구사항|### QA 요구사항|### 생성 문서 섹션" .codex/skills/pgg-*.md`
