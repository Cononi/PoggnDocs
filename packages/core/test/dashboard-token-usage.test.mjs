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
      const generatedReviewContent = "# Code Review\n\nLLM generated review content without provider usage metadata.\n";
      const generatedReviewEstimate = Math.ceil(Array.from(generatedReviewContent).length / 4);
      await writeTopicFile(topicDir, "reviews/code.review.md", generatedReviewContent);
      const generatedSourceContent = "export const generatedTokenSummary = true;\n";
      const generatedSourceEstimate = Math.ceil(Array.from(generatedSourceContent).length / 4);
      await writeTopicFile(rootDir, "packages/core/src/generated-token-summary.ts", generatedSourceContent);
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
            provider: "codex",
            model: "gpt-5",
            usage_metadata_available: true,
            input_tokens: 13,
            output_tokens: 18,
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
            source: "llm",
            total_tokens: 999,
            estimated: false,
            measurement: "unavailable",
            usage_metadata_available: false
          }),
          JSON.stringify({
            ts: "2026-04-27T00:00:02Z",
            stage: "implementation",
            flow: "pgg-code",
            event: "file-created",
            artifact_path: "implementation/index.md",
            operation: "create",
            source: "llm",
            total_tokens: 77,
            estimated: false,
            measurement: "actual",
            usage_metadata_available: false
          }),
          JSON.stringify({
            ts: "2026-04-27T00:00:03Z",
            stage: "implementation",
            flow: "pgg-code",
            event: "file-created",
            artifact_path: "reviews/code.review.md",
            operation: "create",
            source: "llm",
            total_tokens: 0,
            estimated: true,
            measurement: "unavailable",
            usage_metadata_available: false
          }),
          JSON.stringify({
            ts: "2026-04-27T00:00:04Z",
            stage: "implementation",
            flow: "pgg-code",
            event: "file-created",
            artifact_path: "packages/core/src/generated-token-summary.ts",
            operation: "create",
            source: "llm",
            total_tokens: 0,
            estimated: true,
            measurement: "unavailable",
            usage_metadata_available: false
          }),
          JSON.stringify({
            ts: "2026-04-27T00:00:05Z",
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
      const reviewFile = topicSummary?.files.find((file) => file.relativePath === "reviews/code.review.md");

      assert.equal(topicSummary?.tokenUsage.source, "ledger");
      assert.equal(topicSummary?.tokenUsage.ledgerRecordCount, 6);
      assert.equal(topicSummary?.tokenUsage.total, 119 + generatedReviewEstimate + generatedSourceEstimate);
      assert.equal(topicSummary?.tokenUsage.llmActualTokens, 108 + generatedReviewEstimate + generatedSourceEstimate);
      assert.equal(topicSummary?.tokenUsage.localEstimatedTokens, 11);
      assert.equal(topicSummary?.tokenUsageRecords.length, 6);
      assert.equal(topicSummary?.tokenUsageRecords[0]?.usageMetadataAvailable, true);
      assert.equal(topicSummary?.tokenUsageRecords[1]?.measurement, "unavailable");
      assert.equal(topicSummary?.tokenUsageRecords[1]?.usageMetadataAvailable, false);
      assert.equal(topicSummary?.tokenUsageRecords[2]?.measurement, "actual");
      assert.equal(topicSummary?.tokenUsageRecords[2]?.usageMetadataAvailable, false);
      assert.equal(implementationFile?.tokenSource, "ledger");
      assert.equal(implementationFile?.llmActualTokens, 108);
      assert.equal(implementationFile?.localEstimatedTokens, 11);
      assert.equal(reviewFile?.tokenSource, "ledger");
      assert.equal(reviewFile?.llmActualTokens, generatedReviewEstimate);
      assert.equal(reviewFile?.localEstimatedTokens, 0);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
