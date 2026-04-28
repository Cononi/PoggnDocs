import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
export { buildRootReadme, writeRootReadme } from "./readme.js";
export { PGG_COMPATIBILITY_FLOW_ALIASES, PGG_CONDITIONAL_HELPER_FLOWS, PGG_DEFAULT_FLOW, PGG_RUN_STATE_SCHEMA_EXAMPLE, PGG_SKILL_DEFINITION_BY_ID, PGG_SKILL_DEFINITIONS, PGG_TOKEN_USAGE_RECORD_SCHEMA_EXAMPLE, REQUIRED_SKILL_DEFINITION_FIELDS, validatePggSkillDefinition, validatePggSkillRegistry } from "./skill-framework/index.js";
import { buildGeneratedFiles } from "./templates.js";
export { createProjectVerificationPreset, normalizeProjectVerification, resolveProjectVerification } from "./verification.js";
import { normalizeProjectVerification, resolveProjectVerification } from "./verification.js";
export const PGG_VERSION = "0.1.0";
export const MANIFEST_RELATIVE_PATH = ".pgg/project.json";
export const REGISTRY_RELATIVE_PATH = ".pgg/registry.json";
export const USER_CONFIG_RELATIVE_PATH = ".pgg/user.json";
const STAGE_TO_WORKFLOW = {
    proposal: "pgg-add",
    plan: "pgg-plan",
    task: "pgg-plan",
    implementation: "pgg-code",
    refactor: "pgg-refactor",
    token: "pgg-token",
    performance: "pgg-performance",
    qa: "pgg-qa"
};
function checksum(value) {
    return createHash("sha256").update(value).digest("hex");
}
function nowIso() {
    return new Date().toISOString();
}
function stableProjectId(rootDir) {
    const base = path.basename(rootDir).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project";
    return `${base}-${checksum(rootDir).slice(0, 8)}`;
}
function sanitizeFileName(value) {
    return value.replace(/[\\/.: ]+/g, "_");
}
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "category";
}
function dedupeList(values) {
    return [...new Set(values)];
}
function createDefaultCategory(projectIds, timestamp) {
    return {
        id: "home",
        name: "home",
        isDefault: true,
        order: 0,
        visible: true,
        projectIds: dedupeList(projectIds),
        createdAt: timestamp,
        updatedAt: timestamp
    };
}
function normalizeCategories(categories, projectIds, timestamp) {
    const knownProjectIds = new Set(projectIds);
    const source = categories?.length ? categories : [createDefaultCategory(projectIds, timestamp)];
    let changed = !categories?.length;
    const usedIds = new Set();
    const normalized = source.map((category, index) => {
        const shouldMigrateLegacyDefault = category.isDefault && (category.id === "default" || category.name === "All Projects");
        const nextId = shouldMigrateLegacyDefault
            ? "home"
            : category.id && !usedIds.has(category.id)
                ? category.id
                : `${slugify(category.name)}-${index + 1}`;
        if (nextId !== category.id) {
            changed = true;
        }
        usedIds.add(nextId);
        const nextProjectIds = dedupeList(category.projectIds.filter((projectId) => knownProjectIds.has(projectId)));
        if (nextProjectIds.length !== category.projectIds.length) {
            changed = true;
        }
        const nextCategory = {
            id: nextId,
            name: shouldMigrateLegacyDefault ? "home" : category.name || `Category ${index + 1}`,
            isDefault: category.isDefault,
            order: index,
            visible: category.visible ?? true,
            projectIds: nextProjectIds,
            createdAt: category.createdAt || timestamp,
            updatedAt: category.updatedAt || timestamp
        };
        if (category.order !== index) {
            changed = true;
        }
        if (category.visible === undefined) {
            changed = true;
        }
        return nextCategory;
    });
    if (normalized.length === 0) {
        return {
            categories: [createDefaultCategory(projectIds, timestamp)],
            changed: true
        };
    }
    const defaultIndex = normalized.findIndex((category) => category.isDefault);
    const resolvedDefaultIndex = defaultIndex >= 0 ? defaultIndex : 0;
    normalized.forEach((category, index) => {
        const shouldBeDefault = index === resolvedDefaultIndex;
        if (category.isDefault !== shouldBeDefault) {
            category.isDefault = shouldBeDefault;
            changed = true;
        }
    });
    const assigned = new Set(normalized.flatMap((category) => category.projectIds));
    const fallbackDefault = normalized[resolvedDefaultIndex];
    for (const projectId of projectIds) {
        if (!assigned.has(projectId)) {
            fallbackDefault.projectIds.push(projectId);
            fallbackDefault.updatedAt = timestamp;
            changed = true;
        }
    }
    return {
        categories: normalized,
        changed
    };
}
function normalizeRegistryData(registry) {
    const timestamp = nowIso();
    let changed = false;
    const projects = registry.projects.map((entry) => {
        if (!entry.teamsMode) {
            changed = true;
        }
        if (!entry.gitMode) {
            changed = true;
        }
        return {
            ...entry,
            teamsMode: entry.teamsMode ?? "off",
            gitMode: entry.gitMode ?? "off"
        };
    });
    const projectIds = projects.map((entry) => entry.id);
    const normalizedCategories = normalizeCategories(registry.dashboard?.categories, projectIds, timestamp);
    const nextRegistry = {
        version: Math.max(registry.version ?? 1, 3),
        projects,
        dashboard: {
            categories: normalizedCategories.categories
        }
    };
    return {
        registry: nextRegistry,
        changed: changed ||
            normalizedCategories.changed ||
            nextRegistry.version !== registry.version ||
            !registry.dashboard
    };
}
async function ensureParentDir(filePath) {
    await mkdir(path.dirname(filePath), { recursive: true });
}
async function readTextIfExists(filePath) {
    try {
        return await readFile(filePath, "utf8");
    }
    catch {
        return null;
    }
}
function readNonEmptyString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
function compareSemverVersions(left, right) {
    const leftParts = left.split(".").map((part) => Number.parseInt(part, 10) || 0);
    const rightParts = right.split(".").map((part) => Number.parseInt(part, 10) || 0);
    const maxLength = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < maxLength; index += 1) {
        const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
        if (difference !== 0) {
            return difference;
        }
    }
    return 0;
}
async function readLatestVersionHistoryEntry(rootDir) {
    const ledgerPath = path.join(rootDir, "poggn/version-history.ndjson");
    const raw = await readTextIfExists(ledgerPath);
    if (!raw) {
        return null;
    }
    const lines = raw
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .reverse();
    for (const line of lines) {
        try {
            const parsed = JSON.parse(line);
            const version = readNonEmptyString(parsed.version) ?? readNonEmptyString(parsed.targetVersion);
            if (version) {
                return version;
            }
        }
        catch {
            continue;
        }
    }
    return null;
}
async function readLatestArchivedProjectVersion(rootDir) {
    const archiveRoot = path.join(rootDir, "poggn/archive");
    let topicNames;
    try {
        topicNames = await readdir(archiveRoot);
    }
    catch {
        return null;
    }
    let latestVersion = null;
    let latestArchivedAt = null;
    for (const topicName of topicNames) {
        const versionPath = path.join(archiveRoot, topicName, "version.json");
        const raw = await readTextIfExists(versionPath);
        if (!raw) {
            continue;
        }
        try {
            const parsed = JSON.parse(raw);
            const candidateVersion = readNonEmptyString(parsed.version) ?? readNonEmptyString(parsed.targetVersion);
            if (!candidateVersion) {
                continue;
            }
            const candidateArchivedAt = readNonEmptyString(parsed.archivedAt);
            if (!latestVersion) {
                latestVersion = candidateVersion;
                latestArchivedAt = candidateArchivedAt;
                continue;
            }
            const hasNewerArchivedAt = candidateArchivedAt !== null &&
                (latestArchivedAt === null || candidateArchivedAt.localeCompare(latestArchivedAt) > 0);
            const hasComparableArchivedAt = candidateArchivedAt !== null || latestArchivedAt !== null;
            const hasHigherSemver = compareSemverVersions(candidateVersion, latestVersion) > 0;
            if (hasNewerArchivedAt || (!hasComparableArchivedAt && hasHigherSemver)) {
                latestVersion = candidateVersion;
                latestArchivedAt = candidateArchivedAt;
            }
        }
        catch {
            continue;
        }
    }
    return latestVersion;
}
async function readProjectPackageVersion(rootDir) {
    const candidatePaths = [
        path.join(rootDir, "package.json"),
        path.join(rootDir, "apps", "dashboard", "package.json")
    ];
    for (const candidatePath of candidatePaths) {
        const raw = await readTextIfExists(candidatePath);
        if (!raw) {
            continue;
        }
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed.version === "string" && parsed.version.trim()) {
                return parsed.version;
            }
        }
        catch {
            continue;
        }
    }
    return null;
}
async function readProjectVersion(rootDir) {
    return ((await readLatestVersionHistoryEntry(rootDir)) ??
        (await readLatestArchivedProjectVersion(rootDir)) ??
        (await readProjectPackageVersion(rootDir)));
}
async function writeTextFile(filePath, content) {
    await ensureParentDir(filePath);
    await writeFile(filePath, content, "utf8");
}
function manifestPath(rootDir) {
    return path.join(rootDir, MANIFEST_RELATIVE_PATH);
}
function registryPath() {
    return path.join(process.env.PGG_HOME ?? process.env.HOME ?? os.homedir(), REGISTRY_RELATIVE_PATH);
}
function userConfigPath() {
    return path.join(process.env.PGG_HOME ?? process.env.HOME ?? os.homedir(), USER_CONFIG_RELATIVE_PATH);
}
export function normalizeGlobalUsername(value) {
    const username = value.trim();
    if (!username) {
        throw new Error("Username is required. Run `pgg config username {name}` first.");
    }
    return username;
}
function normalizeGlobalUserConfig(config) {
    const username = typeof config?.username === "string" && config.username.trim()
        ? config.username.trim()
        : null;
    const updatedAt = typeof config?.updatedAt === "string" && config.updatedAt.trim()
        ? config.updatedAt
        : null;
    return { username, updatedAt };
}
export async function loadGlobalUserConfig() {
    const raw = await readTextIfExists(userConfigPath());
    if (!raw) {
        return { username: null, updatedAt: null };
    }
    return normalizeGlobalUserConfig(JSON.parse(raw));
}
export async function readGlobalUser() {
    const config = await loadGlobalUserConfig();
    const username = config.username;
    return {
        username,
        configured: Boolean(username),
        source: username ? userConfigPath() : "missing"
    };
}
export async function updateGlobalUsername(username) {
    const nextConfig = {
        username: normalizeGlobalUsername(username),
        updatedAt: nowIso()
    };
    await writeTextFile(userConfigPath(), `${JSON.stringify(nextConfig, null, 2)}\n`);
    return readGlobalUser();
}
export async function assertGlobalUsernameConfigured() {
    const user = await readGlobalUser();
    if (!user.configured) {
        throw new Error("Username is required. Run `pgg config username {name}` first.");
    }
    return user;
}
function buildTemplateInput(manifest) {
    return {
        language: manifest.language,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        provider: manifest.provider,
        version: manifest.installedVersion
    };
}
function getDefaultDashboardTitleIconSvg() {
    return [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">',
        '<defs><linearGradient id="pgg-dashboard-icon" x1="10%" y1="10%" x2="90%" y2="90%">',
        '<stop offset="0%" stop-color="#2467d6" />',
        '<stop offset="55%" stop-color="#4f92ff" />',
        '<stop offset="100%" stop-color="#f59e0b" />',
        "</linearGradient></defs>",
        '<rect x="6" y="6" width="36" height="36" rx="14" fill="#0f172a" />',
        '<path d="M24 11l5.2 7.9 9.3 2.7-5.9 7.3.2 9.9-8.8-3.4-8.8 3.4.2-9.9-5.9-7.3 9.3-2.7L24 11z" fill="url(#pgg-dashboard-icon)" />',
        '<circle cx="24" cy="24" r="4.8" fill="#f8fafc" fill-opacity="0.9" />',
        "</svg>"
    ].join("");
}
function normalizeDashboardConfig(dashboard, projectName) {
    return {
        title: dashboard?.title?.trim() || `${projectName} dashboard`,
        titleIconSvg: dashboard?.titleIconSvg?.trim() || getDefaultDashboardTitleIconSvg(),
        defaultPort: dashboard?.defaultPort ?? 4173,
        refreshIntervalMs: typeof dashboard?.refreshIntervalMs === "number" && Number.isFinite(dashboard.refreshIntervalMs)
            ? Math.max(5_000, Math.min(120_000, Math.round(dashboard.refreshIntervalMs)))
            : 10_000
    };
}
function normalizeOptionalGitString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function normalizeGitProvider(value) {
    return value === "github" || value === "gitlab" || value === "unknown" ? value : undefined;
}
function normalizeGitAuthMethod(value) {
    return value === "https-token" || value === "ssh" || value === "provider-cli" || value === "unknown"
        ? value
        : undefined;
}
function normalizeGitVisibility(value) {
    return value === "private" || value === "public" || value === "unknown" ? value : undefined;
}
function normalizeGitSetupStatus(value, mode) {
    if (value === "none" || value === "detected" || value === "configured" || value === "deferred" || value === "failed") {
        return value;
    }
    return mode === "on" ? "deferred" : "none";
}
function normalizeProjectGitConfig(git) {
    const mode = git?.mode === "on" ? "on" : "off";
    const normalized = {
        mode,
        defaultRemote: git?.defaultRemote?.trim() || "origin",
        workingBranchPrefix: git?.workingBranchPrefix?.trim() || "ai",
        releaseBranchPrefix: git?.releaseBranchPrefix?.trim() || "release",
        setupStatus: normalizeGitSetupStatus(git?.setupStatus, mode)
    };
    const provider = normalizeGitProvider(git?.provider);
    const owner = normalizeOptionalGitString(git?.owner);
    const repository = normalizeOptionalGitString(git?.repository);
    const remoteUrl = normalizeOptionalGitString(git?.remoteUrl);
    const authMethod = normalizeGitAuthMethod(git?.authMethod);
    const visibility = normalizeGitVisibility(git?.visibility);
    const defaultBranch = normalizeOptionalGitString(git?.defaultBranch);
    const setupMessage = normalizeOptionalGitString(git?.setupMessage);
    if (provider)
        normalized.provider = provider;
    if (owner)
        normalized.owner = owner;
    if (repository)
        normalized.repository = repository;
    if (remoteUrl)
        normalized.remoteUrl = remoteUrl;
    if (authMethod)
        normalized.authMethod = authMethod;
    if (visibility)
        normalized.visibility = visibility;
    if (defaultBranch)
        normalized.defaultBranch = defaultBranch;
    if (setupMessage)
        normalized.setupMessage = setupMessage;
    return normalized;
}
function providerFromRemoteHost(host) {
    const normalizedHost = host.toLowerCase();
    if (normalizedHost === "github.com" || normalizedHost.endsWith(".github.com")) {
        return "github";
    }
    if (normalizedHost === "gitlab.com" || normalizedHost.endsWith(".gitlab.com")) {
        return "gitlab";
    }
    return "unknown";
}
function trimGitSuffix(value) {
    return value.replace(/\.git$/i, "").replace(/^\/+|\/+$/g, "");
}
export function parseGitRemoteUrl(remoteUrl) {
    const raw = remoteUrl.trim();
    if (!raw) {
        return null;
    }
    const scpLike = raw.match(/^git@([^:]+):(.+)$/);
    if (scpLike) {
        const host = scpLike[1];
        const pathParts = trimGitSuffix(scpLike[2]).split("/").filter(Boolean);
        if (pathParts.length >= 2) {
            const repository = pathParts.at(-1);
            const owner = pathParts.slice(0, -1).join("/");
            return {
                provider: providerFromRemoteHost(host),
                owner,
                repository,
                url: raw
            };
        }
    }
    try {
        const parsed = new URL(raw);
        const pathParts = trimGitSuffix(parsed.pathname).split("/").filter(Boolean);
        if (pathParts.length < 2) {
            return null;
        }
        const repository = pathParts.at(-1);
        const owner = pathParts.slice(0, -1).join("/");
        return {
            provider: providerFromRemoteHost(parsed.hostname),
            owner,
            repository,
            url: raw
        };
    }
    catch {
        return null;
    }
}
function gitOutput(rootDir, args) {
    try {
        return execFileSync("git", ["-C", rootDir, ...args], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim();
    }
    catch {
        return null;
    }
}
function commandAvailable(command) {
    try {
        execFileSync(command, ["--version"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"]
        });
        return true;
    }
    catch {
        return false;
    }
}
function detectProjectGitConfig(rootDir, manifestGit, options = {}) {
    const normalized = normalizeProjectGitConfig(manifestGit);
    if (normalized.mode === "off" && options.respectDisabledMode !== false) {
        return normalized;
    }
    const remoteUrl = gitOutput(rootDir, ["remote", "get-url", normalized.defaultRemote]);
    if (!remoteUrl) {
        if (existsSync(path.join(rootDir, ".git"))) {
            return normalizeProjectGitConfig({
                ...normalized,
                mode: "on",
                setupStatus: normalized.setupStatus === "configured" ? "configured" : "detected",
                setupMessage: normalized.setupMessage ?? "Detected a local Git repository without a configured remote."
            });
        }
        return normalized;
    }
    const parsed = parseGitRemoteUrl(remoteUrl);
    const currentBranch = gitOutput(rootDir, ["branch", "--show-current"]);
    const detected = {
        ...normalized,
        mode: "on",
        setupStatus: normalized.setupStatus === "configured" ? "configured" : "detected",
        remoteUrl,
        defaultBranch: normalized.defaultBranch ?? currentBranch ?? "main",
        setupMessage: normalized.setupMessage ?? `Detected remote '${normalized.defaultRemote}'.`
    };
    detected.provider = parsed?.provider ?? normalized.provider ?? "unknown";
    const owner = parsed?.owner ?? normalized.owner;
    if (owner) {
        detected.owner = owner;
    }
    const repository = parsed?.repository ?? normalized.repository;
    if (repository) {
        detected.repository = repository;
    }
    return normalizeProjectGitConfig(detected);
}
export async function inspectProjectGitSetup(rootDir) {
    const manifest = await loadProjectManifest(rootDir);
    const manifestGit = normalizeProjectGitConfig(manifest?.git);
    const git = detectProjectGitConfig(rootDir, manifestGit, { respectDisabledMode: false });
    const parsedRemote = git.remoteUrl ? parseGitRemoteUrl(git.remoteUrl) : null;
    const hasGitRepository = existsSync(path.join(rootDir, ".git"));
    const pathKind = parsedRemote ? "fast" : "setup";
    return {
        path: pathKind,
        git,
        parsedRemote,
        hasGitRepository,
        canUseProviderCli: {
            github: commandAvailable("gh"),
            gitlab: commandAvailable("glab")
        },
        message: pathKind === "fast"
            ? "Detected an existing Git remote. Confirm it or reconfigure the repository."
            : "No Git remote was detected. Repository setup can be completed now or later."
    };
}
function normalizeProjectManifest(manifest) {
    return {
        ...manifest,
        schemaVersion: Math.max(manifest.schemaVersion ?? 1, 6),
        teamsMode: manifest.teamsMode ?? "off",
        git: normalizeProjectGitConfig(manifest.git),
        dashboard: normalizeDashboardConfig(manifest.dashboard, manifest.projectName),
        verification: normalizeProjectVerification(manifest.verification)
    };
}
async function removeEmptyParentDirs(rootDir, startDir) {
    const resolvedRoot = path.resolve(rootDir);
    let cursor = path.resolve(startDir);
    while (cursor.startsWith(`${resolvedRoot}${path.sep}`)) {
        const entries = await readdir(cursor).catch(() => null);
        if (!entries || entries.length > 0) {
            return;
        }
        await rm(cursor, { force: true }).catch(() => null);
        const parent = path.dirname(cursor);
        if (parent === cursor) {
            return;
        }
        cursor = parent;
    }
}
async function retireManagedFile(rootDir, record, timestamp, conflicts) {
    const target = path.join(rootDir, record.path);
    const current = await readTextIfExists(target);
    if (current === null) {
        return false;
    }
    if (checksum(current) !== record.checksum) {
        const backupPath = path.join(rootDir, ".pgg", "backups", `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(record.path)}`);
        await writeTextFile(backupPath, current);
        conflicts.push({
            path: record.path,
            backupPath: path.relative(rootDir, backupPath)
        });
    }
    await rm(target, { force: true });
    await removeEmptyParentDirs(rootDir, path.dirname(target));
    return true;
}
export function createProjectManifest(rootDir, options = {}) {
    const projectName = path.basename(rootDir);
    return {
        schemaVersion: 6,
        projectName,
        rootDir,
        provider: options.provider ?? "codex",
        language: options.language ?? "ko",
        autoMode: options.autoMode ?? "on",
        teamsMode: options.teamsMode ?? "off",
        git: normalizeProjectGitConfig(options.gitMode
            ? options.gitMode === "on"
                ? {
                    mode: "on",
                    defaultRemote: "origin",
                    workingBranchPrefix: "ai",
                    releaseBranchPrefix: "release",
                    setupStatus: "deferred",
                    setupMessage: "Git setup can be completed after project initialization."
                }
                : {
                    mode: "off",
                    defaultRemote: "origin",
                    workingBranchPrefix: "ai",
                    releaseBranchPrefix: "release",
                    setupStatus: "none"
                }
            : undefined),
        installedVersion: PGG_VERSION,
        updatedAt: nowIso(),
        dashboard: normalizeDashboardConfig(undefined, projectName),
        verification: normalizeProjectVerification(undefined),
        managedFiles: []
    };
}
export async function loadProjectManifest(rootDir) {
    const raw = await readTextIfExists(manifestPath(rootDir));
    if (!raw) {
        return null;
    }
    return normalizeProjectManifest(JSON.parse(raw));
}
export async function saveProjectManifest(rootDir, manifest) {
    const target = manifestPath(rootDir);
    await writeTextFile(target, `${JSON.stringify(normalizeProjectManifest(manifest), null, 2)}\n`);
}
export async function loadGlobalRegistry() {
    const raw = await readTextIfExists(registryPath());
    if (!raw) {
        return normalizeRegistryData({
            version: 1,
            projects: []
        }).registry;
    }
    return normalizeRegistryData(JSON.parse(raw)).registry;
}
export async function saveGlobalRegistry(registry) {
    const target = registryPath();
    await writeTextFile(target, `${JSON.stringify(registry, null, 2)}\n`);
}
async function loadPersistedGlobalRegistry() {
    const raw = await readTextIfExists(registryPath());
    const parsed = raw
        ? JSON.parse(raw)
        : {
            version: 1,
            projects: []
        };
    const normalized = normalizeRegistryData(parsed);
    if (normalized.changed) {
        await saveGlobalRegistry(normalized.registry);
    }
    return normalized.registry;
}
export async function syncProject(rootDir, manifest) {
    const normalizedManifest = normalizeProjectManifest(manifest);
    const priorManifestContent = await readTextIfExists(manifestPath(rootDir));
    const priorManaged = new Map(normalizedManifest.managedFiles.map((entry) => [entry.path, entry]));
    const templates = buildGeneratedFiles(buildTemplateInput(normalizedManifest));
    const created = [];
    const updated = [];
    const unchanged = [];
    const conflicts = [];
    const nextManaged = [];
    const timestamp = nowIso();
    for (const template of templates) {
        const target = path.join(rootDir, template.path);
        const current = await readTextIfExists(target);
        const nextChecksum = checksum(template.content);
        const previousManaged = priorManaged.get(template.path);
        const preserveExistingContent = template.preserveExistingContent === true;
        if (!preserveExistingContent &&
            current !== null &&
            previousManaged &&
            checksum(current) !== previousManaged.checksum &&
            current !== template.content) {
            const backupPath = path.join(rootDir, ".pgg", "backups", `${timestamp.replaceAll(":", "-")}-${sanitizeFileName(template.path)}`);
            await writeTextFile(backupPath, current);
            conflicts.push({
                path: template.path,
                backupPath: path.relative(rootDir, backupPath)
            });
        }
        if (current === null) {
            await writeTextFile(target, template.content);
            created.push(template.path);
        }
        else if (preserveExistingContent) {
            unchanged.push(template.path);
        }
        else if (current !== template.content) {
            await writeTextFile(target, template.content);
            updated.push(template.path);
        }
        else {
            unchanged.push(template.path);
        }
        if (template.executable) {
            await chmod(target, 0o755);
        }
        nextManaged.push({
            path: template.path,
            checksum: nextChecksum,
            executable: template.executable ?? false
        });
    }
    const activeTemplatePaths = new Set(templates.map((template) => template.path));
    for (const [managedPath, record] of priorManaged.entries()) {
        if (activeTemplatePaths.has(managedPath)) {
            continue;
        }
        const retired = await retireManagedFile(rootDir, record, timestamp, conflicts);
        if (retired) {
            updated.push(managedPath);
        }
    }
    const nextManifestBase = {
        ...normalizedManifest,
        installedVersion: PGG_VERSION,
        updatedAt: normalizedManifest.updatedAt,
        managedFiles: nextManaged
    };
    const manifestChangedWithoutTimestamp = priorManifestContent === null ||
        `${JSON.stringify(nextManifestBase, null, 2)}\n` !== priorManifestContent;
    const nextManifest = {
        ...nextManifestBase,
        updatedAt: manifestChangedWithoutTimestamp ? timestamp : normalizedManifest.updatedAt
    };
    const nextManifestContent = `${JSON.stringify(nextManifest, null, 2)}\n`;
    if (priorManifestContent === null) {
        created.push(MANIFEST_RELATIVE_PATH);
    }
    else if (nextManifestContent !== priorManifestContent) {
        updated.push(MANIFEST_RELATIVE_PATH);
    }
    else {
        unchanged.push(MANIFEST_RELATIVE_PATH);
    }
    if (priorManifestContent !== nextManifestContent) {
        await writeTextFile(manifestPath(rootDir), nextManifestContent);
    }
    return {
        manifest: nextManifest,
        created,
        updated,
        unchanged,
        conflicts
    };
}
export function summarizeSyncResult(result) {
    const created = result.created.length;
    const updated = result.updated.length;
    const unchanged = result.unchanged.length;
    const conflicts = result.conflicts.length;
    const status = conflicts > 0 ? "conflicted" : created > 0 || updated > 0 ? "changed" : "unchanged";
    return {
        status,
        created,
        updated,
        unchanged,
        conflicts,
        paths: {
            created: [...result.created],
            updated: [...result.updated],
            unchanged: [...result.unchanged],
            conflicts: result.conflicts.map((conflict) => ({ ...conflict }))
        }
    };
}
export async function registerProject(manifest) {
    const registry = await loadPersistedGlobalRegistry();
    const nextEntry = {
        id: stableProjectId(manifest.rootDir),
        name: manifest.projectName,
        rootDir: manifest.rootDir,
        provider: manifest.provider,
        language: manifest.language,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        gitMode: manifest.git.mode,
        lastOpenedAt: nowIso()
    };
    const projects = registry.projects.filter((entry) => entry.rootDir !== manifest.rootDir);
    projects.unshift(nextEntry);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        projects
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function initializeProject(rootDir, options = {}) {
    const manifest = createProjectManifest(rootDir, options);
    return syncRegisteredProject(rootDir, manifest);
}
async function requireManifest(rootDir) {
    const manifest = await loadProjectManifest(rootDir);
    if (!manifest) {
        throw new Error("Project is not initialized. Run `pgg init` first.");
    }
    return manifest;
}
async function syncRegisteredProject(rootDir, manifest) {
    const syncResult = await syncProject(rootDir, manifest);
    await registerProject(syncResult.manifest);
    return syncResult;
}
async function updateRegisteredProject(rootDir, updateManifest) {
    const manifest = await requireManifest(rootDir);
    return syncRegisteredProject(rootDir, updateManifest(manifest));
}
export async function updateProject(rootDir) {
    return updateRegisteredProject(rootDir, (manifest) => manifest);
}
export async function updateProjectLanguage(rootDir, language) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, language }));
}
export async function updateProjectAutoMode(rootDir, autoMode) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, autoMode }));
}
export async function updateProjectTeamsMode(rootDir, teamsMode) {
    return updateRegisteredProject(rootDir, (manifest) => ({ ...manifest, teamsMode }));
}
export async function updateProjectGitMode(rootDir, gitMode) {
    return updateRegisteredProject(rootDir, (manifest) => {
        const current = normalizeProjectGitConfig(manifest.git);
        const next = {
            ...current,
            mode: gitMode,
            setupStatus: gitMode === "on" ? (current.setupStatus === "none" ? "deferred" : current.setupStatus) : "none"
        };
        if (gitMode === "on") {
            next.setupMessage = current.setupMessage ?? "Git is enabled. Repository connection can be completed later.";
        }
        else {
            delete next.setupMessage;
        }
        return {
            ...manifest,
            git: normalizeProjectGitConfig(next)
        };
    });
}
export async function deferProjectGitSetup(rootDir, setupMessage) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        git: normalizeProjectGitConfig({
            ...normalizeProjectGitConfig(manifest.git),
            mode: "on",
            setupStatus: "deferred",
            setupMessage: setupMessage.trim() || "Git setup was deferred and can be completed later."
        })
    }));
}
async function defaultGitCommandRunner(command, args, options) {
    try {
        const stdout = execFileSync(command, args, {
            cwd: options.cwd,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"]
        });
        return { stdout: stdout.trim(), stderr: "", exitCode: 0 };
    }
    catch (error) {
        const failure = error;
        return {
            stdout: Buffer.isBuffer(failure.stdout) ? failure.stdout.toString("utf8").trim() : String(failure.stdout ?? "").trim(),
            stderr: Buffer.isBuffer(failure.stderr) ? failure.stderr.toString("utf8").trim() : String(failure.stderr ?? "").trim(),
            exitCode: typeof failure.status === "number" ? failure.status : 1
        };
    }
}
function sanitizeGitOnboardingString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function createRemoteUrl(input) {
    const host = input.provider === "gitlab" ? "gitlab.com" : "github.com";
    const repoPath = `${input.owner}/${input.repository}`.replace(/^\/+|\/+$/g, "");
    return input.authMethod === "ssh" ? `git@${host}:${repoPath}.git` : `https://${host}/${repoPath}.git`;
}
async function runGitStep(steps, runner, rootDir, id, message, command, args) {
    const result = await runner(command, args, { cwd: rootDir });
    const ok = result.exitCode === 0;
    steps.push({
        id,
        status: ok ? "success" : "failed",
        message: ok ? message : `${message} failed${result.stderr ? `: ${result.stderr}` : ""}`
    });
    return ok;
}
function createGitOnboardingResult(input) {
    return {
        path: input.path,
        status: input.status,
        setupStatus: input.setupStatus,
        provider: input.provider ?? null,
        owner: input.owner ?? null,
        repository: input.repository ?? null,
        remoteUrl: input.remoteUrl ?? null,
        authMethod: input.authMethod ?? null,
        defaultBranch: input.defaultBranch ?? null,
        message: input.message,
        steps: input.steps
    };
}
async function completeGitOnboarding(rootDir, request, detected, steps, message) {
    const parsed = request.remoteUrl ? parseGitRemoteUrl(request.remoteUrl) : null;
    const provider = normalizeGitProvider(request.provider) ?? parsed?.provider ?? detected.provider ?? "unknown";
    const owner = sanitizeGitOnboardingString(request.owner) ?? parsed?.owner ?? detected.owner ?? null;
    const repository = sanitizeGitOnboardingString(request.repository) ?? parsed?.repository ?? detected.repository ?? null;
    const authMethod = normalizeGitAuthMethod(request.authMethod) ?? detected.authMethod ?? "unknown";
    const remoteUrl = sanitizeGitOnboardingString(request.remoteUrl) ?? detected.remoteUrl ?? null;
    const defaultBranch = sanitizeGitOnboardingString(request.defaultBranch) ?? detected.defaultBranch ?? "main";
    const visibility = normalizeGitVisibility(request.visibility) ?? detected.visibility;
    const connectionUpdates = {
        provider,
        authMethod,
        defaultBranch,
        setupStatus: "configured",
        setupMessage: message
    };
    if (owner)
        connectionUpdates.owner = owner;
    if (repository)
        connectionUpdates.repository = repository;
    if (remoteUrl)
        connectionUpdates.remoteUrl = remoteUrl;
    if (visibility)
        connectionUpdates.visibility = visibility;
    await updateProjectGitConnection(rootDir, connectionUpdates);
    return createGitOnboardingResult({
        path: request.path,
        status: "configured",
        setupStatus: "configured",
        provider,
        owner,
        repository,
        remoteUrl,
        authMethod,
        defaultBranch,
        message,
        steps
    });
}
export async function runProjectGitOnboarding(rootDir, request, runner = defaultGitCommandRunner) {
    const inspection = await inspectProjectGitSetup(rootDir);
    const steps = [];
    if (request.path === "defer") {
        const message = request.deferMessage?.trim() || "Git setup was deferred and can be completed later.";
        await deferProjectGitSetup(rootDir, message);
        steps.push({ id: "defer", status: "success", message });
        return createGitOnboardingResult({
            path: "defer",
            status: "deferred",
            setupStatus: "deferred",
            provider: inspection.git.provider ?? null,
            owner: inspection.git.owner ?? null,
            repository: inspection.git.repository ?? null,
            remoteUrl: inspection.git.remoteUrl ?? null,
            authMethod: inspection.git.authMethod ?? null,
            defaultBranch: inspection.git.defaultBranch ?? null,
            message,
            steps
        });
    }
    if (request.path === "local") {
        if (!inspection.hasGitRepository) {
            const initialized = await runGitStep(steps, runner, rootDir, "git-init", "Initialized local Git repository.", "git", ["init"]);
            if (!initialized) {
                return createGitOnboardingResult({
                    path: "local",
                    status: "failed",
                    setupStatus: "failed",
                    message: "Local Git initialization failed.",
                    steps
                });
            }
        }
        else {
            steps.push({ id: "git-init", status: "skipped", message: "Local Git repository already exists." });
        }
        await updateProjectGitConnection(rootDir, {
            provider: "unknown",
            authMethod: "unknown",
            setupStatus: "configured",
            setupMessage: "Configured local Git repository without a remote.",
            defaultBranch: request.defaultBranch ?? inspection.git.defaultBranch ?? "main"
        });
        return createGitOnboardingResult({
            path: "local",
            status: "configured",
            setupStatus: "configured",
            provider: "unknown",
            owner: null,
            repository: null,
            remoteUrl: null,
            authMethod: "unknown",
            defaultBranch: request.defaultBranch ?? inspection.git.defaultBranch ?? "main",
            message: "Configured local Git repository without a remote.",
            steps
        });
    }
    if (request.path === "fast" && !inspection.parsedRemote && !request.remoteUrl) {
        steps.push({ id: "detect-remote", status: "failed", message: "FAST PATH requires an existing or provided remote URL." });
        return createGitOnboardingResult({
            path: "fast",
            status: "failed",
            setupStatus: "failed",
            message: "FAST PATH requires an existing or provided remote URL.",
            steps
        });
    }
    if ((request.path === "fast" || request.path === "setup") && !request.confirmRemoteMutation) {
        steps.push({ id: "confirm", status: "pending", message: "Remote setup requires confirmation before changing git state." });
        return createGitOnboardingResult({
            path: request.path,
            status: "blocked",
            setupStatus: inspection.git.setupStatus,
            provider: inspection.git.provider ?? null,
            owner: inspection.git.owner ?? null,
            repository: inspection.git.repository ?? null,
            remoteUrl: inspection.git.remoteUrl ?? null,
            authMethod: inspection.git.authMethod ?? null,
            defaultBranch: inspection.git.defaultBranch ?? null,
            message: "Remote setup requires confirmation before changing git state.",
            steps
        });
    }
    const provider = normalizeGitProvider(request.provider) ?? inspection.parsedRemote?.provider ?? "github";
    const owner = sanitizeGitOnboardingString(request.owner) ?? inspection.parsedRemote?.owner;
    const repository = sanitizeGitOnboardingString(request.repository) ?? inspection.parsedRemote?.repository;
    const authMethod = normalizeGitAuthMethod(request.authMethod) ?? "ssh";
    const defaultBranch = sanitizeGitOnboardingString(request.defaultBranch) ?? inspection.git.defaultBranch ?? "main";
    const remoteUrl = sanitizeGitOnboardingString(request.remoteUrl) ??
        inspection.git.remoteUrl ??
        (owner && repository ? createRemoteUrl({ provider, owner, repository, authMethod }) : undefined);
    if (!remoteUrl || !owner || !repository) {
        steps.push({ id: "repository", status: "failed", message: "Provider, owner, repository, and remote URL are required." });
        return createGitOnboardingResult({
            path: request.path,
            status: "failed",
            setupStatus: "failed",
            provider,
            owner: owner ?? null,
            repository: repository ?? null,
            remoteUrl: remoteUrl ?? null,
            authMethod,
            defaultBranch,
            message: "Provider, owner, repository, and remote URL are required.",
            steps
        });
    }
    if (!inspection.hasGitRepository) {
        const initialized = await runGitStep(steps, runner, rootDir, "git-init", "Initialized local Git repository.", "git", ["init"]);
        if (!initialized) {
            return createGitOnboardingResult({ path: request.path, status: "failed", setupStatus: "failed", provider, owner, repository, remoteUrl, authMethod, defaultBranch, message: "Git initialization failed.", steps });
        }
    }
    else {
        steps.push({ id: "git-init", status: "skipped", message: "Local Git repository already exists." });
    }
    if (request.path === "setup") {
        const remoteAction = inspection.git.remoteUrl ? "set-url" : "add";
        const remoteArgs = remoteAction === "set-url" ? ["remote", "set-url", inspection.git.defaultRemote, remoteUrl] : ["remote", "add", inspection.git.defaultRemote, remoteUrl];
        const remoteConfigured = await runGitStep(steps, runner, rootDir, "remote", `Configured remote '${inspection.git.defaultRemote}'.`, "git", remoteArgs);
        if (!remoteConfigured) {
            return createGitOnboardingResult({ path: request.path, status: "failed", setupStatus: "failed", provider, owner, repository, remoteUrl, authMethod, defaultBranch, message: "Remote configuration failed.", steps });
        }
    }
    else {
        steps.push({ id: "remote", status: "success", message: `Using detected remote '${inspection.git.defaultRemote}'.` });
    }
    const authOk = authMethod === "provider-cli"
        ? await runGitStep(steps, runner, rootDir, "auth", `Checked ${provider === "gitlab" ? "glab" : "gh"} authentication.`, provider === "gitlab" ? "glab" : "gh", ["auth", "status"])
        : await runGitStep(steps, runner, rootDir, "auth", "Checked remote access.", "git", ["ls-remote", remoteUrl, "HEAD"]);
    if (!authOk) {
        return createGitOnboardingResult({ path: request.path, status: "failed", setupStatus: "failed", provider, owner, repository, remoteUrl, authMethod, defaultBranch, message: "Git authentication or remote access check failed.", steps });
    }
    const branchOk = await runGitStep(steps, runner, rootDir, "branch", `Selected default branch '${defaultBranch}'.`, "git", ["branch", "-M", defaultBranch]);
    if (!branchOk) {
        return createGitOnboardingResult({ path: request.path, status: "failed", setupStatus: "failed", provider, owner, repository, remoteUrl, authMethod, defaultBranch, message: "Default branch selection failed.", steps });
    }
    if (request.confirmPush) {
        const pushOk = await runGitStep(steps, runner, rootDir, "push", `Pushed '${defaultBranch}' to '${inspection.git.defaultRemote}'.`, "git", ["push", "-u", inspection.git.defaultRemote, defaultBranch]);
        if (!pushOk) {
            return createGitOnboardingResult({ path: request.path, status: "failed", setupStatus: "failed", provider, owner, repository, remoteUrl, authMethod, defaultBranch, message: "Git push failed.", steps });
        }
    }
    else {
        steps.push({ id: "push", status: "skipped", message: "Push was skipped because it was not confirmed." });
    }
    return completeGitOnboarding(rootDir, {
        ...request,
        provider,
        owner,
        repository,
        remoteUrl,
        authMethod,
        defaultBranch
    }, inspection.git, steps, request.confirmPush ? "Git repository connection completed." : "Git repository connection configured; push was skipped.");
}
export async function updateProjectGitConnection(rootDir, updates) {
    return updateRegisteredProject(rootDir, (manifest) => {
        const current = normalizeProjectGitConfig(manifest.git);
        return {
            ...manifest,
            git: normalizeProjectGitConfig({
                ...current,
                ...updates,
                mode: updates.mode ?? "on",
                defaultRemote: updates.defaultRemote ?? current.defaultRemote,
                workingBranchPrefix: current.workingBranchPrefix,
                releaseBranchPrefix: current.releaseBranchPrefix,
                setupStatus: updates.setupStatus ?? current.setupStatus
            })
        };
    });
}
export async function updateProjectDashboardPort(rootDir, defaultPort) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            defaultPort
        }
    }));
}
export async function updateProjectDashboardTitle(rootDir, title) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            title: title.trim() || manifest.dashboard.title
        }
    }));
}
export async function updateProjectMainSettings(rootDir, updates) {
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        language: updates.language === "en" || updates.language === "ko"
            ? updates.language
            : manifest.language,
        dashboard: {
            ...manifest.dashboard,
            title: typeof updates.title === "string"
                ? updates.title.trim() || manifest.dashboard.title
                : manifest.dashboard.title,
            titleIconSvg: typeof updates.titleIconSvg === "string"
                ? updates.titleIconSvg.trim() || manifest.dashboard.titleIconSvg
                : manifest.dashboard.titleIconSvg
        }
    }));
}
export async function updateProjectRefreshInterval(rootDir, refreshIntervalMs) {
    const normalized = Math.max(5_000, Math.min(120_000, Math.round(refreshIntervalMs)));
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        dashboard: {
            ...manifest.dashboard,
            refreshIntervalMs: normalized
        }
    }));
}
export async function updateProjectGitBranchPrefixes(rootDir, workingBranchPrefix, releaseBranchPrefix) {
    const normalizePrefix = (value, fallback) => value.trim().replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9/_-]+/gi, "-") || fallback;
    return updateRegisteredProject(rootDir, (manifest) => ({
        ...manifest,
        git: {
            ...normalizeProjectGitConfig(manifest.git),
            workingBranchPrefix: normalizePrefix(workingBranchPrefix, "ai"),
            releaseBranchPrefix: normalizePrefix(releaseBranchPrefix, "release")
        }
    }));
}
function requireCategory(registry, categoryId) {
    const category = registry.dashboard?.categories.find((entry) => entry.id === categoryId);
    if (!category) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    return category;
}
export async function createProjectCategory(name) {
    const registry = await loadPersistedGlobalRegistry();
    const timestamp = nowIso();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const category = {
        id: `${slugify(name)}-${timestamp.slice(11, 19).replaceAll(":", "").toLowerCase()}`,
        name: name.trim() || "New Category",
        isDefault: categories.length === 0,
        order: categories.length,
        visible: true,
        projectIds: [],
        createdAt: timestamp,
        updatedAt: timestamp
    };
    categories.push(category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function renameProjectCategory(categoryId, name) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = (registry.dashboard?.categories ?? []).map((category) => category.id === categoryId
        ? {
            ...category,
            name: name.trim() || category.name,
            updatedAt: nowIso()
        }
        : category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function setDefaultProjectCategory(categoryId) {
    const registry = await loadPersistedGlobalRegistry();
    requireCategory(registry, categoryId);
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => ({
        ...category,
        isDefault: category.id === categoryId,
        updatedAt: category.id === categoryId ? timestamp : category.updatedAt
    }));
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function deleteProjectCategory(categoryId) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const category = requireCategory(registry, categoryId);
    if (categories.length <= 1) {
        throw new Error("At least one category must remain.");
    }
    const fallback = categories.find((entry) => entry.id !== categoryId) ?? null;
    if (!fallback) {
        throw new Error("A fallback category is required.");
    }
    const filtered = categories
        .filter((entry) => entry.id !== categoryId)
        .map((entry) => entry.id === fallback.id
        ? {
            ...entry,
            projectIds: dedupeList([...entry.projectIds, ...category.projectIds]),
            updatedAt: nowIso()
        }
        : entry);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories: filtered
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function setProjectCategoryVisibility(categoryId, visible) {
    const registry = await loadPersistedGlobalRegistry();
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => category.id === categoryId
        ? {
            ...category,
            visible,
            updatedAt: timestamp
        }
        : category);
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function reorderProjectCategory(categoryId, targetIndex) {
    const registry = await loadPersistedGlobalRegistry();
    const categories = [...(registry.dashboard?.categories ?? [])];
    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    if (currentIndex < 0) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    const [moved] = categories.splice(currentIndex, 1);
    if (!moved) {
        throw new Error(`Category '${categoryId}' was not found.`);
    }
    const nextIndex = Math.max(0, Math.min(targetIndex, categories.length));
    categories.splice(nextIndex, 0, moved);
    const timestamp = nowIso();
    const normalized = categories.map((category, index) => ({
        ...category,
        order: index,
        updatedAt: category.id === categoryId ? timestamp : category.updatedAt
    }));
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories: normalized
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function moveProjectToCategory(projectId, targetCategoryId, targetIndex) {
    const registry = await loadPersistedGlobalRegistry();
    requireCategory(registry, targetCategoryId);
    const timestamp = nowIso();
    const categories = (registry.dashboard?.categories ?? []).map((category) => ({
        ...category,
        projectIds: category.projectIds.filter((entry) => entry !== projectId)
    }));
    const target = categories.find((category) => category.id === targetCategoryId);
    const index = Math.max(0, Math.min(targetIndex ?? target.projectIds.length, target.projectIds.length));
    target.projectIds.splice(index, 0, projectId);
    target.updatedAt = timestamp;
    const nextRegistry = normalizeRegistryData({
        ...registry,
        dashboard: {
            categories
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    return nextRegistry;
}
export async function registerExistingProject(rootDir) {
    const manifest = await loadProjectManifest(rootDir);
    if (!manifest) {
        throw new Error("Target project is not initialized. Run `pgg init` there first.");
    }
    return registerProject(manifest);
}
export async function inspectProjectFolder(rootDir) {
    const user = await readGlobalUser();
    return {
        rootDir,
        hasPggProject: Boolean(await loadProjectManifest(rootDir)),
        hasGitRepository: existsSync(path.join(rootDir, ".git")),
        globalUsernameConfigured: user.configured,
        username: user.username
    };
}
export async function initializeDashboardProject(rootDir, request = {}) {
    await assertGlobalUsernameConfigured();
    const existing = await loadProjectManifest(rootDir);
    if (!existing) {
        await initializeProject(rootDir, {
            provider: request.provider ?? "codex",
            language: request.language ?? "ko",
            autoMode: request.autoMode ?? "on",
            teamsMode: request.teamsMode ?? "off",
            gitMode: request.gitMode ?? "off"
        });
    }
    if (request.gitSetup) {
        await runProjectGitOnboarding(rootDir, request.gitSetup);
    }
    const manifest = await loadProjectManifest(rootDir);
    if (!manifest) {
        throw new Error("Project initialization did not create a manifest.");
    }
    return registerProject(manifest);
}
export async function deleteRegisteredProject(projectId, options = {}) {
    const registry = await loadPersistedGlobalRegistry();
    const project = registry.projects.find((entry) => entry.id === projectId) ?? null;
    if (!project) {
        throw new Error(`Project '${projectId}' was not found.`);
    }
    if (options.currentRootDir &&
        path.resolve(project.rootDir) === path.resolve(options.currentRootDir)) {
        throw new Error("The current dashboard root project cannot be deleted.");
    }
    const nextRegistry = normalizeRegistryData({
        ...registry,
        projects: registry.projects.filter((entry) => entry.id !== projectId),
        dashboard: {
            categories: (registry.dashboard?.categories ?? []).map((category) => ({
                ...category,
                projectIds: category.projectIds.filter((entry) => entry !== projectId)
            }))
        }
    }).registry;
    await saveGlobalRegistry(nextRegistry);
    if (options.deleteRootDir) {
        await rm(project.rootDir, { recursive: true, force: true });
    }
    return nextRegistry;
}
function parseMarkdownSection(markdown, title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`## ${escaped}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = markdown.match(pattern);
    if (!match?.[1]) {
        return null;
    }
    return match[1].trim();
}
function parseMarkdownSectionByKeyword(markdown, keyword) {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const sections = [...markdown.matchAll(/^##\s+(.+)$/gm)];
    for (let index = 0; index < sections.length; index += 1) {
        const section = sections[index];
        if (!section) {
            continue;
        }
        const title = section[1]?.trim().toLowerCase() ?? "";
        if (!title.includes(normalizedKeyword)) {
            continue;
        }
        const start = (section.index ?? 0) + section[0].length;
        const end = sections[index + 1]?.index ?? markdown.length;
        return markdown.slice(start, end).trim();
    }
    return null;
}
function parseUserQuestionRecord(markdown) {
    if (!markdown) {
        return [];
    }
    const section = parseMarkdownSectionByKeyword(markdown, "사용자 입력 질문 기록") ??
        parseMarkdownSectionByKeyword(markdown, "user question record");
    if (!section) {
        return [];
    }
    return section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).replace(/^`|`$/g, "").trim())
        .filter(Boolean);
}
function parseKeyValue(markdown, key) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^[ \\t]*${escaped}:\\s*"?([^"\\n]+)"?`, "m");
    const match = markdown.match(pattern);
    return match?.[1]?.trim() ?? null;
}
function parseScore(markdown) {
    const section = parseMarkdownSection(markdown, "Last Expert Score");
    if (!section) {
        return null;
    }
    const match = section.match(/score:\s*([0-9]+)/);
    return match ? Number(match[1]) : null;
}
function parseBlockingIssues(markdown) {
    const section = parseMarkdownSection(markdown, "Last Expert Score");
    if (!section) {
        return null;
    }
    const match = section.match(/blocking issues:\s*(.+)/);
    return match?.[1]?.trim() ?? null;
}
function parseOpenItemStatus(markdown) {
    if (!markdown) {
        return null;
    }
    const section = parseMarkdownSection(markdown, "Open Items");
    if (!section) {
        return null;
    }
    const match = section.match(/status:\s*(.+)/i);
    return match?.[1]?.trim() ?? null;
}
function parseAuditApplicability(markdown) {
    const defaults = {
        "pgg-token": {
            status: "not_required",
            reason: "Audit Applicability not declared"
        },
        "pgg-performance": {
            status: "not_required",
            reason: "Audit Applicability not declared"
        }
    };
    if (!markdown) {
        return defaults;
    }
    const section = parseMarkdownSection(markdown, "Audit Applicability");
    if (!section) {
        return defaults;
    }
    for (const line of section.split("\n").map((value) => value.trim())) {
        const match = line.match(/^- `([^`]+)`: `([^`]+)` \| (.+)$/);
        if (!match) {
            continue;
        }
        const [, rawName, rawStatus, rawReason = ""] = match;
        const lookupName = rawName;
        const name = lookupName === "pgg-performanc" ? "pgg-performance" : lookupName;
        if (!(name in defaults)) {
            continue;
        }
        defaults[name] = {
            status: rawStatus === "required" ? "required" : "not_required",
            reason: rawReason.trim()
        };
    }
    return defaults;
}
function parseChangedFilePaths(markdown) {
    if (!markdown) {
        return [];
    }
    const section = parseMarkdownSection(markdown, "Changed Files");
    if (!section) {
        return [];
    }
    const paths = new Set();
    for (const line of section.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("|---") || /^-\s*(create|update|delete):/i.test(trimmed)) {
            const bulletMatch = trimmed.match(/^-\s*(?:create|update|delete):\s*`([^`]+)`/i);
            if (bulletMatch?.[1]) {
                paths.add(bulletMatch[1].trim());
            }
            continue;
        }
        if (trimmed.startsWith("|")) {
            const columns = trimmed
                .split("|")
                .map((value) => value.trim())
                .filter(Boolean);
            if (columns.length >= 2 && columns[1] !== "path") {
                const value = columns[1]?.replace(/^`|`$/g, "").trim();
                if (value) {
                    paths.add(value);
                }
            }
        }
    }
    return Array.from(paths).sort();
}
function normalizeStageName(value) {
    const normalized = value?.trim().toLowerCase();
    switch (normalized) {
        case "proposal":
        case "plan":
        case "task":
        case "implementation":
        case "refactor":
        case "token":
        case "performance":
        case "qa":
            return normalized;
        default:
            return null;
    }
}
function isNonBlockingMarker(value) {
    if (!value) {
        return true;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === "없음" || normalized === "none" || normalized === "n/a" || normalized === "na";
}
function isArchiveReady(nextAction, openItemStatus) {
    if (openItemStatus?.trim().toLowerCase() === "pass") {
        return true;
    }
    return (nextAction ?? "").toLowerCase().includes("archive");
}
async function hasMarkdownFiles(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
        const target = path.join(dirPath, entry.name);
        if (entry.isFile() && entry.name.endsWith(".md")) {
            return true;
        }
        if (entry.isDirectory() && (await hasMarkdownFiles(target))) {
            return true;
        }
    }
    return false;
}
function inferStageFromArtifacts(artifacts) {
    if (artifacts.hasQaReport || artifacts.hasQaReview || artifacts.hasQaReviewSummary) {
        return "qa";
    }
    if (artifacts.hasPerformanceReport) {
        return "performance";
    }
    if (artifacts.hasTokenReport) {
        return "token";
    }
    if (artifacts.hasRefactorReview) {
        return "refactor";
    }
    if (artifacts.hasImplementationIndex || artifacts.hasCodeReview) {
        return "implementation";
    }
    if (artifacts.hasTask) {
        return "task";
    }
    if (artifacts.hasPlan || artifacts.hasSpec || artifacts.hasPlanReview || artifacts.hasTaskReview) {
        return "plan";
    }
    if (artifacts.hasProposal) {
        return "proposal";
    }
    return null;
}
function listMissingArtifacts(candidates) {
    return candidates.filter(([present]) => !present).map(([, label]) => label);
}
function createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, progressStatus) {
    return buildTopicStatusSummary(topic, currentStage, nextWorkflow, reason, progressStatus);
}
function createBlockedTopicStatus(topic, currentStage, nextWorkflow, reason) {
    return createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, "blocked");
}
function createWorkflowRecommendation(topic, currentStage, currentWorkflow, nextWorkflow, reason) {
    return createTopicStatusRecommendation(topic, currentStage, nextWorkflow, reason, currentWorkflow === nextWorkflow ? "in_progress" : "ready");
}
function resolveTopicStage(topic, proposalMarkdown, artifacts) {
    const proposalStage = normalizeStageName(proposalMarkdown ? parseKeyValue(proposalMarkdown, "stage") : null);
    return normalizeStageName(topic.stage) ?? proposalStage ?? inferStageFromArtifacts(artifacts);
}
function resolveMissingArtifactRecommendation(topic, currentStage, currentWorkflow, proposalStatus, artifacts) {
    if (proposalStatus !== "reviewed" || !artifacts.hasProposalReview) {
        const missingProposalArtifacts = listMissingArtifacts([
            [proposalStatus === "reviewed", "proposal frontmatter status=reviewed"],
            [artifacts.hasProposalReview, "reviews/proposal.review.md"]
        ]);
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-add", `Proposal approval artifacts are incomplete: ${missingProposalArtifacts.join(", ")}.`);
    }
    const missingPlanArtifacts = listMissingArtifacts([
        [artifacts.hasPlan, "pgg-plan/plan.md"],
        [artifacts.hasTask, "pgg-plan/task.md"],
        [artifacts.hasSpec, "pgg-plan/spec/*/*.md"],
        [artifacts.hasPlanReview, "pgg-plan/reviews/plan.review.md"],
        [artifacts.hasTaskReview, "pgg-plan/reviews/task.review.md"]
    ]);
    if (missingPlanArtifacts.length > 0) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-plan", `Plan artifacts are incomplete: ${missingPlanArtifacts.join(", ")}.`);
    }
    const missingImplementationArtifacts = listMissingArtifacts([
        [artifacts.hasImplementationIndex, "implementation/index.md"],
        [artifacts.hasCodeReview, "reviews/code.review.md"]
    ]);
    if (missingImplementationArtifacts.length > 0) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-code", `Implementation artifacts are incomplete: ${missingImplementationArtifacts.join(", ")}.`);
    }
    if (!artifacts.hasRefactorReview) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-refactor", "reviews/refactor.review.md is missing, so the refactor stage is not complete.");
    }
    return null;
}
function resolveAuditRecommendation(topic, currentStage, currentWorkflow, artifacts, audits) {
    if (audits["pgg-token"].status === "required" && !artifacts.hasTokenReport) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-token", `Token audit is required before QA: ${audits["pgg-token"].reason}.`);
    }
    const performanceAudit = audits["pgg-performance"];
    if (performanceAudit.status === "required" && !artifacts.hasPerformanceReport) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-performance", `Performance audit is required before QA: ${performanceAudit.reason}.`);
    }
    return null;
}
async function readTopicVersion(topicDir) {
    const raw = await readTextIfExists(path.join(topicDir, "version.json"));
    if (!raw) {
        return {
            version: null,
            changeType: null,
            archivedAt: null,
            versionBump: null,
            targetVersion: null,
            workingBranch: null,
            releaseBranch: null
        };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            version: parsed.version ?? null,
            changeType: parsed.changeType ?? null,
            archivedAt: parsed.archivedAt ?? null,
            versionBump: parsed.versionBump ?? null,
            targetVersion: parsed.targetVersion ?? parsed.version ?? null,
            workingBranch: parsed.workingBranch ?? null,
            releaseBranch: parsed.releaseBranch ?? null
        };
    }
    catch {
        return {
            version: null,
            changeType: null,
            archivedAt: null,
            versionBump: null,
            targetVersion: null,
            workingBranch: null,
            releaseBranch: null
        };
    }
}
async function readTopicPublishMetadata(topicDir) {
    const raw = await readTextIfExists(path.join(topicDir, "git", "publish.json"));
    if (!raw) {
        return {
            publishResultType: null,
            publishPushStatus: null,
            workingBranch: null,
            releaseBranch: null,
            publishMode: null,
            upstreamStatus: null,
            cleanupStatus: null,
            cleanupReason: null,
            cleanupTiming: null
        };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            publishResultType: parsed.resultType ?? null,
            publishPushStatus: parsed.pushStatus ?? null,
            workingBranch: parsed.workingBranch ?? null,
            releaseBranch: parsed.releaseBranch ?? parsed.branch ?? null,
            publishMode: parsed.publishMode ?? null,
            upstreamStatus: parsed.upstreamStatus ?? null,
            cleanupStatus: parsed.cleanupStatus ?? null,
            cleanupReason: parsed.cleanupReason ?? null,
            cleanupTiming: parsed.cleanupTiming ?? null
        };
    }
    catch {
        return {
            publishResultType: null,
            publishPushStatus: null,
            workingBranch: null,
            releaseBranch: null,
            publishMode: null,
            upstreamStatus: null,
            cleanupStatus: null,
            cleanupReason: null,
            cleanupTiming: null
        };
    }
}
function toRelativePath(rootDir, absolutePath) {
    return path.relative(rootDir, absolutePath) || path.basename(absolutePath);
}
async function readWorkflowDetail(rootDir, topicDir, node) {
    const existingDetail = node.data.detail ?? null;
    const diffPath = node.data.diffRef ? path.join(topicDir, node.data.diffRef) : null;
    const documentPath = node.data.path ? path.join(rootDir, node.data.path) : null;
    const targetPath = diffPath ?? documentPath;
    if (!targetPath) {
        return existingDetail;
    }
    const content = await readTextIfExists(targetPath);
    if (content === null) {
        return existingDetail;
    }
    const fileStat = await stat(targetPath).catch(() => null);
    const extension = path.extname(targetPath).toLowerCase();
    const kind = diffPath ? "diff" : extension === ".md" ? "markdown" : "text";
    const contentType = kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";
    return {
        kind,
        title: existingDetail?.title ?? node.data.label ?? path.basename(targetPath),
        sourcePath: toRelativePath(rootDir, targetPath),
        content,
        contentType,
        startedAt: existingDetail?.startedAt ?? null,
        updatedAt: existingDetail?.updatedAt ?? fileStat?.mtime.toISOString() ?? null,
        completedAt: existingDetail?.completedAt ?? null,
        summary: existingDetail?.summary ?? null,
        status: existingDetail?.status ?? node.data.status ?? null
    };
}
function parseTopicHistoryEvents(raw) {
    if (!raw) {
        return [];
    }
    return raw
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => {
        try {
            const parsed = JSON.parse(line);
            return [
                {
                    ts: typeof parsed.ts === "string" ? parsed.ts : null,
                    stage: typeof parsed.stage === "string" ? parsed.stage : null,
                    event: typeof parsed.event === "string" ? parsed.event : null,
                    flow: typeof parsed.flow === "string" ? parsed.flow : null,
                    task: typeof parsed.task === "string" ? parsed.task : null,
                    summary: typeof parsed.summary === "string" ? parsed.summary : null,
                    source: typeof parsed.source === "string" ? parsed.source : null,
                    commitTitle: typeof parsed.commitTitle === "string" ? parsed.commitTitle : null,
                    commitHash: typeof parsed.commitHash === "string" ? parsed.commitHash : null,
                    author: typeof parsed.author === "string" ? parsed.author : null
                }
            ];
        }
        catch {
            return [];
        }
    });
}
function normalizeWorkflowNodePath(topicDir, node) {
    if (!node.data.path) {
        return node;
    }
    const topic = path.basename(topicDir);
    const actualBucket = path.basename(path.dirname(topicDir));
    const activePrefix = `poggn/active/${topic}/`;
    const archivePrefix = `poggn/archive/${topic}/`;
    const actualPrefix = `poggn/${actualBucket}/${topic}/`;
    let nextPath = node.data.path;
    if (nextPath.startsWith(activePrefix)) {
        nextPath = `${actualPrefix}${nextPath.slice(activePrefix.length)}`;
    }
    else if (nextPath.startsWith(archivePrefix)) {
        nextPath = `${actualPrefix}${nextPath.slice(archivePrefix.length)}`;
    }
    if (nextPath === node.data.path) {
        return node;
    }
    return {
        ...node,
        data: {
            ...node.data,
            path: nextPath
        }
    };
}
async function readWorkflow(filePath, rootDir, topicDir) {
    const raw = await readTextIfExists(filePath);
    if (!raw) {
        return null;
    }
    try {
        const workflow = JSON.parse(raw);
        const nodes = await Promise.all(workflow.nodes.map(async (rawNode) => {
            const node = normalizeWorkflowNodePath(topicDir, rawNode);
            return {
                ...node,
                data: {
                    ...node.data,
                    detail: await readWorkflowDetail(rootDir, topicDir, node)
                }
            };
        }));
        return {
            ...workflow,
            nodes
        };
    }
    catch {
        return null;
    }
}
async function collectMatchingFiles(rootDir, predicate) {
    const directory = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
    const files = [];
    for (const entry of directory) {
        const absolutePath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectMatchingFiles(absolutePath, predicate)));
            continue;
        }
        const relativePath = toRelativePath(path.dirname(rootDir), absolutePath);
        if (predicate(relativePath, absolutePath)) {
            files.push(absolutePath);
        }
    }
    return files;
}
async function summarizeArtifactGroup(topicDir, relativePaths, options) {
    const existing = [];
    for (const relativePath of relativePaths) {
        const absolutePath = path.join(topicDir, relativePath);
        if (!existsSync(absolutePath)) {
            continue;
        }
        const fileStat = await stat(absolutePath).catch(() => null);
        existing.push({
            relativePath,
            updatedAt: fileStat?.mtime.toISOString() ?? null
        });
    }
    return {
        count: existing.length,
        missingRequired: Boolean(options?.required) && existing.length === 0,
        latestUpdatedAt: existing
            .map((entry) => entry.updatedAt)
            .filter((value) => Boolean(value))
            .sort((left, right) => right.localeCompare(left))[0] ?? null,
        primaryRef: existing[0]?.relativePath ?? relativePaths[0] ?? null
    };
}
async function readTopicArtifactSummary(topicDir) {
    const specFiles = (await collectMatchingFiles(path.join(topicDir, "spec"), (entryPath) => entryPath.endsWith(".md"))).map((absolutePath) => toRelativePath(topicDir, absolutePath));
    const pggPlanSpecFiles = (await collectMatchingFiles(path.join(topicDir, "pgg-plan", "spec"), (entryPath) => entryPath.endsWith(".md"))).map((absolutePath) => toRelativePath(topicDir, absolutePath));
    const implementationDiffs = (await collectMatchingFiles(path.join(topicDir, "implementation", "diffs"), (entryPath) => entryPath.endsWith(".diff"))).map((absolutePath) => toRelativePath(topicDir, absolutePath));
    return {
        lifecycleDocs: await summarizeArtifactGroup(topicDir, ["proposal.md", "pgg-plan/plan.md", "pgg-plan/task.md", "plan.md", "task.md", "state/current.md"], { required: true }),
        reviewDocs: await summarizeArtifactGroup(topicDir, [
            "reviews/proposal.review.md",
            "pgg-plan/reviews/plan.review.md",
            "pgg-plan/reviews/task.review.md",
            "reviews/plan.review.md",
            "reviews/task.review.md",
            "reviews/code.review.md",
            "reviews/refactor.review.md",
            "reviews/qa.review.md"
        ], { required: true }),
        specDocs: await summarizeArtifactGroup(topicDir, [...pggPlanSpecFiles, ...specFiles]),
        implementationDocs: await summarizeArtifactGroup(topicDir, [
            "implementation/index.md",
            ...implementationDiffs
        ]),
        qaDocs: await summarizeArtifactGroup(topicDir, [
            "qa/report.md",
            "qa/test-plan.md",
            "qa/test-result.md",
            "qa/review.md"
        ]),
        releaseDocs: await summarizeArtifactGroup(topicDir, [
            "version.json",
            "state/history.ndjson",
            "git/publish.json"
        ]),
        workflowDocs: await summarizeArtifactGroup(topicDir, ["workflow.reactflow.json"])
    };
}
function resolveTopicFileKind(absolutePath) {
    const extension = path.extname(absolutePath).toLowerCase();
    if (extension === ".diff") {
        return "diff";
    }
    if (extension === ".md") {
        return "markdown";
    }
    return "text";
}
const projectFileIgnoredDirectories = new Set([
    ".git",
    "node_modules",
    "dist",
    "coverage",
    ".turbo",
    ".next",
    ".cache"
]);
const projectTextExtensions = new Set([
    ".cjs",
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".sh",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml"
]);
function isProjectTextFile(absolutePath) {
    const extension = path.extname(absolutePath).toLowerCase();
    return extension === ".diff" || projectTextExtensions.has(extension);
}
function estimateTokensFromText(value) {
    return Math.ceil(Array.from(value).length / 4);
}
function parseOptionalNumber(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return null;
    }
    return Math.max(0, Math.trunc(value));
}
function parseRequiredNumber(value) {
    return parseOptionalNumber(value) ?? 0;
}
function normalizeTokenUsagePath(value) {
    if (!value) {
        return null;
    }
    return value.replace(/^\.\//, "").replace(/^poggn\/(?:active|archive)\/[^/]+\//, "");
}
function isLocalTokenArtifactPath(value) {
    const normalized = normalizeTokenUsagePath(value);
    return Boolean(normalized && (/\.diff$/i.test(normalized) || normalized.startsWith("implementation/diffs/")));
}
function parseTokenUsageOperation(value) {
    return value === "create" ||
        value === "update" ||
        value === "delete" ||
        value === "read" ||
        value === "generate" ||
        value === "verify" ||
        value === "commit" ||
        value === "other"
        ? value
        : "other";
}
function parseTokenUsageSource(value) {
    return value === "llm" || value === "local" ? value : "local";
}
function parseTokenUsageMeasurement(value) {
    return value === "actual" || value === "estimated" || value === "unavailable" ? value : "estimated";
}
function parseTopicTokenUsageRecords(raw) {
    if (!raw) {
        return [];
    }
    return raw
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => {
        try {
            const parsed = JSON.parse(line);
            const artifactPath = typeof parsed.artifact_path === "string"
                ? parsed.artifact_path
                : typeof parsed.artifactPath === "string"
                    ? parsed.artifactPath
                    : null;
            const measurement = parseTokenUsageMeasurement(parsed.measurement);
            return [
                {
                    ts: typeof parsed.ts === "string" ? parsed.ts : null,
                    stage: typeof parsed.stage === "string" ? parsed.stage : null,
                    flow: typeof parsed.flow === "string" ? parsed.flow : null,
                    event: typeof parsed.event === "string" ? parsed.event : null,
                    task: typeof parsed.task === "string" ? parsed.task : null,
                    artifactPath,
                    operation: parseTokenUsageOperation(parsed.operation),
                    source: parseTokenUsageSource(parsed.source),
                    provider: typeof parsed.provider === "string" ? parsed.provider : null,
                    model: typeof parsed.model === "string" ? parsed.model : null,
                    usageMetadataAvailable: typeof parsed.usage_metadata_available === "boolean"
                        ? parsed.usage_metadata_available
                        : typeof parsed.usageMetadataAvailable === "boolean"
                            ? parsed.usageMetadataAvailable
                            : measurement === "actual" && parseTokenUsageSource(parsed.source) === "llm",
                    inputTokens: parseOptionalNumber(parsed.input_tokens ?? parsed.inputTokens),
                    outputTokens: parseOptionalNumber(parsed.output_tokens ?? parsed.outputTokens),
                    cachedTokens: parseOptionalNumber(parsed.cached_tokens ?? parsed.cachedTokens),
                    reasoningTokens: parseOptionalNumber(parsed.reasoning_tokens ?? parsed.reasoningTokens),
                    totalTokens: parseRequiredNumber(parsed.total_tokens ?? parsed.totalTokens),
                    artifactTokenEstimate: parseOptionalNumber(parsed.artifact_token_estimate ?? parsed.artifactTokenEstimate),
                    estimated: typeof parsed.estimated === "boolean" ? parsed.estimated : measurement !== "actual",
                    measurement,
                    bytes: parseOptionalNumber(parsed.bytes),
                    lineCount: parseOptionalNumber(parsed.line_count ?? parsed.lineCount),
                    notes: typeof parsed.notes === "string" ? parsed.notes : null
                }
            ];
        }
        catch {
            return [];
        }
    });
}
function tokenUsageRecordsForArtifact(records, relativePath, sourcePath) {
    const relative = normalizeTokenUsagePath(relativePath);
    const source = normalizeTokenUsagePath(sourcePath);
    return records.filter((record) => {
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        return Boolean(artifactPath && (artifactPath === relative || artifactPath === source));
    });
}
function sumTokenRecords(records, predicate) {
    let total = 0;
    let seen = false;
    for (const record of records) {
        if (predicate(record)) {
            total += record.totalTokens;
            seen = true;
        }
    }
    return seen ? total : null;
}
function isActualLlmTokenRecord(record) {
    return record.source === "llm" && record.measurement === "actual" && !record.estimated && record.usageMetadataAvailable;
}
function directLlmTokenRecordTotal(record) {
    return isActualLlmTokenRecord(record) && record.totalTokens > 0 ? record.totalTokens : null;
}
function sumLocalTokenRecords(records) {
    return sumTokenRecords(records, (record) => record.source === "local") ?? 0;
}
async function buildTokenEstimateLookup(rootDir, files, tokenUsageRecords) {
    const estimates = new Map();
    for (const file of files) {
        if (file.tokenEstimate === null) {
            continue;
        }
        const relativePath = normalizeTokenUsagePath(file.relativePath);
        const sourcePath = normalizeTokenUsagePath(file.sourcePath);
        if (relativePath) {
            estimates.set(relativePath, file.tokenEstimate);
        }
        if (sourcePath) {
            estimates.set(sourcePath, file.tokenEstimate);
        }
    }
    await Promise.all(tokenUsageRecords.map(async (record) => {
        if (record.source !== "llm") {
            return;
        }
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        if (!artifactPath || estimates.has(artifactPath)) {
            return;
        }
        const absolutePath = path.join(rootDir, artifactPath);
        const content = await readProjectFileContentForSnapshot(absolutePath);
        if (content !== null) {
            estimates.set(artifactPath, estimateTokensFromText(content));
        }
    }));
    return (artifactPath) => {
        const normalized = normalizeTokenUsagePath(artifactPath);
        return normalized ? estimates.get(normalized) ?? null : null;
    };
}
function sumLlmTokenRecords(records) {
    let total = 0;
    let seen = false;
    for (const record of records) {
        if (record.source !== "llm") {
            continue;
        }
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        if (isLocalTokenArtifactPath(artifactPath)) {
            continue;
        }
        const directTotal = directLlmTokenRecordTotal(record);
        if (directTotal !== null) {
            total += directTotal;
            seen = true;
        }
    }
    return seen ? total : null;
}
function sumEstimatedLlmTokenRecords(records, estimateForArtifact) {
    let total = 0;
    const actualArtifacts = new Set();
    const estimatedArtifacts = new Set();
    for (const record of records) {
        if (record.source !== "llm") {
            continue;
        }
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        if (artifactPath && isActualLlmTokenRecord(record)) {
            actualArtifacts.add(artifactPath);
        }
    }
    for (const record of records) {
        if (record.source !== "llm" || isActualLlmTokenRecord(record)) {
            continue;
        }
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        if (isLocalTokenArtifactPath(artifactPath) || (artifactPath && actualArtifacts.has(artifactPath))) {
            continue;
        }
        if (!artifactPath) {
            if (record.measurement === "estimated" && record.totalTokens > 0) {
                total += record.totalTokens;
            }
            continue;
        }
        if (estimatedArtifacts.has(artifactPath)) {
            continue;
        }
        const estimate = record.measurement === "estimated" && record.totalTokens > 0
            ? record.totalTokens
            : record.artifactTokenEstimate ?? estimateForArtifact(artifactPath);
        if (estimate !== null) {
            total += estimate;
            estimatedArtifacts.add(artifactPath);
        }
    }
    return total;
}
function fileHasLlmTokenRecord(file, records) {
    return fileHasTokenRecordWithSource(file, records, "llm");
}
function fileHasTokenRecordWithSource(file, records, source) {
    const relativePath = normalizeTokenUsagePath(file.relativePath);
    const sourcePath = normalizeTokenUsagePath(file.sourcePath);
    return records.some((record) => {
        if (record.source !== source) {
            return false;
        }
        const artifactPath = normalizeTokenUsagePath(record.artifactPath);
        return Boolean(artifactPath && (artifactPath === relativePath || artifactPath === sourcePath));
    });
}
function sumUnrecordedArtifactEstimateTokens(files, records) {
    return files.reduce((sum, file) => {
        if (file.tokenEstimate === null || fileHasLlmTokenRecord(file, records) || fileHasLocalTokenRecord(file, records)) {
            return sum;
        }
        return sum + file.tokenEstimate;
    }, 0);
}
function fileHasLocalTokenRecord(file, records) {
    return fileHasTokenRecordWithSource(file, records, "local");
}
async function applyArtifactTokenEstimatesToRecords(rootDir, files, records) {
    const estimateForArtifact = await buildTokenEstimateLookup(rootDir, files, records);
    return records.map((record) => ({
        ...record,
        artifactTokenEstimate: record.source === "llm" ? estimateForArtifact(record.artifactPath) : record.artifactTokenEstimate
    }));
}
function applyTokenUsageRecordsToFile(file, records) {
    const artifactRecords = tokenUsageRecordsForArtifact(records, file.relativePath, file.sourcePath);
    if (artifactRecords.length === 0) {
        return file;
    }
    const localEstimatedTokens = sumLocalTokenRecords(artifactRecords);
    const isLocalArtifact = isLocalTokenArtifactPath(file.relativePath);
    const llmActualTokens = isLocalArtifact ? null : sumLlmTokenRecords(artifactRecords);
    const estimatedLlmTokens = isLocalArtifact ? 0 : sumEstimatedLlmTokenRecords(artifactRecords, () => file.tokenEstimate);
    return {
        ...file,
        localEstimatedTokens: localEstimatedTokens +
            estimatedLlmTokens +
            (isLocalArtifact && !fileHasLocalTokenRecord(file, artifactRecords) ? file.tokenEstimate ?? 0 : 0),
        llmActualTokens,
        tokenSource: "ledger"
    };
}
async function collectProjectFiles(rootDir, currentDir = rootDir) {
    const entries = await readdir(currentDir, { withFileTypes: true }).catch(() => []);
    const files = [];
    for (const entry of entries) {
        if (entry.name === ".DS_Store") {
            continue;
        }
        const absolutePath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
            if (projectFileIgnoredDirectories.has(entry.name)) {
                continue;
            }
            files.push(...(await collectProjectFiles(rootDir, absolutePath)));
            continue;
        }
        if (entry.isFile()) {
            files.push(absolutePath);
        }
    }
    return files;
}
async function readProjectFileContentForSnapshot(absolutePath) {
    if (!isProjectTextFile(absolutePath)) {
        return null;
    }
    const fileStat = await stat(absolutePath).catch(() => null);
    if (fileStat && fileStat.size > 200_000) {
        return null;
    }
    return readTextIfExists(absolutePath);
}
async function listProjectFiles(rootDir) {
    const files = await collectProjectFiles(rootDir);
    const entries = await Promise.all(files.map(async (absolutePath) => {
        const fileStat = await stat(absolutePath).catch(() => null);
        const relativePath = toRelativePath(rootDir, absolutePath);
        const content = await readProjectFileContentForSnapshot(absolutePath);
        const tokenEstimate = content === null ? null : estimateTokensFromText(content);
        return {
            relativePath,
            sourcePath: relativePath,
            kind: resolveTopicFileKind(absolutePath),
            updatedAt: fileStat?.mtime.toISOString() ?? null,
            size: fileStat?.size ?? null,
            tokenEstimate,
            localEstimatedTokens: tokenEstimate,
            llmActualTokens: null,
            tokenSource: tokenEstimate === null ? "none" : "estimated",
            content,
            editable: isProjectTextFile(absolutePath)
        };
    }));
    return entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}
function cleanMarkdownTableCell(value) {
    return (value ?? "").trim().replace(/^`|`$/g, "").trim();
}
function normalizeMarkdownTableKey(value) {
    return cleanMarkdownTableCell(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}
function splitMarkdownTableRow(line) {
    const trimmed = line.trim();
    const withoutStart = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
    const withoutEnd = withoutStart.endsWith("|") ? withoutStart.slice(0, -1) : withoutStart;
    return withoutEnd.split("|").map((cell) => cell.trim());
}
function sanitizeVirtualDiffPath(value) {
    const normalized = value.replace(/\\/g, "/").replace(/^\.?\//, "");
    const safe = normalized.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
    return safe || "changed-file";
}
function normalizeDiffSource(value) {
    if (value === "commit" || value === "commit-range" || value === "working-tree" || value === "legacy-diff-file") {
        return value;
    }
    return "unavailable";
}
const IMPLEMENTATION_INDEX_SEPARATOR_PATTERN = /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/;
function parseImplementationIndexRows(raw) {
    if (!raw) {
        return [];
    }
    const rows = [];
    for (const line of raw.split(/\n+/)) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("|") || IMPLEMENTATION_INDEX_SEPARATOR_PATTERN.test(trimmed)) {
            continue;
        }
        rows.push(splitMarkdownTableRow(trimmed));
    }
    if (rows.length < 2) {
        return [];
    }
    const header = rows[0] ?? [];
    const headerIndex = new Map(header.map((cell, index) => [normalizeMarkdownTableKey(cell), index]));
    if (!headerIndex.has("path") || !headerIndex.has("diffsource")) {
        return [];
    }
    const cell = (row, key) => cleanMarkdownTableCell(row[headerIndex.get(key) ?? -1]);
    return rows.slice(1).flatMap((row, rowIndex) => {
        const targetPath = cell(row, "path");
        if (!targetPath) {
            return [];
        }
        const diffSource = normalizeDiffSource(cell(row, "diffsource"));
        if (diffSource === "legacy-diff-file") {
            return [];
        }
        const valueOrNull = (value) => (value && value !== "-" ? value : null);
        return [{
                id: cell(row, "id") || String(rowIndex + 1).padStart(3, "0"),
                crud: cell(row, "crud") || "UPDATE",
                targetPath,
                taskRef: valueOrNull(cell(row, "taskref")),
                diffSource,
                gitRef: valueOrNull(cell(row, "gitref")),
                commitRange: valueOrNull(cell(row, "commitrange")),
                diffCommand: valueOrNull(cell(row, "diffcommand")),
                status: valueOrNull(cell(row, "status")),
                note: valueOrNull(cell(row, "note"))
            }];
    });
}
async function listLazyDiffTopicFiles(topicDir, bucket, topic, existingEntries) {
    const indexPath = path.join(topicDir, "implementation", "index.md");
    const indexContent = await readTextIfExists(indexPath);
    const rows = parseImplementationIndexRows(indexContent);
    if (rows.length === 0) {
        return [];
    }
    const existingPaths = new Set(existingEntries.map((entry) => entry.relativePath));
    const indexStat = await stat(indexPath).catch(() => null);
    return rows.flatMap((row) => {
        const relativePath = `implementation/diffs/${row.id}_${row.crud}_${sanitizeVirtualDiffPath(row.targetPath)}.diff`;
        if (existingPaths.has(relativePath)) {
            return [];
        }
        return [{
                relativePath,
                sourcePath: `poggn/${bucket}/${topic}/implementation/index.md#${row.id}`,
                kind: "diff",
                updatedAt: indexStat?.mtime.toISOString() ?? null,
                size: null,
                tokenEstimate: null,
                localEstimatedTokens: null,
                llmActualTokens: null,
                tokenSource: "none",
                content: null,
                editable: false,
                lazyDiff: {
                    topic,
                    bucket,
                    targetPath: row.targetPath,
                    diffSource: row.diffSource,
                    gitRef: row.gitRef,
                    commitRange: row.commitRange,
                    diffCommand: row.diffCommand,
                    status: row.status,
                    taskRef: row.taskRef,
                    note: row.note
                }
            }];
    });
}
async function listTopicFiles(rootDir, topicDir, bucket, topic, tokenUsageRecords) {
    const files = await collectMatchingFiles(topicDir, () => true);
    const entries = await Promise.all(files.map(async (absolutePath) => {
        const fileStat = await stat(absolutePath).catch(() => null);
        const relativePath = toRelativePath(topicDir, absolutePath);
        const content = await readTextIfExists(absolutePath);
        const tokenEstimate = content === null ? null : estimateTokensFromText(content);
        return {
            relativePath,
            sourcePath: `poggn/${bucket}/${topic}/${relativePath}`,
            kind: resolveTopicFileKind(absolutePath),
            updatedAt: fileStat?.mtime.toISOString() ?? null,
            size: fileStat?.size ?? null,
            tokenEstimate,
            localEstimatedTokens: tokenEstimate ?? 0,
            llmActualTokens: null,
            tokenSource: tokenEstimate === null ? "none" : "estimated",
            content,
            editable: true
        };
    }));
    const lazyDiffEntries = await listLazyDiffTopicFiles(topicDir, bucket, topic, entries);
    return [...entries, ...lazyDiffEntries]
        .map((entry) => applyTokenUsageRecordsToFile(entry, tokenUsageRecords))
        .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}
async function summarizeTopicTokenUsage(rootDir, files, tokenUsageRecords) {
    const artifactEstimateBaselineTokens = sumUnrecordedArtifactEstimateTokens(files, tokenUsageRecords);
    if (tokenUsageRecords.length > 0) {
        const tokenEstimateLookup = await buildTokenEstimateLookup(rootDir, files, tokenUsageRecords);
        const llmActualTokensFromRecords = sumLlmTokenRecords(tokenUsageRecords) ?? 0;
        const estimatedLlmTokens = sumEstimatedLlmTokenRecords(tokenUsageRecords, tokenEstimateLookup);
        const localEstimatedTokens = sumLocalTokenRecords(tokenUsageRecords) + estimatedLlmTokens + artifactEstimateBaselineTokens;
        return {
            total: llmActualTokensFromRecords + localEstimatedTokens,
            llmActualTokens: llmActualTokensFromRecords > 0 ? llmActualTokensFromRecords : null,
            localEstimatedTokens,
            source: "ledger",
            ledgerRecordCount: tokenUsageRecords.length
        };
    }
    const localTotal = sumUnrecordedArtifactEstimateTokens(files, []);
    return {
        total: localTotal,
        llmActualTokens: null,
        localEstimatedTokens: localTotal,
        source: localTotal > 0 ? "estimated" : "none",
        ledgerRecordCount: 0
    };
}
function deriveTopicUpdatedAt(artifactSummary, archivedAt) {
    return ([
        artifactSummary.lifecycleDocs.latestUpdatedAt,
        artifactSummary.reviewDocs.latestUpdatedAt,
        artifactSummary.specDocs.latestUpdatedAt,
        artifactSummary.implementationDocs.latestUpdatedAt,
        artifactSummary.qaDocs.latestUpdatedAt,
        artifactSummary.releaseDocs.latestUpdatedAt,
        artifactSummary.workflowDocs.latestUpdatedAt,
        archivedAt
    ]
        .filter((value) => Boolean(value))
        .sort((left, right) => right.localeCompare(left))[0] ?? null);
}
async function listTopicSummaries(rootDir, bucket) {
    const bucketDir = path.join(rootDir, "poggn", bucket);
    const entries = await readdir(bucketDir, { withFileTypes: true }).catch(() => []);
    const topics = entries.filter((entry) => entry.isDirectory()).sort((left, right) => left.name.localeCompare(right.name));
    const result = [];
    for (const entry of topics) {
        const topicDir = path.join(bucketDir, entry.name);
        const statePath = path.join(topicDir, "state", "current.md");
        const proposalPath = path.join(topicDir, "proposal.md");
        const stateMarkdown = await readTextIfExists(statePath);
        const historyEvents = parseTopicHistoryEvents(await readTextIfExists(path.join(topicDir, "state", "history.ndjson")));
        const proposalMarkdown = await readTextIfExists(proposalPath);
        const workflow = await readWorkflow(path.join(topicDir, "workflow.reactflow.json"), rootDir, topicDir);
        const release = await readTopicVersion(topicDir);
        const publish = await readTopicPublishMetadata(topicDir);
        const artifactSummary = await readTopicArtifactSummary(topicDir);
        const userQuestionRecord = parseUserQuestionRecord(proposalMarkdown);
        let tokenUsageRecords = parseTopicTokenUsageRecords(await readTextIfExists(path.join(topicDir, "state", "token-usage.ndjson")));
        const files = await listTopicFiles(rootDir, topicDir, bucket, entry.name, tokenUsageRecords);
        tokenUsageRecords = await applyArtifactTokenEstimatesToRecords(rootDir, files, tokenUsageRecords);
        const tokenUsage = await summarizeTopicTokenUsage(rootDir, files, tokenUsageRecords);
        const updatedAt = deriveTopicUpdatedAt(artifactSummary, release.archivedAt);
        const stage = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Current Stage") : parseKeyValue(proposalMarkdown ?? "", "stage");
        const goal = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Goal") : null;
        const nextAction = stateMarkdown ? parseMarkdownSection(stateMarkdown, "Next Action") : null;
        const score = stateMarkdown ? parseScore(stateMarkdown) : null;
        const blockingIssues = stateMarkdown ? parseBlockingIssues(stateMarkdown) : null;
        const status = proposalMarkdown ? parseKeyValue(proposalMarkdown, "status") : null;
        const proposalWorkingBranch = proposalMarkdown ? parseKeyValue(proposalMarkdown, "working_branch") : null;
        const proposalReleaseBranch = proposalMarkdown ? parseKeyValue(proposalMarkdown, "release_branch") : null;
        result.push({
            name: entry.name,
            bucket,
            stage,
            goal,
            nextAction,
            score,
            blockingIssues,
            status,
            version: release.version,
            changeType: release.changeType,
            archiveType: release.changeType,
            versionBump: release.versionBump,
            targetVersion: release.targetVersion,
            workingBranch: publish.workingBranch ?? release.workingBranch ?? proposalWorkingBranch,
            releaseBranch: publish.releaseBranch ?? release.releaseBranch ?? proposalReleaseBranch,
            publishResultType: publish.publishResultType,
            publishPushStatus: publish.publishPushStatus,
            publishMode: publish.publishMode,
            upstreamStatus: publish.upstreamStatus,
            cleanupStatus: publish.cleanupStatus,
            cleanupReason: publish.cleanupReason,
            cleanupTiming: publish.cleanupTiming,
            archivedAt: release.archivedAt,
            updatedAt,
            workflow,
            artifactSummary,
            artifactCompleteness: artifactSummary.lifecycleDocs.missingRequired ||
                artifactSummary.reviewDocs.missingRequired
                ? "partial"
                : "complete",
            health: stateMarkdown ? "ok" : "partial",
            userQuestionRecord,
            historyEvents,
            files,
            tokenUsage,
            tokenUsageRecords
        });
    }
    return result;
}
async function readTopicArtifacts(rootDir, topic) {
    const topicDir = path.join(rootDir, "poggn", topic.bucket, topic.name);
    const stateMarkdown = await readTextIfExists(path.join(topicDir, "state", "current.md"));
    const proposalMarkdown = await readTextIfExists(path.join(topicDir, "proposal.md"));
    return {
        stateMarkdown,
        proposalMarkdown,
        artifacts: {
            hasProposal: proposalMarkdown !== null,
            hasProposalReview: existsSync(path.join(topicDir, "reviews", "proposal.review.md")),
            hasPlan: existsSync(path.join(topicDir, "pgg-plan", "plan.md")) ||
                existsSync(path.join(topicDir, "plan.md")),
            hasTask: existsSync(path.join(topicDir, "pgg-plan", "task.md")) ||
                existsSync(path.join(topicDir, "task.md")),
            hasSpec: (await hasMarkdownFiles(path.join(topicDir, "pgg-plan", "spec"))) ||
                (await hasMarkdownFiles(path.join(topicDir, "spec"))),
            hasPlanReview: existsSync(path.join(topicDir, "pgg-plan", "reviews", "plan.review.md")) ||
                existsSync(path.join(topicDir, "reviews", "plan.review.md")),
            hasTaskReview: existsSync(path.join(topicDir, "pgg-plan", "reviews", "task.review.md")) ||
                existsSync(path.join(topicDir, "reviews", "task.review.md")),
            hasImplementationIndex: existsSync(path.join(topicDir, "implementation", "index.md")),
            hasCodeReview: existsSync(path.join(topicDir, "reviews", "code.review.md")),
            hasRefactorReview: existsSync(path.join(topicDir, "reviews", "refactor.review.md")),
            hasTokenReport: existsSync(path.join(topicDir, "token", "report.md")),
            hasPerformanceReport: existsSync(path.join(topicDir, "pgg-performance", "report.md")) ||
                existsSync(path.join(topicDir, "performance", "report.md")),
            hasQaReport: existsSync(path.join(topicDir, "qa", "report.md")),
            hasQaReview: existsSync(path.join(topicDir, "qa", "review.md")),
            hasQaReviewSummary: existsSync(path.join(topicDir, "reviews", "qa.review.md"))
        }
    };
}
function buildTopicStatusSummary(topic, currentStage, nextWorkflow, reason, progressStatus) {
    return {
        name: topic.name,
        currentStage: currentStage ?? "unknown",
        progressStatus,
        nextWorkflow,
        reason,
        health: topic.health,
        nextAction: topic.nextAction,
        blockingIssues: topic.blockingIssues
    };
}
async function buildTopicIsolationIssues(rootDir, manifest, topics) {
    if (topics.length < 2) {
        return new Map();
    }
    const gitMode = normalizeProjectGitConfig(manifest.git).mode;
    return gitMode === "on"
        ? buildGitOnTopicIsolationIssues(rootDir, topics)
        : await buildGitOffTopicIsolationIssues(rootDir, topics);
}
function buildGitOnTopicIsolationIssues(rootDir, topics) {
    const issues = new Map();
    const currentBranch = gitOutput(rootDir, ["branch", "--show-current"]);
    for (const topic of topics) {
        if (!topic.workingBranch) {
            issues.set(topic.name, {
                reason: "Multiple active topics are present, but this topic has no working_branch metadata for git isolation."
            });
        }
        else if (!currentBranch) {
            issues.set(topic.name, {
                reason: "Multiple active topics are present with git mode on, but the current git branch could not be resolved."
            });
        }
        else if (currentBranch !== topic.workingBranch) {
            issues.set(topic.name, {
                reason: `Multiple active topics require branch isolation. Current branch '${currentBranch}' does not match '${topic.workingBranch}'.`
            });
        }
    }
    return issues;
}
async function buildGitOffTopicIsolationIssues(rootDir, topics) {
    const issues = new Map();
    const ownership = new Map();
    await Promise.all(topics.map(async (topic) => {
        const stateMarkdown = await readTextIfExists(path.join(rootDir, "poggn", "active", topic.name, "state", "current.md"));
        ownership.set(topic.name, parseChangedFilePaths(stateMarkdown));
    }));
    const ownersByPath = invertChangedFileOwnership(ownership);
    for (const [changedPath, owners] of ownersByPath.entries()) {
        if (owners.length < 2) {
            continue;
        }
        for (const topicName of owners) {
            issues.set(topicName, {
                reason: `Multiple active topics are present with git mode off, and '${changedPath}' is owned by: ${owners.join(", ")}.`
            });
        }
    }
    return issues;
}
function invertChangedFileOwnership(ownership) {
    const ownersByPath = new Map();
    for (const [topicName, paths] of ownership.entries()) {
        for (const changedPath of paths) {
            const owners = ownersByPath.get(changedPath) ?? [];
            owners.push(topicName);
            ownersByPath.set(changedPath, owners);
        }
    }
    return ownersByPath;
}
async function evaluateTopicStatus(rootDir, topic, isolationIssue = null) {
    const { stateMarkdown, proposalMarkdown, artifacts } = await readTopicArtifacts(rootDir, topic);
    const currentStage = resolveTopicStage(topic, proposalMarkdown, artifacts);
    if (!artifacts.hasProposal) {
        return createBlockedTopicStatus(topic, currentStage, "none", "proposal.md is missing, so workflow progression cannot be evaluated.");
    }
    if (!currentStage) {
        return createBlockedTopicStatus(topic, null, "none", "Current stage could not be resolved from state/current.md, proposal.md, or topic artifacts.");
    }
    const currentWorkflow = STAGE_TO_WORKFLOW[currentStage];
    const proposalStatus = proposalMarkdown ? parseKeyValue(proposalMarkdown, "status") : topic.status;
    const openItemStatus = parseOpenItemStatus(stateMarkdown);
    const audits = parseAuditApplicability(stateMarkdown);
    const qaArtifactsPresent = artifacts.hasQaReport || artifacts.hasQaReview || artifacts.hasQaReviewSummary;
    if (isolationIssue) {
        return createBlockedTopicStatus(topic, currentStage, currentWorkflow, isolationIssue.reason);
    }
    if (!isNonBlockingMarker(topic.blockingIssues)) {
        return createBlockedTopicStatus(topic, currentStage, currentWorkflow, `Blocking issues remain: ${topic.blockingIssues}.`);
    }
    if (isArchiveReady(topic.nextAction, openItemStatus)) {
        return createTopicStatusRecommendation(topic, currentStage, "none", "QA pass signal is present, so the topic is ready for archive handling.", "archive_ready");
    }
    const artifactRecommendation = resolveMissingArtifactRecommendation(topic, currentStage, currentWorkflow, proposalStatus, artifacts);
    if (artifactRecommendation) {
        return artifactRecommendation;
    }
    const auditRecommendation = resolveAuditRecommendation(topic, currentStage, currentWorkflow, artifacts, audits);
    if (auditRecommendation) {
        return auditRecommendation;
    }
    if (!qaArtifactsPresent) {
        return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-qa", "QA artifacts are missing, so validation and archive readiness have not been recorded yet.");
    }
    return createWorkflowRecommendation(topic, currentStage, currentWorkflow, "pgg-qa", "QA artifacts exist, but the topic is not yet marked pass or archive-ready.");
}
export async function analyzeProject(rootDir, registered = false) {
    const missingRoot = !(await stat(rootDir).then(() => true).catch(() => false));
    if (missingRoot) {
        const verification = resolveProjectVerification(rootDir, undefined);
        return {
            id: stableProjectId(rootDir),
            name: path.basename(rootDir),
            rootDir,
            registered,
            missingRoot: true,
            provider: "codex",
            language: "ko",
            autoMode: "on",
            teamsMode: "off",
            gitMode: "off",
            defaultRemote: "origin",
            workingBranchPrefix: "ai",
            releaseBranchPrefix: "release",
            gitSetupStatus: "none",
            gitProvider: null,
            gitOwner: null,
            gitRepository: null,
            gitRemoteUrl: null,
            gitAuthMethod: null,
            gitVisibility: null,
            gitDefaultBranch: null,
            gitSetupMessage: null,
            installedVersion: null,
            pggVersion: null,
            projectVersion: null,
            dashboardTitle: `${path.basename(rootDir)} dashboard`,
            dashboardTitleIconSvg: getDefaultDashboardTitleIconSvg(),
            refreshIntervalMs: 10_000,
            dashboardDefaultPort: 4173,
            verificationMode: verification.mode,
            verificationStatus: verification.status,
            verificationPreset: verification.preset,
            verificationReason: verification.reason,
            verificationCommandCount: verification.commands.length,
            hasAgents: false,
            hasCodex: false,
            hasPoggn: false,
            categoryIds: [],
            latestTopicName: null,
            latestTopicStage: null,
            latestActivityAt: null,
            files: [],
            activeTopics: [],
            archivedTopics: []
        };
    }
    const manifest = await loadProjectManifest(rootDir);
    const git = detectProjectGitConfig(rootDir, normalizeProjectGitConfig(manifest?.git));
    const projectVersion = await readProjectVersion(rootDir);
    const activeTopics = await listTopicSummaries(rootDir, "active");
    const archivedTopics = await listTopicSummaries(rootDir, "archive");
    const files = await listProjectFiles(rootDir);
    const verification = resolveProjectVerification(rootDir, manifest?.verification);
    const latestTopic = [...activeTopics, ...archivedTopics]
        .filter((topic) => topic.updatedAt)
        .sort((left, right) => (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""))[0] ?? null;
    return {
        id: stableProjectId(rootDir),
        name: manifest?.projectName ?? path.basename(rootDir),
        rootDir,
        registered,
        missingRoot: false,
        provider: manifest?.provider ?? "codex",
        language: manifest?.language ?? "ko",
        autoMode: manifest?.autoMode ?? "on",
        teamsMode: manifest?.teamsMode ?? "off",
        gitMode: git.mode,
        defaultRemote: git.defaultRemote,
        workingBranchPrefix: git.workingBranchPrefix,
        releaseBranchPrefix: git.releaseBranchPrefix,
        gitSetupStatus: git.setupStatus,
        gitProvider: git.provider ?? null,
        gitOwner: git.owner ?? null,
        gitRepository: git.repository ?? null,
        gitRemoteUrl: git.remoteUrl ?? null,
        gitAuthMethod: git.authMethod ?? null,
        gitVisibility: git.visibility ?? null,
        gitDefaultBranch: git.defaultBranch ?? null,
        gitSetupMessage: git.setupMessage ?? null,
        installedVersion: manifest?.installedVersion ?? null,
        pggVersion: manifest?.installedVersion ?? null,
        projectVersion,
        dashboardTitle: manifest?.dashboard.title ?? `${path.basename(rootDir)} dashboard`,
        dashboardTitleIconSvg: manifest?.dashboard.titleIconSvg ?? getDefaultDashboardTitleIconSvg(),
        refreshIntervalMs: manifest?.dashboard.refreshIntervalMs ?? 10_000,
        dashboardDefaultPort: manifest?.dashboard.defaultPort ?? 4173,
        verificationMode: verification.mode,
        verificationStatus: verification.status,
        verificationPreset: verification.preset,
        verificationReason: verification.reason,
        verificationCommandCount: verification.commands.length,
        hasAgents: existsSync(path.join(rootDir, "AGENTS.md")),
        hasCodex: existsSync(path.join(rootDir, ".codex")),
        hasPoggn: existsSync(path.join(rootDir, "poggn")),
        categoryIds: [],
        latestTopicName: latestTopic?.name ?? null,
        latestTopicStage: latestTopic?.stage ?? null,
        latestActivityAt: latestTopic?.updatedAt ?? null,
        files,
        activeTopics,
        archivedTopics
    };
}
export async function analyzeProjectStatus(rootDir) {
    const manifest = await requireManifest(rootDir);
    const topics = await listTopicSummaries(rootDir, "active");
    const isolationIssues = await buildTopicIsolationIssues(rootDir, manifest, topics);
    const evaluatedTopics = await Promise.all(topics.map((topic) => evaluateTopicStatus(rootDir, topic, isolationIssues.get(topic.name) ?? null)));
    return {
        rootDir,
        autoMode: manifest.autoMode,
        teamsMode: manifest.teamsMode,
        gitMode: manifest.git.mode,
        generatedAt: nowIso(),
        summary: {
            activeTopicCount: evaluatedTopics.length,
            readyCount: evaluatedTopics.filter((topic) => topic.progressStatus === "ready").length,
            inProgressCount: evaluatedTopics.filter((topic) => topic.progressStatus === "in_progress").length,
            blockedCount: evaluatedTopics.filter((topic) => topic.progressStatus === "blocked").length,
            archiveReadyCount: evaluatedTopics.filter((topic) => topic.progressStatus === "archive_ready").length
        },
        topics: evaluatedTopics.sort((left, right) => left.name.localeCompare(right.name))
    };
}
function buildRecentActivity(projects) {
    return projects
        .flatMap((project) => [...project.activeTopics, ...project.archivedTopics]
        .filter((topic) => topic.updatedAt)
        .map((topic) => ({
        id: `${project.id}:${topic.bucket}:${topic.name}:${topic.updatedAt}`,
        projectId: project.id,
        projectName: project.name,
        topicName: topic.name,
        bucket: topic.bucket,
        stage: topic.stage,
        status: topic.status,
        archiveType: topic.archiveType,
        score: topic.score,
        nextAction: topic.nextAction,
        updatedAt: topic.updatedAt
    })))
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
export async function buildDashboardSnapshot(currentRootDir) {
    const registry = await loadPersistedGlobalRegistry();
    const globalUser = await readGlobalUser();
    const dedupedPaths = new Map();
    dedupedPaths.set(currentRootDir, registry.projects.some((entry) => entry.rootDir === currentRootDir));
    for (const entry of registry.projects) {
        if (!dedupedPaths.has(entry.rootDir)) {
            dedupedPaths.set(entry.rootDir, true);
        }
    }
    const projects = [];
    for (const [rootDir, registered] of dedupedPaths.entries()) {
        projects.push(await analyzeProject(rootDir, registered));
    }
    const allProjectIds = projects.map((project) => project.id);
    const categories = normalizeCategories(registry.dashboard?.categories, allProjectIds, nowIso()).categories;
    const projectsWithCategories = projects.map((project) => ({
        ...project,
        categoryIds: categories
            .filter((category) => category.projectIds.includes(project.id))
            .map((category) => category.id)
    }));
    const currentProject = projectsWithCategories.find((project) => path.resolve(project.rootDir) === path.resolve(currentRootDir)) ?? null;
    const recentActivity = buildRecentActivity(projectsWithCategories);
    const latestActiveProjectId = recentActivity.find((entry) => entry.bucket === "active")?.projectId ??
        currentProject?.id ??
        null;
    return {
        generatedAt: nowIso(),
        currentProjectId: currentProject?.id ?? null,
        latestActiveProjectId,
        globalUser,
        categories,
        recentActivity,
        projects: projectsWithCategories
    };
}
function resolveTopicDir(rootDir, bucket, topic) {
    return path.join(rootDir, "poggn", bucket, topic);
}
function normalizeTopicRelativeFilePath(relativePath) {
    const trimmed = relativePath.trim();
    if (!trimmed) {
        throw new Error("A topic-relative file path is required.");
    }
    if (path.isAbsolute(trimmed)) {
        throw new Error("Absolute paths are not allowed.");
    }
    const normalized = path.posix.normalize(trimmed.replace(/\\/g, "/"));
    if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
        throw new Error("The file path must stay inside the topic directory.");
    }
    return normalized;
}
function normalizeProjectRelativeFilePath(relativePath) {
    const trimmed = relativePath.trim();
    if (!trimmed) {
        throw new Error("A project-relative file path is required.");
    }
    if (path.isAbsolute(trimmed)) {
        throw new Error("Absolute paths are not allowed.");
    }
    const normalized = path.posix.normalize(trimmed.replace(/\\/g, "/"));
    if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
        throw new Error("The file path must stay inside the project directory.");
    }
    return normalized;
}
function resolveProjectFilePath(rootDir, relativePath) {
    const projectDir = path.resolve(rootDir);
    const normalizedRelativePath = normalizeProjectRelativeFilePath(relativePath);
    const absolutePath = path.resolve(projectDir, normalizedRelativePath);
    if (!absolutePath.startsWith(`${projectDir}${path.sep}`) && absolutePath !== projectDir) {
        throw new Error("The file path must stay inside the project directory.");
    }
    return {
        absolutePath,
        normalizedRelativePath
    };
}
function resolveTopicFilePath(rootDir, bucket, topic, relativePath) {
    const topicDir = path.resolve(resolveTopicDir(rootDir, bucket, topic));
    const normalizedRelativePath = normalizeTopicRelativeFilePath(relativePath);
    const absolutePath = path.resolve(topicDir, normalizedRelativePath);
    if (!absolutePath.startsWith(`${topicDir}${path.sep}`) && absolutePath !== topicDir) {
        throw new Error("The file path must stay inside the topic directory.");
    }
    return {
        absolutePath,
        normalizedRelativePath
    };
}
export async function readProjectFileDetail(rootDir, relativePath) {
    const { absolutePath, normalizedRelativePath } = resolveProjectFilePath(rootDir, relativePath);
    if (!isProjectTextFile(absolutePath)) {
        throw new Error(`Project file '${normalizedRelativePath}' is not a text file.`);
    }
    const content = await readTextIfExists(absolutePath);
    if (content === null) {
        throw new Error(`Project file '${normalizedRelativePath}' was not found.`);
    }
    const fileStat = await stat(absolutePath).catch(() => null);
    const kind = resolveTopicFileKind(absolutePath);
    const contentType = kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";
    return {
        kind,
        title: path.basename(absolutePath),
        sourcePath: normalizedRelativePath,
        content,
        contentType,
        updatedAt: fileStat?.mtime.toISOString() ?? null
    };
}
export async function readTopicFileDetail(rootDir, bucket, topic, relativePath) {
    const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
    const content = await readTextIfExists(absolutePath);
    if (content === null) {
        throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
    }
    const fileStat = await stat(absolutePath).catch(() => null);
    const kind = resolveTopicFileKind(absolutePath);
    const contentType = kind === "diff" ? "text/x-diff" : kind === "markdown" ? "text/markdown" : "text/plain";
    return {
        kind,
        title: path.basename(absolutePath),
        sourcePath: toRelativePath(rootDir, absolutePath),
        content,
        contentType,
        updatedAt: fileStat?.mtime.toISOString() ?? null
    };
}
function normalizeGitDiffSource(value) {
    if (value === "commit" || value === "commit-range" || value === "working-tree" || value === "legacy-diff-file") {
        return value;
    }
    return "unavailable";
}
function validateGitRevisionArg(value, label) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith("-") || /\s/.test(trimmed)) {
        throw new Error(`${label} is not a valid Git revision.`);
    }
    return trimmed;
}
function runGitText(rootDir, args) {
    return execFileSync("git", ["-C", rootDir, ...args], { encoding: "utf8" });
}
export async function readTopicGitDiffDetail(rootDir, bucket, topic, input) {
    const normalizedTargetPath = normalizeProjectRelativeFilePath(input.targetPath);
    const diffSource = normalizeGitDiffSource(input.diffSource ?? null);
    let content = "";
    if (diffSource === "commit") {
        const gitRef = validateGitRevisionArg(input.gitRef ?? "", "gitRef");
        content = runGitText(rootDir, ["show", "--format=", "--no-ext-diff", gitRef, "--", normalizedTargetPath]);
    }
    else if (diffSource === "commit-range") {
        const commitRange = validateGitRevisionArg(input.commitRange ?? "", "commitRange");
        content = runGitText(rootDir, ["diff", "--no-ext-diff", commitRange, "--", normalizedTargetPath]);
    }
    else if (diffSource === "working-tree") {
        if (bucket !== "active") {
            throw new Error("Working-tree diff lookup is only available for active topics.");
        }
        content = runGitText(rootDir, ["diff", "--no-ext-diff", "--", normalizedTargetPath]);
        if (!content.trim()) {
            content = runGitText(rootDir, ["diff", "--cached", "--no-ext-diff", "--", normalizedTargetPath]);
        }
    }
    else {
        throw new Error("Git diff metadata is unavailable for this file.");
    }
    if (!content.trim()) {
        content = `No Git diff is available for ${normalizedTargetPath}.`;
    }
    const lazyDiff = {
        topic,
        bucket,
        targetPath: normalizedTargetPath,
        diffSource,
        gitRef: input.gitRef ?? null,
        commitRange: input.commitRange ?? null,
        diffCommand: null,
        status: content.startsWith("No Git diff") ? "empty" : "available",
        taskRef: null,
        note: null
    };
    return {
        kind: "diff",
        title: path.basename(normalizedTargetPath),
        sourcePath: normalizedTargetPath,
        content,
        contentType: "text/x-diff",
        lazyDiff,
        updatedAt: nowIso()
    };
}
export async function updateTopicFile(rootDir, bucket, topic, relativePath, content) {
    const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
    const current = await readTextIfExists(absolutePath);
    if (current === null) {
        throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
    }
    await writeTextFile(absolutePath, content);
    return readTopicFileDetail(rootDir, bucket, topic, normalizedRelativePath);
}
export async function updateProjectFile(rootDir, relativePath, content) {
    const { absolutePath, normalizedRelativePath } = resolveProjectFilePath(rootDir, relativePath);
    if (!isProjectTextFile(absolutePath)) {
        throw new Error(`Project file '${normalizedRelativePath}' is not a text file.`);
    }
    const current = await readTextIfExists(absolutePath);
    if (current === null) {
        throw new Error(`Project file '${normalizedRelativePath}' was not found.`);
    }
    await writeTextFile(absolutePath, content);
    return readProjectFileDetail(rootDir, normalizedRelativePath);
}
export async function deleteTopicFile(rootDir, bucket, topic, relativePath) {
    const { absolutePath, normalizedRelativePath } = resolveTopicFilePath(rootDir, bucket, topic, relativePath);
    const current = await readTextIfExists(absolutePath);
    if (current === null) {
        throw new Error(`Topic file '${normalizedRelativePath}' was not found.`);
    }
    await rm(absolutePath, { force: true });
}
export async function deleteProjectFile(rootDir, relativePath) {
    const { absolutePath, normalizedRelativePath } = resolveProjectFilePath(rootDir, relativePath);
    if (!isProjectTextFile(absolutePath)) {
        throw new Error(`Project file '${normalizedRelativePath}' is not a text file.`);
    }
    const current = await readTextIfExists(absolutePath);
    if (current === null) {
        throw new Error(`Project file '${normalizedRelativePath}' was not found.`);
    }
    await rm(absolutePath, { force: true });
}
export function findWorkspaceRoot(startDir) {
    let cursor = path.resolve(startDir);
    while (true) {
        const candidate = path.join(cursor, "pnpm-workspace.yaml");
        if (existsSync(candidate)) {
            return cursor;
        }
        const parent = path.dirname(cursor);
        if (parent === cursor) {
            return null;
        }
        cursor = parent;
    }
}
export async function writeDashboardSnapshotFile(filePath, snapshot) {
    await writeTextFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`);
}
//# sourceMappingURL=index.js.map