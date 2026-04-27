import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildRootReadme,
  initializeProject,
  updateProject,
  updateProjectLanguage,
  updateProjectTeamsMode
} from "../dist/index.js";

const STANDALONE_SKILL_PATH = ".codex/skills/pgg-status/SKILL.md";
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

test("initializeProject and updateProject keep the standalone pgg-status skill managed", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-skill-generation-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const initialSkill = await readFile(path.join(rootDir, STANDALONE_SKILL_PATH), "utf8");
      const initialWorkflow = await readFile(path.join(rootDir, ".codex/add/WOKR-FLOW.md"), "utf8");
      const initialStateContract = await readFile(path.join(rootDir, ".codex/add/STATE-CONTRACT.md"), "utf8");
      const initialReadme = buildRootReadme();
      const initialManifest = await readManifest(rootDir);

      assert.match(initialSkill, /name: "pgg-status"/);
      assert.match(initialSkill, /현재 active topic 상태를 읽고/);
      assert.match(initialWorkflow, /\{convention\}: \{version\}\.\{commit message\}/);
      assert.match(initialStateContract, /pgg lang=ko/);
      assert.match(initialReadme, /\{convention\}: \{version\}\.\{commit message\}/);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === STANDALONE_SKILL_PATH), true);

      await writeFile(
        path.join(rootDir, "poggn", "version-history.ndjson"),
        `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`,
        "utf8"
      );

      await updateProject(rootDir);

      const updatedSkill = await readFile(path.join(rootDir, STANDALONE_SKILL_PATH), "utf8");
      const updatedManifest = await readManifest(rootDir);
      const ledger = await readFile(path.join(rootDir, "poggn", "version-history.ndjson"), "utf8");

      assert.equal(updatedSkill, initialSkill);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === STANDALONE_SKILL_PATH), true);
      assert.equal(ledger, `${JSON.stringify({ topic: "seed", changeType: "feat", version: "0.1.0" })}\n`);
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
      assert.match(productManager, /primary agent roster/);
      assert.match(docsResearcher, /name = "docs_researcher"/);
      assert.match(docsResearcher, /support agent/);
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
