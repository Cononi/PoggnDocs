import { create } from "zustand";
import type {
  DashboardSettingsView,
  DashboardSidebarItem,
  DashboardStore,
  DashboardThemeMode,
  DashboardWorkspaceFilterState,
  DashboardWorkspaceMode
} from "../model/dashboard";

const DASHBOARD_THEME_MODE_STORAGE_KEY = "pgg.dashboard.theme-mode";
const DASHBOARD_UI_STATE_STORAGE_KEY = "pgg.dashboard.ui-state";

type DashboardUiState = Pick<
  DashboardStore,
  | "activeTopMenu"
  | "activeSidebarItem"
  | "activeSettingsView"
  | "workspaceMode"
  | "selectedProjectId"
  | "selectedTopicKey"
  | "shellSearchQuery"
  | "topicFilter"
  | "workspaceFilterState"
  | "insightsRailOpen"
>;

const defaultWorkspaceFilterState: DashboardWorkspaceFilterState = {
  bucket: "all",
  stage: "all"
};

const defaultUiState: DashboardUiState = {
  activeTopMenu: "projects",
  activeSidebarItem: "board",
  activeSettingsView: "main",
  workspaceMode: "board",
  selectedProjectId: null,
  selectedTopicKey: null,
  shellSearchQuery: "",
  topicFilter: "",
  workspaceFilterState: defaultWorkspaceFilterState,
  insightsRailOpen: true
};

function readInitialThemeMode(): DashboardThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedValue = window.localStorage.getItem(DASHBOARD_THEME_MODE_STORAGE_KEY);
  return storedValue === "light" ? "light" : "dark";
}

function persistThemeMode(value: DashboardThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_THEME_MODE_STORAGE_KEY, value);
}

function readInitialUiState(): DashboardUiState {
  if (typeof window === "undefined") {
    return defaultUiState;
  }

  try {
    const raw = window.localStorage.getItem(DASHBOARD_UI_STATE_STORAGE_KEY);
    if (!raw) {
      return defaultUiState;
    }

    const parsed = JSON.parse(raw) as Partial<DashboardUiState>;
    return {
      ...defaultUiState,
      ...parsed,
      workspaceFilterState: {
        ...defaultWorkspaceFilterState,
        ...(parsed.workspaceFilterState ?? {})
      }
    };
  } catch {
    return defaultUiState;
  }
}

function persistUiState(state: DashboardUiState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_UI_STATE_STORAGE_KEY, JSON.stringify(state));
}

function toUiState(store: DashboardStore): DashboardUiState {
  return {
    activeTopMenu: store.activeTopMenu,
    activeSidebarItem: store.activeSidebarItem,
    activeSettingsView: store.activeSettingsView,
    workspaceMode: store.workspaceMode,
    selectedProjectId: store.selectedProjectId,
    selectedTopicKey: store.selectedTopicKey,
    shellSearchQuery: store.shellSearchQuery,
    topicFilter: store.topicFilter,
    workspaceFilterState: store.workspaceFilterState,
    insightsRailOpen: store.insightsRailOpen
  };
}

export const useDashboardStore = create<DashboardStore>((set, get) => {
  const initialUiState = readInitialUiState();

  const setAndPersist = (partial: Partial<DashboardUiState>) => {
    set(partial as Partial<DashboardStore>);
    persistUiState({ ...toUiState(get()), ...partial });
  };

  const openProjectWorkspace = (
    sidebarItem: DashboardSidebarItem,
    workspaceMode: DashboardWorkspaceMode
  ) => {
    setAndPersist({
      activeTopMenu: "projects",
      activeSidebarItem: sidebarItem,
      workspaceMode
    });
  };

  return {
    ...initialUiState,
    themeMode: readInitialThemeMode(),
    setActiveTopMenu: (value) => {
      if (value === "settings") {
        setAndPersist({
          activeTopMenu: "settings",
          workspaceMode: "settings"
        });
        return;
      }

      const currentSidebarItem = get().activeSidebarItem;
      const nextSidebarItem = currentSidebarItem ?? "board";
      const nextWorkspaceMode: DashboardWorkspaceMode =
        nextSidebarItem === "category"
          ? "category"
          : nextSidebarItem === "report"
            ? "report"
            : nextSidebarItem === "history"
              ? "history"
              : "board";

      setAndPersist({
        activeTopMenu: "projects",
        activeSidebarItem: nextSidebarItem,
        workspaceMode: nextWorkspaceMode
      });
    },
    setActiveSidebarItem: (value) => {
      const nextWorkspaceMode: DashboardWorkspaceMode =
        value === "category"
          ? "category"
          : value === "report"
            ? "report"
            : value === "history"
              ? "history"
              : "board";
      openProjectWorkspace(value, nextWorkspaceMode);
    },
    setActiveSettingsView: (value: DashboardSettingsView) =>
      setAndPersist({
        activeTopMenu: "settings",
        activeSettingsView: value,
        workspaceMode: "settings"
      }),
    setWorkspaceMode: (value) => setAndPersist({ workspaceMode: value }),
    setThemeMode: (value) => {
      persistThemeMode(value);
      set({ themeMode: value });
    },
    setSelectedProjectId: (value) => setAndPersist({ selectedProjectId: value }),
    setSelectedTopicKey: (value) => setAndPersist({ selectedTopicKey: value }),
    setShellSearchQuery: (value) => setAndPersist({ shellSearchQuery: value }),
    setTopicFilter: (value) => setAndPersist({ topicFilter: value }),
    setWorkspaceFilterState: (value) => setAndPersist({ workspaceFilterState: value }),
    setInsightsRailOpen: (value) => setAndPersist({ insightsRailOpen: value })
  };
});
