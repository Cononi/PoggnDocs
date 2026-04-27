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
  runProjectGitOnboarding,
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

function createMockRunner() {
  const calls = [];
  return {
    calls,
    async run(command, args, options) {
      calls.push({ command, args, cwd: options.cwd });
      return { stdout: "", stderr: "", exitCode: 0 };
    }
  };
}

function createFailingRunner(failedCommandName) {
  const calls = [];
  return {
    calls,
    async run(command, args, options) {
      calls.push({ command, args, cwd: options.cwd });
      return args.join(" ").includes(failedCommandName)
        ? { stdout: "", stderr: "mock failure", exitCode: 1 }
        : { stdout: "", stderr: "", exitCode: 0 };
    }
  };
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

test("local onboarding initializes git without remote or push", async () => {
  await withTemporaryRoot("pgg-git-local-path-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const runner = createMockRunner();
      const result = await runProjectGitOnboarding(rootDir, { path: "local" }, runner.run);
      const manifest = await loadProjectManifest(rootDir);

      assert.equal(result.status, "configured");
      assert.equal(result.setupStatus, "configured");
      assert.deepEqual(runner.calls.map((call) => [call.command, call.args]), [["git", ["init"]]]);
      assert.equal(manifest?.git.setupStatus, "configured");
      assert.equal(manifest?.git.remoteUrl, undefined);
    });
  });
});

test("fast path validates detected origin and stores non-secret metadata", async () => {
  await withTemporaryRoot("pgg-git-fast-run-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });
      git(rootDir, ["init"]);
      git(rootDir, ["remote", "add", "origin", "git@github.com:acme/widget.git"]);

      const runner = createMockRunner();
      const result = await runProjectGitOnboarding(
        rootDir,
        {
          path: "fast",
          authMethod: "ssh",
          defaultBranch: "main",
          confirmRemoteMutation: true,
          confirmPush: true
        },
        runner.run
      );
      const manifest = await loadProjectManifest(rootDir);

      assert.equal(result.status, "configured");
      assert.equal(manifest?.git.provider, "github");
      assert.equal(manifest?.git.owner, "acme");
      assert.equal(manifest?.git.repository, "widget");
      assert.equal(manifest?.git.remoteUrl, "git@github.com:acme/widget.git");
      assert.equal(JSON.stringify(manifest?.git).includes("secret-token-value"), false);
      assert.deepEqual(
        runner.calls.map((call) => call.args),
        [
          ["ls-remote", "git@github.com:acme/widget.git", "HEAD"],
          ["branch", "-M", "main"],
          ["push", "-u", "origin", "main"]
        ]
      );
    });
  });
});

test("setup path configures remote and can skip push", async () => {
  await withTemporaryRoot("pgg-git-setup-run-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const runner = createMockRunner();
      const result = await runProjectGitOnboarding(
        rootDir,
        {
          path: "setup",
          provider: "gitlab",
          owner: "team/platform",
          repository: "service",
          authMethod: "ssh",
          defaultBranch: "main",
          confirmRemoteMutation: true,
          confirmPush: false
        },
        runner.run
      );
      const manifest = await loadProjectManifest(rootDir);

      assert.equal(result.status, "configured");
      assert.equal(result.remoteUrl, "git@gitlab.com:team/platform/service.git");
      assert.equal(manifest?.git.provider, "gitlab");
      assert.equal(manifest?.git.remoteUrl, "git@gitlab.com:team/platform/service.git");
      assert.ok(runner.calls.some((call) => call.args.join(" ") === "remote add origin git@gitlab.com:team/platform/service.git"));
      assert.ok(!runner.calls.some((call) => call.args[0] === "push"));
    });
  });
});

test("remote onboarding requires confirmation before mutating git state", async () => {
  await withTemporaryRoot("pgg-git-confirm-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const runner = createMockRunner();
      const result = await runProjectGitOnboarding(
        rootDir,
        {
          path: "setup",
          provider: "github",
          owner: "acme",
          repository: "widget",
          authMethod: "ssh"
        },
        runner.run
      );

      assert.equal(result.status, "blocked");
      assert.equal(runner.calls.length, 0);
    });
  });
});

test("remote onboarding stops when auth validation fails", async () => {
  await withTemporaryRoot("pgg-git-auth-fail-", async (rootDir) => {
    await withTemporaryPggHome(rootDir, async () => {
      await initializeProject(rootDir, {
        provider: "codex",
        language: "en",
        autoMode: "on",
        teamsMode: "off"
      });

      const runner = createFailingRunner("ls-remote");
      const result = await runProjectGitOnboarding(
        rootDir,
        {
          path: "setup",
          provider: "github",
          owner: "acme",
          repository: "widget",
          authMethod: "ssh",
          defaultBranch: "main",
          confirmRemoteMutation: true,
          confirmPush: true
        },
        runner.run
      );

      assert.equal(result.status, "failed");
      assert.equal(result.message, "Git authentication or remote access check failed.");
      assert.ok(!runner.calls.some((call) => call.args[0] === "branch"));
      assert.ok(!runner.calls.some((call) => call.args[0] === "push"));
    });
  });
});
