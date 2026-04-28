import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildRootReadme,
  initializeProject,
  PGG_COMPATIBILITY_FLOW_ALIASES,
  PGG_CONDITIONAL_HELPER_FLOWS,
  PGG_DEFAULT_FLOW,
  PGG_RUN_STATE_SCHEMA_EXAMPLE,
  PGG_SKILL_DEFINITION_BY_ID,
  PGG_SKILL_DEFINITIONS,
  PGG_TOKEN_USAGE_RECORD_SCHEMA_EXAMPLE,
  updateProject,
  updateProjectLanguage,
  updateProjectTeamsMode,
  validatePggSkillRegistry
} from "../dist/index.js";

const STANDALONE_SKILL_CASES = [
  {
    path: ".codex/skills/pgg-status/SKILL.md",
    namePattern: /name: "pgg-status"/,
    bodyPattern: /현재 active topic 상태를 읽고/
  },
  {
    path: ".codex/skills/pgg-verify/SKILL.md",
    namePattern: /name: "pgg-verify"/,
    bodyPattern: /구현 결과를 테스트, Acceptance Criteria/
  }
];
const CODEX_CONFIG_PATH = ".codex/config.toml";
const CODEX_AGENTS_DIR = ".codex/agents";
const AGENT_ROUTING_PATH = ".codex/add/AGENT-ROUTING.toml";
const STATE_PACK_PATH = ".codex/sh/pgg-state-pack.sh";
const GENERATED_AGENT_ROLE_IDS = [
  "product-manager",
  "ux-ui-expert",
  "domain-expert",
  "software-architect",
  "senior-backend-engineer",
  "tech-lead",
  "code-reviewer",
  "qa-test-engineer",
  "sre-operations-engineer",
  "project-generalist",
  "docs-researcher"
];
const REQUIRED_COMMON_SKILL_FIELDS = [
  "id",
  "name",
  "purpose",
  "targetAgent",
  "triggerConditions",
  "inputs",
  "outputs",
  "absoluteRules",
  "antiPatterns",
  "modeSpecificBehavior",
  "requiredPhases",
  "approvalGates",
  "verificationRequirements",
  "reviewRequirements",
  "completionMessageContract",
  "tokenAccountingRequirements",
  "nextFlowRouting",
  "performanceTriggerGuidance",
  "poggnWorkspaceRequirements",
  "gitModeRequirements",
  "branchLifecycleRequirements",
  "versioningRequirements",
  "commitMessageRequirements",
  "archiveRequirements",
  "qaRequirements",
  "generatedDocumentationSections"
];

function checksum(content) {
  return createHash("sha256").update(content).digest("hex");
}

function codexAgentRolePath(roleId) {
  return `${CODEX_AGENTS_DIR}/${roleId}.toml`;
}

async function readManifest(rootDir) {
  return JSON.parse(await readFile(path.join(rootDir, ".pgg", "project.json"), "utf8"));
}

async function withTemporaryPggHome(rootDir, run) {
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await run();
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
  }
}

