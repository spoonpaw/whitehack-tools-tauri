#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Optional local env (do not commit):
#   cp .env.notarize.example .env.notarize
#   edit .env.notarize
ENV_FILE="${ROOT_DIR}/.env.notarize"
if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${ENV_FILE}"
  set +a
fi

# macOS Code Signing & Notarization
export APPLE_SIGNING_IDENTITY="${APPLE_SIGNING_IDENTITY:-}"
KEYCHAIN_PROFILE="${APPLE_KEYCHAIN_PROFILE:-}"

# Notarization knobs:
# - Tauri can notarize/staple the .app during bundling if APPLE_ID/APPLE_PASSWORD/APPLE_TEAM_ID are set.
# - This script can notarize/staple the .dmg via notarytool keychain profile.
# Doing both is valid, but it looks like "double notarization".
NOTARIZE_TAURI_APP="${NOTARIZE_TAURI_APP:-0}"
NOTARIZE_DMG="${NOTARIZE_DMG:-}"

# If NOTARIZE_DMG isn't set explicitly:
# - default to DMG notarization if keychain profile is set
# - but if you enable Tauri .app notarization, default to skipping DMG notarization (avoid double-looking runs)
if [[ -z "${NOTARIZE_DMG}" ]]; then
  if [[ "${NOTARIZE_TAURI_APP}" == "1" ]]; then
    NOTARIZE_DMG="0"
  elif [[ -n "${KEYCHAIN_PROFILE}" ]]; then
    NOTARIZE_DMG="1"
  else
    NOTARIZE_DMG="0"
  fi
fi

# Check prerequisites
if ! command -v cargo >/dev/null 2>&1; then
  echo "[build] ERROR: Rust/Cargo is not installed."
  echo "[build] Install it from https://rustup.rs"
  exit 1
fi

if ! command -v tauri >/dev/null 2>&1 && ! cargo tauri -V >/dev/null 2>&1; then
  echo "[build] ERROR: Tauri CLI is not installed."
  echo "[build] Install one of:"
  echo "  - npm:   npm install -g @tauri-apps/cli@^2"
  echo "  - cargo: cargo install tauri-cli"
  exit 1
fi

# Install frontend dependencies if needed
if [[ ! -d "${ROOT_DIR}/frontend/node_modules" ]]; then
  echo "[build] Frontend deps not found. Installing (npm ci) ..."
  (cd "${ROOT_DIR}/frontend" && npm ci)
fi

echo "[build] Building frontend (SvelteKit/Vite) -> frontend/build ..."
(cd "${ROOT_DIR}/frontend" && npm run build)

echo "[build] Building Tauri bundles ..."
echo "[build] Note: during DMG bundling a temporary mounted volume may appear; don't drag/copy from it until the build finishes."
cd "${ROOT_DIR}/backend"

# Linux: Build deb/rpm with Tauri, then manually build AppImage (workaround for linuxdeploy plugin issue)
if [[ "$(uname)" == "Linux" ]]; then
  echo "[build] Building deb and rpm bundles..."
  if command -v tauri >/dev/null 2>&1; then
    tauri build --bundles deb,rpm "$@"
  else
    cargo tauri build --bundles deb,rpm "$@"
  fi

  echo ""
  echo "[build] Building AppImage manually (linuxdeploy workaround)..."
  TAURI_CACHE="${HOME}/.cache/tauri"
  APPDIR="${ROOT_DIR}/backend/target/release/bundle/appimage/Whitehack Tools.AppDir"
  APPIMAGE_OUT="${ROOT_DIR}/backend/target/release/bundle/appimage"

  # Ensure linuxdeploy tools are available
  if [[ ! -f "${TAURI_CACHE}/linuxdeploy-x86_64.AppImage" ]]; then
    echo "[build] ERROR: linuxdeploy not found in ${TAURI_CACHE}"
    echo "[build] Run 'cargo tauri build' once to download it, or download manually."
    exit 1
  fi

  # Extract linuxdeploy if not already done
  LINUXDEPLOY_DIR="${TAURI_CACHE}/linuxdeploy-extracted"
  if [[ ! -d "${LINUXDEPLOY_DIR}" ]]; then
    echo "[build] Extracting linuxdeploy..."
    (cd "${TAURI_CACHE}" && ./linuxdeploy-x86_64.AppImage --appimage-extract && mv squashfs-root linuxdeploy-extracted)
  fi

  # Copy GTK plugin into extracted linuxdeploy
  if [[ -f "${TAURI_CACHE}/linuxdeploy-plugin-gtk.sh" && ! -f "${LINUXDEPLOY_DIR}/usr/bin/linuxdeploy-plugin-gtk.sh" ]]; then
    cp "${TAURI_CACHE}/linuxdeploy-plugin-gtk.sh" "${LINUXDEPLOY_DIR}/usr/bin/"
    chmod +x "${LINUXDEPLOY_DIR}/usr/bin/linuxdeploy-plugin-gtk.sh"
  fi

  # Build AppImage
  mkdir -p "${APPIMAGE_OUT}"
  cd "${APPIMAGE_OUT}"
  PATH="${LINUXDEPLOY_DIR}/usr/bin:${PATH}" "${LINUXDEPLOY_DIR}/usr/bin/linuxdeploy" \
    --appdir "${APPDIR}" \
    --plugin gtk \
    --output appimage

  echo "[build] ✅ AppImage built successfully!"
