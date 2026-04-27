import type {
  DashboardDetailSection,
  DashboardPrimaryMenu,
  DashboardSettingsView
} from "../shared/model/dashboard";

export type DashboardRouteScreen = "home" | "projects" | "settings";
export type DashboardRouteModal = "project-selector" | "add-project" | null;

export type DashboardRouteState = {
  screen: DashboardRouteScreen;
  activeTopMenu: DashboardPrimaryMenu;
  projectId: string | null;
  section: DashboardDetailSection;
  panel: DashboardSettingsView;
  topicKey: string | null;
  filePath: string | null;
  insightsOpen: boolean;
  modal: DashboardRouteModal;
};

type DashboardRouteWriteMode = "push" | "replace";

type DashboardRouteInput = {
  activeRouteScreen: DashboardRouteScreen;
  activeTopMenu: DashboardPrimaryMenu;
  selectedProjectId: string | null;
  activeDetailSection: DashboardDetailSection;
  activeSettingsView: DashboardSettingsView;
  selectedTopicKey: string | null;
  filePath: string | null;
  insightsRailOpen: boolean;
  projectDialogOpen: boolean;
  projectSelectorOpen: boolean;
};

const detailSections = new Set<DashboardDetailSection>(["main", "history", "report", "files", "settings"]);
const settingsPanels = new Set<DashboardSettingsView>(["main", "refresh", "category", "git", "system"]);
const routeModals = new Set<Exclude<DashboardRouteModal, null>>(["project-selector", "add-project"]);

export const defaultDashboardRouteState: DashboardRouteState = {
  screen: "projects",
  activeTopMenu: "projects",
  projectId: null,
  section: "main",
  panel: "main",
  topicKey: null,
  filePath: null,
  insightsOpen: false,
  modal: null
};

export function readDashboardRouteState(location: Location = window.location): DashboardRouteState {
  const searchParams = new URLSearchParams(location.search);
  const screen = routeScreenFromPath(location.pathname);
  const section = readEnum(searchParams.get("section"), detailSections, "main");
  const panel = readEnum(searchParams.get("panel"), settingsPanels, "main");
  const modal = readEnum<Exclude<DashboardRouteModal, null>>(searchParams.get("modal"), routeModals, null);

  return {
    screen,
    activeTopMenu: screen === "settings" ? "settings" : "projects",
    projectId: readOptional(searchParams.get("project")),
    section: screen === "settings" ? "main" : section,
    panel: screen === "settings" ? panel : "main",
    topicKey: screen === "settings" ? null : readOptional(searchParams.get("topic")),
    filePath: screen === "settings" ? null : readOptional(searchParams.get("file")),
    insightsOpen: screen !== "settings" && searchParams.get("insights") === "open",
    modal
  };
}

export function writeDashboardRouteState(nextState: DashboardRouteState, mode: DashboardRouteWriteMode = "push"): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = buildDashboardRouteUrl(nextState);
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (nextUrl === currentUrl) {
    return;
  }

  if (mode === "replace") {
    window.history.replaceState(null, "", nextUrl);
    return;
  }

  window.history.pushState(null, "", nextUrl);
}

export function buildDashboardRouteUrl(state: DashboardRouteState): string {
  const params = new URLSearchParams();
  const path = state.screen === "settings" ? "/settings" : state.screen === "home" ? "/home" : "/projects";

  if (state.screen === "settings") {
    appendIfNotDefault(params, "panel", state.panel, "main");
    appendModal(params, state.modal);
    return withSearch(path, params);
  }

  appendIfValue(params, "project", state.projectId);
  appendIfNotDefault(params, "section", state.screen === "home" ? "main" : state.section, "main");
  appendIfValue(params, "topic", state.topicKey);
  appendIfValue(params, "file", state.filePath);
  if (state.insightsOpen) {
    params.set("insights", "open");
  }
  appendModal(params, state.modal);
  return withSearch(path, params);
}

export function createDashboardRouteState(input: DashboardRouteInput): DashboardRouteState {
  return {
    screen: resolveRouteScreen(input.activeTopMenu, input.activeRouteScreen, input.activeDetailSection),
    activeTopMenu: input.activeTopMenu,
    projectId: input.selectedProjectId,
    section: input.activeDetailSection,
    panel: input.activeSettingsView,
    topicKey: input.selectedTopicKey,
    filePath: input.filePath,
    insightsOpen: input.activeTopMenu === "projects" && input.insightsRailOpen,
    modal: input.projectDialogOpen ? "add-project" : input.projectSelectorOpen ? "project-selector" : null
  };
}

function resolveRouteScreen(
  activeTopMenu: DashboardPrimaryMenu,
  activeRouteScreen: DashboardRouteScreen,
  activeDetailSection: DashboardDetailSection
): DashboardRouteScreen {
  if (activeTopMenu === "settings") {
    return "settings";
  }
  return activeRouteScreen === "home" && activeDetailSection === "main" ? "home" : "projects";
}

function routeScreenFromPath(pathname: string): DashboardRouteScreen {
  if (pathname === "/settings") {
    return "settings";
  }
  if (pathname === "/" || pathname === "/home") {
    return "home";
  }
  return "projects";
}

function readOptional(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

function readEnum<T extends string>(value: string | null, allowed: Set<T>, fallback: T): T;
function readEnum<T extends string>(value: string | null, allowed: Set<T>, fallback: T | null): T | null;
function readEnum<T extends string>(value: string | null, allowed: Set<T>, fallback: T | null): T | null {
  if (!value) {
    return fallback;
  }
  return allowed.has(value as T) ? (value as T) : fallback;
}

function appendIfValue(params: URLSearchParams, key: string, value: string | null): void {
  if (value) {
    params.set(key, value);
  }
}

function appendIfNotDefault(params: URLSearchParams, key: string, value: string, defaultValue: string): void {
  if (value !== defaultValue) {
    params.set(key, value);
  }
}

function appendModal(params: URLSearchParams, modal: DashboardRouteModal): void {
  if (modal) {
    params.set("modal", modal);
  }
}

function withSearch(path: string, params: URLSearchParams): string {
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
