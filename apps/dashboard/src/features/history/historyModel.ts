import type { TopicSummary } from "../../shared/model/dashboard";
import { buildTopicKey, formatDate } from "../../shared/utils/dashboard";

export type HistoryLanguage = "ko" | "en";
export type WorkflowStatus = "completed" | "current" | "pending";
export type FileChangeKind = "A" | "M" | "D";
export type RelationKind = "depends" | "blocks" | "related" | "implements" | "mentioned";
export type HistoryChipColor = "primary" | "secondary" | "success" | "warning" | "default";

export type WorkflowStep = {
  id: string;
  label: string;
  date: string;
  status: WorkflowStatus;
};

export type TimelineRow = {
  id: string;
  step: string;
  tone: "primary" | "success" | "warning" | "neutral";
  completedBy: string;
  time: string;
  duration: string;
  files: Array<{ path: string; kind: FileChangeKind }>;
  commits: Array<{ hash: string; title: string; author: string; time: string }>;
};

export type RelationItem = {
  id: string;
  kind: RelationKind;
  label: string;
  type: string;
  taskId: string;
  direction: string;
  strength: string;
  status: string;
  created: string;
  updated: string;
};

export type RelationGroup = {
  kind: RelationKind;
  label: string;
  color: string;
  side: "left" | "right" | "bottom";
  items: RelationItem[];
};

const workflowStageOrder = ["proposal", "plan", "implementation", "refactor", "qa", "done"] as const;

export function topicType(topic: TopicSummary): string {
  return topic.archiveType ?? topic.changeType ?? "feat";
}

export function topicStatus(topic: TopicSummary): string {
  if (topic.bucket === "archive") {
    return "Archived";
  }
  if (topic.status) {
    return topic.status === "done" ? "Done" : topic.status;
  }
  return "Active";
}

export function topicDisplayId(topic: TopicSummary): string {
  const stableNumber = Math.abs(
    topic.name.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
  );
  return `task-${String(900 + (stableNumber % 200)).padStart(4, "0")}`;
}

function resolveStageIndex(topic: TopicSummary): number {
  if (topic.bucket === "archive") {
    return workflowStageOrder.length - 1;
  }

  const stage = topic.stage ?? "proposal";
  if (stage === "code") {
    return workflowStageOrder.indexOf("implementation");
  }

  const index = workflowStageOrder.findIndex((step) => step === stage);
  return index >= 0 ? index : 0;
}

export function formatTopicDate(topic: TopicSummary, language: HistoryLanguage, fallback: string): string {
  const value = topic.updatedAt ?? topic.archivedAt;
  return value ? formatDate(value, language) : fallback;
}

export function buildWorkflowSteps(topic: TopicSummary, language: HistoryLanguage): WorkflowStep[] {
  const currentIndex = resolveStageIndex(topic);
  const updatedLabel = formatTopicDate(topic, language, "Pending");

  return workflowStageOrder.map((step, index) => ({
    id: step,
    label: step === "done" ? "Done" : step.charAt(0).toUpperCase() + step.slice(1),
    date: index <= currentIndex ? updatedLabel : "Pending",
    status: index < currentIndex || topic.bucket === "archive" ? "completed" : index === currentIndex ? "current" : "pending"
  }));
}

