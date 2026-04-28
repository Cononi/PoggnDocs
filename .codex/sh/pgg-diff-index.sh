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
WORKING_BRANCH_PREFIX="ai"
RELEASE_BRANCH_PREFIX="release"
OUT="$TOPIC_DIR/implementation/index.md"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

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

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
EOF

count=0
for diff_file in "$TOPIC_DIR"/implementation/diffs/*.diff; do
  [[ -f "$diff_file" ]] || continue
  filename="$(basename "$diff_file")"
  id="${filename%%_*}"
  rest="${filename#*_}"
  crud="${rest%%_*}"
  path_value="$(awk '/^\+\+\+ b\// {sub(/^\+\+\+ b\//, "", $0); print; exit}' "$diff_file")"
  printf '| %s | %s | `%s` | `implementation/diffs/%s` | `TBD` | |\n' "$id" "$crud" "$path_value" "$filename" >> "$OUT"
  count=$((count + 1))
done

echo "{\"index\":\"implementation/index.md\",\"items\":$count}"
