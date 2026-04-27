---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-27T01:39:54Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.3"
  short_name: "codex-sync"
  working_branch: "ai/fix/2.3.3-codex-sync"
  release_branch: "release/2.3.3-codex-sync"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Codex subagent 공식 스키마에 맞게 agent 생성 문서를 고치고 init/update/lang 생성 문서의 언어 전환 누락을 수정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

Codex subagent schema and generated document language sync

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.3.3`
- short_name: `codex-sync`
- working_branch: `ai/fix/2.3.3-codex-sync`
- release_branch: `release/2.3.3-codex-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add agents 문서 에러가 많습니다. https://developers.openai.com/codex/subagents 참조 해주시고 하위 내용 수정 부탁드립니다.`
- `init, update로 생성되는 문서중에 lang에 따라 한글 영어 전환이 안되는게 있습니다.`
- Codex warning examples:
  - `.codex/agents/*`: `unknown field category`
  - `.codex/agents/main.toml`: `unknown field activation`

## 4. 문제 정의

- 현재 `.codex/agents/*.toml` 생성물은 `category`, `purpose`, `when_to_use`, `input_contract`, `output_contract`, `constraints`, `forbidden_actions`, `handoff` 같은 pgg 전용 필드를 standalone agent TOML에 직접 넣는다. Codex는 이를 custom agent config로 파싱하면서 `category`를 unknown field로 보고 agent role을 무시한다.
- 현재 `.codex/agents/main.toml`은 routing manifest로 쓰려는 파일이지만 Codex는 `.codex/agents/` 아래 standalone TOML을 custom agent 파일로 로드한다. 이 파일에는 custom agent 필수 필드가 없고 `activation`, `roles`, `flows`, `support` 등 unsupported manifest 필드가 있어 `unknown field activation` 오류가 난다.
- 공식 Codex subagents 문서는 project-scoped custom agents를 `.codex/agents/` 아래 standalone TOML로 정의하며, 각 파일의 필수 필드는 `name`, `description`, `developer_instructions`라고 설명한다. 선택 필드는 `nickname_candidates`, `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config` 등 일반 Codex config 계열이다. Source: https://developers.openai.com/codex/subagents
- 공식 문서는 global subagent 설정이 `[agents]` 아래 `max_threads`, `max_depth`, `job_max_runtime_seconds`로 존재한다고 설명한다. 따라서 pgg의 routing matrix는 Codex agent 파일로 오인되지 않는 위치나 문서 계약으로 옮기거나, `.codex/agents/main.toml`을 valid custom agent로 만들고 unsupported routing manifest 필드를 제거해야 한다.
- `pgg init`, `pgg update`, `pgg lang`은 `.pgg/project.json`의 language를 기반으로 generated assets를 다시 쓰지만, agent TOML 내용과 일부 generated 문서/skill 문구가 한 언어로 고정되어 `ko`/`en` 전환 기대와 어긋난다.
- OpenAI developer docs MCP를 설치했지만 현재 세션 MCP registry에는 즉시 노출되지 않아, 이번 proposal에서는 공식 OpenAI URL을 직접 확인한 결과를 근거로 삼았다.

## 5. 변경 목표

- `.codex/agents/*.toml` 생성물을 Codex custom agent schema에 맞춘다.
- `.codex/agents/main.toml`에서 Codex가 파싱할 수 없는 routing manifest 필드를 제거하거나, routing matrix를 Codex가 agent role로 로드하지 않는 generated 문서로 이동한다.
- pgg의 2-agent routing 계약은 `.codex/add/EXPERT-ROUTING.md`, `WOKR-FLOW.md`, `STATE-CONTRACT.md`, `pgg-state-pack.sh` handoff에서 유지하되 Codex custom agent schema와 충돌하지 않게 표현한다.
- `pgg init`, `pgg update`, `pgg lang`으로 생성/갱신되는 문서형 자산이 `language=ko`면 한국어, `language=en`이면 영어로 일관되게 전환되도록 템플릿을 정리한다.
- 현재 repo의 generated files와 source templates/dist/tests를 함께 고쳐 다음 프로젝트에도 같은 수정이 반영되게 한다.

## 6. 범위

### 포함

- `packages/core/src/templates.ts` agent role/template 생성 로직
- `packages/core/dist/templates.js` 및 sourcemap 동기화
- `.codex/agents/*.toml` 현재 generated files 정정
- `.codex/agents/main.toml` 처리 방식 정정 또는 대체
- `.codex/config.toml`의 `[agents] max_threads=4`, `max_depth=1` 유지
- `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/add/EXPERT-ROUTING.md`의 subagent 설명 중 공식 스키마와 충돌하는 표현 정정
- `.codex/skills/*/SKILL.md`, `AGENTS.md`, README/readme template 등 init/update/lang으로 생성되는 문서형 자산의 ko/en 전환 누락 점검
- `packages/core/test/skill-generation.test.mjs` 중심의 regression test 추가/수정
- 필요 시 `packages/cli`의 `init`, `update`, `lang` 흐름에서 language 기반 sync가 실제 모든 managed doc을 갱신하는지 검증