export function buildTimelineRows(topic: TopicSummary, language: HistoryLanguage): TimelineRow[] {
  const files = topic.files;
  const updatedLabel = formatTopicDate(topic, language, "Pending");
  const fileFor = (pattern: RegExp, fallback: string, kind: FileChangeKind) => {
    const found = files.find((file) => pattern.test(file.relativePath));
    return { path: found?.relativePath ?? fallback, kind };
  };

  return [
    {
      id: "qa",
      step: "QA",
      tone: "primary",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "20m",
      files: [
        fileFor(/^qa\//, "qa/report.md", "M"),
        fileFor(/^reviews\/code/, "reviews/code.review.md", "M"),
        fileFor(/^implementation\//, "implementation/index.md", "A")
      ],
      commits: [
        {
          hash: "a7c3d2e",
          title: "test(dashboard): add QA tests for widgets and charts",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "refactor",
      step: "Refactor",
      tone: "warning",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "34m",
      files: [
        fileFor(/^spec\//, "src/dashboard/hooks/useDashboardData.ts", "M"),
        fileFor(/^reviews\/task/, "src/dashboard/widgets/StatsCard.tsx", "M"),
        fileFor(/^plan\.md$/, "docs/dashboard-refactor.md", "A")
      ],
      commits: [
        {
          hash: "b34f8a1",
          title: "refactor(dashboard): extract hooks and improve types",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "91de7a8",
          title: "chore(dashboard): update docs for refactor",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "implementation",
      step: "Implementation",
      tone: "success",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "56m",
      files: [
        fileFor(/^proposal\.md$/, "src/dashboard/DashboardPage.tsx", "M"),
        fileFor(/^task\.md$/, "src/dashboard/widgets/StatsCard.tsx", "M"),
        fileFor(/^workflow\.reactflow\.json$/, "src/dashboard/widgets/ChartsCard.tsx", "M")
      ],
      commits: [
        {
          hash: "8d2f1c9",
          title: "feat(dashboard): add dashboard page layout",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "c1b94d3",
          title: "feat(dashboard): implement stats cards",
          author: "john.doe",
          time: updatedLabel
        },
        {
          hash: "6a9a9f2",
          title: "feat(dashboard): add performance chart",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "plan",
      step: "Plan",
      tone: "primary",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "25m",
      files: [
        fileFor(/^plan\.md$/, "docs/dashboard-plan.md", "A"),
        fileFor(/^task\.md$/, "docs/dashboard/README.md", "M")
      ],
      commits: [
        {
          hash: "4f1b2c3",
          title: "docs(dashboard): initial plan and requirements",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "proposal",
      step: "Proposal",
      tone: "neutral",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "25m",
      files: [
        fileFor(/^proposal\.md$/, "docs/feature-proposal-dashboard.md", "A"),
        fileFor(/^state\/current\.md$/, "wireframes/dashboard-wireframe.png", "A")
      ],
      commits: [
        {
          hash: "2e6d9b1",
          title: "docs(proposal): add dashboard feature proposal",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    },
    {
      id: "requirement",
      step: "Requirement",
      tone: "neutral",
      completedBy: "john.doe",
      time: updatedLabel,
      duration: "30m",
      files: [
        fileFor(/^state\/history\.ndjson$/, "docs/dashboard-requirements.md", "A"),
        fileFor(/^state\//, "docs/dashboard-scope.md", "A")
      ],
      commits: [
        {
          hash: "9b7a2d1",
          title: "docs(dashboard): add requirements and scope",
          author: "john.doe",
          time: updatedLabel
        }
      ]
    }
  ];
}

export function buildRelationGroups(topic: TopicSummary, topics: TopicSummary[]): RelationGroup[] {
  const candidates = topics.filter((item) => buildTopicKey(item) !== buildTopicKey(topic));
  const pick = (index: number, fallback: string) => candidates[index]?.name ?? fallback;
  const date = topic.updatedAt ?? topic.archivedAt ?? "2026-04-22T11:02:00Z";

  const create = (kind: RelationKind, index: number, fallback: string): RelationItem => ({
    id: `${kind}-${index}`,
    kind,
    label: pick(index, fallback),
    type: kind === "depends" ? "Dependency" : kind === "blocks" ? "Blocking" : "Reference",
    taskId: `task-${String(600 + index * 37).padStart(4, "0")}`,
    direction: kind === "depends" ? "Blocking" : kind === "blocks" ? "Outbound" : "Linked",
    strength: kind === "related" ? "Medium" : "High",
    status: "Active",
    created: formatDate(date, "en"),
    updated: formatDate(date, "en")
  });

  return [
    {
      kind: "depends",
      label: "Depends On",
      color: "#8b5cf6",
      side: "left",
      items: [create("depends", 0, "user-authentication"), create("depends", 1, "api-rate-limit")]
    },
    {
      kind: "blocks",
      label: "Blocks",
      color: "#f97316",
      side: "right",
      items: [create("blocks", 2, "reports-dashboard"), create("blocks", 3, "analytics-export")]
    },
    {
      kind: "related",
      label: "Related",
      color: "#0ea5e9",
      side: "left",
      items: [create("related", 4, "ui-component-library"), create("related", 5, "design-system")]
    },
    {
      kind: "mentioned",
      label: "Mentioned In",
      color: "#14b8a6",
      side: "right",
      items: [create("mentioned", 6, "product-roadmap"), create("mentioned", 7, "release-notes-v0.1.0")]
    },
    {
      kind: "implements",
      label: "Implements",
      color: "#84cc16",
      side: "bottom",
      items: [create("implements", 8, "dashboard-spec")]
    }
  ];
}

export function changeTypeColor(kind: string): HistoryChipColor {
  if (kind === "fix") {
    return "secondary";
  }
  if (kind === "docs") {
    return "success";
  }
  if (kind === "refactor") {
    return "warning";
  }
  return kind === "feat" ? "primary" : "default";
}
