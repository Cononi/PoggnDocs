# Generated Document Language Sync

## Purpose

Ensure `pgg init`, `pgg update`, and `pgg lang` produce managed documents that follow `.pgg/project.json` language consistently.

## Requirements

- `language=ko` output uses Korean for pgg workflow guidance, generated skill descriptions, role descriptions, and role instructions.
- `language=en` output uses English for the same surfaces.
- Shared keywords and file names may remain literal, including `pgg`, `proposal.md`, `archive_type`, `version_bump`, `target_version`, and branch names.
- The English generated skill entries must include the same contract details as Korean entries, including:
  - `archive_type`
  - `version_bump`
  - `target_version`
  - branch naming
  - `project_scope`
  - audit applicability
  - Git Publish Message behavior when relevant
- Agent role text should be generated from language-aware role metadata instead of one English-only role list.
- `updateProjectLanguage` must continue to call the same managed sync path so `pgg lang` rewrites language-sensitive managed files.

## Acceptance

- A Korean project has Korean generated skill and agent instruction text.
- An English project has English generated skill and agent instruction text.
- Switching from Korean to English with `pgg lang` changes language-sensitive managed files while preserving ledgers and unrelated user-owned files.
- `pgg update` preserves the manifest language and syncs generated assets in that language.
