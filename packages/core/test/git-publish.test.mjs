import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDashboardSnapshot,
  initializeProject,
  loadProjectManifest,
  updateProjectGitMode
} from "../dist/index.js";

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

async function withTemporaryRoot(prefix, run) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), prefix));

  try {
    await run(rootDir);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

function git(rootDir, args, options = {}) {
  return execFileSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
    ...options
  }).trim();
}

async function writeTopicFile(topicDir, relativePath, content) {
  const target = path.join(topicDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function createQaTopic(rootDir, topic, changedPaths, goal) {
  const topicDir = path.join(rootDir, "poggn", "active", topic);
  await mkdir(topicDir, { recursive: true });

  const changedFileRows = changedPaths
    .map((changedPath) => `| UPDATE | \`${changedPath}\` | 없음 |`)
    .join("\n");

  await writeTopicFile(
    topicDir,
    "proposal.md",
    [
      "---",
      "pgg:",
      `  topic: "${topic}"`,
      '  stage: "proposal"',
      '  status: "reviewed"',
      '  archive_type: "feat"',
      '  project_scope: "current-project"',
      "---",
      "",
      "# Proposal",
      "",
      "## 1. 제목",
      "",
      topic,
      ""
    ].join("\n")
  );

  await writeTopicFile(
    topicDir,
    "state/current.md",
    [
      "# Current State",
      "",
      "## Topic",
      "",
      topic,
      "",
      "## Current Stage",
      "",
      "qa",
      "",
      "## Goal",
      "",
      goal,
      "",
      "## Open Items",
      "",
      "- status: pass",
      "",
      "## Changed Files",
      "",
      "| CRUD | path | diff |",
      "|---|---|---|",
      changedFileRows,
      "",
      "## Last Expert Score",
      "",
      "- phase: qa",
      "- score: 95",
      "- blocking issues: 없음",
      "",
      "## Next Action",
      "",
      "archive 완료",
      ""
    ].join("\n")
  );
  await writeTopicFile(
    topicDir,
    "state/history.ndjson",
    '{"ts":"2026-04-21T00:00:00Z","stage":"qa","event":"qa-started"}\n'
  );

  await writeTopicFile(
    topicDir,
    "qa/report.md",
    [
      "---",
      "pgg:",
      `  topic: "${topic}"`,
      '  stage: "qa"',
      '  status: "done"',
      "---",
      "",
      "# QA Report",
      "",
      "## Decision",
      "",
      "- pass",
      ""
    ].join("\n")
  );
}

async function initializeGitRepository(rootDir, remoteDir = null) {
  git(rootDir, ["init", "--initial-branch=main"]);
  git(rootDir, ["config", "user.name", "pgg test"]);
  git(rootDir, ["config", "user.email", "pgg@example.com"]);
  git(rootDir, ["add", "-A"]);
  git(rootDir, ["commit", "-m", "chore: initial state"]);

  if (remoteDir) {
    execFileSync("git", ["init", "--bare", remoteDir], { encoding: "utf8" });
    git(rootDir, ["remote", "add", "origin", remoteDir]);
    git(rootDir, ["push", "-u", "origin", "main"]);
  }
}

async function withGitPublishFixture(prefix, options, run) {
  const { remote = false } = options;

  await withTemporaryRoot(`${prefix}-`, async (rootDir) => {
    const remoteDir = remote ? await mkdtemp(path.join(os.tmpdir(), `${prefix}-remote-`)) : null;

    try {
      await withTemporaryPggHome(rootDir, async () => {
        await initializeProject(rootDir, {
          provider: "codex",
          language: "en",
          autoMode: "on",
          teamsMode: "off",
          gitMode: "on"
        });
        await initializeGitRepository(rootDir, remoteDir);
        await run({ rootDir, remoteDir });
      });
    } finally {
      if (remoteDir) {
        await rm(remoteDir, { recursive: true, force: true });
      }
    }
  });
}

function runArchiveHelper(rootDir, topic) {
  return JSON.parse(
    execFileSync(path.join(rootDir, ".codex/sh/pgg-archive.sh"), [topic], {
      encoding: "utf8"
    })
  );
}

async function loadPublishMetadata(rootDir, topic) {
  return JSON.parse(await readFile(path.join(rootDir, `poggn/archive/${topic}/git/publish.json`), "utf8"));
}

test("git mode defaults to off, can be enabled, and appears in dashboard snapshots", async () => {
  await withTemporaryRoot("pgg-git-mode-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const initialManifest = await loadProjectManifest(rootDir);
      assert.equal(initialManifest?.git.mode, "off");
      assert.equal(initialManifest?.git.defaultRemote, "origin");

      await updateProjectGitMode(rootDir, "on");

      const updatedManifest = await loadProjectManifest(rootDir);
      const snapshot = await buildDashboardSnapshot(rootDir);

      assert.equal(updatedManifest?.git.mode, "on");
      assert.equal(
        updatedManifest?.managedFiles.some((entry) => entry.path === ".codex/sh/pgg-git-publish.sh"),
        true
      );
      assert.equal(snapshot.projects.find((project) => project.rootDir === rootDir)?.gitMode, "on");
    });
  });
});

