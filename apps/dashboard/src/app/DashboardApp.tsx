import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { fetchDashboardSnapshot, requestDashboardSnapshot } from "../shared/api/dashboard";
import { dashboardLocale } from "../shared/locale/dashboardLocale";
import type { ArtifactSelection, DashboardQueryResult, ProjectSnapshot, TopicSummary } from "../shared/model/dashboard";
import { useDashboardStore } from "../shared/store/dashboardStore";
import {
  applyOptimisticMove,
  buildTopicArtifactEntries,
  createArtifactSelection,
  filterTopics,
  getDefaultArtifactSelection
} from "../shared/utils/dashboard";
import { ProjectListBoard } from "../features/project-list/ProjectListBoard";
import { ProjectDetailWorkspace } from "../features/project-detail/ProjectDetailWorkspace";
import { ArtifactDetailDialog } from "../features/artifact-inspector/ArtifactDetailDialog";

export default function DashboardApp() {
  const queryClient = useQueryClient();
  const selectedProjectId = useDashboardStore((state) => state.selectedProjectId);
  const selectedTopicKey = useDashboardStore((state) => state.selectedTopicKey);
  const topicFilter = useDashboardStore((state) => state.topicFilter);
  const setSelectedProjectId = useDashboardStore((state) => state.setSelectedProjectId);
  const setSelectedTopicKey = useDashboardStore((state) => state.setSelectedTopicKey);
  const setTopicFilter = useDashboardStore((state) => state.setTopicFilter);
  const deferredFilter = useDeferredValue(topicFilter);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [categoryDialogMode, setCategoryDialogMode] = useState<"create" | "edit" | null>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [detailSelection, setDetailSelection] = useState<ArtifactSelection | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: fetchDashboardSnapshot,
    refetchInterval: 10_000
  });

  const snapshot = snapshotQuery.data?.snapshot ?? null;
  const snapshotSource = snapshotQuery.data?.source ?? "static";
  const fallbackProject =
    snapshot?.projects.find((project) => project.id === snapshot.currentProjectId) ??
    snapshot?.projects[0] ??
    null;
  const selectedProject =
    snapshot?.projects.find((project) => project.id === selectedProjectId) ?? fallbackProject;
  const dictionary = dashboardLocale[selectedProject?.language ?? "en"];
  const isLiveMode = snapshotSource === "live";

  useEffect(() => {
    if (!snapshot?.projects.length) {
      return;
    }

    if (!selectedProjectId) {
      const nextProjectId = snapshot.currentProjectId ?? snapshot.projects[0]?.id ?? null;
      startTransition(() => {
        setSelectedProjectId(nextProjectId);
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

  const projectsById = new Map(snapshot?.projects.map((project) => [project.id, project]) ?? []);
  const categories = [...(snapshot?.categories ?? [])].sort((left, right) => left.order - right.order);
  const categoryColumns = categories.map((category) => ({
    ...category,
    projects: category.projectIds
      .map((projectId) => projectsById.get(projectId))
      .filter((project): project is ProjectSnapshot => Boolean(project))
  }));

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

  const simpleCategoryMutation = useMutation({
    mutationFn: async (payload: {
      path: string;
      method: "POST" | "PATCH" | "DELETE";
      body?: string;
    }) => {
      if (!isLiveMode) {
        throw new Error(dictionary.dashboardError);
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

  if (snapshotQuery.isLoading) {
    return <Box sx={{ p: 4 }}>{dictionary.loading}</Box>;
  }

  if (!snapshot || snapshot.projects.length === 0) {
    return <Box sx={{ p: 4 }}>{dictionary.empty}</Box>;
  }

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <ProjectListBoard
          categories={categoryColumns}
          currentProjectId={snapshot.currentProjectId}
          selectedProject={selectedProject}
          generatedAt={snapshot.generatedAt}
          dictionary={dictionary}
          isLiveMode={isLiveMode}
          onCreateCategory={() => {
            setCategoryDialogMode("create");
            setEditingCategoryId(null);
            setCategoryDraft("");
          }}
          onEditCategory={(categoryId, currentName) => {
            setCategoryDialogMode("edit");
            setEditingCategoryId(categoryId);
            setCategoryDraft(currentName);
          }}
          onSetDefaultCategory={(categoryId) =>
            simpleCategoryMutation.mutate({
              path: `/api/dashboard/categories/${categoryId}/default`,
              method: "POST"
            })
          }
          onDeleteCategory={(categoryId) =>
            simpleCategoryMutation.mutate({
              path: `/api/dashboard/categories/${categoryId}`,
              method: "DELETE"
            })
          }
          onSelectProject={(projectId) => {
            startTransition(() => {
              setSelectedProjectId(projectId);
              setSelectedTopicKey(null);
              setTopicFilter("");
            });
          }}
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

        {feedback ? (
          <Alert severity="error" onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        ) : null}

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
            setDetailSelection(createArtifactSelection(`${selectedTopic.bucket}:${selectedTopic.name}`, entry));
          }}
          onOpenDetailDialog={() => setDetailDialogOpen(true)}
          onWorkflowNodeClick={(selection) => {
            setDetailSelection(selection);
            setDetailDialogOpen(true);
          }}
        />
      </Stack>

      <Dialog
        open={categoryDialogMode !== null}
        onClose={() => setCategoryDialogMode(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {categoryDialogMode === "create"
            ? dictionary.createCategoryTitle
            : dictionary.editCategoryTitle}
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
                simpleCategoryMutation.mutate({
                  path: "/api/dashboard/categories",
                  method: "POST",
                  body: JSON.stringify({ name: categoryDraft })
                });
              } else if (editingCategoryId) {
                simpleCategoryMutation.mutate({
                  path: `/api/dashboard/categories/${editingCategoryId}`,
                  method: "PATCH",
                  body: JSON.stringify({ name: categoryDraft })
                });
              }
              setCategoryDialogMode(null);
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
