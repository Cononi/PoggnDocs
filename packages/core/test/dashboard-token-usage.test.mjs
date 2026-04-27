import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildDashboardSnapshot, initializeProject } from "../dist/index.js";

async function writeTopicFile(topicDir, relativePath, content) {
  const target = path.join(topicDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
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

test("dashboard snapshots prefer topic token usage ledger attribution", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-token-ledger-"));
  const topic = "token-ledger-topic";
  const topicDir = path.join(rootDir, "poggn", "active", topic);

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      await writeTopicFile(
        topicDir,
        "proposal.md",
        [
          "---",
          "pgg:",
          `  topic: "${topic}"`,
          '  stage: "implementation"',
          '  status: "reviewed"',
          '  archive_type: "feat"',
          '  project_scope: "current-project"',
          "---",
          ""
        ].join("\n")
      );
      await writeTopicFile(
        topicDir,
        "state/current.md",
        ["# Current State", "", "## Topic", "", topic, "", "## Current Stage", "", "implementation", ""].join("\n")
      );
      await writeTopicFile(topicDir, "workflow.reactflow.json", JSON.stringify({ topic, nodes: [], edges: [] }, null, 2));
      await writeTopicFile(topicDir, "implementation/index.md", "# Implementation\n\nshort file content\n");
      await writeTopicFile(
        topicDir,
        "state/token-usage.ndjson",
        [
          JSON.stringify({
            ts: "2026-04-27T00:00:00Z",
            stage: "implementation",
            flow: "pgg-code",
            event: "file-created",
            artifact_path: "implementation/index.md",
            operation: "create",
            source: "llm",
            total_tokens: 31,
            estimated: false,
            measurement: "actual"
          }),
          JSON.stringify({
            ts: "2026-04-27T00:00:01Z",
            stage: "implementation",
            flow: "pgg-code",
            event: "file-created",
            artifact_path: "implementation/index.md",
            operation: "create",
            source: "local",
            total_tokens: 11,
            estimated: true,
            measurement: "estimated"
          })
        ].join("\n")
      );

      const snapshot = await buildDashboardSnapshot(rootDir);
      const project = snapshot.projects.find((entry) => entry.rootDir === rootDir);
      const topicSummary = project?.activeTopics.find((entry) => entry.name === topic);
      const implementationFile = topicSummary?.files.find((file) => file.relativePath === "implementation/index.md");

      assert.equal(topicSummary?.tokenUsage.source, "ledger");
      assert.equal(topicSummary?.tokenUsage.ledgerRecordCount, 2);
      assert.equal(topicSummary?.tokenUsage.total, 42);
      assert.equal(topicSummary?.tokenUsage.llmActualTokens, 31);
      assert.equal(topicSummary?.tokenUsage.localEstimatedTokens, 11);
      assert.equal(topicSummary?.tokenUsageRecords.length, 2);
      assert.equal(implementationFile?.tokenSource, "ledger");
      assert.equal(implementationFile?.llmActualTokens, 31);
      assert.equal(implementationFile?.localEstimatedTokens, 11);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
