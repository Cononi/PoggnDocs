import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { InsightsRail } from "../features/backlog/InsightsRail";
import { CategoryManagementPanel } from "../features/project-list/CategoryManagementPanel";
import { ProjectDetailWorkspace } from "../features/project-detail/ProjectDetailWorkspace";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import {
  fetchDashboardSnapshot,
  fetchProjectFileDetail,
  fetchTopicFileDetail,
  removeProjectFile,
  removeTopicFile,
  requestDashboardJson,
  requestDashboardSnapshot,
  saveProjectFileDetail,
  saveTopicFileDetail
} from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type {
  ArtifactSelection,
  DashboardDetailSection,
  DashboardProjectInitRequest,
  DashboardQueryResult,
  DashboardSettingsView,
  DashboardSnapshot,
  ProjectFolderInspection,
  ProjectGitSetupRequest
} from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import { normalizeDashboardTitleIconSvg, toSvgDataUrl } from "../shared/utils/brand";
import {
  buildProjectFileArtifactEntry,
  buildTopicKey,
  createArtifactSelection,
  getDefaultArtifactSelection,
  resolveTopicKeyFromSourcePath,
  splitVisibleTopics
} from "../shared/utils/dashboard";
import {
  DashboardSpeedDial,
  DashboardStatePanel,
  ProjectContextSidebar,
  ProjectSelectorDialog,
  TopNavigation
} from "./DashboardShellChrome";
import {
  createDashboardRouteState,
  readDashboardRouteState,
  writeDashboardRouteState,
  type DashboardRouteModal,
  type DashboardRouteScreen,
  type DashboardRouteState
} from "./dashboardRouteState";
import {
  buildInsightsSummary,
  createMutationPayload,
  markDashboardInteraction,
  resolveCurrentProject,
  resolveInitialSelectedProjectId,
  resolveLatestActiveProject,
  resolveSelectedProject,
  resolveSelectedTopic,
  resolveSnapshotRefreshInterval,
  resolveVisibleTopicSelection,
  type DashboardMutationPayload
} from "./dashboardShell";

