import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  buildDashboardSnapshot,
  createProjectCategory,
  deleteTopicFile,
  deleteRegisteredProject,
  deleteProjectCategory,
  deferProjectGitSetup,
  initializeDashboardProject,
  inspectProjectFolder,
  moveProjectToCategory,
  readTopicFileDetail,
  registerExistingProject,
  reorderProjectCategory,
  renameProjectCategory,
  runProjectGitOnboarding,
  setProjectCategoryVisibility,
  setDefaultProjectCategory,
  updateTopicFile,
  updateProjectAutoMode,
  updateProjectGitBranchPrefixes,
  updateProjectGitMode,
  updateProjectMainSettings,
  updateProjectRefreshInterval,
  updateGlobalUsername,
  updateProjectTeamsMode
} from "../../packages/core/src/index";

const dashboardRoot = path.resolve(process.env.PGG_DASHBOARD_ROOT ?? process.cwd());

async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function writeJson(response: ServerResponse, status: number, payload: unknown): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

async function resolveProjectRootDir(projectId: string): Promise<string> {
  const snapshot = await buildDashboardSnapshot(dashboardRoot);
  const project = snapshot.projects.find((entry) => entry.id === projectId);
  if (!project) {
    throw new Error(`Project '${projectId}' was not found.`);
  }

  return project.rootDir;
}