test("initializeProject and updateProject keep standalone skills managed", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-skill-generation-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const initialStandaloneSkills = new Map(
        await Promise.all(
          STANDALONE_SKILL_CASES.map(async (skill) => [
            skill.path,
            await readFile(path.join(rootDir, skill.path), "utf8")
          ])
        )
      );
      const initialWorkflow = await readFile(path.join(rootDir, ".codex/add/WOKR-FLOW.md"), "utf8");
      const initialStateContract = await readFile(path.join(rootDir, ".codex/add/STATE-CONTRACT.md"), "utf8");
      const initialReadme = buildRootReadme();
      const initialManifest = await readManifest(rootDir);

      for (const skill of STANDALONE_SKILL_CASES) {
        const content = initialStandaloneSkills.get(skill.path);
        assert.ok(content);
        assert.match(content, skill.namePattern);
        assert.match(content, skill.bodyPattern);
        assert.equal(initialManifest.managedFiles.some((entry) => entry.path === skill.path), true);
      }
      assert.match(initialWorkflow, /\{convention\}: \{version\}\.\{commit message\}/);
      assert.match(initialStateContract, /pgg lang=ko/);
      assert.match(initialReadme, /\{convention\}: \{version\}\.\{commit message\}/);

      await writeFile(
        path.join(rootDir, "poggn", "version-history.ndjson"),
        `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`,
        "utf8"
      );

      await updateProject(rootDir);

      const updatedStandaloneSkills = new Map(
        await Promise.all(
          STANDALONE_SKILL_CASES.map(async (skill) => [
            skill.path,
            await readFile(path.join(rootDir, skill.path), "utf8")
          ])
        )
      );
      const updatedManifest = await readManifest(rootDir);
      const ledger = await readFile(path.join(rootDir, "poggn", "version-history.ndjson"), "utf8");

      for (const skill of STANDALONE_SKILL_CASES) {
        assert.equal(updatedStandaloneSkills.get(skill.path), initialStandaloneSkills.get(skill.path));
        assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === skill.path), true);
      }
      assert.equal(ledger, `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("common TypeScript Skill definitions expose required workflow fields and generated docs", async () => {
  const requiredSkillIds = ["pgg-add", "pgg-plan", "pgg-code", "pgg-refactor", "pgg-performance", "pgg-qa"];
  const registeredIds = PGG_SKILL_DEFINITIONS.map((definition) => definition.id);
  assert.deepEqual(PGG_DEFAULT_FLOW, ["pgg-add", "pgg-plan", "pgg-code", "pgg-refactor", "pgg-qa"]);
  assert.deepEqual(PGG_CONDITIONAL_HELPER_FLOWS, ["pgg-performance", "pgg-performanc"]);
  assert.equal(PGG_COMPATIBILITY_FLOW_ALIASES["pgg-performanc"], "pgg-performance");
  assert.deepEqual(validatePggSkillRegistry(), []);

  for (const skillId of requiredSkillIds) {
    assert.equal(registeredIds.includes(skillId), true);
    const definition = PGG_SKILL_DEFINITION_BY_ID[skillId];
    assert.ok(definition);
    for (const field of REQUIRED_COMMON_SKILL_FIELDS) {
      assert.equal(Object.hasOwn(definition, field), true, `${skillId} missing ${field}`);
    }
    assert.ok(Array.isArray(definition.purpose.ko));
    assert.ok(Array.isArray(definition.purpose.en));
    assert.ok(definition.generatedDocumentationSections.ko.includes("completionMessageContract"));
    assert.ok(definition.generatedDocumentationSections.en.includes("completionMessageContract"));
    assert.match(definition.completionMessageContract.ko.join("\n"), /PGG Flow 완료 보고서/);
    assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: <next-flow-id>/);
    assert.match(definition.tokenAccountingRequirements.ko.join("\n"), /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
    assert.match(definition.poggnWorkspaceRequirements.ko.join("\n"), /poggn\/active\/\{topic_name\}/);
    assert.match(definition.gitModeRequirements.ko.join("\n"), /pgg git = off/);
    assert.match(definition.branchLifecycleRequirements.ko.join("\n"), /pgg\/working\/\{topic_name\}/);
    assert.match(definition.versioningRequirements.ko.join("\n"), /x\.x\.x/);
    assert.match(definition.commitMessageRequirements.ko.join("\n"), /\{convention\}\. \{version\} \{message\}/);
    assert.match(definition.archiveRequirements.ko.join("\n"), /poggn\/archive\/\{topic_name\}/);
  }

  const addDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-add"];
  assert.match(addDefinition.purpose.ko.join("\n"), /요구사항을 발견하고 명세화/);
  assert.match(addDefinition.purpose.ko.join("\n"), /코드를 작성하지 않고/);
  assert.match(addDefinition.absoluteRules.ko.join("\n"), /구현 코드를 작성하면 안 된다/);
  assert.match(addDefinition.modeSpecificBehavior.autoOff.ko.join("\n"), /최대 5개의 소크라테스식 질문/);
  assert.match(addDefinition.modeSpecificBehavior.autoOn.ko.join("\n"), /가정, 불확실성, 선택 이유/);
  assert.match(addDefinition.outputs.ko.join("\n"), /Acceptance Criteria 초안/);
  assert.match(addDefinition.outputs.ko.join("\n"), /currentVersion, targetVersion, bumpType, convention, versionReason, versionSource/);
  assert.match(addDefinition.outputs.ko.join("\n"), /pgg-performance 필요성 후보/);
  assert.match(addDefinition.requiredPhases.ko.join("\n"), /POGGN active workspace 생성/);
  assert.match(addDefinition.requiredPhases.ko.join("\n"), /working branch 생성 또는 전환/);
  assert.match(addDefinition.verificationRequirements.ko.join("\n"), /lowercase kebab-case/);
  assert.match(addDefinition.nextFlowRouting.ko.join("\n"), /pgg-plan/);
  assert.ok(addDefinition.additionalGuidance?.some((section) => section.title.ko === "topic_name 생성"));
  assert.ok(addDefinition.additionalGuidance?.some((section) => section.title.ko === "POGGN active workspace"));
  assert.ok(addDefinition.additionalGuidance?.some((section) => section.title.ko === "Version 결정"));
  assert.ok(addDefinition.additionalGuidance?.some((section) => section.title.ko === "pgg git mode"));
  assert.ok(addDefinition.additionalGuidance?.some((section) => section.title.ko === "Acceptance Criteria 초안 작성 규칙"));

  const planDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-plan"];
  assert.match(planDefinition.purpose.ko.join("\n"), /승인된 요구사항과 설계를 상세한 구현 계획/);
  assert.match(planDefinition.triggerConditions.ko.join("\n"), /pgg-add.*승인/);
  assert.match(planDefinition.inputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/state\.json/);
  assert.match(planDefinition.outputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-plan\/plan\.md/);
  assert.match(planDefinition.outputs.ko.join("\n"), /version bump task/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /2~5분/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /정확한 파일 경로/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /완전한 코드/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /검증 단계/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /예상 결과/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /실패 시 확인 항목/);
  assert.match(planDefinition.absoluteRules.ko.join("\n"), /적절히 구현/);
  assert.match(planDefinition.modeSpecificBehavior.autoOff.ko.join("\n"), /승인되지 않았다면 계획이나 구현 task를 만들지 않고/);
  assert.match(planDefinition.modeSpecificBehavior.autoOn.ko.join("\n"), /병렬화 가능한 task/);
  assert.match(planDefinition.verificationRequirements.ko.join("\n"), /versionSource.*targetVersion/);
  assert.match(planDefinition.nextFlowRouting.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
  assert.match(planDefinition.nextFlowRouting.ko.join("\n"), /다음 flow를 실행하세요: pgg-add/);
  assert.match(planDefinition.nextFlowRouting.ko.join("\n"), /다음 flow를 실행하세요: pgg-plan/);
  assert.match(planDefinition.performanceTriggerGuidance.ko.join("\n"), /응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수/);
  assert.match(planDefinition.performanceTriggerGuidance.ko.join("\n"), /baseline 또는 baseline 측정 방법/);
  assert.ok(planDefinition.additionalGuidance?.some((section) => section.title.ko === "Version Plan"));
  assert.ok(planDefinition.additionalGuidance?.some((section) => section.title.ko === "Task 작성 규칙"));
  assert.ok(planDefinition.additionalGuidance?.some((section) => section.title.ko === "pgg-performance 유도 조건"));
  assert.match(planDefinition.generatedDocumentationSections.ko.join("\n"), /pgg-plan 목적/);
  assert.match(planDefinition.generatedDocumentationSections.ko.join("\n"), /token accounting 규칙/);
  assert.match(planDefinition.generatedDocumentationSections.ko.join("\n"), /next flow routing/);

  assert.equal(PGG_SKILL_DEFINITION_BY_ID["pgg-performance"].id, "pgg-performance");
  assert.equal(PGG_SKILL_DEFINITION_BY_ID["pgg-performanc"].id, "pgg-performance");
  assert.equal(PGG_RUN_STATE_SCHEMA_EXAMPLE.activePath, "poggn/active/{topic_name}");
  assert.equal(PGG_RUN_STATE_SCHEMA_EXAMPLE.archivePath, "poggn/archive/{topic_name}");
  assert.equal(PGG_RUN_STATE_SCHEMA_EXAMPLE.versionSource, "package.json");
  assert.equal(PGG_TOKEN_USAGE_RECORD_SCHEMA_EXAMPLE.filePath, "string");
  assert.equal(PGG_TOKEN_USAGE_RECORD_SCHEMA_EXAMPLE.operation, "modified");
});

test("generated Skill docs include completion, token, workspace, git, version, branch, and QA contracts", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-common-skill-docs-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const addSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-add/SKILL.md"), "utf8");
      const planSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-plan/SKILL.md"), "utf8");
      const codeSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-code/SKILL.md"), "utf8");
      const performanceSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-performance/SKILL.md"), "utf8");
      const qaSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-qa/SKILL.md"), "utf8");
      const manifest = await readManifest(rootDir);

      assert.match(addSkill, /## Common Skill Definition/);
      assert.match(addSkill, /pgg-add는 요구사항을 발견하고 명세화하는 Skill/);
      assert.match(addSkill, /## 코드 작성 금지/);
      assert.match(addSkill, /구현 코드, 테스트 코드, 마이그레이션, 설정 변경을 작성하지 않는다/);
      assert.match(addSkill, /## topic_name 생성/);
      assert.match(addSkill, /lowercase kebab-case/);
      assert.match(addSkill, /login-flow/);
      assert.match(addSkill, /auth-session-refresh/);
      assert.match(addSkill, /checkout-payment-validation/);
      assert.match(addSkill, /## POGGN active workspace 생성/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/state\.json/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/pgg-add\/requirements\.md/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/pgg-add\/acceptance-criteria\.md/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(addSkill, /## version 결정/);
      assert.match(addSkill, /package\.json/);
      assert.match(addSkill, /currentVersion, targetVersion, bumpType, convention, reason, versionSource/);
      assert.match(addSkill, /## pgg git mode/);
      assert.match(addSkill, /pgg\/working\/\{topic_name\}/);
      assert.match(addSkill, /## auto off 동작/);
      assert.match(addSkill, /한 번에 최대 5개의 질문/);
      assert.match(addSkill, /## auto on 동작/);
      assert.match(addSkill, /가정, 불확실성, 선택 이유/);
      assert.match(addSkill, /## 소크라테스식 질문/);
      assert.match(addSkill, /이 기능의 최소 동작은 무엇인가요/);
      assert.match(addSkill, /## 승인 게이트/);
      assert.match(addSkill, /## 필수 출력 섹션/);
      assert.match(addSkill, /## Acceptance Criteria 초안 작성 규칙/);
      assert.match(addSkill, /## commit 규칙/);
      assert.match(addSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(addSkill, /## pgg-performance 유도/);
      assert.match(addSkill, /#### auto off/);
      assert.match(addSkill, /### Token Accounting Requirements/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(addSkill, /### Next Flow Routing/);
      assert.match(addSkill, /다음 flow를 실행하세요: pgg-plan/);
      assert.match(addSkill, /다음 flow를 실행하세요: pgg-add/);
      assert.match(addSkill, /### POGGN Workspace Requirements/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}/);
      assert.match(addSkill, /### Git Mode Requirements/);
      assert.match(addSkill, /pgg git = off/);
      assert.match(addSkill, /### Branch Lifecycle Requirements/);
      assert.match(addSkill, /pgg\/working\/\{topic_name\}/);
      assert.match(addSkill, /### Versioning Requirements/);
      assert.match(addSkill, /x\.x\.x/);
      assert.match(addSkill, /### Commit Message Requirements/);
      assert.match(addSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(addSkill, /### Archive Requirements/);
      assert.match(addSkill, /poggn\/archive\/\{topic_name\}/);
      assert.match(planSkill, /## Common Skill Definition/);
      assert.match(planSkill, /pgg-plan`은 승인된 `pgg-add` 요구사항과 설계를 상세한 구현 계획/);
      assert.match(planSkill, /## 진입 조건/);
      assert.match(planSkill, /pgg-add` 산출물이 승인된 뒤에만 진행/);
      assert.match(planSkill, /poggn\/active\/\{topic_name\}\/state\.json/);
      assert.match(planSkill, /## active workspace 사용/);
      assert.match(planSkill, /poggn\/active\/\{topic_name\}\/pgg-plan\//);
      assert.match(planSkill, /## 검증 전략|검증 전략/);
      assert.match(planSkill, /test plan/);
      assert.match(planSkill, /생성할 테스트 목록/);
      assert.match(planSkill, /성공\/실패 기준/);
      assert.match(planSkill, /경계값\/예외\/회귀\/성능 기준/);
      assert.match(planSkill, /## Version Plan/);
      assert.match(planSkill, /currentVersion, targetVersion, bumpType, convention, versionReason, versionSource/);
      assert.match(planSkill, /update project version/);
      assert.match(planSkill, /package\.json.*targetVersion/);
      assert.match(planSkill, /## task 규칙/);
      assert.match(planSkill, /2~5분/);
      assert.match(planSkill, /정확한 파일 경로/);
      assert.match(planSkill, /완전한 코드/);
      assert.match(planSkill, /검증 단계/);
      assert.match(planSkill, /예상 결과/);
      assert.match(planSkill, /실패 시 확인할 항목/);
      assert.match(planSkill, /적절히 구현/);
      assert.match(planSkill, /필요한 로직 추가/);
      assert.match(planSkill, /일반적인 방식으로 처리/);
      assert.match(planSkill, /## pgg-performance 유도 조건/);
      assert.match(planSkill, /응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수/);
      assert.match(planSkill, /baseline 또는 baseline 측정 방법/);
      assert.match(planSkill, /### Completion Message Contract/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-add/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-plan/);
      assert.match(planSkill, /### Token Accounting Requirements/);
      assert.match(planSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(planSkill, /## commit 규칙/);
      assert.match(planSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(planSkill, /### Next Flow Routing/);
      assert.match(codeSkill, /## Common Skill Definition/);
      assert.match(codeSkill, /### Completion Message Contract/);
      assert.match(codeSkill, /# PGG Flow 완료 보고서/);
      assert.match(codeSkill, /다음 flow를 실행하세요: <next-flow-id>/);
      assert.match(codeSkill, /### Token Accounting Requirements/);
      assert.match(codeSkill, /contentSha256/);
      assert.match(codeSkill, /### Next Flow Routing/);
      assert.match(codeSkill, /pgg-refactor/);
      assert.match(performanceSkill, /name: "pgg-performance"/);
      assert.match(performanceSkill, /### Performance Trigger Guidance/);
      assert.match(performanceSkill, /pgg-performanc/);
      assert.match(qaSkill, /### QA Requirements/);
      assert.match(qaSkill, /generated docs/);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-add/SKILL.md"), true);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-performance/SKILL.md"), true);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("teams mode controls managed Codex multi-agent config and two-agent routing", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-agent-routing-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const disabledConfig = await readFile(path.join(rootDir, CODEX_CONFIG_PATH), "utf8");
      const agentRouting = await readFile(path.join(rootDir, AGENT_ROUTING_PATH), "utf8");
      const routing = await readFile(path.join(rootDir, ".codex/add/EXPERT-ROUTING.md"), "utf8");
      const codeSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-code/SKILL.md"), "utf8");
      const statePack = await readFile(path.join(rootDir, STATE_PACK_PATH), "utf8");
      const initialManifest = await readManifest(rootDir);

      assert.match(disabledConfig, /\[features\]\nmulti_agent = false/);
      assert.match(disabledConfig, /\[agents\]\nmax_threads = 4\nmax_depth = 1/);
      assert.equal(existsSync(path.join(rootDir, CODEX_AGENTS_DIR, "main.toml")), false);
      assert.match(agentRouting, /flow = "pgg-code"\nprimary_agents = \["senior-backend-engineer", "tech-lead"\]/);
      assert.match(agentRouting, /roles = \["project-generalist", "docs-researcher"\]/);
      assert.match(routing, /`pgg-code`: 시니어 백엔드 엔지니어, 테크 리드/);
      assert.doesNotMatch(routing, /`pgg-code`: .*Code Reviewer/);
      assert.match(codeSkill, /아래 2개 primary agent/);
      assert.match(codeSkill, /- 시니어 백엔드 엔지니어: 주 구현 작업/);
      assert.match(codeSkill, /- 테크 리드: 아키텍처 가드레일과 통합 판단/);
      assert.doesNotMatch(codeSkill, /- 코드 리뷰어: 버그와 회귀 관점 검토/);
      assert.match(statePack, /implementation\|code\|pgg-code\)/);
      assert.match(statePack, /PRIMARY_AGENTS="senior-backend-engineer,tech-lead"/);
      assert.match(statePack, /token\|pgg-token\)/);
      assert.match(statePack, /PRIMARY_AGENTS="tech-lead,code-reviewer"/);
      assert.match(statePack, /agent_routing_ref: \.codex\/add\/AGENT-ROUTING\.toml/);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === CODEX_CONFIG_PATH), true);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === AGENT_ROUTING_PATH), true);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === `${CODEX_AGENTS_DIR}/main.toml`), false);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === "agents/main.toml"), false);

      await updateProjectTeamsMode(rootDir, "on");

      const enabledConfig = await readFile(path.join(rootDir, CODEX_CONFIG_PATH), "utf8");
      const updatedManifest = await readManifest(rootDir);

      assert.match(enabledConfig, /\[features\]\nmulti_agent = true/);
      assert.equal(updatedManifest.teamsMode, "on");
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === codexAgentRolePath("docs-researcher")), true);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === codexAgentRolePath("qa-test-engineer")), true);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === `${CODEX_AGENTS_DIR}/main.toml`), false);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("generated Codex custom agents use the supported standalone schema", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-custom-agent-schema-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      for (const roleId of GENERATED_AGENT_ROLE_IDS) {
        const roleToml = await readFile(path.join(rootDir, codexAgentRolePath(roleId)), "utf8");
        assert.match(roleToml, /^name = "[a-z_]+"/m);
        assert.match(roleToml, /^description = "/m);
        assert.match(roleToml, /^developer_instructions = """/m);
        assert.doesNotMatch(roleToml, /^id = /m);
        assert.doesNotMatch(roleToml, /^category = /m);
        assert.doesNotMatch(roleToml, /^purpose = /m);
        assert.doesNotMatch(roleToml, /^when_to_use = /m);
        assert.doesNotMatch(roleToml, /^input_contract = /m);
        assert.doesNotMatch(roleToml, /^output_contract = /m);
        assert.doesNotMatch(roleToml, /^constraints = /m);
        assert.doesNotMatch(roleToml, /^forbidden_actions = /m);
        assert.doesNotMatch(roleToml, /^handoff = /m);
      }

      const productManager = await readFile(path.join(rootDir, codexAgentRolePath("product-manager")), "utf8");
      const docsResearcher = await readFile(path.join(rootDir, codexAgentRolePath("docs-researcher")), "utf8");

      assert.match(productManager, /name = "product_manager"/);
      assert.match(productManager, /프로덕트 매니저/);
      assert.match(productManager, /주요 에이전트 목록/);
      assert.match(docsResearcher, /name = "docs_researcher"/);
      assert.match(docsResearcher, /지원 에이전트/);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("project language changes update generated agent and routing text", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-agent-language-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const koreanAgent = await readFile(path.join(rootDir, codexAgentRolePath("product-manager")), "utf8");
      const koreanRouting = await readFile(path.join(rootDir, ".codex/add/EXPERT-ROUTING.md"), "utf8");
      assert.match(koreanAgent, /프로덕트 매니저/);
      assert.match(koreanAgent, /사용자 문제/);
      assert.match(koreanRouting, /`pgg-add`: 프로덕트 매니저, UX\/UI 전문가/);

      await updateProjectLanguage(rootDir, "en");

      const englishAgent = await readFile(path.join(rootDir, codexAgentRolePath("product-manager")), "utf8");
      const englishRouting = await readFile(path.join(rootDir, ".codex/add/EXPERT-ROUTING.md"), "utf8");
      const updatedManifest = await readManifest(rootDir);

      assert.match(englishAgent, /Product Manager/);
      assert.match(englishAgent, /Frame the user problem/);
      assert.doesNotMatch(englishAgent, /사용자 문제/);
      assert.match(englishRouting, /`pgg-add`: Product Manager, UX\/UI Expert/);
      assert.equal(updatedManifest.language, "en");
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === AGENT_ROUTING_PATH), true);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("generated workflow docs and pgg comment rules follow project language", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-language-contract-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const koreanWorkflow = await readFile(path.join(rootDir, ".codex/add/WOKR-FLOW.md"), "utf8");
      const koreanRubric = await readFile(path.join(rootDir, ".codex/add/REVIEW-RUBRIC.md"), "utf8");
      const koreanCodeSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-code/SKILL.md"), "utf8");

      assert.match(koreanWorkflow, /pgg가 생성하거나 수정하는 코드 주석은 `pgg lang`을 따르/);
      assert.match(koreanRubric, /코드 주석이 `pgg lang`을 따르는지 확인한다/);
      assert.match(koreanCodeSkill, /## Language Contract/);
      assert.match(koreanCodeSkill, /pgg-managed 코드 주석은 `pgg lang`을 따른다/);
      assert.doesNotMatch(koreanCodeSkill, /pgg-managed code comments created or modified/);

      await updateProjectLanguage(rootDir, "en");

      const englishWorkflow = await readFile(path.join(rootDir, ".codex/add/WOKR-FLOW.md"), "utf8");
      const englishRubric = await readFile(path.join(rootDir, ".codex/add/REVIEW-RUBRIC.md"), "utf8");
      const englishCodeSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-code/SKILL.md"), "utf8");

      assert.match(englishWorkflow, /pgg-generated or pgg-modified code comments must follow `pgg lang`/);
      assert.match(englishRubric, /code comments follow `pgg lang`/);
      assert.match(englishCodeSkill, /## Language Contract/);
      assert.match(englishCodeSkill, /pgg-managed code comments created or modified by this skill follow `pgg lang`/);
      assert.doesNotMatch(englishCodeSkill, /pgg-managed 코드 주석은 `pgg lang`을 따른다/);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("new topic helper localizes generated workflow document skeletons", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-topic-language-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      execFileSync(path.join(rootDir, ".codex/sh/pgg-new-topic.sh"), ["english-topic", "on", "feat", "minor"], {
        encoding: "utf8"
      });

      const englishTopicDir = path.join(rootDir, "poggn/active/english-topic");
      const englishProposal = await readFile(path.join(englishTopicDir, "proposal.md"), "utf8");
      const englishReview = await readFile(path.join(englishTopicDir, "reviews/proposal.review.md"), "utf8");
      const englishState = await readFile(path.join(englishTopicDir, "state/current.md"), "utf8");

      assert.match(englishProposal, /## 1\. Title/);
      assert.match(englishProposal, /## 2\. Change Classification/);
      assert.match(englishProposal, /## 3\. User Input Question Record/);
      assert.match(englishReview, /# Proposal Review/);
      assert.match(englishState, /# Current State/);
      assert.match(englishState, /## Goal/);
      assert.doesNotMatch(englishProposal, /사용자 입력 질문 기록/);

      await updateProjectLanguage(rootDir, "ko");
      execFileSync(path.join(rootDir, ".codex/sh/pgg-new-topic.sh"), ["korean-topic", "on", "fix", "patch"], {
        encoding: "utf8"
      });

      const koreanTopicDir = path.join(rootDir, "poggn/active/korean-topic");
      const koreanProposal = await readFile(path.join(koreanTopicDir, "proposal.md"), "utf8");
      const koreanReview = await readFile(path.join(koreanTopicDir, "reviews/proposal.review.md"), "utf8");
      const koreanState = await readFile(path.join(koreanTopicDir, "state/current.md"), "utf8");

      assert.match(koreanProposal, /## 1\. 제목/);
      assert.match(koreanProposal, /## 2\. 변경 분류/);
      assert.match(koreanProposal, /## 3\. 사용자 입력 질문 기록/);
      assert.match(koreanReview, /## 전문가 메모/);
      assert.match(koreanState, /# Current State/);
      assert.match(koreanState, /## Goal/);
      assert.doesNotMatch(koreanProposal, /User Input Question Record/);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("updateProject retires old managed root agents while preserving user-owned files", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-agent-path-migration-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const managedMain = "old managed main\n";
      const originalManagedRole = "old managed role\n";
      const modifiedManagedRole = "user modified role\n";

      await mkdir(path.join(rootDir, "agents"), { recursive: true });
      await writeFile(path.join(rootDir, "agents/main.toml"), managedMain, "utf8");
      await writeFile(path.join(rootDir, "agents/product-manager.toml"), modifiedManagedRole, "utf8");
      await writeFile(path.join(rootDir, "agents/custom.toml"), "user custom agent\n", "utf8");

      const manifest = await readManifest(rootDir);
      manifest.managedFiles = [
        ...manifest.managedFiles.filter((entry) => !entry.path.startsWith("agents/")),
        {
          path: "agents/main.toml",
          checksum: checksum(managedMain),
          executable: false
        },
        {
          path: "agents/product-manager.toml",
          checksum: checksum(originalManagedRole),
          executable: false
        }
      ];
      await writeFile(path.join(rootDir, ".pgg", "project.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

      const result = await updateProject(rootDir);
      const updatedManifest = await readManifest(rootDir);

      assert.equal(existsSync(path.join(rootDir, "agents/main.toml")), false);
      assert.equal(existsSync(path.join(rootDir, "agents/product-manager.toml")), false);
      assert.equal(existsSync(path.join(rootDir, "agents/custom.toml")), true);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === "agents/main.toml"), false);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === "agents/product-manager.toml"), false);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === AGENT_ROUTING_PATH), true);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === `${CODEX_AGENTS_DIR}/main.toml`), false);
      assert.equal(result.conflicts.some((conflict) => conflict.path === "agents/product-manager.toml"), true);
      assert.equal(
        existsSync(path.join(rootDir, result.conflicts.find((conflict) => conflict.path === "agents/product-manager.toml").backupPath)),
        true
      );
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
