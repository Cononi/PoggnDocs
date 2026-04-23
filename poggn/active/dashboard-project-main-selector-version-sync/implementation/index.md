---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 94
  updated_at: "2026-04-23T16:33:13Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1` | archive latest version을 ledger 우선, archive metadata fallback, package version 최종 fallback으로 계산하도록 resolver를 분리했다 |
| 002 | UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_version-history_test_mjs.diff` | `T1` | ledger 유효 entry 우선과 archive metadata fallback을 검증하는 regression test를 추가했다 |
| 003 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/003_UPDATE_packages_core_dist_index_js.diff` | `T1` | source resolver 변경을 반영하도록 tracked dist runtime bundle을 재생성했다 |
| 004 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_index_js_map.diff` | `T1` | source resolver 변경을 반영하도록 tracked source map을 재생성했다 |
