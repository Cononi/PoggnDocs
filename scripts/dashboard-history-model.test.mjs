import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadHistoryModel() {
  const source = readFileSync("apps/dashboard/src/features/history/historyModel.ts", "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  });
  const module = { exports: {} };
  const require = (specifier) => {
    if (specifier.endsWith("/shared/utils/dashboard")) {
      return {
        buildTopicKey: (topic) => topic.name,
        formatDate: (value) => value
      };
    }
    throw new Error(`Unexpected test import: ${specifier}`);
  };

  vm.runInNewContext(outputText, { exports: module.exports, module, require }, { filename: "historyModel.cjs" });
  return module.exports;
}

function dictionary() {
  return new Proxy(
    {},
    {
      get: (_target, key) => String(key)
    }
  );
}

function workflowFile(relativePath, content = "# Fixture") {
  return {
    relativePath,
    sourcePath: `poggn/active/topic/${relativePath}`,
    updatedAt: "2026-04-27T12:00:00Z",
    tokenEstimate: null,
    llmActualTokens: null,
    localEstimatedTokens: null,
    content
  };
}

function workflowTopic(historyEvents, overrides = {}) {
  return {
    name: "refactor-status-regression",
    bucket: "active",
    stage: "qa",
    status: "진행 중",
    updatedAt: "2026-04-27T12:04:00Z",
    archivedAt: null,
    version: null,
    publishResultType: null,
    publishPushStatus: null,
    blockingIssues: null,
    nextAction: "Run pgg-qa",
    goal: "workflow status regression",
    files: [],
    workflow: { nodes: [] },
    historyEvents,
    artifactSummary: {
      reviewDocs: { count: 0, latestUpdatedAt: null, primaryRef: null },
      qaDocs: { count: 0, latestUpdatedAt: null, primaryRef: null },
      implementationDocs: { count: 0, latestUpdatedAt: null, primaryRef: null },
      workflowDocs: { count: 0, latestUpdatedAt: null, primaryRef: null }
    },
    ...overrides
  };
}

test("refactor completion after blocked evidence resolves stage-blocked status", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic([
    { stage: "refactor", event: "stage-blocked", source: "refactor", ts: "2026-04-27T12:01:00Z" },
    { stage: "refactor", event: "stage-completed", source: "verified gate", ts: "2026-04-27T12:02:00Z" },
    { stage: "qa", event: "stage-started", source: "pgg-qa", ts: "2026-04-27T12:03:00Z" }
  ]);

  const refactor = buildWorkflowSteps(topic, "ko", dictionary()).find((step) => step.id === "refactor");

  assert.equal(refactor?.status, "completed");
});

test("blocked evidence after completion keeps the flow stage-blocked", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic([
    { stage: "refactor", event: "stage-completed", source: "verified gate", ts: "2026-04-27T12:01:00Z" },
    { stage: "refactor", event: "stage-blocked", source: "refactor", ts: "2026-04-27T12:02:00Z" },
    { stage: "qa", event: "stage-started", source: "pgg-qa", ts: "2026-04-27T12:03:00Z" }
  ]);

  const refactor = buildWorkflowSteps(topic, "ko", dictionary()).find((step) => step.id === "refactor");

  assert.equal(refactor?.status, "stage-blocked");
});

test("plan progress events alone do not complete the plan flow", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic(
    [
      { stage: "plan", event: "stage-started", source: "pgg-plan", ts: "2026-04-27T12:01:00Z" },
      { stage: "plan", event: "stage-progress", source: "pgg-plan", ts: "2026-04-27T12:02:00Z" },
      { stage: "code", event: "stage-started", source: "pgg-code", ts: "2026-04-27T12:03:00Z" }
    ],
    { stage: "pgg-code" }
  );

  const plan = buildWorkflowSteps(topic, "ko", dictionary()).find((step) => step.id === "plan");

  assert.notEqual(plan?.status, "completed");
});

test("verified plan completion completes the plan flow", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic(
    [
      { stage: "plan", event: "stage-completed", source: "verified gate", ts: "2026-04-27T12:01:00Z" },
      { stage: "code", event: "stage-started", source: "pgg-code", ts: "2026-04-27T12:02:00Z" }
    ],
    { stage: "pgg-code" }
  );

  const plan = buildWorkflowSteps(topic, "ko", dictionary()).find((step) => step.id === "plan");

  assert.equal(plan?.status, "completed");
});

test("plan revision after verified completion marks the plan flow updating", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic(
    [
      { stage: "plan", event: "stage-completed", source: "verified gate", ts: "2026-04-27T12:01:00Z" },
      { stage: "plan", event: "requirements-added", source: "pgg-add", ts: "2026-04-27T12:02:00Z" },
      { stage: "code", event: "stage-started", source: "pgg-code", ts: "2026-04-27T12:03:00Z" }
    ],
    { stage: "pgg-code" }
  );

  const plan = buildWorkflowSteps(topic, "ko", dictionary()).find((step) => step.id === "plan");

  assert.equal(plan?.status, "updating");
});

