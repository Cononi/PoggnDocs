# S5: Multi-Agent Context Budget

## Purpose

Limit token growth from parallel agent usage.

## Requirements

- Default `max_depth=1` prevents child agents from spawning more agents.
- Default `max_threads=4` permits parent coordination, two flow primaries, and one spare support slot.
- Agent handoff must prioritize `state/current.md`.
- If teams handoff is needed, use `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`.
- Do not send full proposal/plan/task/spec bundles to every agent by default.
- Agent outputs must be summarized into review docs with attribution.

## Required Audit

`pgg-token` is required for this topic because token optimization is an explicit user requirement and multi-agent orchestration increases fan-out risk.

## Acceptance

- Token audit report compares naive full-doc handoff with state-pack/minimal handoff.
- Token audit confirms two-agent routing, depth limit, and support-role opt-in behavior.
- QA blocks archive if required token audit is missing.