else
  # macOS or other: use Tauri's bundler directly
  if [[ "$(uname)" == "Darwin" && "${NOTARIZE_TAURI_APP}" != "1" ]]; then
    # Prevent Tauri from attempting .app notarization when we're not doing it.
    unset APPLE_ID APPLE_PASSWORD APPLE_TEAM_ID APPLE_API_KEY APPLE_API_ISSUER APPLE_API_KEY_PATH
  fi

  if command -v tauri >/dev/null 2>&1; then
    tauri build "$@"
  else
    cargo tauri build "$@"
  fi
fi

# macOS: Notarize and staple the DMG (optional)
if [[ "$(uname)" == "Darwin" && "${NOTARIZE_DMG}" == "1" ]]; then
  DMG_PATH="${ROOT_DIR}/backend/target/release/bundle/dmg"
  DMG_FILE=$(find "${DMG_PATH}" -name "*.dmg" -type f 2>/dev/null | head -1)

  if [[ -n "${DMG_FILE}" ]]; then
    echo ""
    echo "[build] Notarizing DMG with Apple..."

    # `notarytool submit --wait` uses carriage-return progress which looks messy in logs.
    # Capture output and print a clean heartbeat while waiting.
    NOTARY_LOG="$(mktemp -t tauri-notary.XXXXXX)"

    set +e
    xcrun notarytool submit "${DMG_FILE}" --keychain-profile "${KEYCHAIN_PROFILE}" --wait >"${NOTARY_LOG}" 2>&1 &
    NOTARY_PID=$!
    set -e

    elapsed=0
    while kill -0 "${NOTARY_PID}" >/dev/null 2>&1; do
      if [[ $((elapsed % 10)) -eq 0 ]]; then
        echo "[build] Notarization in progress... (${elapsed}s elapsed)"
      fi
      sleep 1
      elapsed=$((elapsed + 1))
    done

    set +e
    wait "${NOTARY_PID}"
    NOTARY_EXIT=$?
    set -e

    if [[ "${NOTARY_EXIT}" -eq 0 ]]; then
      # Clean summary (strip carriage returns)
      tr "\r" "\n" < "${NOTARY_LOG}" | tail -n 20 || true
      echo "[build] Notarization accepted! Stapling ticket..."
      xcrun stapler staple "${DMG_FILE}"
      echo "[build] ✅ DMG is signed, notarized, and stapled!"
      echo "[build] DMG: ${DMG_FILE}"
      open -R "${DMG_FILE}" >/dev/null 2>&1 || true
    else
      echo "[build] ⚠️  Notarization failed. DMG is signed but not notarized."
      echo "[build] Notarytool output:"
      tr "\r" "\n" < "${NOTARY_LOG}" || true
      # Intentionally do not fail the build so you still get a signed DMG to debug with.
    fi

    rm -f "${NOTARY_LOG}" || true
  else
    echo "[build] Skipping DMG notarization: no DMG found under ${DMG_PATH}"
  fi
fi

echo ""
echo "[build] Done! Bundles at:"
echo "  ${ROOT_DIR}/backend/target/release/bundle/"
