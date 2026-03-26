#!/bin/bash
set -e

cd "$(dirname "$0")"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is not installed or not on PATH."
  echo "Install pnpm first, then run this again."
  read -n 1 -s -r -p "Press any key to close..."
  echo
  exit 1
fi

pnpm build
pnpm serve --host 0.0.0.0 --port 3000
