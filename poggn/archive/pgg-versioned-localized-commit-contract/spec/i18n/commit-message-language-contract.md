---
spec:
  id: "S2"
  topic: "pgg-versioned-localized-commit-contract"
  title: "Commit Message Language Contract"
  status: "ready"
---

# Commit Message Language Contract

## Intent

pgg commit message text must follow the current project language so generated git history is readable in the same language as the project workflow assets.

## Requirements

1. Helpers must read `.pgg/project.json` and use `language` as the source of truth.
2. When `language=ko`, the commit message text after `{convention}: [{version}]` must be Korean.
3. When `language=en`, the commit message text after `{convention}: [{version}]` must be English.
4. Language validation applies to the commit message text and detailed body text, not to footer tokens such as `Refs: <topic>`.
5. The helper must fail or defer with a clear `commit_message_invalid` result when commit text violates the project language contract.
6. Generated defaults, examples, and QA completion messages must be localized for both `ko` and `en`.
7. `pgg lang` updates must keep generated assets aligned with the same commit language rule.
8. The implementation may use deterministic language guards rather than external translation services.

## Acceptance

- A Korean project accepts a title like `feat: [1.0.0]버전 포함 커밋 규칙` and rejects an English-only message text.
- An English project accepts a title like `feat: [1.0.0]versioned commit contract` and rejects Korean message text.
- Footer values such as `Refs: pgg-versioned-localized-commit-contract` are not rejected for being English in a Korean project.
- QA completion fallback text is generated in the configured project language.

## Non-Requirements

- Perfect natural-language detection is not required.
- Translating archived historical docs is not required.
- Supporting languages other than `ko` and `en` is not required.
