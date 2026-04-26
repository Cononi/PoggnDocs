# S3: Two-Agent Flow Orchestration

## Purpose

Replace broad expert rosters with a deterministic two-primary-agent routing model.

## Routing Matrix

| Flow | Primary Agents |
|---|---|
| `pgg-add` | `product-manager`, `ux-ui-expert` |
| `pgg-plan` | `software-architect`, `domain-expert` |
| `pgg-code` | `senior-backend-engineer`, `tech-lead` |
| `pgg-refactor` | `software-architect`, `code-reviewer` |
| `pgg-qa` | `qa-test-engineer`, `sre-operations-engineer` |
| `pgg-token` | `tech-lead`, `code-reviewer` |
| `pgg-performance` | `qa-test-engineer`, `sre-operations-engineer` |

## Rules

- Each flow uses exactly two primary agents.
- Support agents are opt-in and never count as flow primaries.
- The parent Codex process decides whether delegation is appropriate. If immediate blocking work depends on a result, the parent handles it locally.
- Agent write ownership must be disjoint when workers edit files.
- Exploratory agent output is summarized into review docs, not copied wholesale.
- `pgg teams=off` disables automatic multi-agent orchestration.

## Stage Evidence

- When teams mode is on, state history should record that two-agent orchestration was prepared or used.
- Agent outputs should be referenced from review docs or implementation notes.
- Completed flow state still depends on pgg stage completion evidence, not on agent completion alone.

## Acceptance

- Managed docs and generated skills all reference the same two-agent matrix.
- No flow has three primary agents.
- Optional audits only route agents when the audit is required or explicitly invoked.