### 제외

- OpenAI Codex 자체 subagent 런타임 기능 변경
- archived topic 문서 전체 번역 또는 과거 산출물 소급 수정
- pgg workflow의 primary agent 수 2개 규칙 변경
- teams mode를 실제 병렬 subagent 실행으로 강제하는 새 orchestration 엔진 구현
- 사용자 홈 `~/.codex`의 global agent 파일 수정
- `add-img/*.png` 등 현재 topic과 무관한 dirty asset 정리

## 7. 설계 방향

- Codex가 직접 로드하는 `.codex/agents/<agent>.toml`은 공식 필드만 사용한다.
- pgg 전용 분류 정보(`primary`, `support`, flow routing, activation wording)는 Codex agent TOML의 unknown field로 두지 않고 generated docs 또는 `developer_instructions` 본문으로 옮긴다.
- agent 파일명은 hyphen을 유지해도 되지만, `name`은 Codex가 source of truth로 쓰므로 spawn-friendly한 식별자를 사용한다. 예: `product_manager`, `ux_ui_expert`.
- `developer_instructions`는 각 role의 목적, 입력 제한, 출력 계약, 금지사항을 자연어로 포함한다.
- support agent인 `docs-researcher`에는 공식 문서 확인 역할을 유지하되, MCP 설정을 넣을 경우 공식 예시처럼 `[mcp_servers.<name>]` 형태만 사용한다.
- `main.toml`이 계속 `.codex/agents/` 아래 있어야 한다면 valid custom agent로 만들어야 한다. routing manifest가 필요하면 Codex가 agent 파일로 로드하지 않는 `.codex/add/EXPERT-ROUTING.md` 또는 다른 generated doc이 source of truth가 된다.

## 8. Auto Mode Handling

- poggn auto mode: `on`
- 요구사항은 현재 프로젝트 내부 generated workflow 자산 수정이므로 추가 질문 없이 `archive_type=fix`, `version_bump=patch`, `target_version=2.3.3`으로 확정한다.
- 공식 문서 대조 결과가 명확해 `category`/`activation` 제거 및 schema alignment를 blocking 없이 계획 단계로 넘긴다.

## 9. Baseline Decisions

| Item | Decision | Status |
|---|---|---|
| archive_type | `fix`, because malformed generated Codex agent files cause runtime warnings and ignored roles. | resolved |
| version_bump | `patch`, because this repairs generated file validity and localization consistency without intentionally changing pgg workflow semantics. | resolved |
| target_version | `2.3.3` | resolved |
| Codex agent schema | Use only supported custom agent fields and general config keys. | resolved |
| Routing matrix | Keep pgg 2-agent routing in workflow docs/state-pack, not as unsupported custom TOML fields. | resolved |
| Language sync | Generated documents must reflect `.pgg/project.json` language for both init/update/lang. | resolved |
| Official source | OpenAI Codex subagents doc at `https://developers.openai.com/codex/subagents`. | resolved |

## 10. 성공 기준

- Codex no longer reports `unknown field category` for generated `.codex/agents/*.toml`.
- Codex no longer reports `unknown field activation` for `.codex/agents/main.toml`, or `main.toml` is no longer generated in a location/schema that Codex loads as an invalid custom agent.
- Each generated custom agent file includes at least `name`, `description`, and `developer_instructions`.
- Optional custom agent fields, if present, match official Codex config-compatible keys.
- `pgg init --lang ko`, `pgg init --lang en`, `pgg update`, and `pgg lang` regression coverage proves generated docs/skills/agent instructions switch language consistently.
- Existing pgg 2-agent routing and support-agent opt-in rules remain documented and available for workflow handoff.
- Generated source and dist outputs stay in sync.

## 11. 전문가 검토 요약

- Product manager: 현재 warning은 사용자가 teams/subagent 기능을 신뢰하지 못하게 만드는 직접적인 product defect이며, official schema alignment와 language sync를 한 patch topic으로 묶는 것이 적절하다.
- UX/UI expert: init/update/lang 결과가 설정 언어와 다르면 사용자는 현재 프로젝트 상태를 잘못 해석한다. generated docs의 언어 일관성은 workflow 이해 가능성에 직접 영향을 준다.
- Docs researcher: 공식 문서상 custom agent TOML은 `name`, `description`, `developer_instructions` 중심이며 pgg 전용 `category`/`activation` 필드는 근거가 없다. routing metadata는 Codex loader와 충돌하지 않는 문서 위치로 분리해야 한다.

## 12. 다음 단계

`pgg-plan`에서 agent schema spec, routing-doc preservation spec, generated language sync spec, regression proof spec으로 나눈 뒤 구현 범위를 확정한다.
