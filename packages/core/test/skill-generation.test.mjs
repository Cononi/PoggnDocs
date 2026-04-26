import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildRootReadme, initializeProject, updateProject, updateProjectTeamsMode } from "../dist/index.js";

const STANDALONE_SKILL_PATH = ".codex/skills/pgg-status/SKILL.md";
const CODEX_CONFIG_PATH = ".codex/config.toml";
const AGENTS_MAIN_PATH = "agents/main.toml";
const STATE_PACK_PATH = ".codex/sh/pgg-state-pack.sh";

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
      const agentsMain = await readFile(path.join(rootDir, AGENTS_MAIN_PATH), "utf8");
      const routing = await readFile(path.join(rootDir, ".codex/add/EXPERT-ROUTING.md"), "utf8");
      const codeSkill = await readFile(path.join(rootDir, ".codex/skills/pgg-code/SKILL.md"), "utf8");
      const statePack = await readFile(path.join(rootDir, STATE_PACK_PATH), "utf8");
      const initialManifest = await readManifest(rootDir);

      assert.match(disabledConfig, /\[features\]\nmulti_agent = false/);
      assert.match(disabledConfig, /\[agents\]\nmax_threads = 4\nmax_depth = 1/);
      assert.match(agentsMain, /flow = "pgg-code"\nprimary_agents = \["senior-backend-engineer", "tech-lead"\]/);
      assert.match(agentsMain, /roles = \["project-generalist", "docs-researcher"\]/);
      assert.match(routing, /`pgg-code`: Senior Backend Engineer, Tech Lead/);
      assert.doesNotMatch(routing, /`pgg-code`: .*Code Reviewer/);
      assert.match(codeSkill, /아래 2개 primary agent/);
      assert.match(codeSkill, /- 시니어 백엔드 엔지니어: 주 구현 작업/);
      assert.match(codeSkill, /- 테크 리드: 아키텍처 가드레일과 통합 판단/);
      assert.doesNotMatch(codeSkill, /- 코드 리뷰어: 버그와 회귀 관점 검토/);
      assert.match(statePack, /implementation\|code\|pgg-code\)/);
      assert.match(statePack, /PRIMARY_AGENTS="senior-backend-engineer,tech-lead"/);
      assert.match(statePack, /token\|pgg-token\)/);
      assert.match(statePack, /PRIMARY_AGENTS="tech-lead,code-reviewer"/);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === CODEX_CONFIG_PATH), true);
      assert.equal(initialManifest.managedFiles.some((entry) => entry.path === AGENTS_MAIN_PATH), true);

      await updateProjectTeamsMode(rootDir, "on");

      const enabledConfig = await readFile(path.join(rootDir, CODEX_CONFIG_PATH), "utf8");
      const updatedManifest = await readManifest(rootDir);

      assert.match(enabledConfig, /\[features\]\nmulti_agent = true/);
      assert.equal(updatedManifest.teamsMode, "on");
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === "agents/docs-researcher.toml"), true);
      assert.equal(updatedManifest.managedFiles.some((entry) => entry.path === "agents/qa-test-engineer.toml"), true);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
