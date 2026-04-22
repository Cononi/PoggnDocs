import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";
import { ProjectDetailWorkspace } from "../features/project-detail/ProjectDetailWorkspace";
import { BoardSettingsPanel } from "../features/project-list/BoardSettingsPanel";
import { CategoryManagementPanel } from "../features/project-list/CategoryManagementPanel";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { RecentActivityTable } from "../features/reports/RecentActivityTable";
import { SettingsWorkspace } from "../features/settings/SettingsWorkspace";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type { ArtifactSelection, DashboardQueryResult } from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import {
  applyOptimisticMove,
  buildTopicArtifactEntries,
  createArtifactSelection,
  filterTopics,
  getDefaultArtifactSelection
} from "../shared/utils/dashboard";
import {
  buildCategoryColumns,
  createMutationPayload,
  resolveCurrentProject,
  resolveLatestActiveProject,
  resolveSelectedProject,
  type DashboardMutationPayload
} from "./dashboardShell";

type CategoryDialogMode = "create" | "edit" | null;

export default function DashboardApp() {
  const queryClient = useQueryClient();
  const activeTopMenu = useDashboardStore((state) => state.activeTopMenu);
  const activeProjectsView = useDashboardStore((state) => state.activeProjectsView);
  const activeSettingsView = useDashboardStore((state) => state.activeSettingsView);
  const projectSurface = useDashboardStore((state) => state.projectSurface);
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const setActiveTopMenu = useDashboardStore((state) => state.setActiveTopMenu);
  const setActiveProjectsView = useDashboardStore((state) => state.setActiveProjectsView);
  const setActiveSettingsView = useDashboardStore((state) => state.setActiveSettingsView);
  const setProjectSurface = useDashboardStore((state) => state.setProjectSurface);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const deferredFilter = useDeferredValue(topicFilter);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [categoryDialogMode, setCategoryDialogMode] = useState<CategoryDialogMode>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectRootDirDraft, setProjectRootDirDraft] = useState("");
  const [projectCategoryDraft, setProjectCategoryDraft] = useState("");
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: (query) => {
      const payload = query.state.data as DashboardQueryResult | undefined;
      const snapshot = payload?.snapshot;
      const currentProject =
        snapshot?.projects.find((project) => project.id === snapshot.currentProjectId) ?? null;
      return currentProject?.refreshIntervalMs ?? 10_000;
    }
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const currentProject = resolveCurrentProject(snapshot);
  const selectedProject = resolveSelectedProject(snapshot, selectedProjectId, currentProject);
  const latestActiveProject = resolveLatestActiveProject(snapshot, currentProject);
  const dictionary = dashboardLocale[(selectedProject ?? currentProject)?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";

  useEffect(() => {
    if (!snapshot?.projects.length) {
      return;
    }

    if (!selectedProjectId) {
      startTransition(() => {
        setSelectedProjectId(snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null);
      });
    }
  }, [selectedProjectId, setSelectedProjectId, snapshot]);

  const visibleTopics = filterTopics(selectedProject, deferredFilter);
  const selectedTopic =
    visibleTopics.find((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey) ??
    visibleTopics[0] ??
    null;

  useEffect(() => {
    if (!visibleTopics.length) {
      if (selectedTopicKey) {
        startTransition(() => {
          setSelectedTopicKey(null);
        });
      }
      return;
    }

    if (
      !selectedTopicKey ||
      !visibleTopics.some((topic) => `${topic.bucket}:${topic.name}` === selectedTopicKey)
    ) {
      startTransition(() => {
        setSelectedTopicKey(`${visibleTopics[0]!.bucket}:${visibleTopics[0]!.name}`);
      });
    }
  }, [selectedTopicKey, setSelectedTopicKey, visibleTopics]);

  const artifactEntries = buildTopicArtifactEntries(selectedTopic);

  useEffect(() => {
    const nextSelection = getDefaultArtifactSelection(selectedTopic);
    if (!nextSelection) {
      setDetailSelection(null);
      return;
    }

    if (
      !detailSelection ||
      detailSelection.topicKey !== nextSelection.topicKey ||
      !artifactEntries.some((entry) => entry.sourcePath === detailSelection.sourcePath)
    ) {
      setDetailSelection(nextSelection);
    }
  }, [artifactEntries, detailSelection, selectedTopic]);

  const categories = useMemo(
    () => [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order),
    [snapshot?.categories]
  );
  const categoryColumns = useMemo(() => buildCategoryColumns(snapshot), [snapshot]);

  const moveProjectMutation = useMutation({
    mutationFn: async (payload: {
      projectId: string;
      targetCategoryId: string;
      targetIndex?: number;
    }) => {
      if (!isLiveMode) {
        throw new Error(dictionary.dashboardError);
      }

      return requestDashboardSnapshot("/api/dashboard/categories/move", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard-snapshot"] });
      const previous = queryClient.getQueryData<DashboardQueryResult>(["dashboard-snapshot"]);
      if (previous) {
        queryClient.setQueryData<DashboardQueryResult>(["dashboard-snapshot"], {
          ...previous,
          snapshot: applyOptimisticMove(previous.snapshot, payload)
        });
      }

      return { previous };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["dashboard-snapshot"], context.previous);
      }
      setFeedback(error instanceof Error ? error.message : dictionary.dashboardError);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot"] });
    }
  });

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

  const openProjectDetail = (projectId: string) => {
    startTransition(() => {
      setSelectedProjectId(projectId);
      setActiveTopMenu("projects");
      setActiveProjectsView("board");
      setProjectSurface("detail");
      setSelectedTopicKey(null);
    });
  };

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

  const openCategoryDialog = (mode: CategoryDialogMode, categoryId?: string | null, name = "") => {
    setCategoryDialogMode(mode);
    setEditingCategoryId(categoryId ?? null);
    setCategoryDraft(name);
  };

  const openCreateProjectDialog = () => {
    setProjectCategoryDraft(
      categories.find((category) => category.isDefault)?.id ?? categories[0]?.id ?? ""
    );
    setProjectRootDirDraft("");
    setProjectDialogOpen(true);
  };

  if (snapshotQuery.isLoading) {
    return <Box sx={{ p: 4 }}>{dictionary.loading}</Box>;
  }

  if (!snapshot || snapshot.projects.length === 0) {
    return <Box sx={{ p: 4 }}>{dictionary.empty}</Box>;
  }

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <DashboardHeader
          title={currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle}
          subtitle={dictionary.subtitle}
          latestActiveProject={latestActiveProject}
          dictionary={dictionary}
          snapshotSource={snapshotSource}
          activeTopMenu={activeTopMenu}
          onChangeTopMenu={(next) => {
            setActiveTopMenu(next);
            if (next === "projects") {
              setActiveProjectsView("board");
              setProjectSurface("board");
            } else {
              setActiveSettingsView("main");
            }
          }}
        />

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", xl: "280px minmax(0, 1fr)" }
          }}
        >
          <DashboardSidebar
            activeTopMenu={activeTopMenu}
            activeProjectsView={activeProjectsView}
            activeSettingsView={activeSettingsView}
            dictionary={dictionary}
            onOpenProjectsView={(view) => {
              setActiveTopMenu("projects");
              setActiveProjectsView(view);
              if (view !== "board") {
                setProjectSurface("board");
              }
            }}
            onOpenSettingsView={(view) => {
              setActiveTopMenu("settings");
              setActiveSettingsView(view);
            }}
          />

          <Stack spacing={3}>
            {feedback ? (
              <Alert severity="error" onClose={() => setFeedback(null)}>
                {feedback}
              </Alert>
            ) : null}

            {activeTopMenu === "projects" ? (
              activeProjectsView === "board" ? (
                projectSurface === "detail" ? (
                  <ProjectDetailWorkspace
                    project={selectedProject}
                    selectedTopic={selectedTopic}
                    activeTopics={visibleTopics.filter((topic) => topic.bucket === "active")}
                    archivedTopics={visibleTopics.filter((topic) => topic.bucket === "archive")}
                    selectedTopicKey={selectedTopicKey}
                    topicFilter={topicFilter}
                    detailSelection={detailSelection}
                    artifactEntries={artifactEntries}
                    dictionary={dictionary}
                    onBack={() => setProjectSurface("board")}
                    onTopicFilterChange={setTopicFilter}
                    onSelectTopic={setSelectedTopicKey}
                    onPreviewArtifact={(topic) => {
                      const preview = getDefaultArtifactSelection(topic);
                      setDetailSelection(preview);
                    }}
                    onSelectArtifact={(entry) => {
                      if (!selectedTopic) {
                        return;
                      }
                      setDetailSelection(
                        createArtifactSelection(`${selectedTopic.bucket}:${selectedTopic.name}`, entry)
                      );
                    }}
                    onOpenDetailDialog={() => setDetailDialogOpen(true)}
                    onWorkflowNodeClick={(selection) => {
                      setDetailSelection(selection);
                      setDetailDialogOpen(true);
                    }}
                  />
                ) : (
                  <>
                    {categoryColumns.length === 0 ? (
                      <Alert severity="info">{dictionary.noVisibleCategories}</Alert>
                    ) : null}
                    <ProjectListBoard
                      categories={categoryColumns}
                      latestActiveProjectId={snapshot.latestActiveProjectId}
                      selectedProjectId={selectedProject?.id ?? null}
                      dictionary={dictionary}
                      isLiveMode={isLiveMode}
                      onCreateProject={openCreateProjectDialog}
                      onOpenProject={openProjectDetail}
                      onDragStart={(projectId) => setDraggingProjectId(projectId)}
                      onDragEnd={() => setDraggingProjectId(null)}
                      onDropProject={(categoryId, targetIndex) => {
                        if (draggingProjectId) {
                          moveProjectMutation.mutate({
                            projectId: draggingProjectId,
                            targetCategoryId: categoryId,
                            targetIndex
                          });
                        }
                        setDraggingProjectId(null);
                      }}
                    />
                  </>
                )
              ) : activeProjectsView === "categories" ? (
                <CategoryManagementPanel
                  categories={categories}
                  dictionary={dictionary}
                  isLiveMode={isLiveMode}
                  onCreateCategory={() => openCategoryDialog("create")}
                  onEditCategory={(categoryId, currentName) =>
                    openCategoryDialog("edit", categoryId, currentName)
                  }
                  onSetDefaultCategory={(categoryId) =>
                    mutateSnapshot(
                      createMutationPayload(`/api/dashboard/categories/${categoryId}/default`, "POST")
                    )
                  }
                  onDeleteCategory={(categoryId) =>
                    mutateSnapshot(
                      createMutationPayload(`/api/dashboard/categories/${categoryId}`, "DELETE")
                    )
                  }
                />
              ) : activeProjectsView === "reports" ? (
                <RecentActivityTable
                  entries={snapshot.recentActivity}
                  dictionary={dictionary}
                  language={selectedProject?.language ?? currentProject?.language ?? "en"}
                  onOpenProject={openProjectDetail}
                />
              ) : (
                <BoardSettingsPanel
                  categories={categories}
                  dictionary={dictionary}
                  isLiveMode={isLiveMode}
                  onMoveCategory={(categoryId, targetIndex) =>
                    mutateSnapshot(
                      createMutationPayload(`/api/dashboard/categories/${categoryId}/reorder`, "POST", {
                        targetIndex
                      })
                    )
                  }
                  onToggleCategory={(categoryId, visible) =>
                    mutateSnapshot(
                      createMutationPayload(
                        `/api/dashboard/categories/${categoryId}/visibility`,
                        "PATCH",
                        { visible }
                      )
                    )
                  }
                />
              )
            ) : (
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
            )}
          </Stack>
        </Box>
      </Stack>

      <Dialog
        open={categoryDialogMode !== null}
        onClose={() => setCategoryDialogMode(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {categoryDialogMode === "create" ? dictionary.createCategoryTitle : dictionary.editCategoryTitle}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label={dictionary.categoryName}
            value={categoryDraft}
            onChange={(event) => setCategoryDraft(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogMode(null)}>{dictionary.cancel}</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (categoryDialogMode === "create") {
                mutateSnapshot(createMutationPayload("/api/dashboard/categories", "POST", { name: categoryDraft }));
              } else if (editingCategoryId) {
                mutateSnapshot(
                  createMutationPayload(`/api/dashboard/categories/${editingCategoryId}`, "PATCH", {
                    name: categoryDraft
                  })
                );
              }
              setCategoryDialogMode(null);
            }}
          >
            {dictionary.save}
          </Button>
        </DialogActions>
      </Dialog>

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

function DashboardHeader(props: {
  title: string;
  subtitle: string;
  latestActiveProject: ProjectSnapshot | null;
  dictionary: Record<string, string>;
  snapshotSource: "live" | "static";
  activeTopMenu: "projects" | "settings";
  onChangeTopMenu: (next: "projects" | "settings") => void;
}) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 7, overflow: "hidden", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(209, 100, 58, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(57, 90, 115, 0.14), transparent 26%)"
        }}
      />
      <Stack spacing={2.5} sx={{ position: "relative" }}>
        <Stack direction={{ xs: "column", xl: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="primary.main">
              {props.dictionary.eyebrow}
            </Typography>
            <Typography variant="h2" sx={{ lineHeight: 0.96 }}>
              {props.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
              {props.subtitle}
            </Typography>
          </Stack>

          <Paper
            sx={{
              p: 1.5,
              borderRadius: 4,
              minWidth: { xs: "100%", xl: 320 },
              backgroundColor: "rgba(255,255,255,0.68)"
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {props.dictionary.latestProject}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {props.latestActiveProject?.name ?? "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.latestActiveProject?.latestTopicName ?? "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {props.snapshotSource === "live" ? props.dictionary.liveMode : props.dictionary.staticMode}
            </Typography>
          </Paper>
        </Stack>

        <ToggleButtonGroup
          value={props.activeTopMenu}
          exclusive
          onChange={(_event, value) => {
            if (value) {
              props.onChangeTopMenu(value);
            }
          }}
          size="small"
          color="primary"
        >
          <ToggleButton value="projects">{props.dictionary.projects}</ToggleButton>
          <ToggleButton value="settings">{props.dictionary.settings}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}

function DashboardSidebar(props: {
  activeTopMenu: "projects" | "settings";
  activeProjectsView: "board" | "categories" | "reports" | "board-settings";
  activeSettingsView: "main" | "refresh" | "git" | "system";
  dictionary: Record<string, string>;
  onOpenProjectsView: (view: "board" | "categories" | "reports" | "board-settings") => void;
  onOpenSettingsView: (view: "main" | "refresh" | "git" | "system") => void;
}) {
  const items =
    props.activeTopMenu === "projects"
      ? [
          { id: "board", label: props.dictionary.board },
          { id: "categories", label: props.dictionary.categories },
          { id: "reports", label: props.dictionary.reports },
          { id: "board-settings", label: props.dictionary.boardSettings }
        ]
      : [
          { id: "main", label: props.dictionary.main },
          { id: "refresh", label: props.dictionary.refresh },
          { id: "git", label: props.dictionary.git },
          { id: "system", label: props.dictionary.system }
        ];

  const activeId = props.activeTopMenu === "projects" ? props.activeProjectsView : props.activeSettingsView;

  return (
    <Paper sx={{ p: 1.5, borderRadius: 6, alignSelf: "start" }}>
      <Stack spacing={1}>
        {items.map((item) => (
          <Button
            key={item.id}
            variant={activeId === item.id ? "contained" : "text"}
            onClick={() => {
              if (props.activeTopMenu === "projects") {
                props.onOpenProjectsView(item.id as "board" | "categories" | "reports" | "board-settings");
              } else {
                props.onOpenSettingsView(item.id as "main" | "refresh" | "git" | "system");
              }
            }}
            sx={{ justifyContent: "flex-start", borderRadius: 3, py: 1.25 }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}
