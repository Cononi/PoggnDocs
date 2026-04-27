import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { DashboardQueryResult, DashboardSnapshot, WorkflowDetailPayload } from "../model/dashboard";

const dashboardApiClient = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});

function toAxiosConfig(
  init?: {
    method?: string;
    body?: string;
  }
): AxiosRequestConfig {
  return {
    method: init?.method ?? "GET",
    data: init?.body ? JSON.parse(init.body) : undefined
  };
}

export async function fetchDashboardSnapshot(): Promise<DashboardQueryResult> {
  try {
    const liveResponse = await dashboardApiClient.get<DashboardSnapshot>("/api/dashboard/snapshot");
    return {
      snapshot: liveResponse.data,
      source: "live"
    };
  } catch {
    // fall through to the static snapshot
  }

  const staticResponse = await dashboardApiClient.get<DashboardSnapshot>(
    `/dashboard-data.json?ts=${Date.now()}`
  );

  return {
    snapshot: staticResponse.data,
    source: "static"
  };
}

export async function requestDashboardSnapshot(
  input: string,
  init?: {
    method?: string;
    body?: string;
  }
): Promise<DashboardSnapshot> {
  try {
    const response = await dashboardApiClient.request<DashboardSnapshot>({
      url: input,
      ...toAxiosConfig(init)
    });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error.message || "Dashboard request failed.";
      throw new Error(message);
    }

    throw error instanceof Error ? error : new Error("Dashboard request failed.");
  }
}

export async function requestDashboardJson<T>(
  input: string,
  init?: {
    method?: string;
    body?: string;
  }
): Promise<T> {
  try {
    const response = await dashboardApiClient.request<T>({
      url: input,
      ...toAxiosConfig(init)
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error.message || "Dashboard request failed.";
      throw new Error(message);
    }

    throw error instanceof Error ? error : new Error("Dashboard request failed.");
  }
}

export async function fetchTopicFileDetail(
  projectId: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string
): Promise<WorkflowDetailPayload> {
  const params = new URLSearchParams({ path: relativePath });
  return requestDashboardJson<WorkflowDetailPayload>(
    `/api/dashboard/projects/${projectId}/topics/${bucket}/${topic}/files/content?${params.toString()}`
  );
}

export async function fetchProjectFileDetail(
  projectId: string,
  relativePath: string
): Promise<WorkflowDetailPayload> {
  const params = new URLSearchParams({ path: relativePath });
  return requestDashboardJson<WorkflowDetailPayload>(
    `/api/dashboard/projects/${projectId}/files/content?${params.toString()}`
  );
}

export async function saveTopicFileDetail(
  projectId: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string,
  content: string
): Promise<{ snapshot: DashboardSnapshot; detail: WorkflowDetailPayload }> {
  return requestDashboardJson<{ snapshot: DashboardSnapshot; detail: WorkflowDetailPayload }>(
    `/api/dashboard/projects/${projectId}/topics/${bucket}/${topic}/files/content`,
    {
      method: "PATCH",
      body: JSON.stringify({ path: relativePath, content })
    }
  );
}

export async function saveProjectFileDetail(
  projectId: string,
  relativePath: string,
  content: string
): Promise<{ snapshot: DashboardSnapshot; detail: WorkflowDetailPayload }> {
  return requestDashboardJson<{ snapshot: DashboardSnapshot; detail: WorkflowDetailPayload }>(
    `/api/dashboard/projects/${projectId}/files/content`,
    {
      method: "PATCH",
      body: JSON.stringify({ path: relativePath, content })
    }
  );
}

export async function removeTopicFile(
  projectId: string,
  bucket: "active" | "archive",
  topic: string,
  relativePath: string
): Promise<{ snapshot: DashboardSnapshot }> {
  return requestDashboardJson<{ snapshot: DashboardSnapshot }>(
    `/api/dashboard/projects/${projectId}/topics/${bucket}/${topic}/files/content`,
    {
      method: "DELETE",
      body: JSON.stringify({ path: relativePath })
    }
  );
}

export async function removeProjectFile(
  projectId: string,
  relativePath: string
): Promise<{ snapshot: DashboardSnapshot }> {
  return requestDashboardJson<{ snapshot: DashboardSnapshot }>(
    `/api/dashboard/projects/${projectId}/files/content`,
    {
      method: "DELETE",
      body: JSON.stringify({ path: relativePath })
    }
  );
}
