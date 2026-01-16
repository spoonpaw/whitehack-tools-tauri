#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VITE_PORT="${VITE_PORT:-5173}"

# Check prerequisites
if ! command -v cargo >/dev/null 2>&1; then
  echo "[dev] ERROR: Rust/Cargo is not installed."
  echo "[dev] Install it from https://rustup.rs"
  exit 1
fi

if ! command -v tauri >/dev/null 2>&1 && ! cargo tauri -V >/dev/null 2>&1; then
  echo "[dev] ERROR: Tauri CLI is not installed."
  echo "[dev] Install one of:"
  echo "  - npm:   npm install -g @tauri-apps/cli@^2"
  echo "  - cargo: cargo install tauri-cli"
  exit 1
fi

cleanup() {
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "${FRONTEND_PID}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

port_listeners() {
  local port="$1"
  # macOS-friendly: list PIDs listening on TCP port
  lsof -nP -iTCP:"${port}" -sTCP:LISTEN -t 2>/dev/null || true
}

is_our_dev_server() {
  local pid="$1"
  local cmd
  cmd="$(ps -p "${pid}" -o command= 2>/dev/null || true)"
  [[ -z "${cmd}" ]] && return 1
  # Heuristics: only treat as "ours" if it's clearly a Node/Vite process from this repo.
  [[ "${cmd}" == *"vite"* || "${cmd}" == *"node"* ]] || return 1
  [[ "${cmd}" == *"${ROOT_DIR}"* || "${cmd}" == *"tauri"* || "${cmd}" == *"sveltekit"* ]] || return 1
  return 0
}

kill_our_port_listeners() {
  local port="$1"
  local pids
  pids="$(port_listeners "${port}")"
  [[ -z "${pids}" ]] && return 0

  local anyKilled=0
  while read -r pid; do
    [[ -z "${pid}" ]] && continue
    if is_our_dev_server "${pid}"; then
      echo "[dev] Port ${port} is in use by an old dev server (pid ${pid}). Stopping it..."
      kill "${pid}" >/dev/null 2>&1 || true
      anyKilled=1
    fi
  done <<< "${pids}"

  if [[ "${anyKilled}" -eq 1 ]]; then
    # Give the OS a moment to release the port
    sleep 0.3
  fi
}

if [[ ! -d "${ROOT_DIR}/frontend/node_modules" ]]; then
  echo "[dev] Frontend deps not found. Installing (npm ci) ..."
  (cd "${ROOT_DIR}/frontend" && npm ci)
fi

kill_our_port_listeners "${VITE_PORT}"

if [[ -n "$(port_listeners "${VITE_PORT}")" ]]; then
  echo "[dev] Port ${VITE_PORT} is already in use by a non-app process."
  echo "[dev] Please stop it or run with a different port:"
  echo "[dev]   VITE_PORT=XXXX bash ./dev.sh"
  exit 1
fi

echo "[dev] Starting frontend (SvelteKit) on http://localhost:${VITE_PORT} ..."
(cd "${ROOT_DIR}/frontend" && npm run dev -- --host 127.0.0.1 --port "${VITE_PORT}") &
FRONTEND_PID=$!

echo "[dev] Starting Tauri ..."
cd "${ROOT_DIR}/backend"
if command -v tauri >/dev/null 2>&1; then
  tauri dev
else
  cargo tauri dev
fi
