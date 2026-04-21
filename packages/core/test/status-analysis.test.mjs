import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { analyzeProjectStatus, initializeProject } from "../dist/index.js";

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

function proposalMarkdown(topic) {
  return [
    "---",
    "pgg:",
    `  topic: "${topic}"`,
    '  stage: "proposal"',
    '  status: "reviewed"',
    '  archive_type: "feat"',
    '  project_scope: "current-project"',
    "---",
    ""
  ].join("\n");
}

function stateMarkdown({
  topic,
  stage,
  blockingIssues = "없음",
  openStatus = "none",
  nextAction = "`pgg-code` 실행",
  tokenAudit = "not_required",
  tokenReason = "token audit not needed",
  performanceAudit = "not_required",
  performanceReason = "performance audit not needed"
}) {
  return [
    "# Current State",
    "",
    "## Topic",
    "",
    topic,
    "",
    "## Current Stage",
    "",
    stage,
    "",
    "## Goal",
    "",
    "status analysis fixture",
    "",
    "## Open Items",
    "",
    `- status: ${openStatus}`,
    "",
    "## Audit Applicability",
    "",
    `- \`pgg-token\`: \`${tokenAudit}\` | ${tokenReason}`,
    `- \`pgg-performance\`: \`${performanceAudit}\` | ${performanceReason}`,
    "",
    "## Last Expert Score",
    "",
    `- phase: ${stage}`,
    "- score: 95",
    `- blocking issues: ${blockingIssues}`,
    "",
    "## Next Action",
    "",
    nextAction,
    ""
  ].join("\n");
}

async function createTopic(rootDir, topic, files) {
  const topicDir = path.join(rootDir, "poggn", "active", topic);
  await mkdir(topicDir, { recursive: true });
  await writeTopicFile(topicDir, "proposal.md", proposalMarkdown(topic));
  await writeTopicFile(topicDir, "reviews/proposal.review.md", "# proposal.review\n");
  await writeTopicFile(topicDir, "workflow.reactflow.json", JSON.stringify({ topic, nodes: [], edges: [] }, null, 2));

  for (const [relativePath, content] of files) {
    await writeTopicFile(topicDir, relativePath, content);
  }
}

test("analyzeProjectStatus rejects uninitialized projects", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-missing-"));

  try {
    await assert.rejects(() => analyzeProjectStatus(rootDir), /Project is not initialized/);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProjectStatus returns an empty summary when no active topics exist", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-empty-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      const result = await analyzeProjectStatus(rootDir);

      assert.equal(result.summary.activeTopicCount, 0);
      assert.equal(result.summary.readyCount, 0);
      assert.equal(result.summary.inProgressCount, 0);
      assert.equal(result.summary.blockedCount, 0);
      assert.equal(result.summary.archiveReadyCount, 0);
      assert.deepEqual(result.topics, []);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProjectStatus classifies active topics and next workflows", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-topics-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      await createTopic(rootDir, "proposal-ready", [
        ["state/current.md", stateMarkdown({ topic: "proposal-ready", stage: "proposal", nextAction: "`pgg-plan` 실행" })]
      ]);

      await createTopic(rootDir, "plan-ready", [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/infra/status.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["state/current.md", stateMarkdown({ topic: "plan-ready", stage: "task", nextAction: "`pgg-code` 실행" })]
      ]);

      await createTopic(rootDir, "implementation-wip", [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/infra/status.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        [
          "state/current.md",
          stateMarkdown({ topic: "implementation-wip", stage: "implementation", nextAction: "`pgg-code` 실행" })
        ]
      ]);

      await createTopic(rootDir, "audit-required", [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/infra/status.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        ["reviews/code.review.md", "# code.review\n"],
        ["reviews/refactor.review.md", "# refactor.review\n"],
        [
          "state/current.md",
          stateMarkdown({
            topic: "audit-required",
            stage: "refactor",
            nextAction: "`pgg-token` 실행",
            tokenAudit: "required",
            tokenReason: "status evaluator should prefer token audit before QA"
          })
        ]
      ]);

      await createTopic(rootDir, "blocked-topic", [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/infra/status.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        [
          "state/current.md",
          stateMarkdown({
            topic: "blocked-topic",
            stage: "implementation",
            blockingIssues: "API contract mismatch",
            nextAction: "`pgg-code` 재작업"
          })
        ]
      ]);

      await createTopic(rootDir, "archive-ready", [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/infra/status.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        ["reviews/code.review.md", "# code.review\n"],
        ["reviews/refactor.review.md", "# refactor.review\n"],
        ["qa/review.md", "# qa.review\n"],
        [
          "state/current.md",
          stateMarkdown({
            topic: "archive-ready",
            stage: "qa",
            openStatus: "pass",
            nextAction: "archive 완료"
          })
        ]
      ]);

      const result = await analyzeProjectStatus(rootDir);

      assert.equal(result.summary.activeTopicCount, 6);
      assert.equal(result.summary.readyCount, 3);
      assert.equal(result.summary.inProgressCount, 1);
      assert.equal(result.summary.blockedCount, 1);
      assert.equal(result.summary.archiveReadyCount, 1);

      assert.deepEqual(
        result.topics.map((topic) => [topic.name, topic.progressStatus, topic.nextWorkflow]),
        [
          ["archive-ready", "archive_ready", "none"],
          ["audit-required", "ready", "pgg-token"],
          ["blocked-topic", "blocked", "pgg-code"],
          ["implementation-wip", "in_progress", "pgg-code"],
          ["plan-ready", "ready", "pgg-code"],
          ["proposal-ready", "ready", "pgg-plan"]
        ]
      );
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