test("archive helper reports remote setup required when git mode is on without a configured remote", async () => {
  await withGitPublishFixture("pgg-git-remote-missing", { remote: false }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "remote missing case\n", "utf8");
    await createQaTopic(rootDir, "git-remote-missing", ["feature.txt"], "Remote setup required");

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runArchiveHelper(rootDir, "git-remote-missing");
    const metadata = await loadPublishMetadata(rootDir, "git-remote-missing");
    const history = await readFile(path.join(rootDir, "poggn/archive/git-remote-missing/state/history.ndjson"), "utf8");

    assert.equal(result.status, "archived");
    assert.equal(result.git.resultType, "remote_setup_required");
    assert.equal(result.git.pushStatus, "not_attempted");
    assert.equal(metadata.resultType, "remote_setup_required");
    assert.match(metadata.reason, /Remote 'origin' is not configured/);
    assert.match(history, /git-publish-deferred/);
    assert.equal(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
  });
});

test("archive helper blocks automatic publish when unrelated dirty files exist", async () => {
  await withGitPublishFixture("pgg-git-dirty-block", { remote: true }, async ({ rootDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "candidate change\n", "utf8");
    const agentsPath = path.join(rootDir, "AGENTS.md");
    await writeFile(agentsPath, `${await readFile(agentsPath, "utf8")}\n# unrelated dirty change\n`, "utf8");
    await createQaTopic(rootDir, "git-dirty-blocked", ["feature.txt"], "Dirty worktree guardrail");

    const beforeSha = git(rootDir, ["rev-parse", "HEAD"]);
    const result = runArchiveHelper(rootDir, "git-dirty-blocked");
    const metadata = await loadPublishMetadata(rootDir, "git-dirty-blocked");

    assert.equal(result.git.resultType, "publish_blocked");
    assert.equal(result.git.pushStatus, "not_attempted");
    assert.equal(metadata.resultType, "publish_blocked");
    assert.equal(git(rootDir, ["rev-parse", "HEAD"]), beforeSha);
  });
});

test("archive helper commits and pushes when git mode is on and the remote is available", async () => {
  await withGitPublishFixture("pgg-git-publish-success", { remote: true }, async ({ rootDir, remoteDir }) => {
    await writeFile(path.join(rootDir, "feature.txt"), "publish success case\n", "utf8");
    await createQaTopic(rootDir, "git-publish-success", ["feature.txt"], "Automatic git publish");

    const result = runArchiveHelper(rootDir, "git-publish-success");
    const metadata = await loadPublishMetadata(rootDir, "git-publish-success");
    const remoteHead = execFileSync("git", ["--git-dir", remoteDir, "rev-parse", "refs/heads/main"], {
      encoding: "utf8"
    }).trim();
    const note = git(rootDir, ["notes", "--ref", "pgg-publish", "show", result.git.commitSha]);

    assert.equal(result.git.resultType, "published");
    assert.equal(result.git.pushStatus, "success");
    assert.match(result.git.commitTitle, /^feat\. 0\.1\.0 /);
    assert.equal(result.git.commitSha, git(rootDir, ["rev-parse", "HEAD"]));
    assert.equal(result.git.commitSha, remoteHead);
    assert.equal(metadata.resultType, "pending");
    assert.equal(metadata.notesRef, "refs/notes/pgg-publish");
    assert.equal(JSON.parse(note).resultType, "published");
  });
});