test("audit applicability text alone does not show optional performance flow", () => {
  const { buildWorkflowSteps } = loadHistoryModel();
  const topic = workflowTopic(
    [
      { stage: "refactor", event: "stage-completed", source: "verified gate", ts: "2026-04-27T12:01:00Z" },
      { stage: "qa", event: "stage-started", source: "pgg-qa", ts: "2026-04-27T12:02:00Z" }
    ],
    {
      stage: "pgg-qa",
      files: [
        workflowFile(
          "state/current.md",
          [
            "# Current State",
            "",
            "## Audit Applicability",
            "",
            "- [pgg-performance]: required | measurement needed",
            ""
          ].join("\n")
        )
      ]
    }
  );

  const steps = buildWorkflowSteps(topic, "ko", dictionary());

  assert.equal(steps.some((step) => step.id === "performance"), false);
});

test("timeline rows use completed flow scoped token records", () => {
  const { buildTimelineRows } = loadHistoryModel();
  const topic = {
    ...workflowTopic([
      { stage: "implementation", event: "stage-completed", source: "verified", ts: "2026-04-27T12:01:00Z" },
      { stage: "qa", event: "stage-completed", source: "verified", ts: "2026-04-27T12:02:00Z" }
    ]),
    files: [
      {
        relativePath: "implementation/index.md",
        sourcePath: "poggn/active/topic/implementation/index.md",
        tokenEstimate: 10,
        llmActualTokens: 10,
        localEstimatedTokens: 0,
        content: "# Implementation"
      },
      {
        relativePath: "implementation/diffs/001_UPDATE_example.diff",
        sourcePath: "poggn/active/topic/implementation/diffs/001_UPDATE_example.diff",
        tokenEstimate: 15,
        llmActualTokens: null,
        localEstimatedTokens: 15,
        content: "diff --git a/example.ts b/example.ts"
      },
      {
        relativePath: "implementation/diffs/002_UPDATE_lazy.diff",
        sourcePath: "poggn/active/topic/implementation/index.md#002",
        tokenEstimate: null,
        llmActualTokens: null,
        localEstimatedTokens: null,
        content: null,
        lazyDiff: {
          topic: "topic",
          bucket: "active",
          targetPath: "packages/core/src/index.ts",
          diffSource: "working-tree",
          gitRef: null,
          commitRange: null,
          diffCommand: "git diff -- packages/core/src/index.ts",
          status: "pending",
          taskRef: "T1",
          note: null
        }
      },
      {
        relativePath: "qa/report.md",
        sourcePath: "poggn/active/topic/qa/report.md",
        tokenEstimate: 20,
        llmActualTokens: 20,
        localEstimatedTokens: 0,
        content: "# QA"
      }
    ],
    tokenUsageRecords: [
      {
        stage: "implementation",
        flow: "pgg-code",
        source: "llm",
        totalTokens: 31,
        measurement: "actual",
        estimated: false,
        usageMetadataAvailable: true,
        artifactPath: "packages/core/src/index.ts",
        artifactTokenEstimate: null
      },
      {
        stage: "implementation",
        flow: "pgg-code",
        source: "local",
        totalTokens: 5,
        measurement: "estimated",
        artifactPath: "pnpm test",
        artifactTokenEstimate: null
      },
      {
        stage: "qa",
        flow: "pgg-qa",
        source: "llm",
        totalTokens: 0,
        measurement: "unavailable",
        estimated: true,
        usageMetadataAvailable: false,
        artifactPath: "qa/report.md",
        artifactTokenEstimate: 44
      },
      {
        stage: "qa",
        flow: "pgg-qa",
        source: "local",
        totalTokens: 7,
        measurement: "estimated",
        artifactPath: "pgg-gate",
        artifactTokenEstimate: null
      },
      {
        stage: "plan",
        flow: "pgg-plan",
        source: "local",
        totalTokens: 99,
        measurement: "estimated",
        artifactPath: "plan.md",
        artifactTokenEstimate: null
      }
    ]
  };

  const rows = buildTimelineRows(topic, "ko", "tester", dictionary());
  const code = rows.find((row) => row.id === "code");
  const qa = rows.find((row) => row.id === "qa");

  assert.equal(code?.llmActualTokens, 31);
  assert.equal(code?.localEstimatedTokens, 30);
  assert.equal(code?.files.some((file) => file.lazyDiff?.targetPath === "packages/core/src/index.ts" && file.content === null), true);
  assert.equal(qa?.llmActualTokens, null);
  assert.equal(qa?.localEstimatedTokens, 51);
});
