#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <topic|topic_dir>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$1"

# shellcheck source=./pgg-git-prefix.sh
source "$ROOT_DIR/.codex/sh/pgg-git-prefix.sh"
if [[ -d "$TARGET" ]]; then
  TOPIC_DIR="$TARGET"
else
  TOPIC_DIR="$ROOT_DIR/poggn/active/$TARGET"
fi
TOPIC="$(basename "$TOPIC_DIR")"
OUT="$TOPIC_DIR/implementation/index.md"
STATE_FILE="$TOPIC_DIR/state/current.md"
DEFAULT_COMMIT_RANGE="${PGG_DIFF_COMMIT_RANGE:-}"
DEFAULT_GIT_REF="${PGG_DIFF_GIT_REF:-}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

extract_changed_files() {
  [[ -f "$STATE_FILE" ]] || return 0
  DEFAULT_COMMIT_RANGE="$DEFAULT_COMMIT_RANGE" DEFAULT_GIT_REF="$DEFAULT_GIT_REF" awk '
    function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
    function clean(value) { value = trim(value); gsub(/`/, "", value); return trim(value) }
    function key(value) { value = tolower(clean(value)); gsub(/[^a-z0-9]/, "", value); return value }
    $0 == "## Changed Files" { in_section = 1; next }
    /^## / && in_section { exit }
    !in_section || $0 !~ /^\|/ { next }
    /^\|[[:space:]]*-[-|[:space:]]*$/ { next }
    {
      line = $0
      sub(/^\|/, "", line)
      sub(/\|$/, "", line)
      count = split(line, cells, "|")
      if (!header_seen) {
        for (idx = 1; idx <= count; idx++) { headers[key(cells[idx])] = idx }
        header_seen = 1
        next
      }
      path_index = headers["path"]
      if (!path_index) { path_index = headers["file"] }
      path_value = clean(cells[path_index])
      if (path_value == "" || path_value == "path") { next }
      crud = clean(cells[headers["crud"]])
      task_ref = clean(cells[headers["taskref"]])
      diff_source = clean(cells[headers["diffsource"]])
      git_ref = clean(cells[headers["gitref"]])
      commit_range = clean(cells[headers["commitrange"]])
      diff_command = clean(cells[headers["diffcommand"]])
      status = clean(cells[headers["status"]])
      note = clean(cells[headers["note"]])
      if (crud == "") { crud = "UPDATE" }
      if (task_ref == "") { task_ref = "TBD" }
      default_commit_range = ENVIRON["DEFAULT_COMMIT_RANGE"]
      default_git_ref = ENVIRON["DEFAULT_GIT_REF"]
      if (diff_source == "" && default_commit_range != "") { diff_source = "commit-range"; commit_range = default_commit_range }
      if (diff_source == "" && default_git_ref != "") { diff_source = "commit"; git_ref = default_git_ref }
      if (diff_source == "") { diff_source = "working-tree" }
      if (git_ref == "") { git_ref = "-" }
      if (commit_range == "") { commit_range = "-" }
      if (diff_command == "" && diff_source == "commit-range") { diff_command = "git diff " commit_range " -- " path_value }
      if (diff_command == "" && diff_source == "commit") { diff_command = "git show " git_ref " -- " path_value }
      if (diff_command == "") { diff_command = "git diff -- " path_value }
      if (status == "") { status = diff_source == "working-tree" ? "pending" : "available" }
      print crud "\t" path_value "\t" task_ref "\t" diff_source "\t" git_ref "\t" commit_range "\t" diff_command "\t" status "\t" note
    }
  ' "$STATE_FILE"
}

extract_legacy_diff_files() {
  for diff_file in "$TOPIC_DIR"/implementation/diffs/*.diff; do
    [[ -f "$diff_file" ]] || continue
    filename="$(basename "$diff_file")"
    rest="${filename#*_}"
    crud="${rest%%_*}"
    path_value="$(awk '/^\+\+\+ b\// {sub(/^\+\+\+ b\//, "", $0); print; exit}' "$diff_file")"
    [[ -n "$path_value" ]] || path_value="$(awk '/^--- a\// {sub(/^--- a\//, "", $0); print; exit}' "$diff_file")"
    printf '%s\t%s\tTBD\tlegacy-diff-file\t-\t-\tcat %s\tavailable\t%s\n' "$crud" "$path_value" "implementation/diffs/$filename" "implementation/diffs/$filename"
  done
}

mkdir -p "$TOPIC_DIR/implementation"
cat > "$OUT" <<EOF
---
pgg:
  topic: "$TOPIC"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 0
  updated_at: "$TIMESTAMP"
---

# Implementation Index

| ID | CRUD | path | taskRef | diffSource | gitRef | commitRange | diffCommand | status | note |
|---|---|---|---|---|---|---|---|---|---|
EOF

count=0
while IFS=$'\t' read -r crud path_value task_ref diff_source git_ref commit_range diff_command status note; do
  [[ -n "$path_value" ]] || continue
  count=$((count + 1))
  printf '| %03d | %s | `%s` | `%s` | `%s` | `%s` | `%s` | `%s` | `%s` | %s |\n' "$count" "$crud" "$path_value" "$task_ref" "$diff_source" "$git_ref" "$commit_range" "$diff_command" "$status" "$note" >> "$OUT"
done < <(extract_changed_files)

if [[ "$count" -eq 0 ]]; then
  while IFS=$'\t' read -r crud path_value task_ref diff_source git_ref commit_range diff_command status note; do
    [[ -n "$path_value" ]] || continue
    count=$((count + 1))
    printf '| %03d | %s | `%s` | `%s` | `%s` | `%s` | `%s` | `%s` | `%s` | %s |\n' "$count" "$crud" "$path_value" "$task_ref" "$diff_source" "$git_ref" "$commit_range" "$diff_command" "$status" "$note" >> "$OUT"
  done < <(extract_legacy_diff_files)
fi

if [[ "$count" -eq 0 ]]; then
  cat >> "$OUT" <<EOF

No changed files were found in \`state/current.md\` and no legacy diff files were present.
EOF
else
  cat >> "$OUT" <<EOF

## Notes

- \`working-tree\` rows are temporary until a task or stage commit records a durable Git ref.
- \`legacy-diff-file\` rows point to pre-existing opt-in diff body artifacts.
EOF
fi

echo "{\"index\":\"implementation/index.md\",\"items\":$count}"
