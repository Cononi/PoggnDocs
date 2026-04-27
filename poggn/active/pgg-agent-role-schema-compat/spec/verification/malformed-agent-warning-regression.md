# S3: Malformed Agent Warning Regression

## Purpose

Prove the compatibility fix removes the user-visible warning without relying only on syntactic TOML parsing.

## Required Evidence

- List every agent TOML file changed.
- Record the rejected keys removed or relocated.
- Capture a validation result from the same startup path or closest available command that previously emitted:
  - `Ignoring malformed agent role definition`
  - `unknown field category`
  - `unknown field activation`

## Verification Rules

- Prefer local commands and project-managed helpers.
- Do not require internet access.
- Do not edit global Codex configuration.
- If the exact warning path cannot be automated, record the manual verification command/path and observed output.

## Acceptance

- No malformed agent role warning is observed for `.codex/agents/*.toml` after the change.
- `./.codex/sh/pgg-gate.sh pgg-code pgg-agent-role-schema-compat` passes after plan, task, spec, and reviews exist.
- Residual schema uncertainty, if any, is documented in `reviews/code.review.md`.
