import type { DashboardQueryResult, DashboardSnapshot } from "../model/dashboard";

export async function fetchDashboardSnapshot(): Promise<DashboardQueryResult> {
  try {
    const liveResponse = await fetch("/api/dashboard/snapshot");
    if (liveResponse.ok) {
      return {
        snapshot: (await liveResponse.json()) as DashboardSnapshot,
        source: "live"
      };
    }
  } catch {
    // fall through to the static snapshot
  }

  const staticResponse = await fetch(`/dashboard-data.json?ts=${Date.now()}`);
  if (!staticResponse.ok) {
    throw new Error("Failed to load dashboard snapshot.");
  }

  return {
    snapshot: (await staticResponse.json()) as DashboardSnapshot,
    source: "static"
  };
}

export async function requestDashboardSnapshot(
  input: RequestInfo,
  init?: RequestInit
): Promise<DashboardSnapshot> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Dashboard request failed.");
  }

  return (await response.json()) as DashboardSnapshot;
}
