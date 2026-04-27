#!/usr/bin/env node
import { clearScreenDown, cursorTo, emitKeypressEvents, moveCursor } from "node:readline";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import {
  analyzeProjectStatus,
  buildDashboardSnapshot,
  deferProjectGitSetup,
  findWorkspaceRoot,
  initializeProject,
  inspectProjectGitSetup,
  loadProjectManifest,
  MANIFEST_RELATIVE_PATH,
  type PggAutoMode,
  type PggGitMode,
  type PggLanguage,
  type PggTeamsMode,
  summarizeSyncResult,
  updateProject,
  updateProjectAutoMode,
  updateProjectDashboardPort,
  updateProjectGitMode,
  updateProjectLanguage,
  updateProjectTeamsMode,
  writeDashboardSnapshotFile
} from "@pgg/core";

type CommandName = "init" | "update" | "lang" | "auto" | "teams" | "git" | "status" | "dashboard";

interface ParsedArgs {
  command: CommandName | null;
  options: Record<string, string | boolean>;
}

class InteractiveCancelError extends Error {
  constructor() {
    super("Interactive selection was cancelled.");
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const [commandToken, ...rest] = argv;
  const command = (["init", "update", "lang", "auto", "teams", "git", "status", "dashboard"].includes(commandToken ?? "")
    ? commandToken
    : null) as CommandName | null;
  const options: Record<string, string | boolean> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token?.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split("=");
    if (!rawKey) {
      continue;
    }

    const key = rawKey;
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const next = rest[index + 1];
    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
      continue;
    }

    options[key] = true;
  }

  return { command, options };
}

async function choose<T extends string>(question: string, options: Array<{ value: T; label: string }>): Promise<T> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(`${question} requires an interactive terminal or an explicit flag.`);
  }
  if (options.length === 0) {
    throw new Error("At least one choice option is required.");
  }

  emitKeypressEvents(input);
  input.resume();

  const priorRawMode = input.isRaw ?? false;
  if (typeof input.setRawMode === "function") {
    input.setRawMode(true);
  }

  let selectedIndex = 0;
  let renderedLines = 0;

  const render = (): void => {
    const lines = [
      `${question} (Use Up/Down and Enter)`,
      ...options.map((option, index) => `${index === selectedIndex ? ">" : " "} ${option.label}`)
    ];

    if (renderedLines > 1) {
      moveCursor(output, 0, -(renderedLines - 1));
    }
    if (renderedLines > 0) {
      cursorTo(output, 0);
    }

    output.write(lines.join("\n"));
    clearScreenDown(output);
    renderedLines = lines.length;
  };

  return await new Promise<T>((resolve, reject) => {
    let cleanedUp = false;

    const cleanup = (): void => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;

      input.off("keypress", onKeypress);
      if (typeof input.setRawMode === "function") {
        input.setRawMode(priorRawMode);
      }
      input.pause();

      if (renderedLines > 1) {
        moveCursor(output, 0, -(renderedLines - 1));
      }
      if (renderedLines > 0) {
        cursorTo(output, 0);
        clearScreenDown(output);
      }
      output.write("\n");
    };

    const onKeypress = (_value: string, key: { ctrl?: boolean; name?: string }): void => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new InteractiveCancelError());
        return;
      }

      if (key.name === "up") {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
        return;
      }

      if (key.name === "down") {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
        return;
      }

      if (key.name === "return") {
        const selected = options[selectedIndex];
        cleanup();
        resolve(selected!.value);
      }
    };

    input.on("keypress", onKeypress);
    render();
  });
}

