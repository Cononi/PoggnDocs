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

function workflowTopic(historyEvents) {
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
    }
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
