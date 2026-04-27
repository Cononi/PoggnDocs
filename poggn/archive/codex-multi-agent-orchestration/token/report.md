# Token Audit Report

## Topic

codex-multi-agent-orchestration

## Stage

token

## Verdict

pass

## Scope

- pgg workflow handoff structure
- generated agent configuration and routing assets
- generated skill and workflow documents
- implementation evidence relevant to multi-agent context fanout

## Measurements

| Surface | Words | Bytes | Notes |
|---|---:|---:|---|
| state-pack handoff | 156 | 2,475 | `.codex/sh/pgg-state-pack.sh codex-multi-agent-orchestration` |
| proposal/plan/task/spec bundle | 3,008 | 24,453 | naive per-agent planning handoff |
| full topic docs, excluding implementation diffs | 5,445 | 54,261 | all topic markdown/json/ndjson except diff files |
| implementation diffs | 16,527 | 245,663 | intentionally excluded from default agent handoff |
| generated workflow docs and skills | 2,904 | 27,691 | `.codex/add/*` and `.codex/skills/*` checked as token surface |
| agent TOML and Codex config | 2,777 | 20,163 | `agents/*.toml` plus `.codex/config.toml` |

## Comparison

- Naive two-agent handoff with proposal/plan/task/spec bundle: `3,008 * 2 = 6,016` words.
- Two-agent handoff with state-pack only: `156 * 2 = 312` words.
- Estimated reduction for initial handoff: `5,704` words, about `94.8%`.
- Compared with full topic docs, state-pack is about `2.9%` of the word count.
- Excluding implementation diffs from default handoff avoids `16,527` words per agent, or `33,054` words for two primary agents.

## Cost Drivers

- Implementation diffs are the largest token surface and should be opened only when a reviewer needs a specific diff.
- Full generated docs and skill files duplicate routing and handoff guidance across several managed assets.
- Agent TOML files are intentionally generic and reusable, but loading every role file for every flow is unnecessary.
- `state/current.md` is useful as a durable summary but is currently larger than state-pack because it carries the full Changed Files table.

## Optimization Actions

- Keep `max_threads=4` and `max_depth=1` as the default Codex agent budget.
- Use exactly two primary agents per flow from `agents/main.toml`.
- Treat `project-generalist` and `docs-researcher` as opt-in support roles only.
- Use `.codex/sh/pgg-state-pack.sh <topic|topic_dir>` as the first teams handoff payload.
- Pass file references from state-pack or `state/current.md`; do not copy proposal/plan/task/spec bundles by default.
- Do not pass implementation diffs to all agents; open only the specific diff ref needed for a bounded review question.
- Keep final agent outputs summarized in review/audit docs rather than copying full sub-agent transcripts.

## Improvement Result

- The implemented state-pack now includes `multi_agent`, `agent_max_threads`, `agent_max_depth`, `agent_routing_ref`, and stage-specific `primary_agents`, so sub-agents can start from a compact handoff.
- The generated `agents/main.toml` centralizes route lookup, so individual flow docs do not need to carry full role definitions.
- The generated skills and workflow docs now consistently instruct agents to prefer state/current refs or state-pack over full document copies.

## Expert Notes

- Tech Lead: pass. The current budget is conservative for token usage because it allows the parent plus two primary agents and one support slot while preventing nested fanout.
- Code Reviewer: pass. The largest token risk is repeated diff loading, and the workflow now records diff refs instead of using full diff content as default handoff.

## Residual Risk

- `state/current.md` will grow as more stages complete. For teams mode, state-pack should remain the primary payload because it filters the larger state document into key/value context.
- If future flows add more support roles or richer agent TOML prompts, the generated asset size should be remeasured before raising `max_threads`.