async function chooseMany<T extends string>(
  question: string,
  options: Array<{ value: T; label: string; checked: boolean }>
): Promise<T[]> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(`${question} requires an interactive terminal or explicit flags.`);
  }

  emitKeypressEvents(input);
  input.resume();

  const priorRawMode = input.isRaw ?? false;
  if (typeof input.setRawMode === "function") {
    input.setRawMode(true);
  }

  let selectedIndex = 0;
  let renderedLines = 0;
  const selectedValues = new Set(options.filter((option) => option.checked).map((option) => option.value));

  const render = (): void => {
    const lines = [
      `${question} (Use Up/Down, Space, Enter)`,
      ...options.map((option, index) => {
        const cursor = index === selectedIndex ? ">" : " ";
        const checked = selectedValues.has(option.value) ? "x" : " ";
        return `${cursor} [${checked}] ${option.label}`;
      })
    ];

    if (renderedLines > 1) {
      moveCursor(output, 0, -(renderedLines - 1));
    }
    if (renderedLines > 0) {
      cursorTo(output, 0);
    }

    output.write(lines.join("\n"));
    clearScreenDown(output);
    renderedLines = lines.length;
  };

  return await new Promise<T[]>((resolve, reject) => {
    let cleanedUp = false;

    const cleanup = (): void => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;

      input.off("keypress", onKeypress);
      if (typeof input.setRawMode === "function") {
        input.setRawMode(priorRawMode);
      }
      input.pause();

      if (renderedLines > 1) {
        moveCursor(output, 0, -(renderedLines - 1));
      }
      if (renderedLines > 0) {
        cursorTo(output, 0);
        clearScreenDown(output);
      }
      output.write("\n");
    };

    const onKeypress = (value: string, key: { ctrl?: boolean; name?: string }): void => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new InteractiveCancelError());
        return;
      }

      if (key.name === "up") {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
        return;
      }

      if (key.name === "down") {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
        return;
      }

      if (key.name === "space" || value === " ") {
        const selected = options[selectedIndex]!;
        if (selectedValues.has(selected.value)) {
          selectedValues.delete(selected.value);
        } else {
          selectedValues.add(selected.value);
        }
        render();
        return;
      }

      if (key.name === "return") {
        cleanup();
        resolve(options.map((option) => option.value).filter((value) => selectedValues.has(value)));
      }
    };

    input.on("keypress", onKeypress);
    render();
  });
}

function printHelp(language: "ko" | "en"): void {
  output.write(helpText(language));
}

function helpText(language: "ko" | "en"): string {
  if (language === "ko") {
    return [
      "Usage: pgg <command> [options]",
      "",
      "Commands:",
      "  pgg init [--cwd <dir>] [--provider codex] [--lang ko|en] [--auto on|off] [--teams on|off] [--git on|off]",
      "    현재 프로젝트에 pgg workflow 파일을 만들고 lang/auto/teams/git 초기 설정을 저장합니다.",
      "  pgg update [--cwd <dir>]",
      "    pgg가 관리하는 파일을 현재 설치 버전에 맞게 다시 동기화합니다.",
      "  pgg lang [--cwd <dir>] [--value ko|en]",
      "    프로젝트 문서와 절차 설명에 사용할 언어를 바꿉니다.",
      "  pgg auto [--cwd <dir>] [--value on|off]",
      "    요구사항이 충분할 때 pgg가 기준안을 자동 확정할지 설정합니다.",
      "  pgg teams [--cwd <dir>] [--value on|off]",
      "    단계별 2-agent orchestration과 .codex multi-agent 설정을 켜거나 끕니다.",
      "  pgg git [--cwd <dir>] [--value on|off]",
      "    task/QA commit, release publish, repository 연결 상태를 project별로 설정합니다.",
      "  pgg status [--cwd <dir>]",
      "    active topic의 다음 workflow와 blocking 상태를 보여 줍니다.",
      "  pgg dashboard [--cwd <dir>] [--host 127.0.0.1] [--port 4173] [--save-port] [--snapshot-only]",
      "    현재 프로젝트 dashboard snapshot을 만들거나 dashboard UI를 실행합니다.",
      ""
    ].join("\n");
  }

  return [
    "Usage: pgg <command> [options]",
    "",
    "Commands:",
    "  pgg init [--cwd <dir>] [--provider codex] [--lang ko|en] [--auto on|off] [--teams on|off] [--git on|off]",
    "    Create pgg workflow files and store project-scoped lang/auto/teams/git settings.",
    "  pgg update [--cwd <dir>]",
    "    Resync pgg-managed files with the installed version.",
    "  pgg lang [--cwd <dir>] [--value ko|en]",
    "    Change the language used by project documents and interactive explanations.",
    "  pgg auto [--cwd <dir>] [--value on|off]",
    "    Decide whether pgg can resolve clear requirements automatically.",
    "  pgg teams [--cwd <dir>] [--value on|off]",
    "    Toggle two-agent stage orchestration and .codex multi-agent settings.",
    "  pgg git [--cwd <dir>] [--value on|off]",
    "    Configure project-scoped task/QA commits, release publishing, and repository connection state.",
    "  pgg status [--cwd <dir>]",
    "    Show active topic workflow readiness and blockers.",
    "  pgg dashboard [--cwd <dir>] [--host 127.0.0.1] [--port 4173] [--save-port] [--snapshot-only]",
    "    Generate a dashboard snapshot or run the dashboard UI.",
    ""
  ].join("\n");
}

