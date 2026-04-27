#!/usr/bin/env node
import { clearScreenDown, cursorTo, emitKeypressEvents, moveCursor } from "node:readline";
import { createInterface } from "node:readline/promises";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import { analyzeProjectStatus, assertGlobalUsernameConfigured, buildDashboardSnapshot, findWorkspaceRoot, initializeProject, inspectProjectGitSetup, readGlobalUser, updateGlobalUsername, loadProjectManifest, MANIFEST_RELATIVE_PATH, runProjectGitOnboarding, summarizeSyncResult, updateProject, updateProjectAutoMode, updateProjectDashboardPort, updateProjectGitMode, updateProjectLanguage, updateProjectTeamsMode, writeDashboardSnapshotFile } from "@pgg/core";
class InteractiveCancelError extends Error {
    constructor() {
        super("Interactive selection was cancelled.");
    }
}
function parseArgs(argv) {
    const [commandToken, ...rest] = argv;
    const commands = ["init", "update", "lang", "auto", "teams", "git", "config", "settings", "status", "dashboard"];
    const command = (commands.includes(commandToken ?? "")
        ? commandToken
        : null);
    const options = {};
    const positionals = [];
    for (let index = 0; index < rest.length; index += 1) {
        const token = rest[index];
        if (!token?.startsWith("--")) {
            if (token) {
                positionals.push(token);
            }
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
    return { command, options, positionals };
}
async function choose(question, options) {
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
    const render = () => {
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
    return await new Promise((resolve, reject) => {
        let cleanedUp = false;
        const cleanup = () => {
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
        const onKeypress = (_value, key) => {
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
                resolve(selected.value);
            }
        };
        input.on("keypress", onKeypress);
        render();
    });
}
async function chooseMany(question, options) {
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
    const render = () => {
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
    return await new Promise((resolve, reject) => {
        let cleanedUp = false;
        const cleanup = () => {
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
        const onKeypress = (value, key) => {
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
                const selected = options[selectedIndex];
                if (selectedValues.has(selected.value)) {
                    selectedValues.delete(selected.value);
                }
                else {
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
async function askText(question, fallback) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        if (fallback !== undefined) {
            return fallback;
        }
        throw new Error(`${question} requires an interactive terminal or an explicit flag.`);
    }
    const rl = createInterface({ input, output });
    try {
        const suffix = fallback ? ` (${fallback})` : "";
        const answer = (await rl.question(`${question}${suffix}: `)).trim();
        return answer || fallback || "";
    }
    finally {
        rl.close();
    }
}
function printHelp(language) {
    output.write(helpText(language));
}
function helpText(language) {
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
            "  pgg config username {이름}",
            "    이 PC의 모든 pgg 프로젝트에서 사용할 사용자명을 저장합니다.",
            "  pgg settings [--username <이름>]",
            "    기본 설정 메뉴에서 사용자명을 변경합니다.",
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
        "  pgg config username {name}",
        "    Store the username shared by every pgg project on this computer.",
        "  pgg settings [--username <name>]",
        "    Change the username from the basic settings menu.",
        "  pgg status [--cwd <dir>]",
        "    Show active topic workflow readiness and blockers.",
        "  pgg dashboard [--cwd <dir>] [--host 127.0.0.1] [--port 4173] [--save-port] [--snapshot-only]",
        "    Generate a dashboard snapshot or run the dashboard UI.",
        ""
    ].join("\n");
}
async function resolveHelpLanguage(rootDir, requested) {
    if (requested === "en" || requested === "ko") {
        return requested;
    }
    const manifest = await loadProjectManifest(rootDir).catch(() => null);
    return manifest?.language === "en" ? "en" : "ko";
}
function usernameRequiredMessage(language) {
    return language === "ko"
        ? "pgg init을 시작하려면 먼저 사용자명을 설정해야 합니다. `pgg config username {이름}`을 실행하세요."
        : "Set a username before running pgg init. Run `pgg config username {name}` first.";
}
function localizedFeatureOptions(language, rootDir) {
    const hasGitRepository = existsSync(path.join(rootDir, ".git"));
    if (language === "ko") {
        return [
            { value: "auto", label: "auto - 요구가 명확하면 기준안을 자동 확정합니다.", checked: true },
            { value: "teams", label: "teams - 단계별 2-agent orchestration을 사용합니다.", checked: false },
            { value: "git", label: "git - commit/publish와 repository 연결을 관리합니다.", checked: hasGitRepository }
        ];
    }
    return [
        { value: "auto", label: "auto - Resolve clear requirements automatically.", checked: true },
        { value: "teams", label: "teams - Use two-agent stage orchestration.", checked: false },
        { value: "git", label: "git - Manage commits, publishing, and repository connection.", checked: hasGitRepository }
    ];
}
function readStringOption(options, key) {
    return typeof options[key] === "string" ? options[key] : undefined;
}
function isGitSetupOptionProvided(options) {
    return ["git-setup", "git-provider", "git-owner", "git-repository", "git-auth", "git-remote-url", "git-default-branch"].some((key) => typeof options[key] === "string");
}
async function resolveGitOnboardingRequest(rootDir, language, options) {
    const inspection = await inspectProjectGitSetup(rootDir);
    const explicitPath = readStringOption(options, "git-setup");
    const pathChoice = explicitPath ??
        (process.stdin.isTTY && process.stdout.isTTY
            ? await choose(language === "ko" ? "Git 설정 방식을 선택하세요" : "Choose Git setup path", [
                { value: "local", label: language === "ko" ? "local - git init만 처리" : "local - run git init only" },
                {
                    value: inspection.path === "fast" ? "fast" : "setup",
                    label: inspection.path === "fast"
                        ? language === "ko"
                            ? "remote - 기존 origin FAST PATH 사용"
                            : "remote - use detected origin FAST PATH"
                        : language === "ko"
                            ? "remote - 새 remote SETUP PATH 진행"
                            : "remote - configure a new remote SETUP PATH"
                },
                { value: "defer", label: language === "ko" ? "나중에 등록" : "Register later" }
            ])
            : undefined);
    if (!pathChoice) {
        throw new Error(language === "ko"
            ? "Git 설정에는 interactive terminal 또는 --git-setup local|fast|setup|defer 옵션이 필요합니다."
            : "Git setup requires an interactive terminal or --git-setup local|fast|setup|defer.");
    }
    if (pathChoice === "defer") {
        return {
            path: "defer",
            deferMessage: language === "ko"
                ? "Git 저장소 연결은 나중에 `pgg git` 또는 dashboard project settings에서 완료할 수 있습니다."
                : "Git repository connection can be completed later with `pgg git` or dashboard project settings."
        };
    }
    if (pathChoice === "local") {
        const localRequest = { path: "local" };
        const localDefaultBranch = readStringOption(options, "git-default-branch");
        if (localDefaultBranch)
            localRequest.defaultBranch = localDefaultBranch;
        return localRequest;
    }
    const provider = readStringOption(options, "git-provider") ??
        inspection.parsedRemote?.provider ??
        (pathChoice === "setup"
            ? (await choose(language === "ko" ? "Git provider를 선택하세요" : "Choose Git provider", [
                { value: "github", label: "GitHub" },
                { value: "gitlab", label: "GitLab" }
            ]))
            : "github");
    const authMethod = readStringOption(options, "git-auth") ??
        (await choose(language === "ko" ? "인증 방식을 선택하세요" : "Choose auth method", [
            { value: "ssh", label: "SSH" },
            { value: "https-token", label: "HTTPS Token" },
            { value: "provider-cli", label: provider === "gitlab" ? "glab auth login" : "gh auth login" }
        ]));
    const owner = readStringOption(options, "git-owner") ?? inspection.parsedRemote?.owner ?? (await askText(language === "ko" ? "Owner/user/org" : "Owner/user/org"));
    const repository = readStringOption(options, "git-repository") ??
        inspection.parsedRemote?.repository ??
        (await askText(language === "ko" ? "Repository name" : "Repository name", path.basename(rootDir)));
    const request = {
        path: pathChoice === "fast" ? "fast" : "setup",
        provider,
        owner,
        repository,
        authMethod,
        defaultBranch: readStringOption(options, "git-default-branch") ?? "main",
        visibility: readStringOption(options, "git-visibility") ?? "private",
        confirmRemoteMutation: options["yes"] === true || process.stdin.isTTY,
        confirmPush: options.push === true || readStringOption(options, "push") === "true"
    };
    const remoteUrl = readStringOption(options, "git-remote-url") ?? inspection.git.remoteUrl;
    if (remoteUrl)
        request.remoteUrl = remoteUrl;
    return request;
}
async function runGitOnboarding(rootDir, language, options) {
    const request = await resolveGitOnboardingRequest(rootDir, language, options);
    const result = await runProjectGitOnboarding(rootDir, request);
    output.write(`${JSON.stringify({ gitSetup: result }, null, 2)}\n`);
}
function resolveRoot(options) {
    const raw = typeof options.cwd === "string" ? options.cwd : process.cwd();
    return path.resolve(raw);
}
function formatSyncResult(result) {
    return JSON.stringify(summarizeSyncResult(result), null, 2);
}
async function run() {
    const { command, options, positionals } = parseArgs(process.argv.slice(2));
    const rootDir = resolveRoot(options);
    if (!command) {
        printHelp(await resolveHelpLanguage(rootDir, options.lang));
        process.exitCode = 1;
        return;
    }
    if (command === "config") {
        const key = positionals[0];
        if (key !== "username") {
            throw new Error("Supported config keys: username");
        }
        const username = positionals.slice(1).join(" ") || readStringOption(options, "value") || readStringOption(options, "username");
        if (!username) {
            throw new Error("Username is required. Run `pgg config username {name}`.");
        }
        output.write(`${JSON.stringify({ user: await updateGlobalUsername(username) }, null, 2)}\n`);
        return;
    }
    if (command === "settings") {
        const language = await resolveHelpLanguage(rootDir, options.lang);
        const current = await readGlobalUser();
        const username = readStringOption(options, "username") ??
            readStringOption(options, "value") ??
            (await askText(language === "ko" ? "사용자명을 입력하세요" : "Enter username", current.username ?? undefined));
        output.write(`${JSON.stringify({ user: await updateGlobalUsername(username) }, null, 2)}\n`);
        return;
    }
    if (command === "init") {
        const languageForGate = await resolveHelpLanguage(rootDir, options.lang);
        try {
            await assertGlobalUsernameConfigured();
        }
        catch {
            throw new Error(usernameRequiredMessage(languageForGate));
        }
        const providerValue = typeof options.provider === "string"
            ? options.provider
            : await choose("Choose the initial provider", [
                { value: "codex", label: "Codex (recommended)" },
                { value: "cancel", label: "Cancel" }
            ]);
        if (providerValue === "cancel") {
            output.write('{"status":"cancelled"}\n');
            return;
        }
        const provider = providerValue;
        const language = (typeof options.lang === "string"
            ? options.lang
            : await choose("Choose project language", [
                { value: "ko", label: "Korean / 한국어" },
                { value: "en", label: "English" }
            ]));
        const explicitFeatureFlags = typeof options.auto === "string" || typeof options.teams === "string" || typeof options.git === "string";
        const selectedFeatures = explicitFeatureFlags
            ? []
            : await chooseMany(language === "ko" ? "초기 기능을 선택하세요" : "Choose initial project features", [...localizedFeatureOptions(language, rootDir)]);
        const autoMode = (typeof options.auto === "string"
            ? options.auto
            : explicitFeatureFlags
                ? "on"
                : selectedFeatures.includes("auto")
                    ? "on"
                    : "off");
        const teamsMode = (typeof options.teams === "string"
            ? options.teams
            : explicitFeatureFlags
                ? "off"
                : selectedFeatures.includes("teams")
                    ? "on"
                    : "off");
        const gitMode = (typeof options.git === "string"
            ? options.git
            : explicitFeatureFlags
                ? "off"
                : selectedFeatures.includes("git")
                    ? "on"
                    : "off");
        const existing = await loadProjectManifest(rootDir);
        if (existing) {
            output.write(JSON.stringify({
                status: "already_initialized",
                manifest: path.join(rootDir, MANIFEST_RELATIVE_PATH)
            }, null, 2) + "\n");
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
            await runGitOnboarding(rootDir, language === "en" ? "en" : "ko", options);
        }
        return;
    }
    if (command === "update") {
        const result = await updateProject(rootDir);
        output.write(`${formatSyncResult(result)}\n`);
        return;
    }
    if (command === "lang") {
        const language = (typeof options.value === "string"
            ? options.value
            : await choose("Choose project language", [
                { value: "ko", label: "Korean" },
                { value: "en", label: "English" }
            ]));
        const result = await updateProjectLanguage(rootDir, language);
        output.write(`${formatSyncResult(result)}\n`);
        return;
    }
    if (command === "auto") {
        const autoMode = (typeof options.value === "string"
            ? options.value
            : await choose("Choose auto mode", [
                { value: "on", label: "on" },
                { value: "off", label: "off" }
            ]));
        const result = await updateProjectAutoMode(rootDir, autoMode);
        output.write(`${formatSyncResult(result)}\n`);
        return;
    }
    if (command === "teams") {
        const teamsMode = (typeof options.value === "string"
            ? options.value
            : await choose("Choose teams mode", [
                { value: "off", label: "off" },
                { value: "on", label: "on" }
            ]));
        const result = await updateProjectTeamsMode(rootDir, teamsMode);
        output.write(`${formatSyncResult(result)}\n`);
        return;
    }
    if (command === "git") {
        const language = await resolveHelpLanguage(rootDir, options.lang);
        const gitMode = (typeof options.value === "string"
            ? options.value
            : await choose("Choose git mode", [
                { value: "off", label: "off" },
                { value: "on", label: "on" }
            ]));
        const result = await updateProjectGitMode(rootDir, gitMode);
        output.write(`${formatSyncResult(result)}\n`);
        if (gitMode === "on") {
            if (isGitSetupOptionProvided(options) || (process.stdin.isTTY && process.stdout.isTTY)) {
                await runGitOnboarding(rootDir, language, options);
            }
            else {
                throw new Error(language === "ko"
                    ? "Git 활성화 후 저장소 설정에는 interactive terminal 또는 --git-setup local|fast|setup|defer 옵션이 필요합니다."
                    : "Enabling Git repository setup requires an interactive terminal or --git-setup local|fast|setup|defer.");
            }
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
    const child = spawn("pnpm", ["--dir", workspaceRoot, "--filter", "@pgg/dashboard", "exec", "vite", "--host", host, "--port", String(port)], {
        stdio: "inherit",
        env: {
            ...process.env,
            PGG_DASHBOARD_ROOT: rootDir
        }
    });
    child.on("exit", (code) => {
        process.exitCode = code ?? 0;
    });
}
run().catch((error) => {
    if (error instanceof InteractiveCancelError) {
        output.write(`${JSON.stringify({ status: "cancelled" }, null, 2)}\n`);
        process.exitCode = 0;
        return;
    }
    const message = error instanceof Error ? error.message : String(error);
    output.write(`${JSON.stringify({ error: message }, null, 2)}\n`);
    process.exitCode = 1;
});
//# sourceMappingURL=index.js.map