#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <topic|topic_dir>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$1"
if [[ -d "$TARGET" ]]; then
  TOPIC_DIR="$TARGET"
else
  TOPIC_DIR="$ROOT_DIR/poggn/active/$TARGET"
  if [[ ! -d "$TOPIC_DIR" ]]; then
    TOPIC_DIR="$ROOT_DIR/poggn/archive/$TARGET"
  fi
fi

[[ -d "$TOPIC_DIR" ]] || { echo '{"error":"topic not found"}' >&2; exit 1; }
STATE_FILE="$TOPIC_DIR/state/current.md"
[[ -f "$STATE_FILE" ]] || { echo '{"error":"state/current.md not found"}' >&2; exit 1; }

to_rel() {
  local value="$1"
  if [[ "$value" == "$ROOT_DIR/"* ]]; then
    printf '%s\n' "${value#$ROOT_DIR/}"
  else
    printf '%s\n' "$value"
  fi
}

extract_section() {
  local title="$1"
  awk -v title="$title" '
    $0 == "## " title { found = 1; next }
    /^## / && found { exit }
    found { print }
  ' "$STATE_FILE" | sed '/^[[:space:]]*$/d'
}

read_json_field() {
  local key="$1"
  local manifest="$ROOT_DIR/.pgg/project.json"
  if [[ ! -f "$manifest" ]]; then
    return 0
  fi
  sed -n "s/.*\"${key}\": \"\([^\"]*\)\".*/\1/p" "$manifest" | head -n 1
}

read_proposal_field() {
  local key="$1"
  local proposal="$TOPIC_DIR/proposal.md"
  [[ -f "$proposal" ]] || return 0
  sed -n "s/^[[:space:]]*${key}: \"\([^\"]*\)\"/\1/p" "$proposal" | head -n 1
}

read_version_field() {
  local key="$1"
  local version_file="$TOPIC_DIR/version.json"
  [[ -f "$version_file" ]] || return 0
  sed -n "s/.*\"${key}\": \"\([^\"]*\)\".*/\1/p" "$version_file" | head -n 1
}

TOPIC="$(extract_section "Topic" | head -n 1)"
STAGE="$(extract_section "Current Stage" | head -n 1)"
GOAL="$(extract_section "Goal" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//')"
NEXT_ACTION="$(extract_section "Next Action" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//')"
AUTO_MODE="$(read_json_field autoMode)"
TEAMS_MODE="$(read_json_field teamsMode)"
ARCHIVE_TYPE="$(read_proposal_field archive_type)"
VERSION_BUMP="$(read_proposal_field version_bump)"
TARGET_VERSION="$(read_proposal_field target_version)"
SHORT_NAME="$(read_proposal_field short_name)"
WORKING_BRANCH="$(read_proposal_field working_branch)"
RELEASE_BRANCH="$(read_proposal_field release_branch)"
PROJECT_SCOPE="$(read_proposal_field project_scope)"
ARCHIVE_VERSION="$(read_version_field version)"
MULTI_AGENT="false"
if [[ "${TEAMS_MODE:-off}" == "on" ]]; then
  MULTI_AGENT="true"
fi
PRIMARY_AGENTS=""
case "$STAGE" in
  proposal|add|pgg-add)
    PRIMARY_AGENTS="product-manager,ux-ui-expert"
    ;;
  plan|planning|task|pgg-plan)
    PRIMARY_AGENTS="software-architect,domain-expert"
    ;;
  implementation|code|pgg-code)
    PRIMARY_AGENTS="senior-backend-engineer,tech-lead"
    ;;
  refactor|pgg-refactor)
    PRIMARY_AGENTS="software-architect,code-reviewer"
    ;;
  qa|pgg-qa)
    PRIMARY_AGENTS="qa-test-engineer,sre-operations-engineer"
    ;;
  token|pgg-token)
    PRIMARY_AGENTS="tech-lead,code-reviewer"
    ;;
  performance|pgg-performance)
    PRIMARY_AGENTS="qa-test-engineer,sre-operations-engineer"
    ;;
esac

printf 'topic: %s\n' "${TOPIC:-$(basename "$TOPIC_DIR")}"
printf 'topic_dir: %s\n' "$(to_rel "$TOPIC_DIR")"
printf 'current_stage: %s\n' "${STAGE:-unknown}"
printf 'auto_mode: %s\n' "${AUTO_MODE:-on}"
printf 'teams_mode: %s\n' "${TEAMS_MODE:-off}"
printf 'multi_agent: %s\n' "$MULTI_AGENT"
printf 'agent_max_threads: 4\n'
printf 'agent_max_depth: 1\n'
printf 'agent_routing_ref: .codex/add/AGENT-ROUTING.toml\n'
if [[ -n "$PRIMARY_AGENTS" ]]; then
  printf 'primary_agents: %s\n' "$PRIMARY_AGENTS"