async function resolveHelpLanguage(rootDir: string, requested?: string | boolean): Promise<"ko" | "en"> {
  if (requested === "en" || requested === "ko") {
    return requested;
  }
  const manifest = await loadProjectManifest(rootDir).catch(() => null);
  return manifest?.language === "en" ? "en" : "ko";
}

function localizedFeatureOptions(language: "ko" | "en", rootDir: string) {
  const hasGitRepository = existsSync(path.join(rootDir, ".git"));
  if (language === "ko") {
    return [
      { value: "auto", label: "auto - 요구가 명확하면 기준안을 자동 확정합니다.", checked: true },
      { value: "teams", label: "teams - 단계별 2-agent orchestration을 사용합니다.", checked: false },
      { value: "git", label: "git - commit/publish와 repository 연결을 관리합니다.", checked: hasGitRepository }
    ] as const;
  }

  return [
    { value: "auto", label: "auto - Resolve clear requirements automatically.", checked: true },
    { value: "teams", label: "teams - Use two-agent stage orchestration.", checked: false },
    { value: "git", label: "git - Manage commits, publishing, and repository connection.", checked: hasGitRepository }
  ] as const;
}

async function deferGitSetup(rootDir: string, language: "ko" | "en"): Promise<void> {
  const inspection = await inspectProjectGitSetup(rootDir);
  const message =
    language === "ko"
      ? "Git 저장소 연결은 나중에 `pgg git` 또는 dashboard project settings에서 완료할 수 있습니다."
      : "Git repository connection can be completed later with `pgg git` or dashboard project settings.";
  await deferProjectGitSetup(rootDir, message);
  output.write(
    `${JSON.stringify(
      {
        gitSetup: "deferred",
        setupPath: inspection.path,
        provider: inspection.parsedRemote?.provider ?? null,
        owner: inspection.parsedRemote?.owner ?? null,
        repository: inspection.parsedRemote?.repository ?? null,
        message
      },
      null,
      2
    )}\n`
  );
}

function resolveRoot(options: Record<string, string | boolean>): string {
  const raw = typeof options.cwd === "string" ? options.cwd : process.cwd();
  return path.resolve(raw);
}

function formatSyncResult(result: {
  created: string[];
  updated: string[];
  unchanged: string[];
  conflicts: Array<{ path: string; backupPath: string }>;
}): string {
  return JSON.stringify(summarizeSyncResult(result), null, 2);
}

