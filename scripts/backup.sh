#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="${DATABASE_PATH:-$ROOT/data/bytex.db}"
UPLOAD_DIR="${UPLOAD_DIR:-$ROOT/data/uploads}"
BACKUP_ROOT="${BACKUP_DIR:-$ROOT/data/backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_ROOT/$STAMP"

mkdir -p "$DEST"

if [[ ! -f "$DB_PATH" ]]; then
  echo "Database not found: $DB_PATH" >&2
  exit 1
fi

# Online-safe SQLite backup
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_PATH" ".backup '$DEST/bytex.db'"
else
  # Fallback: copy WAL-aware trio if present
  cp -a "$DB_PATH" "$DEST/bytex.db"
  [[ -f "${DB_PATH}-wal" ]] && cp -a "${DB_PATH}-wal" "$DEST/"
  [[ -f "${DB_PATH}-shm" ]] && cp -a "${DB_PATH}-shm" "$DEST/"
fi

if [[ -d "$UPLOAD_DIR" ]]; then
  mkdir -p "$DEST/uploads"
  cp -a "$UPLOAD_DIR/." "$DEST/uploads/"
fi

echo "Backup created: $DEST"
echo "Restore: stop the app, replace DATABASE_PATH and UPLOAD_DIR contents, then start the app."
