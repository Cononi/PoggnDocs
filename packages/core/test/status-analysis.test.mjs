import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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

function git(rootDir, args) {
  return execFileSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8"
  }).trim();
}

function proposalMarkdown(topic, options = {}) {
  return [
    "---",
    "pgg:",
    `  topic: "${topic}"`,
    '  stage: "proposal"',
    `  status: "${options.status ?? "reviewed"}"`,
    '  archive_type: "feat"',
    ...(options.workingBranch ? [`  working_branch: "${options.workingBranch}"`] : []),
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
  performanceReason = "performance audit not needed",
  changedFiles = [],
  auditFormat = "backtick"
}) {
  const auditLines =
    auditFormat === "bracket"
      ? [
          `- [pgg-token]: ${tokenAudit} | ${tokenReason}`,
          `- [pgg-performance]: ${performanceAudit} | ${performanceReason}`
        ]
      : [
          `- \`pgg-token\`: \`${tokenAudit}\` | ${tokenReason}`,
          `- \`pgg-performance\`: \`${performanceAudit}\` | ${performanceReason}`
        ];

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
    ...auditLines,
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
    "",
    ...(changedFiles.length
      ? [
          "## Changed Files",
          "",
          "| CRUD | path | diff |",
          "|---|---|---|",
          ...changedFiles.map((changedPath) => `| UPDATE | \`${changedPath}\` | test.diff |`),
          ""
        ]
      : []),
    ""
  ].join("\n");
}

async function createTopic(rootDir, topic, files, options = {}) {
  const topicDir = path.join(rootDir, "poggn", "active", topic);
  await mkdir(topicDir, { recursive: true });
  await writeTopicFile(topicDir, "proposal.md", proposalMarkdown(topic, options));
  await writeTopicFile(topicDir, "reviews/proposal.review.md", "# proposal.review\n");

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

test("analyzeProjectStatus treats new pgg-add approved topics as ready for pgg-plan", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-pgg-add-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      await createTopic(
        rootDir,
        "new-add-ready",
        [
          ["pgg-add/requirements.md", "# Requirements\n"],
          ["pgg-add/acceptance-criteria.md", "# Acceptance Criteria\n"],
          [
            "state/history.ndjson",
            JSON.stringify({
              ts: "2026-04-28T12:00:00Z",
              stage: "pgg-add",
              flow: "pgg-add",
              event: "stage-completed",
              source: "verified gate"
            }) + "\n"
          ],
          [
            "state/current.md",
            stateMarkdown({
              topic: "new-add-ready",
              stage: "pgg-add",
              nextAction: "`pgg-plan` 실행"
            })
          ]
        ],
        { status: "approved" }
      );

      const result = await analyzeProjectStatus(rootDir);
      const topic = result.topics.find((entry) => entry.name === "new-add-ready");

      assert.equal(topic?.currentStage, "proposal");
      assert.equal(topic?.progressStatus, "ready");
      assert.equal(topic?.nextWorkflow, "pgg-plan");
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProjectStatus parses bracket audit applicability for required performance audit", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-audit-bracket-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off"
      });

      await createTopic(rootDir, "bracket-performance-required", [
        ["pgg-plan/plan.md", "# Plan\n"],
        ["pgg-plan/task.md", "# Task\n"],
        ["pgg-plan/spec/testing/status.md", "# Spec\n"],
        ["pgg-plan/reviews/plan.review.md", "# plan.review\n"],
        ["pgg-plan/reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        ["reviews/code.review.md", "# code.review\n"],
        ["reviews/refactor.review.md", "# refactor.review\n"],
        [
          "state/current.md",
          stateMarkdown({
            topic: "bracket-performance-required",
            stage: "pgg-refactor",
            nextAction: "`pgg-performance` 실행",
            performanceAudit: "required",
            performanceReason: "measurement needed",
            auditFormat: "bracket"
          })
        ]
      ]);

      const result = await analyzeProjectStatus(rootDir);
      const topic = result.topics.find((entry) => entry.name === "bracket-performance-required");

      assert.equal(topic?.progressStatus, "ready");
      assert.equal(topic?.nextWorkflow, "pgg-performance");
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProjectStatus blocks git-on active topics on branch mismatch", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-branch-isolation-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off",
        gitMode: "on"
      });
      git(rootDir, ["init", "--initial-branch=main"]);

      const files = [
        ["plan.md", "# Plan\n"],
        ["task.md", "# Task\n"],
        ["spec/runtime/isolation.md", "# Spec\n"],
        ["reviews/plan.review.md", "# plan.review\n"],
        ["reviews/task.review.md", "# task.review\n"],
        ["implementation/index.md", "# Implementation\n"],
        ["reviews/code.review.md", "# code.review\n"],
        ["state/current.md", stateMarkdown({ topic: "branch-topic-a", stage: "implementation" })]
      ];
      await createTopic(rootDir, "branch-topic-a", files, { workingBranch: "ai/feat/1.0.0-branch-topic-a" });
      await createTopic(
        rootDir,
        "branch-topic-b",
        files.map(([relativePath, content]) => [
          relativePath,
          relativePath === "state/current.md" ? stateMarkdown({ topic: "branch-topic-b", stage: "implementation" }) : content
        ]),
        { workingBranch: "ai/feat/1.0.0-branch-topic-b" }
      );

      const result = await analyzeProjectStatus(rootDir);

      assert.equal(result.gitMode, "on");
      assert.equal(result.summary.blockedCount, 2);
      assert.equal(result.topics.every((topic) => topic.progressStatus === "blocked"), true);
      assert.match(result.topics[0].reason, /branch isolation/);
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("analyzeProjectStatus blocks git-off active topics with changed-path collisions", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-status-path-isolation-"));

  try {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "ko",
        autoMode: "on",
        teamsMode: "off",
        gitMode: "off"
      });

      async function createImplementationTopic(topic, changedFiles) {
        await createTopic(rootDir, topic, [
          ["plan.md", "# Plan\n"],
          ["task.md", "# Task\n"],
          ["spec/runtime/isolation.md", "# Spec\n"],
          ["reviews/plan.review.md", "# plan.review\n"],
          ["reviews/task.review.md", "# task.review\n"],
          ["implementation/index.md", "# Implementation\n"],
          ["reviews/code.review.md", "# code.review\n"],
          ["state/current.md", stateMarkdown({ topic, stage: "implementation", changedFiles })]
        ]);
      }

      await createImplementationTopic("path-topic-a", ["src/shared.ts"]);
      await createImplementationTopic("path-topic-b", ["src/shared.ts"]);
      await createImplementationTopic("path-topic-c", ["src/isolated.ts"]);

      const result = await analyzeProjectStatus(rootDir);
      const byName = new Map(result.topics.map((topic) => [topic.name, topic]));

      assert.equal(result.gitMode, "off");
      assert.equal(byName.get("path-topic-a")?.progressStatus, "blocked");
      assert.equal(byName.get("path-topic-b")?.progressStatus, "blocked");
      assert.match(byName.get("path-topic-a")?.reason ?? "", /src\/shared\.ts/);
      assert.notEqual(byName.get("path-topic-c")?.progressStatus, "blocked");
    });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
