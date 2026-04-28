---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T03:35:40Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/001_UPDATE__codex_add_WOKR-FLOW_md.diff` | `T2` | pgg-add 필수 산출물에서 workflow JSON 제거 |
| 002 | UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/002_UPDATE__codex_sh_pgg-new-topic_sh.diff` | `T2` | proposal reactflow metadata와 workflow JSON write 제거 |
| 003 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/003_UPDATE__codex_sh_pgg-state-pack_sh.diff` | `T1` | actual LLM 합계를 usage metadata 기반으로 제한 |
| 004 | UPDATE | `.codex/skills/pgg-add/SKILL.md` | `implementation/diffs/004_UPDATE__codex_skills_pgg-add_SKILL_md.diff` | `T2` | pgg-add write contract에서 workflow JSON 제거 |
| 005 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T1` | timeline token 집계도 actual/local estimate 분리 |
| 006 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/006_UPDATE_packages_core_src_index_ts.diff` | `T1,T2` | dashboard snapshot token 집계와 workflow optional 처리 |
| 007 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/007_UPDATE_packages_core_src_templates_ts.diff` | `T1,T2` | generated template에서 React Flow 생성 제거와 state-pack 동기화 |
| 008 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/008_UPDATE_packages_core_dist_index_js.diff` | `T3` | build 산출물 동기화 |
| 009 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/009_UPDATE_packages_core_dist_index_js_map.diff` | `T3` | build sourcemap 동기화 |
| 010 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/010_UPDATE_packages_core_dist_templates_js.diff` | `T3` | template build 산출물 동기화 |
| 011 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/011_UPDATE_packages_core_dist_templates_js_map.diff` | `T3` | template sourcemap 동기화 |
| 012 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/012_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` | `T3` | actual metadata 기준과 local estimate 기대값 검증 |
| 013 | UPDATE | `packages/core/test/status-analysis.test.mjs` | `implementation/diffs/013_UPDATE_packages_core_test_status-analysis_test_mjs.diff` | `T3` | workflow JSON 없는 topic fixture 검증 |
| 014 | UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/014_UPDATE_scripts_dashboard-history-model_test_mjs.diff` | `T3` | timeline token 기대값 갱신 |
| 015 | UPDATE | `.codex/add/SHELL-RULES.md` | `implementation/diffs/015_UPDATE__codex_add_SHELL-RULES_md.diff` | `T2` | trusted script 목록에서 React Flow helper 제거 |
| 016 | DELETE | `.codex/sh/pgg-reactflow-build.sh` | `implementation/diffs/016_DELETE__codex_sh_pgg-reactflow-build_sh.diff` | `T2` | workflow JSON 생성 전용 helper 제거 |
