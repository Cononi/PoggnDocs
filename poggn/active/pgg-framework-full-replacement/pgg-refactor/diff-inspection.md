# Diff Inspection

## Changed Files

- `packages/core/src/templates.ts`
- `packages/core/dist/templates.js`
- `packages/core/dist/templates.js.map`

## Diff Stat

```text
packages/core/dist/templates.js     | 116 ++++++++++++++++++-----------------
packages/core/dist/templates.js.map |   2 +-
packages/core/src/templates.ts      | 118 ++++++++++++++++++------------------
3 files changed, 120 insertions(+), 116 deletions(-)
```

## Inspection

- Feature change: none.
- Acceptance Criteria change: none.
- Public API break: none.
- Generated Markdown direct edit: none.
- Unrelated cleanup: none.
- Runtime behavior change: none expected; generated docs update remained `unchanged` twice.

## Decision

PASS. The diff is a behavior-preserving extraction of common Skill definition labels.
