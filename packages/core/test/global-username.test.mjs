import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertGlobalUsernameConfigured,
  loadGlobalUserConfig,
  readGlobalUser,
  updateGlobalUsername
} from "../dist/index.js";

async function withTemporaryPggHome(run) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pgg-user-config-"));
  const previousPggHome = process.env.PGG_HOME;

  try {
    process.env.PGG_HOME = rootDir;
    await run(rootDir);
  } finally {
    if (previousPggHome === undefined) {
      delete process.env.PGG_HOME;
    } else {
      process.env.PGG_HOME = previousPggHome;
    }
    await rm(rootDir, { recursive: true, force: true });
  }
}

test("global username starts empty and reports missing source", async () => {
  await withTemporaryPggHome(async () => {
    const user = await readGlobalUser();

    assert.equal(user.username, null);
    assert.equal(user.configured, false);
    assert.equal(user.source, "missing");
  });
});

test("global username update trims edges and preserves display casing", async () => {
  await withTemporaryPggHome(async () => {
    const user = await updateGlobalUsername("  Jane Doe  ");
    const config = await loadGlobalUserConfig();

    assert.equal(user.username, "Jane Doe");
    assert.equal(user.configured, true);
    assert.equal(config.username, "Jane Doe");
    assert.equal(typeof config.updatedAt, "string");
  });
});

test("global username rejects empty values and gate fails when missing", async () => {
  await withTemporaryPggHome(async () => {
    await assert.rejects(() => updateGlobalUsername("   "), /Username is required/);
    await assert.rejects(() => assertGlobalUsernameConfigured(), /Username is required/);
  });
});