async function run(): Promise<void> {
  const { command, options } = parseArgs(process.argv.slice(2));
  const rootDir = resolveRoot(options);
  if (!command) {
    printHelp(await resolveHelpLanguage(rootDir, options.lang));
    process.exitCode = 1;
    return;
  }

  if (command === "init") {
    const providerValue =
      typeof options.provider === "string"
        ? options.provider
        : await choose("Choose the initial provider", [
            { value: "codex", label: "Codex (recommended)" },
            { value: "cancel", label: "Cancel" }
          ]);

    if (providerValue === "cancel") {
      output.write('{"status":"cancelled"}\n');
      return;
    }

    const provider = providerValue as "codex";
    const language = (typeof options.lang === "string"
      ? options.lang
      : await choose("Choose project language", [
          { value: "ko", label: "Korean / 한국어" },
          { value: "en", label: "English" }
        ])) as PggLanguage;
    const explicitFeatureFlags =
      typeof options.auto === "string" || typeof options.teams === "string" || typeof options.git === "string";
    const selectedFeatures = explicitFeatureFlags
      ? []
      : await chooseMany(
          language === "ko" ? "초기 기능을 선택하세요" : "Choose initial project features",
          [...localizedFeatureOptions(language, rootDir)]
        );
    const autoMode = (typeof options.auto === "string"
      ? options.auto
      : explicitFeatureFlags
        ? "on"
        : selectedFeatures.includes("auto")
        ? "on"
        : "off") as PggAutoMode;
    const teamsMode = (typeof options.teams === "string"
      ? options.teams
      : explicitFeatureFlags
        ? "off"
        : selectedFeatures.includes("teams")
        ? "on"
        : "off") as PggTeamsMode;
    const gitMode = (typeof options.git === "string"
      ? options.git
      : explicitFeatureFlags
        ? "off"
        : selectedFeatures.includes("git")
        ? "on"
        : "off") as PggGitMode;
    const existing = await loadProjectManifest(rootDir);
    if (existing) {
      output.write(
        JSON.stringify(
          {
            status: "already_initialized",
            manifest: path.join(rootDir, MANIFEST_RELATIVE_PATH)
          },
          null,
          2
        ) + "\n"
      );
      return;
    }

    const result = await initializeProject(rootDir, {
      provider,
      language,
      autoMode,
      teamsMode,
      gitMode
    });
    output.write(`${formatSyncResult(result)}\n`);
    if (gitMode === "on") {
      await deferGitSetup(rootDir, language === "en" ? "en" : "ko");
    }
    return;
  }

  if (command === "update") {
    const result = await updateProject(rootDir);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "lang") {
    const language =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose project language", [
            { value: "ko", label: "Korean" },
            { value: "en", label: "English" }
          ])) as PggLanguage;

    const result = await updateProjectLanguage(rootDir, language);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "auto") {
    const autoMode =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose auto mode", [
            { value: "on", label: "on" },
            { value: "off", label: "off" }
          ])) as PggAutoMode;

    const result = await updateProjectAutoMode(rootDir, autoMode);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "teams") {
    const teamsMode =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose teams mode", [
            { value: "off", label: "off" },
            { value: "on", label: "on" }
          ])) as PggTeamsMode;

    const result = await updateProjectTeamsMode(rootDir, teamsMode);
    output.write(`${formatSyncResult(result)}\n`);
    return;
  }

  if (command === "git") {
    const language = await resolveHelpLanguage(rootDir, options.lang);
    const gitMode =
      (typeof options.value === "string"
        ? options.value
        : await choose("Choose git mode", [
            { value: "off", label: "off" },
            { value: "on", label: "on" }
          ])) as PggGitMode;

    const result = await updateProjectGitMode(rootDir, gitMode);
    output.write(`${formatSyncResult(result)}\n`);
    if (gitMode === "on") {
      await deferGitSetup(rootDir, language);
    }
    return;
  }

  if (command === "status") {
    const result = await analyzeProjectStatus(rootDir);
    output.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const host = typeof options.host === "string" ? options.host : "127.0.0.1";
  const manifest = await loadProjectManifest(rootDir);
  const manifestPort = manifest?.dashboard.defaultPort ?? 4173;
  const port = Number(typeof options.port === "string" ? options.port : String(manifestPort));
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Dashboard port must be a positive integer.");
  }

  if (options["save-port"]) {
    await updateProjectDashboardPort(rootDir, port);
  }

  const snapshot = await buildDashboardSnapshot(rootDir);
  const workspaceRoot = findWorkspaceRoot(rootDir) ?? findWorkspaceRoot(path.dirname(new URL(import.meta.url).pathname));
  const snapshotPath = workspaceRoot
    ? path.join(workspaceRoot, "apps", "dashboard", "public", "dashboard-data.json")
    : path.join(rootDir, ".pgg", "dashboard-data.json");
  await writeDashboardSnapshotFile(snapshotPath, snapshot);

  if (options["snapshot-only"]) {
    output.write(`${JSON.stringify({ snapshot: snapshotPath }, null, 2)}\n`);
    return;
  }

  if (!workspaceRoot) {
    throw new Error("Dashboard workspace root was not found. Use --snapshot-only to export data only.");
  }

  const child = spawn(
    "pnpm",
    ["--dir", workspaceRoot, "--filter", "@pgg/dashboard", "exec", "vite", "--host", host, "--port", String(port)],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PGG_DASHBOARD_ROOT: rootDir
      }
    }
  );

  child.on("exit", (code) => {
    process.exitCode = code ?? 0;
  });
}

run().catch((error: unknown) => {
  if (error instanceof InteractiveCancelError) {
    output.write(`${JSON.stringify({ status: "cancelled" }, null, 2)}\n`);
    process.exitCode = 0;
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  output.write(`${JSON.stringify({ error: message }, null, 2)}\n`);
  process.exitCode = 1;
});
