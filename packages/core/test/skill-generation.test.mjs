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
    if (skillId === "pgg-code") {
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-refactor/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-performance/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
    } else if (skillId === "pgg-refactor") {
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-qa/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-performance/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-refactor/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
    } else {
      assert.match(definition.completionMessageContract.ko.join("\n"), /PGG Flow 완료 보고서/);
      assert.match(definition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: <next-flow-id>/);
    }
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

  const codeDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-code"];
  assert.match(codeDefinition.purpose.ko.join("\n"), /테스트 우선 구현, 실패 분석, 수정, 재검증/);
  assert.match(codeDefinition.inputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/state\.json/);
  assert.match(codeDefinition.outputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-code\//);
  assert.match(codeDefinition.absoluteRules.ko.join("\n"), /실제 테스트 코드 생성, 실제 구현 코드 작성, 테스트 실행, 실패 로그 분석, 수정 후 재실행, project version bump 적용, verify 수행/);
  assert.match(codeDefinition.modeSpecificBehavior.teamsOn.ko.join("\n"), /메인 에이전트가 모든 코드를 직접 작성하지 않고/);
  assert.match(codeDefinition.modeSpecificBehavior.teamsOn.ko.join("\n"), /깨끗한 context/);
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "필수 실행 순서"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "task 단위 실행 순서"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "Review 1: 명세 준수"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "Review 2: 코드 품질"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "Project Version Bump"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "task별 git commit 규칙"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "Token Accounting"));
  assert.ok(codeDefinition.additionalGuidance?.some((section) => section.title.ko === "pgg-performance 유도 조건"));
  assert.match(codeDefinition.versioningRequirements.ko.join("\n"), /package\.json.*targetVersion/);
  assert.match(codeDefinition.versioningRequirements.ko.join("\n"), /projectVersionUpdated, versionSource, currentVersion, targetVersion/);
  assert.match(codeDefinition.commitMessageRequirements.ko.join("\n"), /pgg git = on이고 git 저장소/);
  assert.match(codeDefinition.commitMessageRequirements.ko.join("\n"), /pgg git = off 또는 git 저장소 없음이면 commit하지 않고/);
  assert.match(codeDefinition.commitMessageRequirements.ko.join("\n"), /token 기록 후 commit 순서/);
  assert.match(codeDefinition.gitModeRequirements.ko.join("\n"), /git rev-parse --is-inside-work-tree/);
  assert.match(codeDefinition.gitModeRequirements.ko.join("\n"), /pgg git = off/);
  assert.match(codeDefinition.gitModeRequirements.ko.join("\n"), /git 저장소가 없으면 task commit을 생략/);
  assert.match(codeDefinition.tokenAccountingRequirements.ko.join("\n"), /task commit 전에 완료/);
  assert.match(codeDefinition.tokenAccountingRequirements.ko.join("\n"), /commitSha/);
  assert.match(codeDefinition.performanceTriggerGuidance.ko.join("\n"), /대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기/);
  assert.match(codeDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-refactor/);
  assert.match(codeDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-performance/);
  assert.match(codeDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
  assert.match(codeDefinition.nextFlowRouting.ko.join("\n"), /기본 정상 완료/);
  assert.match(codeDefinition.nextFlowRouting.ko.join("\n"), /성능 측정 필요/);
  assert.match(codeDefinition.nextFlowRouting.ko.join("\n"), /실패 또는 미완료/);
  assert.match(codeDefinition.generatedDocumentationSections.ko.join("\n"), /task별 git commit 규칙/);
  assert.match(codeDefinition.generatedDocumentationSections.ko.join("\n"), /pgg git off일 때 commit 생략/);
  assert.match(codeDefinition.generatedDocumentationSections.ko.join("\n"), /git 저장소가 없을 때 commit 생략 기록/);
  assert.match(codeDefinition.generatedDocumentationSections.ko.join("\n"), /completion message 규격/);

  const refactorDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-refactor"];
  assert.match(refactorDefinition.purpose.ko.join("\n"), /기능 변경 없이 코드 구조를 개선/);
  assert.match(refactorDefinition.triggerConditions.ko.join("\n"), /pgg-add.*pgg-plan.*pgg-code.*pgg-refactor.*pgg-qa/);
  assert.match(refactorDefinition.outputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-refactor\//);
  assert.match(refactorDefinition.absoluteRules.ko.join("\n"), /동작 변경 금지/);
  assert.match(refactorDefinition.absoluteRules.ko.join("\n"), /before \/ after 결과는 동일/);
  assert.match(refactorDefinition.absoluteRules.ko.join("\n"), /새로운 feature를 추가하지 않는다/);
  assert.match(refactorDefinition.absoluteRules.ko.join("\n"), /Acceptance Criteria를 변경하지 않는다/);
  assert.match(refactorDefinition.absoluteRules.ko.join("\n"), /verification은 필수/);
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "필수 workflow"));
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "필수 개선 범주"));
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "before / after 동일성"));
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "diff inspection"));
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "pgg-performance 유도 조건"));
  assert.ok(refactorDefinition.additionalGuidance?.some((section) => section.title.ko === "완료 산출물"));
  assert.match(refactorDefinition.performanceTriggerGuidance.ko.join("\n"), /알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기/);
  assert.match(refactorDefinition.performanceTriggerGuidance.ko.join("\n"), /before \/ after 성능 비교/);
  assert.match(refactorDefinition.performanceTriggerGuidance.ko.join("\n"), /pgg-qa에서 성능 근거 부족/);
  assert.match(refactorDefinition.tokenAccountingRequirements.ko.join("\n"), /before \/ after 비교 파일 또는 diff report 파일/);
  assert.match(refactorDefinition.commitMessageRequirements.ko.join("\n"), /refactor\. 1\.3\.1 simplify login validation structure/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /refactor 대상/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /diff inspection 결과/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-qa/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-performance/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-refactor/);
  assert.match(refactorDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
  assert.match(refactorDefinition.nextFlowRouting.ko.join("\n"), /정상 완료/);
  assert.match(refactorDefinition.nextFlowRouting.ko.join("\n"), /성능 재측정 필요/);
  assert.match(refactorDefinition.nextFlowRouting.ko.join("\n"), /refactor 실패 또는 동작 변경 발생/);
  assert.match(refactorDefinition.nextFlowRouting.ko.join("\n"), /구현 수정 필요/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /기본 flow 위치/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /동작 보존/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /before \/ after 동일성/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /feature change 금지/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /pgg-performance 유도 조건/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /completion message 규격/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /token accounting 규칙/);
  assert.match(refactorDefinition.generatedDocumentationSections.ko.join("\n"), /next flow routing/);

  assert.equal(PGG_SKILL_DEFINITION_BY_ID["pgg-performance"].id, "pgg-performance");
  assert.equal(PGG_SKILL_DEFINITION_BY_ID["pgg-performanc"].id, "pgg-performance");
  const performanceDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-performance"];
  assert.deepEqual(performanceDefinition.legacyAliases, ["pgg-performanc"]);
  assert.match(performanceDefinition.outputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-performance\/report\.md/);
  assert.match(performanceDefinition.triggerConditions.ko.join("\n"), /대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기/);
  assert.match(performanceDefinition.modeSpecificBehavior.autoOff.ko.join("\n"), /비용이 큰 benchmark나 장시간 테스트/);
  assert.match(performanceDefinition.modeSpecificBehavior.autoOn.ko.join("\n"), /합리적인 범위의 성능 측정/);
  assert.match(performanceDefinition.requiredPhases.ko.join("\n"), /성능 측정 필요성 판단/);
  assert.match(performanceDefinition.requiredPhases.ko.join("\n"), /baseline 확인/);
  assert.match(performanceDefinition.requiredPhases.ko.join("\n"), /성능 테스트 또는 benchmark 실행/);
  assert.match(performanceDefinition.absoluteRules.ko.join("\n"), /임의의 성능 수치를 만들어내지 않는다/);
  assert.match(performanceDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-refactor/);
  assert.match(performanceDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-qa/);
  assert.match(performanceDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-code/);
  assert.match(performanceDefinition.tokenAccountingRequirements.ko.join("\n"), /성능 측정 결과 파일이나 benchmark 결과 파일/);
  assert.match(performanceDefinition.nextFlowRouting.ko.join("\n"), /QA에서 성능 근거 부족/);
  assert.match(performanceDefinition.commitMessageRequirements.ko.join("\n"), /perf\. 1\.3\.1 measure login-flow performance baseline/);
  assert.match(performanceDefinition.generatedDocumentationSections.ko.join("\n"), /기본 flow와의 관계/);
  assert.match(performanceDefinition.generatedDocumentationSections.ko.join("\n"), /실행 조건/);
  assert.match(performanceDefinition.generatedDocumentationSections.ko.join("\n"), /completion message 규격/);
  assert.match(performanceDefinition.generatedDocumentationSections.ko.join("\n"), /token accounting 규칙/);
  assert.match(performanceDefinition.generatedDocumentationSections.ko.join("\n"), /next flow routing/);
  const qaDefinition = PGG_SKILL_DEFINITION_BY_ID["pgg-qa"];
  assert.match(qaDefinition.purpose.ko.join("\n"), /PGG Skill Framework의 최종 검증 Skill/);
  assert.match(qaDefinition.purpose.ko.join("\n"), /PASS 또는 FAIL/);
  assert.match(qaDefinition.inputs.ko.join("\n"), /TypeScript Skill 정의 파일과 generator 파일/);
  assert.match(qaDefinition.outputs.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-qa\/report\.md/);
  assert.match(qaDefinition.absoluteRules.ko.join("\n"), /generated Markdown을 직접 수정해서 통과시키면 안 된다/);
  assert.match(qaDefinition.absoluteRules.ko.join("\n"), /QA FAIL이면 archive 이동, release branch 전환, working branch 삭제, push를 수행하지 않는다/);
  assert.match(qaDefinition.requiredPhases.ko.join("\n"), /Source of Truth 검증/);
  assert.match(qaDefinition.requiredPhases.ko.join("\n"), /Skill Framework 검증/);
  assert.match(qaDefinition.requiredPhases.ko.join("\n"), /Flow completeness 검증/);
  assert.match(qaDefinition.requiredPhases.ko.join("\n"), /generator 2회 실행 안정성/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /pnpm build/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /pnpm build:readme/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /pnpm build:dashboard/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /pnpm test:core/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /typecheck/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /lint/);
  assert.match(qaDefinition.verificationRequirements.ko.join("\n"), /snapshot/);
  assert.match(qaDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: pgg-add/);
  assert.match(qaDefinition.completionMessageContract.ko.join("\n"), /다음 flow를 실행하세요: <실패한 flow-id>/);
  assert.match(qaDefinition.tokenAccountingRequirements.ko.join("\n"), /source: generator/);
  assert.match(qaDefinition.tokenAccountingRequirements.ko.join("\n"), /isEstimated/);
  assert.match(qaDefinition.tokenAccountingRequirements.ko.join("\n"), /commitSha/);
  assert.match(qaDefinition.poggnWorkspaceRequirements.ko.join("\n"), /poggn\/active\/\{topic_name\}\/pgg-qa\//);
  assert.match(qaDefinition.poggnWorkspaceRequirements.ko.join("\n"), /poggn\/archive\/\{topic_name\}/);
  assert.match(qaDefinition.versioningRequirements.ko.join("\n"), /currentVersion, targetVersion, bumpType, convention, reason, versionSource/);
  assert.match(qaDefinition.gitModeRequirements.ko.join("\n"), /git rev-parse --is-inside-work-tree/);
  assert.match(qaDefinition.branchLifecycleRequirements.ko.join("\n"), /release\/\{topic_name\}-v\{version\}/);
  assert.match(qaDefinition.commitMessageRequirements.ko.join("\n"), /pgg-code task별 commit/);
  assert.match(qaDefinition.commitMessageRequirements.ko.join("\n"), /task별 commit SHA/);
  assert.match(qaDefinition.archiveRequirements.ko.join("\n"), /remote가 있으면 release branch를 push/);
  assert.match(qaDefinition.qaRequirements.ko.join("\n"), /Source of Truth, Skill Framework, POGGN Workspace/);
  assert.match(qaDefinition.qaRequirements.ko.join("\n"), /pgg-code Task Commits/);
  assert.match(qaDefinition.qaRequirements.ko.join("\n"), /Archive \/ Release \/ Push/);
  assert.match(qaDefinition.qaRequirements.ko.join("\n"), /pgg-performance 검증/);
  assert.match(qaDefinition.generatedDocumentationSections.ko.join("\n"), /Source of Truth 검증/);
  assert.match(qaDefinition.generatedDocumentationSections.ko.join("\n"), /pgg-code task commit 검증/);
  assert.match(qaDefinition.generatedDocumentationSections.ko.join("\n"), /QA PASS 후 archive\/release\/push 절차/);
  assert.ok(qaDefinition.additionalGuidance?.some((section) => section.title.ko === "Source of Truth 검증"));
  assert.ok(qaDefinition.additionalGuidance?.some((section) => section.title.ko === "최종 QA Report 형식"));
  assert.ok(qaDefinition.additionalGuidance?.some((section) => section.title.ko === "기술 검증 명령"));
  assert.ok(qaDefinition.additionalGuidance?.some((section) => section.title.ko === "PASS/FAIL 기준"));
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
      const refactorSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-refactor/SKILL.md"), "utf8");
      const performanceSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-performance/SKILL.md"), "utf8");
      const qaSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-qa/SKILL.md"), "utf8");
      const manifest = await readManifest(rootDir);

      assert.match(addSkill, /## 공통 Skill 정의/);
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
      assert.match(addSkill, /### Token Accounting 요구사항/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(addSkill, /### 검증 요구사항/);
      assert.match(addSkill, /`topic_name`이 lowercase kebab-case/);
      assert.match(addSkill, /### 완료 메시지 규격/);
      assert.match(addSkill, /Flow ID, 상태, Mode, Teams Mode, PGG Git, Topic, Version/);
      assert.match(addSkill, /### Next Flow Routing/);
      assert.match(addSkill, /다음 flow를 실행하세요: pgg-plan/);
      assert.match(addSkill, /다음 flow를 실행하세요: pgg-add/);
      assert.match(addSkill, /### POGGN Workspace 요구사항/);
      assert.match(addSkill, /poggn\/active\/\{topic_name\}/);
      assert.match(addSkill, /### pgg git mode 요구사항/);
      assert.match(addSkill, /pgg git = off/);
      assert.match(addSkill, /### Branch Lifecycle 요구사항/);
      assert.match(addSkill, /pgg\/working\/\{topic_name\}/);
      assert.match(addSkill, /### Versioning 요구사항/);
      assert.match(addSkill, /x\.x\.x/);
      assert.match(addSkill, /### Commit Message 요구사항/);
      assert.match(addSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(addSkill, /### Archive 요구사항/);
      assert.match(addSkill, /poggn\/archive\/\{topic_name\}/);
      assert.match(addSkill, /### QA 요구사항/);
      assert.match(addSkill, /acceptance criteria, generated docs, tests, version, token accounting/);
      assert.match(addSkill, /### 생성 문서 섹션/);
      assert.match(addSkill, /completionMessageContract/);
      assert.match(planSkill, /## 공통 Skill 정의/);
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
      assert.match(planSkill, /### 완료 메시지 규격/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-add/);
      assert.match(planSkill, /다음 flow를 실행하세요: pgg-plan/);
      assert.match(planSkill, /### Token Accounting 요구사항/);
      assert.match(planSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(planSkill, /## commit 규칙/);
      assert.match(planSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(planSkill, /### Next Flow Routing/);
      assert.match(codeSkill, /## 공통 Skill 정의/);
      assert.match(codeSkill, /### 완료 메시지 규격/);
      assert.match(codeSkill, /다음 flow를 실행하세요: pgg-refactor/);
      assert.match(codeSkill, /다음 flow를 실행하세요: pgg-performance/);
      assert.match(codeSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(codeSkill, /### Token Accounting 요구사항/);
      assert.match(codeSkill, /contentSha256/);
      assert.match(codeSkill, /### Next Flow Routing/);
      assert.match(codeSkill, /pgg-refactor/);
      assert.match(codeSkill, /pgg-code`는 승인된 `pgg-plan`을 기반으로 테스트 우선 구현/);
      assert.match(codeSkill, /poggn\/active\/\{topic_name\}\/state\.json/);
      assert.match(codeSkill, /poggn\/active\/\{topic_name\}\/pgg-code\//);
      assert.match(codeSkill, /## 필수 실행 순서/);
      assert.match(codeSkill, /실제 테스트 코드를 생성한다/);
      assert.match(codeSkill, /실패 로그를 분석한다/);
      assert.match(codeSkill, /수정 후 테스트를 재실행한다/);
      assert.match(codeSkill, /## task 단위 실행 순서/);
      assert.match(codeSkill, /## Review 1: 명세 준수/);
      assert.match(codeSkill, /Acceptance Criteria 만족 여부/);
      assert.match(codeSkill, /## Review 2: 코드 품질/);
      assert.match(codeSkill, /불필요한 dependency 여부/);
      assert.match(codeSkill, /메인 에이전트가 모든 코드를 직접 작성하지 않고/);
      assert.match(codeSkill, /특정 task, 관련 파일 경로, 관련 Acceptance Criteria, 필요한 검증 단계, version 정보만 받는다/);
      assert.match(codeSkill, /깨끗한 context/);
      assert.match(codeSkill, /## Project Version Bump/);
      assert.match(codeSkill, /package\.json` version을 targetVersion으로 수정/);
      assert.match(codeSkill, /projectVersionUpdated, versionSource, currentVersion, targetVersion/);
      assert.match(codeSkill, /## task별 git commit 규칙/);
      assert.match(codeSkill, /git rev-parse --is-inside-work-tree/);
      assert.match(codeSkill, /pgg git = on이고 git 저장소/);
      assert.match(codeSkill, /pgg git = off이면 commit하지 않고 완료 메시지에 생략 사유/);
      assert.match(codeSkill, /git 저장소가 아니면 commit하지 않고 완료 메시지에 생략 사유/);
      assert.match(codeSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(codeSkill, /PGG-Flow: pgg-code/);
      assert.match(codeSkill, /push는 하지 않는다/);
      assert.match(codeSkill, /## Token Accounting/);
      assert.match(codeSkill, /token 기록은 task commit 전에 완료/);
      assert.match(codeSkill, /commitSha/);
      assert.match(codeSkill, /대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기/);
      assert.match(codeSkill, /docs generation을 재실행해 안정성을 확인/);
      assert.match(codeSkill, /다음 flow를 실행하세요: pgg-performance/);
      assert.match(codeSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(refactorSkill, /name: "pgg-refactor"/);
      assert.match(refactorSkill, /기능 변경 없이 코드 구조를 개선하는 Skill/);
      assert.match(refactorSkill, /poggn\/active\/\{topic_name\}\/pgg-refactor\//);
      assert.match(refactorSkill, /## 기본 flow 위치/);
      assert.match(refactorSkill, /pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa/);
      assert.match(refactorSkill, /## 절대 규칙/);
      assert.match(refactorSkill, /동작 변경 금지/);
      assert.match(refactorSkill, /before \/ after 결과는 동일/);
      assert.match(refactorSkill, /새로운 feature를 추가하지 않는다/);
      assert.match(refactorSkill, /Acceptance Criteria를 변경하지 않는다/);
      assert.match(refactorSkill, /verification은 필수/);
      assert.match(refactorSkill, /## 필수 개선 범주/);
      assert.match(refactorSkill, /구조 개선/);
      assert.match(refactorSkill, /중복 제거/);
      assert.match(refactorSkill, /성능 개선 또는 성능 영향 여부/);
      assert.match(refactorSkill, /가독성 분리/);
      assert.match(refactorSkill, /책임 분리/);
      assert.match(refactorSkill, /## 필수 workflow/);
      assert.match(refactorSkill, /현재 동작을 캡처하거나 정의한다/);
      assert.match(refactorSkill, /refactor 전 기존 테스트를 실행/);
      assert.match(refactorSkill, /refactor 후 동일한 테스트를 다시 실행/);
      assert.match(refactorSkill, /diff를 확인하여 feature change가 없는지 검토/);
      assert.match(refactorSkill, /## before \/ after 동일성/);
      assert.match(refactorSkill, /## diff inspection/);
      assert.match(refactorSkill, /generated Markdown을 직접 수정하지 않았는지 확인/);
      assert.match(refactorSkill, /알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기/);
      assert.match(refactorSkill, /## Token Accounting/);
      assert.match(refactorSkill, /before \/ after 비교 파일 또는 diff report 파일/);
      assert.match(refactorSkill, /## Commit 규칙/);
      assert.match(refactorSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(refactorSkill, /refactor\. 1\.3\.1 simplify login validation structure/);
      assert.match(refactorSkill, /### 완료 메시지 규격/);
      assert.match(refactorSkill, /refactor 대상/);
      assert.match(refactorSkill, /diff inspection 결과/);
      assert.match(refactorSkill, /다음 flow를 실행하세요: pgg-qa/);
      assert.match(refactorSkill, /다음 flow를 실행하세요: pgg-performance/);
      assert.match(refactorSkill, /다음 flow를 실행하세요: pgg-refactor/);
      assert.match(refactorSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(refactorSkill, /### Next Flow Routing/);
      assert.match(performanceSkill, /name: "pgg-performance"/);
      assert.match(performanceSkill, /# Skill: pgg-performance/);
      assert.match(performanceSkill, /poggn\/active\/\{topic_name\}\/pgg-performance\//);
      assert.match(performanceSkill, /## 기본 flow와의 관계/);
      assert.match(performanceSkill, /## 실행 조건/);
      assert.match(performanceSkill, /## 필수 단계/);
      assert.match(performanceSkill, /성능 측정 필요성 판단/);
      assert.match(performanceSkill, /측정 대상/);
      assert.match(performanceSkill, /측정 지표/);
      assert.match(performanceSkill, /baseline/);
      assert.match(performanceSkill, /측정 방법/);
      assert.match(performanceSkill, /benchmark 실행/);
      assert.match(performanceSkill, /결과 비교/);
      assert.match(performanceSkill, /성능 기준 통과 여부/);
      assert.match(performanceSkill, /실제 측정 없이 성능이 좋아졌다고 말하지 않는다/);
      assert.match(performanceSkill, /다음 flow를 실행하세요: pgg-refactor/);
      assert.match(performanceSkill, /다음 flow를 실행하세요: pgg-qa/);
      assert.match(performanceSkill, /다음 flow를 실행하세요: pgg-code/);
      assert.match(performanceSkill, /성능 측정 결과 파일이나 benchmark 결과 파일/);
      assert.match(performanceSkill, /perf\. 1\.3\.1 measure login-flow performance baseline/);
      assert.match(performanceSkill, /next flow routing/);
      assert.match(performanceSkill, /### 성능 측정 유도 기준/);
      assert.match(performanceSkill, /pgg-performance/);
      assert.match(performanceSkill, /pgg-performanc/);
      assert.match(qaSkill, /name: "pgg-qa"/);
      assert.match(qaSkill, /PGG Skill Framework의 최종 검증 Skill/);
      assert.match(qaSkill, /## 필수 검증 영역/);
      assert.match(qaSkill, /Source of Truth/);
      assert.match(qaSkill, /Skill Framework/);
      assert.match(qaSkill, /POGGN Workspace/);
      assert.match(qaSkill, /Git Mode \/ Branch Lifecycle/);
      assert.match(qaSkill, /pgg-code Task Commits/);
      assert.match(qaSkill, /Archive \/ Release \/ Push/);
      assert.match(qaSkill, /## Source of Truth/);
      assert.match(qaSkill, /TypeScript Skill 정의가 source of truth/);
      assert.match(qaSkill, /generator를 두 번 실행/);
      assert.match(qaSkill, /## 기술 검증/);
      assert.match(qaSkill, /typecheck, lint, test, snapshot test, docs generation, build/);
      assert.match(qaSkill, /node packages\/cli\/dist\/index\.js update/);
      assert.match(qaSkill, /### Source of Truth 검증/);
      assert.match(qaSkill, /packages\/core\/src\/skill-framework\/registry\.ts/);
      assert.match(qaSkill, /### 최종 QA Report 형식/);
      assert.match(qaSkill, /\| Area \| Pass\/Fail \| Evidence \|/);
      assert.match(qaSkill, /### 기술 검증 명령/);
      assert.match(qaSkill, /pnpm build:dashboard/);
      assert.match(qaSkill, /pnpm verify:version-history/);
      assert.match(qaSkill, /### PASS\/FAIL 기준/);
      assert.match(qaSkill, /### QA 요구사항/);
      assert.match(qaSkill, /generated Markdown/);
      assert.match(qaSkill, /poggn\/active\/\{topic_name\}\/pgg-qa\//);
      assert.match(qaSkill, /poggn\/active\/\{topic_name\}\/metrics\/token-usage\.jsonl/);
      assert.match(qaSkill, /source: generator/);
      assert.match(qaSkill, /release\/\{topic_name\}-v\{version\}/);
      assert.match(qaSkill, /\{convention\}\. \{version\} \{message\}/);
      assert.match(qaSkill, /다음 flow를 실행하세요: pgg-add/);
      assert.match(qaSkill, /다음 flow를 실행하세요: <실패한 flow-id>/);
      assert.match(qaSkill, /pgg-performance 검증/);
      assert.match(qaSkill, /QA PASS 후 archive\/release\/push 절차/);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-add/SKILL.md"), true);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-refactor/SKILL.md"), true);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-performance/SKILL.md"), true);
      assert.equal(manifest.managedFiles.some((entry) => entry.path === ".codex/skills/pgg-qa/SKILL.md"), true);
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