export default function DashboardApp() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isCompactShell = useMediaQuery(theme.breakpoints.down("lg"));
  const activeTopMenu = useDashboardStore((state) => state.activeTopMenu);
  const projectDetailOpen = useDashboardStore((state) => state.projectDetailOpen);
  const activeDetailSection = useDashboardStore((state) => state.activeDetailSection);
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const insightsRailOpen = useDashboardStore((state) => state.insightsRailOpen);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setProjectDetailOpen = useDashboardStore((state) => state.setProjectDetailOpen);
  const setActiveDetailSection = useDashboardStore((state) => state.setActiveDetailSection);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const themeMode = useDashboardStore((state) => state.themeMode);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setThemeMode = useDashboardStore((state) => state.setThemeMode);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const setInsightsRailOpen = useDashboardStore((state) => state.setInsightsRailOpen);
  const deferredTopicFilter = useDeferredValue(topicFilter);
  const initialRouteState = useMemo(() => readDashboardRouteState(), []);
  const [activeRouteScreen, setActiveRouteScreen] = useState<DashboardRouteScreen>(
    () => initialRouteState.screen
  );
  const suppressNextRouteWrite = useRef(false);
  const routeWriteInitialized = useRef(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(() => initialRouteState.modal === "add-project");
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [projectInitLanguage, setProjectInitLanguage] = useState<"ko" | "en">("ko");
  const [projectInitAutoMode, setProjectInitAutoMode] = useState<"on" | "off">("on");
  const [projectInitTeamsMode, setProjectInitTeamsMode] = useState<"on" | "off">("off");
  const [projectInitGitMode, setProjectInitGitMode] = useState<"on" | "off">("off");
  const [projectInitGitSetupPath, setProjectInitGitSetupPath] = useState<"local" | "defer">("defer");
  const [projectAddStep, setProjectAddStep] = useState(0);
  const [projectInspection, setProjectInspection] = useState<ProjectFolderInspection | null>(null);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<string | null>(null);
  const [dangerousDeleteRoot, setDangerousDeleteRoot] = useState(false);
  const [confirmedNoExternalBackup, setConfirmedNoExternalBackup] = useState(false);
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [fileSelection, setFileSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [projectSelectorOpen, setProjectSelectorOpen] = useState(
    () => initialRouteState.modal === "project-selector"
  );

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: (query) => resolveSnapshotRefreshInterval(query.state.data)
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const globalUser = snapshot?.globalUser ?? { username: null, configured: false, source: "missing" };
  const currentProject = resolveCurrentProject(snapshot);
  const selectedProject = resolveSelectedProject(snapshot, selectedProjectId, currentProject);
  const latestActiveProject = resolveLatestActiveProject(snapshot, currentProject);
  const boardContextProject = selectedProject ?? currentProject;
  const projectContextId = boardContextProject?.id ?? null;
  const projectFileSelectionKey = projectContextId ? `project:${projectContextId}` : null;
  const projectSurfaceProject = activeTopMenu === "projects" ? boardContextProject : currentProject;
  const dictionary = dashboardLocale[projectSurfaceProject?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";
  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );
  const pendingDeleteProject =
    (snapshot?.projects ?? []).find((project) => project.id === pendingDeleteProjectId) ?? null;
  const allProjectTopics = useMemo(
    () => (boardContextProject ? [...boardContextProject.activeTopics, ...boardContextProject.archivedTopics] : []),
    [boardContextProject]
  );
  const { activeTopics, archivedTopics } = useMemo(
    () => splitVisibleTopics(boardContextProject, deferredTopicFilter),
    [boardContextProject, deferredTopicFilter]
  );
  const visibleTopics = useMemo(() => [...activeTopics, ...archivedTopics], [activeTopics, archivedTopics]);
  const nextVisibleTopicKey = useMemo(
    () => resolveVisibleTopicSelection(visibleTopics, selectedTopicKey),
    [selectedTopicKey, visibleTopics]
  );
  const selectedTopic = useMemo(
    () => resolveSelectedTopic(visibleTopics, nextVisibleTopicKey),
    [nextVisibleTopicKey, visibleTopics]
  );
  const detailTopic = useMemo(
    () =>
      detailSelection
        ? allProjectTopics.find((topic) => buildTopicKey(topic) === detailSelection.topicKey) ?? null
        : null,
    [allProjectTopics, detailSelection]
  );
  const fileTopic = useMemo(
    () =>
      fileSelection
        ? allProjectTopics.find((topic) => buildTopicKey(topic) === fileSelection.topicKey) ?? null
        : null,
    [allProjectTopics, fileSelection]
  );
  const isProjectFileSelection = Boolean(
    fileSelection && projectFileSelectionKey && fileSelection.topicKey === projectFileSelectionKey
  );
  const insightsSummary = useMemo(
    () => buildInsightsSummary(boardContextProject, snapshot?.recentActivity ?? [], dictionary),
    [boardContextProject, dictionary, snapshot?.recentActivity]
  );
  const isDeletingCurrentProject = pendingDeleteProject?.id === currentProject?.id;
  const deleteRootAllowed = !dangerousDeleteRoot || confirmedNoExternalBackup;
  const routeStateForUi: DashboardRouteState = createDashboardRouteState({
    activeRouteScreen,
    activeTopMenu,
    selectedProjectId,
    activeDetailSection,
    activeSettingsView,
    selectedTopicKey,
    filePath: fileSelection?.sourcePath ?? fileSelection?.relativePath ?? null,
    insightsRailOpen,
    projectDialogOpen,
    projectSelectorOpen
  });

  const applyRouteState = (nextRoute: DashboardRouteState) => {
    suppressNextRouteWrite.current = true;
    setActiveRouteScreen(nextRoute.screen);
    startTransition(() => {
      if (nextRoute.activeTopMenu === "settings") {
        setActiveSettingsView(nextRoute.panel);
        setInsightsRailOpen(false);
      } else {
        setActiveTopMenu("projects");
        setProjectDetailOpen(true);
        setActiveDetailSection(nextRoute.section);
        setSelectedTopicKey(nextRoute.topicKey);
        setInsightsRailOpen(nextRoute.insightsOpen);
      }
      if (nextRoute.projectId) {
        setSelectedProjectId(nextRoute.projectId);
      }
      setProjectDialogOpen(nextRoute.modal === "add-project");
      setProjectSelectorOpen(nextRoute.modal === "project-selector");
    });
  };

  const openRouteModal = (modal: Exclude<DashboardRouteModal, null>) => {
    if (modal === "add-project") {
      setProjectDialogOpen(true);
      setProjectSelectorOpen(false);
      return;
    }
    setProjectSelectorOpen(true);
    setProjectDialogOpen(false);
  };

  const goHome = () => {
    startTransition(() => {
      setActiveRouteScreen("home");
      setActiveTopMenu("projects");
      setProjectDetailOpen(true);
      setActiveDetailSection("main");
      setInsightsRailOpen(false);
      setSidebarDrawerOpen(false);
    });
  };

  useEffect(() => {
    applyRouteState(readDashboardRouteState());
    routeWriteInitialized.current = true;

    const handlePopState = () => {
      applyRouteState(readDashboardRouteState());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (suppressNextRouteWrite.current) {
      suppressNextRouteWrite.current = false;
      return;
    }

    writeDashboardRouteState(routeStateForUi, routeWriteInitialized.current ? "push" : "replace");
    routeWriteInitialized.current = true;
  }, [
    routeStateForUi.screen,
    routeStateForUi.projectId,
    routeStateForUi.section,
    routeStateForUi.panel,
    routeStateForUi.topicKey,
    routeStateForUi.filePath,
    routeStateForUi.insightsOpen,
    routeStateForUi.modal
  ]);

  useEffect(() => {
    const nextSelectedProjectId = resolveInitialSelectedProjectId(snapshot, selectedProjectId);
    if (!nextSelectedProjectId) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(nextSelectedProjectId);
    });
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  useEffect(() => {
    if (!snapshot?.projects.length || !selectedProjectId) {
      return;
    }

    const selectedProjectStillExists = snapshot.projects.some((project) => project.id === selectedProjectId);
    if (selectedProjectStillExists) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null);
    });
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  useEffect(() => {
    const dashboardTitle = projectSurfaceProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle;
    document.title = dashboardTitle;

    const iconSvg = normalizeDashboardTitleIconSvg(projectSurfaceProject?.dashboardTitleIconSvg);
    const iconHref = toSvgDataUrl(iconSvg);
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }, [dictionary.dashboardFallbackTitle, projectSurfaceProject?.dashboardTitle, projectSurfaceProject?.dashboardTitleIconSvg]);

  useEffect(() => {
    if (!nextVisibleTopicKey) {
      if (selectedTopicKey !== null) {
        startTransition(() => {
          setSelectedTopicKey(null);
        });
      }
      return;
    }

    if (selectedTopicKey === nextVisibleTopicKey) {
      return;
    }

    startTransition(() => {
      setSelectedTopicKey(nextVisibleTopicKey);
    });
  }, [nextVisibleTopicKey, selectedTopicKey, setSelectedTopicKey]);

  useEffect(() => {
    const nextSelection = getDefaultArtifactSelection(selectedTopic);
    if (
      detailSelection?.topicKey === nextSelection?.topicKey &&
      detailSelection?.sourcePath === nextSelection?.sourcePath
    ) {
      return;
    }

    setDetailSelection(nextSelection);
  }, [detailSelection, selectedTopic]);

  useEffect(() => {
    if (activeTopMenu !== "projects" || activeDetailSection !== "files" || !boardContextProject || !projectFileSelectionKey) {
      return;
    }

    const routeFilePath = readDashboardRouteState().filePath;
    if (!routeFilePath) {
      return;
    }

    const routeFile = boardContextProject.files.find(
      (file) => file.sourcePath === routeFilePath || file.relativePath === routeFilePath
    );
    if (!routeFile) {
      return;
    }

    if (fileSelection?.topicKey === projectFileSelectionKey && fileSelection.sourcePath === routeFile.sourcePath) {
      return;
    }

    setFileSelection(createArtifactSelection(projectFileSelectionKey, buildProjectFileArtifactEntry(routeFile)));
  }, [activeDetailSection, activeTopMenu, boardContextProject, fileSelection, projectFileSelectionKey]);

  useEffect(() => {
    if (!fileSelection || !boardContextProject || !projectFileSelectionKey) {
      return;
    }

    const fileStillVisible =
      fileSelection.topicKey === projectFileSelectionKey &&
      boardContextProject.files.some((file) => file.relativePath === fileSelection.relativePath);

    if (!fileStillVisible) {
      setFileSelection(null);
    }
  }, [boardContextProject, fileSelection, projectFileSelectionKey]);

  useEffect(() => {
    if (snapshot?.generatedAt) {
      markDashboardInteraction("snapshot-ready", "ready");
    }
  }, [snapshot?.generatedAt]);

  useEffect(() => {
    if (boardContextProject?.id) {
      markDashboardInteraction("project-switch", "ready");
    }
  }, [boardContextProject?.id]);

  const detailFileQuery = useQuery({
    queryKey: [
      "dashboard-topic-file-detail",
      projectContextId,
      detailTopic?.bucket ?? null,
      detailTopic?.name ?? null,
      detailSelection?.relativePath ?? null
    ],
    queryFn: async () => {
      if (!projectContextId || !detailTopic || !detailSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      return fetchTopicFileDetail(
        projectContextId,
        detailTopic.bucket,
        detailTopic.name,
        detailSelection.relativePath
      );
    },
    enabled: Boolean(
      projectContextId &&
        detailTopic &&
        detailSelection?.relativePath &&
        !detailSelection.detail
    )
  });

  useEffect(() => {
    if (!detailFileQuery.data) {
      return;
    }

    setDetailSelection((current) => {
      if (
        !current ||
        current.relativePath !== detailSelection?.relativePath ||
        current.topicKey !== detailSelection?.topicKey
      ) {
        return current;
      }

      return {
        ...current,
        title: detailFileQuery.data.title,
        detail: detailFileQuery.data
      };
    });
  }, [detailFileQuery.data, detailSelection?.relativePath, detailSelection?.topicKey]);

  useEffect(() => {
    if (!detailFileQuery.error) {
      return;
    }

    setFeedback(
      detailFileQuery.error instanceof Error ? detailFileQuery.error.message : dictionary.dashboardError
    );
  }, [detailFileQuery.error, dictionary.dashboardError]);

  const fileDetailQuery = useQuery({
    queryKey: [
      "dashboard-topic-browser-file-detail",
      projectContextId,
      isProjectFileSelection ? "project" : "topic",
      fileTopic?.bucket ?? null,
      fileTopic?.name ?? null,
      fileSelection?.relativePath ?? null
    ],
    queryFn: async () => {
      if (!projectContextId || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      if (isProjectFileSelection) {
        return fetchProjectFileDetail(projectContextId, fileSelection.relativePath);
      }

      if (!fileTopic) {
        throw new Error(dictionary.detailUnavailable);
      }

      return fetchTopicFileDetail(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath
      );
    },
    enabled: Boolean(
      projectContextId &&
        fileSelection?.relativePath &&
        !fileSelection.detail &&
        (isProjectFileSelection || fileTopic)
    )
  });

  useEffect(() => {
    if (!fileDetailQuery.data) {
      return;
    }

    setFileSelection((current) => {
      if (
        !current ||
        current.relativePath !== fileSelection?.relativePath ||
        current.topicKey !== fileSelection?.topicKey
      ) {
        return current;
      }

      return {
        ...current,
        title: fileDetailQuery.data.title,
        detail: fileDetailQuery.data
      };
    });
  }, [fileDetailQuery.data, fileSelection?.relativePath, fileSelection?.topicKey]);

  useEffect(() => {
    if (!fileDetailQuery.error) {
      return;
    }

    setFeedback(fileDetailQuery.error instanceof Error ? fileDetailQuery.error.message : dictionary.dashboardError);
  }, [fileDetailQuery.error, dictionary.dashboardError]);

  const updateSnapshotCache = (nextSnapshot: DashboardSnapshot) => {
    queryClient.setQueryData<DashboardQueryResult>(["dashboard-snapshot"], (current) => ({
      snapshot: nextSnapshot,
      source: current?.source ?? "live"
    }));
  };

  const snapshotMutation = useMutation({
    mutationFn: async (payload: DashboardMutationPayload) => {
      if (!isLiveMode) {
        throw new Error(dictionary.liveEditingDisabled);
      }

      return requestDashboardSnapshot(payload.path, {
        method: payload.method,
        body: payload.body
      });
    },
    onSuccess: (nextSnapshot) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const gitSetupMutation = useMutation({
    mutationFn: async (input: { projectId: string; request: ProjectGitSetupRequest }) => {
      if (!isLiveMode) {
        throw new Error(dictionary.liveEditingDisabled);
      }

      return requestDashboardJson<{ snapshot: DashboardSnapshot }>(
        `/api/dashboard/projects/${input.projectId}/git/setup`,
        {
          method: "POST",
          body: JSON.stringify(input.request)
        }
      );
    },
    onSuccess: ({ snapshot: nextSnapshot }) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const projectInspectMutation = useMutation({
    mutationFn: async (rootDir: string) => {
      if (!isLiveMode) {
        throw new Error(dictionary.liveEditingDisabled);
      }

      return requestDashboardJson<ProjectFolderInspection>("/api/dashboard/projects/inspect", {
        method: "POST",
        body: JSON.stringify({ rootDir })
      });
    },
    onSuccess: (inspection) => {
      setProjectInspection(inspection);
      setFeedback(null);
      setProjectInitGitMode("off");
      setProjectInitGitSetupPath(inspection.hasGitRepository ? "defer" : "local");
      setProjectAddStep(1);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const saveFileMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!projectContextId || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      if (isProjectFileSelection) {
        return saveProjectFileDetail(projectContextId, fileSelection.relativePath, content);
      }

      if (!fileTopic) {
        throw new Error(dictionary.detailUnavailable);
      }

      return saveTopicFileDetail(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath,
        content
      );
    },
    onSuccess: ({ snapshot: nextSnapshot, detail }) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
      setFileSelection((current) =>
        current
          ? {
              ...current,
              title: detail.title,
              detail
            }
          : current
      );
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      if (!projectContextId || !fileSelection?.relativePath) {
        throw new Error(dictionary.detailUnavailable);
      }

      if (isProjectFileSelection) {
        return removeProjectFile(projectContextId, fileSelection.relativePath);
      }

      if (!fileTopic) {
        throw new Error(dictionary.detailUnavailable);
      }

      return removeTopicFile(
        projectContextId,
        fileTopic.bucket,
        fileTopic.name,
        fileSelection.relativePath
      );
    },
    onSuccess: ({ snapshot: nextSnapshot }) => {
      setFeedback(null);
      updateSnapshotCache(nextSnapshot);
      setFileSelection(null);
      setDetailDialogOpen(false);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const mutateSnapshot = (payload: DashboardMutationPayload) => {
    snapshotMutation.mutate(payload);
  };

  const resetProjectSurfaceSelection = () => {
    setSelectedTopicKey(null);
    setTopicFilter("");
    setDetailSelection(null);
    setFileSelection(null);
    setDetailDialogOpen(false);
  };

  const mutateCurrentProject = (
    section: "main" | "refresh" | "git" | "system",
    body: Record<string, unknown>
  ) => {
    if (!currentProject) {
      return;
    }

    mutateSnapshot(
      createMutationPayload(`/api/dashboard/projects/${currentProject.id}/${section}`, "PATCH", body)
    );
  };

  const mutateProject = (
    projectId: string,
    section: "main" | "refresh" | "git" | "system",
    body: Record<string, unknown>
  ) => {
    mutateSnapshot(createMutationPayload(`/api/dashboard/projects/${projectId}/${section}`, "PATCH", body));
  };

  const deferProjectGitSetup = (projectId: string, message: string) => {
    mutateSnapshot(
      createMutationPayload(`/api/dashboard/projects/${projectId}/git/defer`, "POST", { message })
    );
  };

  const runProjectGitSetup = (projectId: string, request: ProjectGitSetupRequest) => {
    gitSetupMutation.mutate({ projectId, request });
  };

  const focusProjectContext = (projectId: string) => {
    const shouldResetSelection = selectedProjectId !== projectId;
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setActiveRouteScreen("projects");
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setProjectDetailOpen(true);
      setActiveDetailSection("main");
      if (shouldResetSelection) {
        resetProjectSurfaceSelection();
      }
      setProjectSelectorOpen(false);
      if (isCompactShell) {
        setSidebarDrawerOpen(false);
      }
    });
  };

  const openManagementSection = (section: DashboardDetailSection) => {
    const projectId = boardContextProject?.id ?? selectedProjectId;
    if (!projectId) {
      return;
    }

    startTransition(() => {
      setActiveRouteScreen("projects");
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setProjectDetailOpen(true);
      setActiveDetailSection(section);
    });
  };

  const openSettingsPanel = (panel: DashboardSettingsView) => {
    setActiveRouteScreen("settings");
    setActiveSettingsView(panel);
    if (isCompactShell) {
      setSidebarDrawerOpen(false);
    }
  };

  const openProjectSelector = () => {
    openRouteModal("project-selector");
  };

  const closeProjectSelector = () => {
    setProjectSelectorOpen(false);
  };

  const handleSelectProjectFromSelector = (projectId: string) => {
    focusProjectContext(projectId);
  };

  const resolveSelectionTopicKey = (entry: { sourcePath: string }): string | null =>
    resolveTopicKeyFromSourcePath(entry.sourcePath) ?? (selectedTopic ? buildTopicKey(selectedTopic) : null);

  const renderProjectDetailWorkspace = (section: DashboardDetailSection) => (
    <ProjectDetailWorkspace
      project={boardContextProject}
      selectedTopic={selectedTopic}
      activeTopics={activeTopics}
      archivedTopics={archivedTopics}
      selectedTopicKey={nextVisibleTopicKey}
      topicFilter={topicFilter}
      activeSection={section}
      detailSelection={detailSelection}
      fileSelection={fileSelection}
      globalUser={globalUser}
      dictionary={dictionary}
      isLiveMode={isLiveMode}
      fileMutationPending={saveFileMutation.isPending || deleteFileMutation.isPending}
      onTopicFilterChange={handleTopicFilterChange}
      onSelectTopic={setSelectedTopicKey}
      onSelectArtifact={(entry) => {
        const topicKey = resolveSelectionTopicKey(entry);

        if (!topicKey) {
          return;
        }

        handleSelectArtifact(entry.sourcePath, createArtifactSelection(topicKey, entry));
      }}
      onOpenDetailDialog={() => {
        markDashboardInteraction("detail-open", "start");
        setDetailDialogOpen(true);
      }}
      onSelectFile={(entry) => {
        const topicKey = resolveSelectionTopicKey(entry) ?? projectFileSelectionKey;

        if (!topicKey) {
          return;
        }

        setFileSelection(createArtifactSelection(topicKey, entry));
      }}
      onSaveSelection={(content) => saveFileMutation.mutate(content)}
      onDeleteSelection={() => deleteFileMutation.mutate()}
      onApplyGitPrefixes={(workingBranchPrefix, releaseBranchPrefix) => {
        if (boardContextProject) {
          mutateProject(boardContextProject.id, "git", { workingBranchPrefix, releaseBranchPrefix });
        }
      }}
      onUpdateLanguage={(language) => {
        if (boardContextProject) {
          mutateProject(boardContextProject.id, "main", { language });
        }
      }}
      onUpdateSystem={(payload) => {
        if (boardContextProject) {
          mutateProject(boardContextProject.id, "system", payload);
        }
      }}
      onDeferGitSetup={(message) => {
        if (boardContextProject) {
          deferProjectGitSetup(boardContextProject.id, message);
        }
      }}
      onRunGitSetup={(request) => {
        if (boardContextProject) {
          runProjectGitSetup(boardContextProject.id, request);
        }
      }}
      gitSetupPending={gitSetupMutation.isPending}
    />
  );

  const handleTopicFilterChange = (value: string) => {
    markDashboardInteraction("topic-filter", "start");
    setTopicFilter(value);
  };

  const handleSelectArtifact = (sourcePath: string, selection: ArtifactSelection | null) => {
    const resolvedTopicKey =
      selection?.topicKey ??
      resolveTopicKeyFromSourcePath(sourcePath) ??
      (selectedTopic ? buildTopicKey(selectedTopic) : null);

    if (!selection || !resolvedTopicKey) {
      return;
    }

    setDetailSelection({
      ...selection,
      topicKey: resolvedTopicKey
    });
  };

  const promptForCategoryName = (title: string, currentName = "") => {
    const nextName = window.prompt(title, currentName)?.trim() ?? "";
    return nextName || null;
  };

  const handleCreateCategory = () => {
    const name = promptForCategoryName(dictionary.createCategoryTitle);
    if (!name) {
      return;
    }

    mutateSnapshot(createMutationPayload("/api/dashboard/categories", "POST", { name }));
  };

  const handleEditCategory = (categoryId: string, currentName: string) => {
    const name = promptForCategoryName(dictionary.editCategoryTitle, currentName);
    if (!name || name === currentName) {
      return;
    }

    mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}`, "PATCH", { name }));
  };

  const renderCategoryManagementPanel = () => (
    <CategoryManagementPanel
      categories={categories}
      dictionary={dictionary}
      isLiveMode={isLiveMode}
      onCreateCategory={handleCreateCategory}
      onEditCategory={handleEditCategory}
      onSetDefaultCategory={(categoryId) =>
        mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}/default`, "POST"))
      }
      onDeleteCategory={(categoryId) =>
        mutateSnapshot(createMutationPayload(`/api/dashboard/categories/${categoryId}`, "DELETE"))
      }
      onToggleCategory={(categoryId, visible) =>
        mutateSnapshot(
          createMutationPayload(`/api/dashboard/categories/${categoryId}/visibility`, "PATCH", { visible })
        )
      }
      onMoveCategory={(categoryId, targetIndex) =>
        mutateSnapshot(
          createMutationPayload(`/api/dashboard/categories/${categoryId}/reorder`, "POST", { targetIndex })
        )
      }
    />
  );

  const closeProjectDialog = () => {
    setProjectDialogOpen(false);
    setProjectRootDirDraft("");
    setProjectCategoryDraft("");
    setProjectInspection(null);
    setProjectAddStep(0);
    setUsernameDraft("");
    setProjectInitLanguage("ko");
    setProjectInitAutoMode("on");
    setProjectInitTeamsMode("off");
    setProjectInitGitMode("off");
    setProjectInitGitSetupPath("defer");
  };

  const closeDeleteProjectDialog = () => {
    setPendingDeleteProjectId(null);
    setDangerousDeleteRoot(false);
    setConfirmedNoExternalBackup(false);
  };

  const handleCreateProject = () => {
    const request: DashboardProjectInitRequest = {
      provider: "codex",
      language: projectInitLanguage,
      autoMode: projectInitAutoMode,
      teamsMode: projectInitTeamsMode,
      gitMode: projectInitGitMode,
      gitSetup:
        projectInitGitMode === "on" && projectInitGitSetupPath !== "defer"
          ? { path: projectInitGitSetupPath }
          : projectInitGitMode === "on"
            ? { path: "defer", deferMessage: dictionary.gitDeferredSavedMessage }
            : undefined
    };
    mutateSnapshot(
      createMutationPayload("/api/dashboard/projects/init", "POST", {
        rootDir: projectRootDirDraft,
        ...request,
        targetCategoryId: projectCategoryDraft || undefined
      })
    );
    closeProjectDialog();
  };

  const handleInspectProjectRoot = () => {
    if (!projectRootDirDraft.trim()) {
      return;
    }
    projectInspectMutation.mutate(projectRootDirDraft);
  };

  const projectAddSteps = [
    dictionary.projectAddStepInspect,
    dictionary.projectAddStepUsername,
    dictionary.projectAddStepInit,
    dictionary.projectAddStepGit,
    dictionary.projectAddStepConfirm
  ];
  const canAdvanceProjectStep =
    projectAddStep === 0
      ? Boolean(projectInspection)
      : projectAddStep === 1
        ? globalUser.configured
        : projectAddStep === 4
          ? false
          : true;
  const handleProjectStepNext = () => {
    if (canAdvanceProjectStep) {
      setProjectAddStep((current) => Math.min(current + 1, projectAddSteps.length - 1));
    }
  };
  const handleProjectStepBack = () => {
    setProjectAddStep((current) => Math.max(current - 1, 0));
  };

  const handleSaveGlobalUsername = () => {
    if (!usernameDraft.trim()) {
      return;
    }
    mutateSnapshot(createMutationPayload("/api/dashboard/user", "PATCH", { username: usernameDraft }));
    setUsernameDraft("");
  };

  const handleDeleteProject = () => {
    if (!pendingDeleteProject) {
      return;
    }

    mutateSnapshot(
      createMutationPayload(`/api/dashboard/projects/${pendingDeleteProject.id}`, "DELETE", {
        dangerousDeleteRoot: dangerousDeleteRoot && confirmedNoExternalBackup
      })
    );
    closeDeleteProjectDialog();
  };

  const renderMainSurface = () => {
    if (activeTopMenu === "settings") {
      if (activeSettingsView === "category") {
        return renderCategoryManagementPanel();
      }

      return (
        <SettingsWorkspace
          project={currentProject}
          panel={activeSettingsView}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          themeMode={themeMode}
          onApplyTitle={(title) => mutateCurrentProject("main", { title })}
          onApplyTitleIcon={(titleIconSvg) => mutateCurrentProject("main", { titleIconSvg })}
          onApplyRefreshInterval={(refreshIntervalMs) =>
            mutateCurrentProject("refresh", { refreshIntervalMs })
          }
          onUpdateThemeMode={setThemeMode}
        />
      );
    }

    if (projectDetailOpen) {
      return renderProjectDetailWorkspace(activeDetailSection);
    }

    return renderProjectDetailWorkspace("main");
  };

  if (snapshotQuery.isLoading) {
    return <DashboardStatePanel title={dictionary.loading} helper={dictionary.subtitle} />;
  }

  if (!snapshot || snapshot.projects.length === 0) {
    return <DashboardStatePanel title={dictionary.empty} helper={dictionary.subtitle} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <TopNavigation
        title={projectSurfaceProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
        titleIconSvg={projectSurfaceProject?.dashboardTitleIconSvg ?? ""}
        dictionary={dictionary}
        activeTopMenu={activeTopMenu}
        compactShell={isCompactShell}
        onOpenProjects={() => {
          setActiveRouteScreen("projects");
          setActiveTopMenu("projects");
        }}
        onOpenSettings={() => {
          setActiveRouteScreen("settings");
          setActiveTopMenu("settings");
        }}
        onToggleSidebar={() => setSidebarDrawerOpen(true)}
      />

      <Box
        sx={{
          display: "grid",
          minHeight: "calc(100vh - 74px)",
          gridTemplateColumns:
            !isCompactShell && activeTopMenu === "projects" && insightsRailOpen
              ? "292px minmax(0, 1fr) 360px"
              : !isCompactShell
                ? "292px minmax(0, 1fr)"
                : "1fr"
        }}
      >
        {!isCompactShell ? (
          <Box
            sx={{
              borderRight: `1px solid ${theme.palette.divider}`,
              minHeight: "100%",
              backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.72 : 0.86)
            }}
          >
            <ProjectContextSidebar
              activeTopMenu={activeTopMenu}
              projectDetailOpen={projectDetailOpen}
              activeDetailSection={activeDetailSection}
              activeSettingsView={activeSettingsView}
              compactShell={false}
              project={boardContextProject}
              globalUser={globalUser}
              dictionary={dictionary}
              onSelectDetailSection={openManagementSection}
              onSelectSettingsView={openSettingsPanel}
              onOpenProjectSelector={openProjectSelector}
            />
          </Box>
        ) : null}

        <Stack
          spacing={2}
          sx={{ px: { xs: 1.5, md: 2.5 }, pt: { xs: 1.5, md: 2 }, pb: { xs: 10, md: 2 } }}
        >
          {feedback ? (
            <Alert severity="error" onClose={() => setFeedback(null)}>
              {feedback}
            </Alert>
          ) : null}

          {renderMainSurface()}
        </Stack>

        {!isCompactShell && activeTopMenu === "projects" && insightsRailOpen ? (
          <Box
            sx={{
              p: 1.5,
              borderLeft: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.72 : 0.4)
            }}
          >
            <InsightsRail
              summary={insightsSummary}
              project={boardContextProject}
              isCurrentProject={boardContextProject?.id === currentProject?.id}
              isLatestProject={boardContextProject?.id === latestActiveProject?.id}
              dictionary={dictionary}
              isLiveMode={isLiveMode}
              onClose={() => setInsightsRailOpen(false)}
            />
          </Box>
        ) : null}
      </Box>

      <Drawer
        open={isCompactShell && sidebarDrawerOpen}
        onClose={() => setSidebarDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 292,
              backgroundColor: "background.paper"
            }
          }
        }}
      >
        <ProjectContextSidebar
          activeTopMenu={activeTopMenu}
          projectDetailOpen={projectDetailOpen}
          activeDetailSection={activeDetailSection}
          activeSettingsView={activeSettingsView}
          compactShell={isCompactShell}
          project={boardContextProject}
          globalUser={globalUser}
          dictionary={dictionary}
          onSelectDetailSection={(section) => {
            openManagementSection(section);
            setSidebarDrawerOpen(false);
          }}
          onSelectSettingsView={openSettingsPanel}
          onOpenProjectSelector={() => {
            openRouteModal("project-selector");
            setSidebarDrawerOpen(false);
          }}
        />
      </Drawer>

      <ProjectSelectorDialog
        open={projectSelectorOpen}
        project={boardContextProject}
        categories={categories}
        projects={snapshot.projects}
        dictionary={dictionary}
        currentProjectId={currentProject?.id ?? null}
        onClose={closeProjectSelector}
        onSelectProject={handleSelectProjectFromSelector}
        onDeleteProject={(projectId) => setPendingDeleteProjectId(projectId)}
      />

      <DashboardSpeedDial
        activeTopMenu={activeTopMenu}
        compactShell={isCompactShell}
        dictionary={dictionary}
        onGoHome={goHome}
        onAddProject={() => openRouteModal("add-project")}
        onToggleInsights={() => setInsightsRailOpen(!insightsRailOpen)}
        onOpenProjectSelector={() => openRouteModal("project-selector")}
      />

      <Drawer
        anchor="right"
        open={isCompactShell && activeTopMenu === "projects" && insightsRailOpen}
        onClose={() => setInsightsRailOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 360 },
              backgroundColor: "background.default"
            }
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <InsightsRail
            summary={insightsSummary}
            project={boardContextProject}
            isCurrentProject={boardContextProject?.id === currentProject?.id}
            isLatestProject={boardContextProject?.id === latestActiveProject?.id}
            dictionary={dictionary}
            isLiveMode={isLiveMode}
            onClose={() => setInsightsRailOpen(false)}
          />
        </Box>
      </Drawer>

      <Dialog open={projectDialogOpen} onClose={closeProjectDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dictionary.addProjectTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1.25 }}>
            <Typography variant="body2" color="text.secondary">
              {dictionary.addProjectHint}
            </Typography>
            <Stepper activeStep={projectAddStep} orientation="vertical">
              {projectAddSteps.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha(theme.palette.primary.main, 0.05)})`
              }}
            >
              <Stack spacing={1.5}>
                {projectAddStep === 0 ? (
                  <>
                    <TextField
                      autoFocus
                      fullWidth
                      size="small"
                      label={dictionary.projectRootDir}
                      value={projectRootDirDraft}
                      onChange={(event) => {
                        setProjectRootDirDraft(event.target.value);
                        setProjectInspection(null);
                        setProjectAddStep(0);
                      }}
                    />
                    <Button
                      variant="outlined"
                      disabled={!isLiveMode || !projectRootDirDraft.trim() || projectInspectMutation.isPending}
                      onClick={handleInspectProjectRoot}
                    >
                      {dictionary.inspectProject}
                    </Button>
                    {projectInspection ? (
                      <Alert severity={projectInspection.hasPggProject ? "info" : "warning"}>
                        {projectInspection.hasPggProject ? dictionary.projectAlreadyInitialized : dictionary.projectNeedsInit}
                      </Alert>
                    ) : null}
                  </>
                ) : null}
                {projectAddStep === 1 ? (
                  globalUser.configured ? (
                    <Alert severity="success">
                      {dictionary.username}: {globalUser.username}
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      <Alert severity="warning">{dictionary.usernameRequiredForInit}</Alert>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          label={dictionary.username}
                          value={usernameDraft}
                          onChange={(event) => setUsernameDraft(event.target.value)}
                        />
                        <Button variant="contained" disabled={!isLiveMode || !usernameDraft.trim()} onClick={handleSaveGlobalUsername}>
                          {dictionary.save}
                        </Button>
                      </Stack>
                    </Stack>
                  )
                ) : null}
                {projectAddStep === 2 ? (
                  <>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={dictionary.language}
                      value={projectInitLanguage}
                      onChange={(event) => setProjectInitLanguage(event.target.value === "en" ? "en" : "ko")}
                    >
                      <MenuItem value="ko">Korean / 한국어</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </TextField>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <FormControlLabel
                        control={<Switch checked={projectInitAutoMode === "on"} onChange={(event) => setProjectInitAutoMode(event.target.checked ? "on" : "off")} />}
                        label={dictionary.autoMode}
                      />
                      <FormControlLabel
                        control={<Switch checked={projectInitTeamsMode === "on"} onChange={(event) => setProjectInitTeamsMode(event.target.checked ? "on" : "off")} />}
                        label={dictionary.teamsMode}
                      />
                    </Stack>
                  </>
                ) : null}
                {projectAddStep === 3 ? (
                  <>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <Button
                        fullWidth
                        variant={projectInitGitMode === "off" ? "contained" : "outlined"}
                        onClick={() => setProjectInitGitMode("off")}
                      >
                        {dictionary.projectAddGitOff}
                      </Button>
                      <Button
                        fullWidth
                        variant={projectInitGitMode === "on" ? "contained" : "outlined"}
                        onClick={() => setProjectInitGitMode("on")}
                      >
                        {dictionary.projectAddGitOn}
                      </Button>
                    </Stack>
                    <Alert severity={projectInitGitMode === "off" ? "info" : "warning"}>
                      {projectInitGitMode === "off" ? dictionary.projectAddGitOffHint : dictionary.projectAddGitOnHint}
                    </Alert>
                    {projectInitGitMode === "on" ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={dictionary.gitSetupPath}
                        value={projectInitGitSetupPath}
                        onChange={(event) => setProjectInitGitSetupPath(event.target.value === "local" ? "local" : "defer")}
                      >
                        <MenuItem value="local">{dictionary.gitSetupLocal}</MenuItem>
                        <MenuItem value="defer">{dictionary.deferGitSetup}</MenuItem>
                      </TextField>
                    ) : null}
                  </>
                ) : null}
                {projectAddStep === 4 ? (
                  <>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={dictionary.targetCategory}
                      value={projectCategoryDraft}
                      onChange={(event) => setProjectCategoryDraft(event.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Alert severity="info">
                      {projectInitGitMode === "off"
                        ? dictionary.projectAddConfirmGitOff
                        : projectInitGitSetupPath === "local"
                          ? dictionary.projectAddConfirmGitLocal
                          : dictionary.projectAddConfirmGitDefer}
                    </Alert>
                  </>
                ) : null}
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProjectDialog}>{dictionary.cancel}</Button>
          {projectAddStep > 0 ? <Button onClick={handleProjectStepBack}>{dictionary.projectAddBack}</Button> : null}
          {projectAddStep < projectAddSteps.length - 1 ? (
            <Button variant="contained" disabled={!canAdvanceProjectStep} onClick={handleProjectStepNext}>
              {dictionary.projectAddNext}
            </Button>
          ) : (
            <Button variant="contained" disabled={!isLiveMode || !globalUser.configured || !projectRootDirDraft.trim() || !projectInspection} onClick={handleCreateProject}>
              {dictionary.save}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={pendingDeleteProject !== null}
        onClose={closeDeleteProjectDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{dictionary.deleteProjectTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {dictionary.deleteProjectHint}
            </Typography>
            {pendingDeleteProject ? (
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{pendingDeleteProject.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pendingDeleteProject.rootDir}
                  </Typography>
                </Stack>
              </Paper>
            ) : null}
            {isDeletingCurrentProject ? (
              <Alert severity="warning">{dictionary.deleteProjectBlockedCurrent}</Alert>
            ) : null}
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dangerousDeleteRoot}
                    color="error"
                    disabled={isDeletingCurrentProject}
                    onChange={(event) => {
                      setDangerousDeleteRoot(event.target.checked);
                      if (!event.target.checked) {
                        setConfirmedNoExternalBackup(false);
                      }
                    }}
                  />
                }
                label={
                  <Stack spacing={0.35}>
                    <Typography variant="body2">{dictionary.deleteProjectRoot}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dictionary.deleteProjectRootHint}
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0, alignItems: "flex-start" }}
              />
            </Paper>
            {dangerousDeleteRoot ? (
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, borderColor: "error.main" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmedNoExternalBackup}
                      color="error"
                      disabled={isDeletingCurrentProject}
                      onChange={(event) => setConfirmedNoExternalBackup(event.target.checked)}
                    />
                  }
                  label={
                    <Stack spacing={0.35}>
                      <Typography variant="body2" color="error.main">
                        {dictionary.deleteProjectBackupConfirm}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dictionary.deleteProjectBackupConfirmHint}
                      </Typography>
                    </Stack>
                  }
                  sx={{ m: 0, alignItems: "flex-start" }}
                />
              </Paper>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteProjectDialog}>{dictionary.cancel}</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!pendingDeleteProject || isDeletingCurrentProject || !isLiveMode || !deleteRootAllowed}
            onClick={handleDeleteProject}
          >
            {dictionary.deleteProjectConfirm}
          </Button>
        </DialogActions>
      </Dialog>

      <ArtifactDetailDialog
        open={detailDialogOpen}
        detailSelection={detailSelection}
        dictionary={dictionary}
        language={boardContextProject?.language ?? "en"}
        onClose={() => setDetailDialogOpen(false)}
      />
    </Box>
  );
}
