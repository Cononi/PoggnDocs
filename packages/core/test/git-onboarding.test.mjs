import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDashboardSnapshot,
  deferProjectGitSetup,
  initializeProject,
  inspectProjectGitSetup,
  loadProjectManifest,
  parseGitRemoteUrl,
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

function git(rootDir, args) {
  return execFileSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8"
  }).trim();
}

test("remote URL parser extracts GitHub and GitLab repository coordinates", () => {
  assert.deepEqual(parseGitRemoteUrl("https://github.com/acme/widget.git"), {
    provider: "github",
    owner: "acme",
    repository: "widget",
    url: "https://github.com/acme/widget.git"
  });
  assert.deepEqual(parseGitRemoteUrl("git@gitlab.com:team/platform/service.git"), {
    provider: "gitlab",
    owner: "team/platform",
    repository: "service",
    url: "git@gitlab.com:team/platform/service.git"
  });
});

test("git defaults are preserved while setup can be deferred", async () => {
  await withTemporaryRoot("pgg-git-onboarding-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off",
        gitMode: "on"
      });

      await deferProjectGitSetup(rootDir, "Register Git later.");
      const manifest = await loadProjectManifest(rootDir);
      assert.equal(manifest?.git.mode, "on");
      assert.equal(manifest?.git.setupStatus, "deferred");
      assert.equal(manifest?.git.defaultRemote, "origin");
      assert.equal(manifest?.git.workingBranchPrefix, "ai");
      assert.equal(manifest?.git.releaseBranchPrefix, "release");

      const snapshot = await buildDashboardSnapshot(rootDir);
      const project = snapshot.projects.find((entry) => entry.rootDir === rootDir);
      assert.equal(project?.gitSetupStatus, "deferred");
      assert.equal(project?.defaultRemote, "origin");
      assert.equal(project?.workingBranchPrefix, "ai");
      assert.equal(project?.releaseBranchPrefix, "release");
    });
  });
});

test("git setup inspection prefers fast path when origin exists", async () => {
  await withTemporaryRoot("pgg-git-fast-path-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });
      git(rootDir, ["init"]);
      git(rootDir, ["remote", "add", "origin", "git@github.com:acme/widget.git"]);
      await updateProjectGitMode(rootDir, "on");

      const inspection = await inspectProjectGitSetup(rootDir);
      assert.equal(inspection.path, "fast");
      assert.equal(inspection.git.mode, "on");
      assert.equal(inspection.git.setupStatus, "detected");
      assert.equal(inspection.parsedRemote?.provider, "github");
      assert.equal(inspection.parsedRemote?.owner, "acme");
      assert.equal(inspection.parsedRemote?.repository, "widget");
    });
  });
});
