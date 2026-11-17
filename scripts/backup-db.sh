#!/usr/bin/env bash
# Dumps the production MySQL database to storage/backups/, compressed, and
# deletes backups older than RETENTION_DAYS. Intended to run daily via cron —
# see DEPLOYMENT.txt Part 9 for setup.
#
# Reads DATABASE_URL from .env in the project root (same format Prisma uses:
# mysql://user:password@host:port/database).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"
BACKUP_DIR="$PROJECT_DIR/storage/backups"
RETENTION_DAYS=14

if [ ! -f "$ENV_FILE" ]; then
  echo "No .env file found at $ENV_FILE" >&2
  exit 1
fi

DATABASE_URL=$(grep -E '^DATABASE_URL=' "$ENV_FILE" | sed -E 's/^DATABASE_URL="?(.*)"?$/\1/')
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not found in $ENV_FILE" >&2
  exit 1
fi

# Parse mysql://user:password@host:port/dbname
DB_USER=$(echo "$DATABASE_URL" | sed -E 's#mysql://([^:]+):.*#\1#')
DB_PASS=$(echo "$DATABASE_URL" | sed -E 's#mysql://[^:]+:([^@]+)@.*#\1#')
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's#.*@([^:/]+)[:/].*#\1#')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's#.*:([0-9]+)/.*#\1#')
DB_NAME=$(echo "$DATABASE_URL" | sed -E 's#.*/([^?]+).*#\1#')

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT_FILE="$BACKUP_DIR/${DB_NAME}-${TIMESTAMP}.sql.gz"

mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --password="$DB_PASS" \
  --single-transaction \
  --quick \
  --routines \
  "$DB_NAME" | gzip > "$OUT_FILE"

echo "Backup written: $OUT_FILE"

# Delete backups older than RETENTION_DAYS
find "$BACKUP_DIR" -name "${DB_NAME}-*.sql.gz" -mtime +"$RETENTION_DAYS" -delete

echo "Backup complete. Retention: $RETENTION_DAYS days."