function createDashboardApiPlugin(): Plugin {
  return {
    name: "pgg-dashboard-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ? new URL(request.url, "http://127.0.0.1") : null;
        if (!url || !url.pathname.startsWith("/api/dashboard")) {
          next();
          return;
        }

        try {
          if (request.method === "GET" && url.pathname === "/api/dashboard/snapshot") {
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "PATCH" && url.pathname === "/api/dashboard/user") {
            const body = await readJsonBody(request);
            if (typeof body.username !== "string") {
              writeJson(response, 400, { error: "username is required." });
              return;
            }
            await updateGlobalUsername(body.username);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/projects/inspect") {
            const body = await readJsonBody(request);
            if (typeof body.rootDir !== "string") {
              writeJson(response, 400, { error: "rootDir is required." });
              return;
            }
            writeJson(response, 200, await inspectProjectFolder(path.resolve(body.rootDir)));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/projects/init") {
            const body = await readJsonBody(request);
            if (typeof body.rootDir !== "string") {
              writeJson(response, 400, { error: "rootDir is required." });
              return;
            }
            await initializeDashboardProject(path.resolve(body.rootDir), {
              provider: "codex",
              language: body.language === "en" || body.language === "ko" ? body.language : "ko",
              autoMode: body.autoMode === "off" ? "off" : "on",
              teamsMode: body.teamsMode === "on" ? "on" : "off",
              gitMode: body.gitMode === "on" ? "on" : "off",
              gitSetup:
                body.gitSetup && typeof body.gitSetup === "object"
                  ? {
                      path:
                        (body.gitSetup as { path?: unknown }).path === "local" ||
                        (body.gitSetup as { path?: unknown }).path === "fast" ||
                        (body.gitSetup as { path?: unknown }).path === "setup" ||
                        (body.gitSetup as { path?: unknown }).path === "defer"
                          ? ((body.gitSetup as { path: "local" | "fast" | "setup" | "defer" }).path)
                          : "defer"
                    }
                  : undefined
            });
            if (typeof body.targetCategoryId === "string") {
              const snapshot = await buildDashboardSnapshot(dashboardRoot);
              const project = snapshot.projects.find((entry) => path.resolve(entry.rootDir) === path.resolve(body.rootDir));
              if (project) {
                await moveProjectToCategory(project.id, body.targetCategoryId);
              }
            }
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/categories") {
            const body = await readJsonBody(request);
            if (typeof body.name !== "string") {
              writeJson(response, 400, { error: "Category name is required." });
              return;
            }
            await createProjectCategory(body.name);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/categories/move") {
            const body = await readJsonBody(request);
            if (
              typeof body.projectId !== "string" ||
              typeof body.targetCategoryId !== "string"
            ) {
              writeJson(response, 400, { error: "projectId and targetCategoryId are required." });
              return;
            }
            await moveProjectToCategory(
              body.projectId,
              body.targetCategoryId,
              typeof body.targetIndex === "number" ? body.targetIndex : undefined
            );
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const categoryMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)$/);
          if (categoryMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (typeof body.name !== "string") {
              writeJson(response, 400, { error: "Updated category name is required." });
              return;
            }
            await renameProjectCategory(categoryMatch[1]!, body.name);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (categoryMatch && request.method === "DELETE") {
            await deleteProjectCategory(categoryMatch[1]!);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const defaultMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)\/default$/);
          if (defaultMatch && request.method === "POST") {
            await setDefaultProjectCategory(defaultMatch[1]!);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const visibilityMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)\/visibility$/);
          if (visibilityMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (typeof body.visible !== "boolean") {
              writeJson(response, 400, { error: "visible must be a boolean." });
              return;
            }
            await setProjectCategoryVisibility(visibilityMatch[1]!, body.visible);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const reorderMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)\/reorder$/);
          if (reorderMatch && request.method === "POST") {
            const body = await readJsonBody(request);
            if (typeof body.targetIndex !== "number") {
              writeJson(response, 400, { error: "targetIndex must be a number." });
              return;
            }
            await reorderProjectCategory(reorderMatch[1]!, body.targetIndex);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/projects") {
            const body = await readJsonBody(request);
            if (typeof body.rootDir !== "string") {
              writeJson(response, 400, { error: "rootDir is required." });
              return;
            }
            await registerExistingProject(path.resolve(body.rootDir));
            if (typeof body.targetCategoryId === "string") {
              const snapshot = await buildDashboardSnapshot(dashboardRoot);
              const project = snapshot.projects.find((entry) => path.resolve(entry.rootDir) === path.resolve(body.rootDir));
              if (project) {
                await moveProjectToCategory(project.id, body.targetCategoryId);
              }
            }
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectMainMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/main$/);
          if (projectMainMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (
              typeof body.title !== "string" &&
              typeof body.titleIconSvg !== "string" &&
              typeof body.language !== "string"
            ) {
              writeJson(response, 400, {
                error: "At least one of title, titleIconSvg, or language is required."
              });
              return;
            }
            await updateProjectMainSettings(await resolveProjectRootDir(projectMainMatch[1]!), {
              title: typeof body.title === "string" ? body.title : undefined,
              titleIconSvg: typeof body.titleIconSvg === "string" ? body.titleIconSvg : undefined,
              language: body.language === "en" || body.language === "ko" ? body.language : undefined
            });
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectRefreshMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/refresh$/);
          if (projectRefreshMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (typeof body.refreshIntervalMs !== "number") {
              writeJson(response, 400, { error: "refreshIntervalMs must be a number." });
              return;
            }
            await updateProjectRefreshInterval(
              await resolveProjectRootDir(projectRefreshMatch[1]!),
              body.refreshIntervalMs
            );
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectGitMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/git$/);
          if (projectGitMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (
              typeof body.workingBranchPrefix !== "string" ||
              typeof body.releaseBranchPrefix !== "string"
            ) {
              writeJson(response, 400, {
                error: "workingBranchPrefix and releaseBranchPrefix are required."
              });
              return;
            }
            await updateProjectGitBranchPrefixes(
              await resolveProjectRootDir(projectGitMatch[1]!),
              body.workingBranchPrefix,
              body.releaseBranchPrefix
            );
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectGitDeferMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/git\/defer$/);
          if (projectGitDeferMatch && request.method === "POST") {
            const body = await readJsonBody(request);
            await deferProjectGitSetup(
              await resolveProjectRootDir(projectGitDeferMatch[1]!),
              typeof body.message === "string"
                ? body.message
                : "Git setup was deferred and can be completed later."
            );
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectGitSetupMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/git\/setup$/);
          if (projectGitSetupMatch && request.method === "POST") {
            const body = await readJsonBody(request);
            const rootDir = await resolveProjectRootDir(projectGitSetupMatch[1]!);
            const result = await runProjectGitOnboarding(rootDir, {
              path:
                body.path === "local" || body.path === "fast" || body.path === "setup" || body.path === "defer"
                  ? body.path
                  : "defer",
              provider: body.provider === "github" || body.provider === "gitlab" || body.provider === "unknown" ? body.provider : undefined,
              owner: typeof body.owner === "string" ? body.owner : undefined,
              repository: typeof body.repository === "string" ? body.repository : undefined,
              remoteUrl: typeof body.remoteUrl === "string" ? body.remoteUrl : undefined,
              authMethod:
                body.authMethod === "https-token" || body.authMethod === "ssh" || body.authMethod === "provider-cli" || body.authMethod === "unknown"
                  ? body.authMethod
                  : undefined,
              visibility: body.visibility === "private" || body.visibility === "public" || body.visibility === "unknown" ? body.visibility : undefined,
              defaultBranch: typeof body.defaultBranch === "string" ? body.defaultBranch : undefined,
              confirmRemoteMutation: body.confirmRemoteMutation === true,
              confirmPush: body.confirmPush === true,
              deferMessage: typeof body.deferMessage === "string" ? body.deferMessage : undefined
            });
            writeJson(response, 200, { snapshot: await buildDashboardSnapshot(dashboardRoot), result });
            return;
          }

          const projectSystemMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)\/system$/);
          if (projectSystemMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            const rootDir = await resolveProjectRootDir(projectSystemMatch[1]!);
            if (typeof body.autoMode === "string") {
              await updateProjectAutoMode(rootDir, body.autoMode === "off" ? "off" : "on");
            }
            if (typeof body.teamsMode === "string") {
              await updateProjectTeamsMode(rootDir, body.teamsMode === "on" ? "on" : "off");
            }
            if (typeof body.gitMode === "string") {
              await updateProjectGitMode(rootDir, body.gitMode === "on" ? "on" : "off");
            }
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const projectDeleteMatch = url.pathname.match(/^\/api\/dashboard\/projects\/([^/]+)$/);
          if (projectDeleteMatch && request.method === "DELETE") {
            const body = await readJsonBody(request);
            await deleteRegisteredProject(projectDeleteMatch[1]!, {
              deleteRootDir: body.dangerousDeleteRoot === true,
              currentRootDir: dashboardRoot
            });
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const topicFileMatch = url.pathname.match(
            /^\/api\/dashboard\/projects\/([^/]+)\/topics\/(active|archive)\/([^/]+)\/files\/content$/
          );
          if (topicFileMatch && request.method === "GET") {
            const relativePath = url.searchParams.get("path");
            if (!relativePath) {
              writeJson(response, 400, { error: "path is required." });
              return;
            }

            writeJson(
              response,
              200,
              await readTopicFileDetail(
                await resolveProjectRootDir(topicFileMatch[1]!),
                topicFileMatch[2] as "active" | "archive",
                topicFileMatch[3]!,
                relativePath
              )
            );
            return;
          }

          if (topicFileMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (typeof body.path !== "string" || typeof body.content !== "string") {
              writeJson(response, 400, { error: "path and content are required." });
              return;
            }

            const rootDir = await resolveProjectRootDir(topicFileMatch[1]!);
            const detail = await updateTopicFile(
              rootDir,
              topicFileMatch[2] as "active" | "archive",
              topicFileMatch[3]!,
              body.path,
              body.content
            );
            writeJson(response, 200, {
              snapshot: await buildDashboardSnapshot(dashboardRoot),
              detail
            });
            return;
          }

          if (topicFileMatch && request.method === "DELETE") {
            const body = await readJsonBody(request);
            if (typeof body.path !== "string") {
              writeJson(response, 400, { error: "path is required." });
              return;
            }

            await deleteTopicFile(
              await resolveProjectRootDir(topicFileMatch[1]!),
              topicFileMatch[2] as "active" | "archive",
              topicFileMatch[3]!,
              body.path
            );
            writeJson(response, 200, {
              snapshot: await buildDashboardSnapshot(dashboardRoot)
            });
            return;
          }

          writeJson(response, 404, { error: "Dashboard API route not found." });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          writeJson(response, 500, { error: message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), createDashboardApiPlugin()],
  server: {
    host: "127.0.0.1",
    allowedHosts: ["3000.code.warin.kr"],
    port: 4173
  }
});