fi
printf 'project_scope: %s\n' "${PROJECT_SCOPE:-}"
printf 'archive_type: %s\n' "${ARCHIVE_TYPE:-}"
printf 'version_bump: %s\n' "${VERSION_BUMP:-}"
printf 'target_version: %s\n' "${TARGET_VERSION:-}"
printf 'short_name: %s\n' "${SHORT_NAME:-}"
printf 'working_branch: %s\n' "${WORKING_BRANCH:-}"
printf 'release_branch: %s\n' "${RELEASE_BRANCH:-}"
printf 'archive_version: %s\n' "${ARCHIVE_VERSION:-}"
printf 'goal: %s\n' "${GOAL:-}"
printf 'next_action: %s\n' "${NEXT_ACTION:-}"
printf 'refs:\n'
printf -- '- %s\n' "$(to_rel "$STATE_FILE")"
for ref in "$TOPIC_DIR/proposal.md" "$TOPIC_DIR/plan.md" "$TOPIC_DIR/task.md" "$TOPIC_DIR/implementation/index.md" "$TOPIC_DIR/reviews/code.review.md" "$TOPIC_DIR/reviews/refactor.review.md" "$TOPIC_DIR/token/report.md" "$TOPIC_DIR/performance/report.md" "$TOPIC_DIR/qa/report.md"; do
  [[ -f "$ref" ]] || continue
  printf -- '- %s\n' "$(to_rel "$ref")"
done
while IFS= read -r spec_path; do
  [[ -n "$spec_path" ]] || continue
  printf -- '- %s\n' "$(to_rel "$spec_path")"
done < <(find "$TOPIC_DIR/spec" -type f -name '*.md' 2>/dev/null | sort)

ACTIVE_SPECS="$(extract_section "Active Specs")"
ACTIVE_TASKS="$(extract_section "Active Tasks")"
AUDIT_APPLICABILITY="$(extract_section "Audit Applicability")"
GIT_PUBLISH_MESSAGE="$(extract_section "Git Publish Message")"
TOKEN_USAGE_FILE="$TOPIC_DIR/state/token-usage.ndjson"
if [[ -n "$ACTIVE_SPECS" ]]; then
  printf 'active_specs:\n%s\n' "$ACTIVE_SPECS"
fi
if [[ -n "$ACTIVE_TASKS" ]]; then
  printf 'active_tasks:\n%s\n' "$ACTIVE_TASKS"
fi
if [[ -n "$AUDIT_APPLICABILITY" ]]; then
  printf 'audit_applicability:\n%s\n' "$AUDIT_APPLICABILITY"
fi
if [[ -n "$GIT_PUBLISH_MESSAGE" ]]; then
  printf 'git_publish_message_ref: %s#Git Publish Message\n' "$(to_rel "$STATE_FILE")"
  printf 'git_publish_message:\n%s\n' "$GIT_PUBLISH_MESSAGE"
fi
if [[ -f "$TOKEN_USAGE_FILE" ]]; then
  printf 'token_usage_ref: %s\n' "$(to_rel "$TOKEN_USAGE_FILE")"
  node -e '
    const path = require("path");
    const fs = require("fs");
    const topicDir = process.argv[2];
    const rootDir = process.argv[3];
    const normalize = (value) => {
      if (!value || typeof value !== "string") return null;
      return value.replace(/^\.\//, "").replace(/^poggn\/(?:active|archive)\/[^/]+\//, "");
    };
    const estimateArtifact = (artifactPath) => {
      const normalized = normalize(artifactPath);
      if (!normalized) return null;
      for (const baseDir of [topicDir, rootDir]) {
        try {
          const content = fs.readFileSync(path.join(baseDir, normalized), "utf8");
          return Math.ceil(Array.from(content).length / 4);
        } catch {}
      }
      return null;
    };
    const lines = fs.readFileSync(process.argv[1], "utf8").split(/\n+/).map((line) => line.trim()).filter(Boolean);
    let llm = 0;
    let local = 0;
    let unavailable = 0;
    const directArtifacts = new Set();
    const fallbackArtifacts = new Set();
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const total = Number.isFinite(entry.total_tokens) ? entry.total_tokens : Number.isFinite(entry.totalTokens) ? entry.totalTokens : 0;
        const artifactPath = normalize(entry.artifact_path ?? entry.artifactPath);
        if (entry.source === "llm" && total > 0 && entry.measurement !== "unavailable") {
          llm += total;
          if (artifactPath) directArtifacts.add(artifactPath);
        } else if (entry.source === "llm" && artifactPath) {
          fallbackArtifacts.add(artifactPath);
        } else if (entry.source === "local") {
          local += total;
        }
        if (entry.measurement === "unavailable") unavailable += 1;
      } catch {}
    }
    for (const artifactPath of fallbackArtifacts) {
      if (directArtifacts.has(artifactPath)) continue;
      const estimate = estimateArtifact(artifactPath);
      if (estimate !== null) llm += estimate;
    }
    console.log(`token_usage_records: ${lines.length}`);
    console.log(`token_usage_llm_total: ${llm}`);
    console.log(`token_usage_local_total: ${local}`);
    console.log(`token_usage_unavailable_records: ${unavailable}`);
  ' "$TOKEN_USAGE_FILE" "$TOPIC_DIR" "$ROOT_DIR"
fi
