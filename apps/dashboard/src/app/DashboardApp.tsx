import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  InputBase,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { BacklogWorkspace } from "../features/backlog/BacklogWorkspace";
import { InsightsRail } from "../features/backlog/InsightsRail";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { RecentActivityTable } from "../features/reports/RecentActivityTable";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type {
  ArtifactSelection,
  DashboardLocale,
  DashboardPrimaryMenu,
  DashboardSettingsView,
  DashboardSidebarItem,
  DashboardWorkspaceFilterState,
  ProjectSnapshot
} from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import {
  buildTopicArtifactEntries,
  getDefaultArtifactSelection
} from "../shared/utils/dashboard";
import {
  buildBacklogSections,
  buildInsightsSummary,
  createMutationPayload,
  markDashboardInteraction,
  resolveCurrentProject,
  resolveInitialSelectedProjectId,
  resolveSelectedProject,
  resolveSelectedProjectFromSearch,
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
  const activeSidebarItem = useDashboardStore((state) => state.activeSidebarItem);
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const workspaceMode = useDashboardStore((state) => state.workspaceMode);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const shellSearchQuery = useDashboardStore((state) => state.shellSearchQuery);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const workspaceFilterState = useDashboardStore((state) => state.workspaceFilterState);
  const insightsRailOpen = useDashboardStore((state) => state.insightsRailOpen);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveSidebarItem = useDashboardStore((state) => state.setActiveSidebarItem);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setShellSearchQuery = useDashboardStore((state) => state.setShellSearchQuery);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const setWorkspaceFilterState = useDashboardStore((state) => state.setWorkspaceFilterState);
  const setInsightsRailOpen = useDashboardStore((state) => state.setInsightsRailOpen);
  const deferredShellSearchQuery = useDeferredValue(shellSearchQuery);
  const deferredTopicFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: (query) => resolveSnapshotRefreshInterval(query.state.data)
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const currentProject = resolveCurrentProject(snapshot);
  const selectedProject = resolveSelectedProject(snapshot, selectedProjectId, currentProject);
  const searchMatchedProject = resolveSelectedProjectFromSearch(snapshot, deferredShellSearchQuery);
  const dictionary = dashboardLocale[(selectedProject ?? currentProject)?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";
  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );

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
    if (!searchMatchedProject || searchMatchedProject.id === selectedProjectId) {
      return;
    }

    startTransition(() => {
      setSelectedProjectId(searchMatchedProject.id);
    });
  }, [searchMatchedProject, selectedProjectId, setSelectedProjectId]);

  const backlogSections = useMemo(
    () => buildBacklogSections(selectedProject, deferredTopicFilter, workspaceFilterState, dictionary),
    [deferredTopicFilter, dictionary, selectedProject, workspaceFilterState]
  );
  const visibleTopics = useMemo(
    () => backlogSections.flatMap((section) => section.rows.map((row) => row.topic)),
    [backlogSections]
  );
  const nextVisibleTopicKey = useMemo(
    () => resolveVisibleTopicSelection(visibleTopics, selectedTopicKey),
    [selectedTopicKey, visibleTopics]
  );
  const selectedTopic = useMemo(
    () => resolveSelectedTopic(visibleTopics, nextVisibleTopicKey),
    [nextVisibleTopicKey, visibleTopics]
  );
  const artifactEntries = useMemo(() => buildTopicArtifactEntries(selectedTopic), [selectedTopic]);
  const insightsSummary = useMemo(
    () => buildInsightsSummary(selectedProject, snapshot?.recentActivity ?? [], dictionary),
    [dictionary, selectedProject, snapshot?.recentActivity]
  );

  useEffect(() => {
    if (nextVisibleTopicKey === selectedTopicKey) {
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
    if (snapshot?.generatedAt) {
      markDashboardInteraction("snapshot-ready", "ready");
    }
  }, [snapshot?.generatedAt]);

  useEffect(() => {
    if (selectedProject?.id) {
      markDashboardInteraction("project-switch", "ready");
    }
  }, [selectedProject?.id]);

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot"] });
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    }
  });

  const mutateSnapshot = (payload: DashboardMutationPayload) => {
    snapshotMutation.mutate(payload);
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

  const openProjectContext = (projectId: string) => {
    markDashboardInteraction("project-switch", "start");
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveSidebarItem("backlog");
      setSelectedTopicKey(null);
      if (isCompactShell) {
        setSidebarDrawerOpen(false);
      }
    });
  };

  const openTopicDialog = (topicKey: string) => {
    const topic = visibleTopics.find((item) => `${item.bucket}:${item.name}` === topicKey) ?? null;
    markDashboardInteraction("detail-open", "start");
    startTransition(() => {
      setSelectedTopicKey(topicKey);
      setDetailSelection(getDefaultArtifactSelection(topic));
      setDetailDialogOpen(true);
    });
  };

  const openSettingsPanel = (panel: DashboardSettingsView) => {
    setActiveSettingsView(panel);
    if (isCompactShell) {
      setSidebarDrawerOpen(false);
    }
  };

  const renderMainSurface = () => {
    if (activeTopMenu === "settings") {
      return (
        <SettingsWorkspace
          project={currentProject}
          panel={activeSettingsView}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          onSaveTitle={(title) => mutateCurrentProject("main", { title })}
          onSaveRefreshInterval={(refreshIntervalMs) =>
            mutateCurrentProject("refresh", { refreshIntervalMs })
          }
          onSaveGitPrefixes={(workingBranchPrefix, releaseBranchPrefix) =>
            mutateCurrentProject("git", { workingBranchPrefix, releaseBranchPrefix })
          }
          onSaveSystem={(payload) => mutateCurrentProject("system", payload)}
        />
      );
    }

    if (workspaceMode === "board") {
      return (
        <ProjectListBoard
          categories={categories}
          projects={snapshot?.projects ?? []}
          currentProjectId={currentProject?.id ?? null}
          selectedProjectId={selectedProjectId}
          latestActiveProjectId={currentProject?.id ?? null}
          dictionary={dictionary}
          snapshotSource={snapshotSource}
          isLiveMode={isLiveMode}
          onAddProject={() => setProjectDialogOpen(true)}
          onOpenProject={openProjectContext}
        />
      );
    }

    if (workspaceMode === "reports") {
      return (
        <RecentActivityTable
          entries={snapshot?.recentActivity ?? []}
          dictionary={dictionary}
          language={selectedProject?.language ?? currentProject?.language ?? "en"}
          onOpenProject={openProjectContext}
        />
      );
    }

    return (
      <BacklogWorkspace
        project={selectedProject}
        sections={backlogSections}
        dictionary={dictionary}
        language={selectedProject?.language ?? currentProject?.language ?? "en"}
        isLiveMode={isLiveMode}
        searchQuery={topicFilter}
        filterState={workspaceFilterState}
        selectedTopicKey={nextVisibleTopicKey}
        onSearchChange={(value) => {
          markDashboardInteraction("topic-filter", "start");
          setTopicFilter(value);
        }}
        onFilterChange={setWorkspaceFilterState}
        onOpenCreateAction={() => setProjectDialogOpen(true)}
        onOpenTopic={openTopicDialog}
      />
    );
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
        title={currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
        latestProject={currentProject?.name ?? "-"}
        dictionary={dictionary}
        shellSearchQuery={shellSearchQuery}
        activeTopMenu={activeTopMenu}
        isLiveMode={isLiveMode}
        compactShell={isCompactShell}
        onOpenProjects={() => setActiveTopMenu("projects")}
        onOpenSettings={() => setActiveTopMenu("settings")}
        onSearchChange={setShellSearchQuery}
        onOpenCreate={() => setProjectDialogOpen(true)}
        onToggleSidebar={() => setSidebarDrawerOpen(true)}
        onToggleInsights={() => setInsightsRailOpen(!insightsRailOpen)}
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
          <Box sx={{ borderRight: `1px solid ${theme.palette.divider}`, minHeight: "100%" }}>
            <ProjectContextSidebar
              activeTopMenu={activeTopMenu}
              activeSidebarItem={activeSidebarItem}
              activeSettingsView={activeSettingsView}
              project={selectedProject}
              dictionary={dictionary}
              onSelectSidebarItem={setActiveSidebarItem}
              onSelectSettingsView={openSettingsPanel}
            />
          </Box>
        ) : null}

        <Stack spacing={2} sx={{ px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2 } }}>
          {feedback ? (
            <Alert severity="error" onClose={() => setFeedback(null)}>
              {feedback}
            </Alert>
          ) : null}

          {activeTopMenu === "projects" && !insightsRailOpen && !isCompactShell ? (
            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setInsightsRailOpen(true)}>
                {dictionary.openInsights}
              </Button>
            </Stack>
          ) : null}

          {renderMainSurface()}
        </Stack>

        {!isCompactShell && activeTopMenu === "projects" && insightsRailOpen ? (
          <Box
            sx={{
              p: 1.5,
              borderLeft: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.4)
            }}
          >
            <InsightsRail
              summary={insightsSummary}
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
        PaperProps={{
          sx: {
            width: 292,
            backgroundColor: "background.paper"
          }
        }}
      >
        <ProjectContextSidebar
          activeTopMenu={activeTopMenu}
          activeSidebarItem={activeSidebarItem}
          activeSettingsView={activeSettingsView}
          project={selectedProject}
          dictionary={dictionary}
          onSelectSidebarItem={(item) => {
            setActiveSidebarItem(item);
            setSidebarDrawerOpen(false);
          }}
          onSelectSettingsView={openSettingsPanel}
        />
      </Drawer>

      <Drawer
        anchor="right"
        open={isCompactShell && activeTopMenu === "projects" && insightsRailOpen}
        onClose={() => setInsightsRailOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 360 },
            backgroundColor: "background.default"
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <InsightsRail
            summary={insightsSummary}
            dictionary={dictionary}
            isLiveMode={isLiveMode}
            onClose={() => setInsightsRailOpen(false)}
          />
        </Box>
      </Drawer>

      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dictionary.addProjectTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {dictionary.addProjectHint}
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label={dictionary.projectRootDir}
              value={projectRootDirDraft}
              onChange={(event) => setProjectRootDirDraft(event.target.value)}
            />
            <TextField
              select
              SelectProps={{ native: true }}
              label={dictionary.targetCategory}
              value={projectCategoryDraft}
              onChange={(event) => setProjectCategoryDraft(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>{dictionary.cancel}</Button>
          <Button
            variant="contained"
            disabled={!isLiveMode}
            onClick={() => {
              mutateSnapshot(
                createMutationPayload("/api/dashboard/projects", "POST", {
                  rootDir: projectRootDirDraft,
                  targetCategoryId: projectCategoryDraft || undefined
                })
              );
              setProjectDialogOpen(false);
            }}
          >
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

      <ArtifactDetailDialog
        open={detailDialogOpen}
        detailSelection={detailSelection}
        dictionary={dictionary}
        language={selectedProject?.language ?? "en"}
        onClose={() => setDetailDialogOpen(false)}
      />
    </Box>
  );
}

function TopNavigation(props: {
  title: string;
  latestProject: string;
  dictionary: DashboardLocale;
  shellSearchQuery: string;
  activeTopMenu: DashboardPrimaryMenu;
  isLiveMode: boolean;
  compactShell: boolean;
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onToggleSidebar: () => void;
  onToggleInsights: () => void;
}) {
  const theme = useTheme();
  const navItems = [
    props.dictionary.navYourWork,
    props.dictionary.projects,
    props.dictionary.navFilter,
    props.dictionary.navDashboards,
    props.dictionary.navTeams,
    props.dictionary.navApps
  ];

  return (
    <Paper
      square
      sx={{
        px: { xs: 1.25, md: 2.25 },
        py: 1.15,
        borderRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          {props.compactShell ? (
            <Button variant="text" onClick={props.onToggleSidebar} sx={{ minWidth: 0, px: 1 }}>
              {props.dictionary.menu}
            </Button>
          ) : (
            <AppLauncherMark />
          )}

          <Stack direction="row" spacing={1.1} sx={{ alignItems: "center", minWidth: 0 }}>
            <BrandMark />
            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
              {props.title}
            </Typography>
          </Stack>

          {!props.compactShell ? (
            <Stack direction="row" spacing={0.3} sx={{ alignItems: "center" }}>
              {navItems.map((item) => {
                const active = item === props.dictionary.projects && props.activeTopMenu === "projects";
                return (
                  <ButtonBase
                    key={item}
                    onClick={item === props.dictionary.projects ? props.onOpenProjects : undefined}
                    sx={{
                      px: 1.25,
                      py: 1,
                      borderRadius: 0.6,
                      color: active ? "primary.light" : "text.secondary",
                      borderBottom: active
                        ? `3px solid ${theme.palette.primary.main}`
                        : "3px solid transparent"
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: active ? 700 : 500 }}>
                      {item}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </Stack>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {!props.compactShell ? (
            <Paper
              sx={{
                px: 1.35,
                py: 0.75,
                width: 320,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha(theme.palette.common.white, 0.03)
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid ${theme.palette.text.secondary}`,
                  position: "relative"
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 8,
                    height: 2,
                    bgcolor: "text.secondary",
                    right: -6,
                    bottom: -3,
                    transform: "rotate(45deg)"
                  }}
                />
              </Box>
              <InputBase
                value={props.shellSearchQuery}
                onChange={(event) => props.onSearchChange(event.target.value)}
                placeholder={props.dictionary.globalSearchPlaceholder}
                sx={{ flex: 1 }}
              />
            </Paper>
          ) : null}

          <Chip
            label={`${props.dictionary.latestProject}: ${props.latestProject}`}
            variant="outlined"
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          />

          <Button
            variant="contained"
            disabled={!props.isLiveMode}
            onClick={props.onOpenCreate}
            sx={{ px: 2.4 }}
          >
            {props.dictionary.createAction}
          </Button>

          <UtilityButton label={props.dictionary.openInsights} onClick={props.onToggleInsights} />
          <UtilityButton
            label={props.dictionary.settings}
            active={props.activeTopMenu === "settings"}
            onClick={props.onOpenSettings}
          />
          <Avatar sx={{ width: 38, height: 38, bgcolor: "primary.dark" }}>PG</Avatar>
        </Stack>
      </Stack>
    </Paper>
  );
}

function ProjectContextSidebar(props: {
  activeTopMenu: DashboardPrimaryMenu;
  activeSidebarItem: DashboardSidebarItem;
  activeSettingsView: DashboardSettingsView;
  project: ProjectSnapshot | null;
  dictionary: DashboardLocale;
  onSelectSidebarItem: (item: DashboardSidebarItem) => void;
  onSelectSettingsView: (view: DashboardSettingsView) => void;
}) {
  const theme = useTheme();
  const projectItems = [
    { id: "backlog", label: props.dictionary.backlogTitle, enabled: true },
    { id: "board", label: props.dictionary.board, enabled: true },
    { id: "reports", label: props.dictionary.reports, enabled: true },
    { id: "issues", label: props.dictionary.sidebarIssues, enabled: false },
    { id: "components", label: props.dictionary.sidebarComponents, enabled: false },
    { id: "code", label: props.dictionary.sidebarCode, enabled: false },
    { id: "releases", label: props.dictionary.sidebarReleases, enabled: false },
    { id: "pages", label: props.dictionary.sidebarPages, enabled: false },
    { id: "shortcuts", label: props.dictionary.sidebarShortcuts, enabled: false },
    { id: "project-settings", label: props.dictionary.sidebarProjectSettings, enabled: true }
  ] as const;
  const settingsItems = [
    { id: "main", label: props.dictionary.main },
    { id: "refresh", label: props.dictionary.refresh },
    { id: "git", label: props.dictionary.git },
    { id: "system", label: props.dictionary.system }
  ] as const;

  return (
    <Stack sx={{ minHeight: "100%", p: 1.5, justifyContent: "space-between" }}>
      <Stack spacing={2}>
        {props.project ? (
          <Paper
            sx={{
              p: 1.75,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.background.default, 0.36)
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{ width: 46, height: 46, bgcolor: alpha(theme.palette.primary.main, 0.18), color: "primary.light" }}
              >
                {props.project.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography variant="h6">{props.project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.dictionary.projectIdentityHint}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        {props.activeTopMenu === "projects" ? (
          <>
            <SidebarSectionLabel label={props.dictionary.sidebarPlanning} />
            <Stack spacing={0.5}>
              {projectItems.slice(0, 3).map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeSidebarItem === item.id}
                  disabled={!item.enabled}
                  onClick={() => props.onSelectSidebarItem(item.id)}
                />
              ))}
            </Stack>

            <SidebarSectionLabel label={props.dictionary.sidebarDevelopment} />
            <Stack spacing={0.5}>
              {projectItems.slice(3).map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeSidebarItem === item.id}
                  disabled={!item.enabled}
                  onClick={() => props.onSelectSidebarItem(item.id)}
                />
              ))}
            </Stack>
          </>
        ) : (
          <>
            <SidebarSectionLabel label={props.dictionary.settings} />
            <Stack spacing={0.5}>
              {settingsItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  label={item.label}
                  active={props.activeSettingsView === item.id}
                  onClick={() => props.onSelectSettingsView(item.id)}
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>

      <Paper sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.32) }}>
        <Stack spacing={0.45}>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.sidebarFooterTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.dictionary.verificationRequired}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}

function SidebarSectionLabel(props: { label: string }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ px: 1.1, pt: 0.8 }}>
      {props.label}
    </Typography>
  );
}

function SidebarNavButton(props: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <ButtonBase
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        px: 1.1,
        py: 1.1,
        borderRadius: 0.9,
        color: props.disabled ? "text.disabled" : props.active ? "primary.light" : "text.secondary",
        backgroundColor: props.active ? alpha(theme.palette.primary.main, 0.18) : "transparent",
        borderLeft: props.active ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent"
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: props.active ? 700 : 500 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function UtilityButton(props: { label: string; active?: boolean; onClick: () => void }) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={props.onClick}
      sx={{
        px: 1.2,
        py: 0.95,
        borderRadius: 0.8,
        border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        bgcolor: props.active ? alpha(theme.palette.primary.main, 0.16) : "transparent",
        color: props.active ? "primary.light" : "text.secondary"
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

function BrandMark() {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", width: 22, height: 22 }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          clipPath: "polygon(0 0, 100% 0, 58% 48%, 100% 100%, 54% 100%, 0 50%)",
          bgcolor: theme.palette.primary.main
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: "3px 3px auto auto",
          width: 8,
          height: 8,
          borderRadius: 0.4,
          bgcolor: alpha(theme.palette.primary.light, 0.85)
        }}
      />
    </Box>
  );
}

function AppLauncherMark() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.35, width: 22, height: 22 }}>
      {Array.from({ length: 9 }).map((_, index) => (
        <Box key={index} sx={{ borderRadius: 0.25, bgcolor: alpha(theme.palette.text.secondary, 0.92) }} />
      ))}
    </Box>
  );
}

function DashboardStatePanel(props: { title: string; helper: string }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 1, maxWidth: 640 }}>
        <Stack spacing={1}>
          <Typography variant="h5">{props.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.helper}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
