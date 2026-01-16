# Template Upgrade Plan

Backporting improvements from `weekly-writing-tracker` to this template.

---

## Overview

While building the Weekly Writing app, several infrastructure improvements were made that should be part of the base template. This plan outlines what to copy back.

---

## Frontend Changes

### 1. `frontend/src/app.css`
**Status:** ✅ Completed

**Copy:**
- View transitions CSS (`::view-transition-old`, `::view-transition-new`, `@keyframes fade-in`)
- Gradient background (the cool cyan/fuchsia/green radial gradients)
- Dark mode as default + light mode support with CSS overrides
- Form element styling (inputs, selects, textareas)

**Remove/Skip:**
- `.week-cell` component styles (app-specific)

---

### 2. `frontend/src/routes/+layout.svelte`
**Status:** ✅ Completed

**Copy:**
- View transitions via `onNavigate()` hook
- Svelte 5 syntax: `$props()` and `{@render children()}` instead of `<slot />`
- Theme toggle with `localStorage` persistence
- Sticky navbar with backdrop blur

**Modify:**
- Change branding from "Weekly Writing" → "Tauri SvelteKit"
- Remove storage migration logic (`hasJsonFilesToMigrate`, etc.)
- Remove settings link (or keep as example?)

---

### 3. `frontend/package.json`
**Status:** ✅ Completed

**Add dependencies:**
```json
"dependencies": {
  "@tauri-apps/plugin-fs": "^2.4.5",
  "@tauri-apps/plugin-sql": "^2.3.1"
}
```

**Add devDependencies:**
```json
"@types/node": "^25.0.3"
```

**Update:**
```json
"@tauri-apps/api": "^2.9.1"  // was ^2.1.1
```

---

## Backend Changes

### 4. `backend/Cargo.toml`
**Status:** ✅ Completed

**Add:**
```toml
tauri-plugin-fs = "2.0"
tauri-plugin-sql = { version = "2.0", features = ["sqlite"] }
```

---

### 5. `backend/src/main.rs`
**Status:** ✅ Completed

**Add to `tauri::Builder`:**
```rust
.plugin(tauri_plugin_fs::init())
.plugin(tauri_plugin_sql::Builder::default().build())
```

---

### 6. `backend/tauri.conf.json`
**Status:** ✅ Completed

**Update plugins section:**
```json
"plugins": {
  "fs": {}
}
```

---

## Scripts

### 7. `dev.sh`
**Status:** ✅ Completed

**Add at top (after ROOT_DIR):**
```bash
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
```

**Fix:** Update the process detection pattern from `whitehack_combat_simulator` to something generic like `tauri_sveltekit` or just remove that specific check.

---

### 8. `build.sh`
**Status:** ✅ Completed

**Add:** Same prerequisite checks as dev.sh

**Optional:** Add commented-out macOS notarization template:
```bash
# === macOS Notarization (Optional) ===
# To enable, create .env.notarize with your credentials:
#   APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)"
#   APPLE_KEYCHAIN_PROFILE="your-notarize-profile"
# Then uncomment the notarization section below.
```

---

## New Test Suite Features

### 9. `frontend/src/routes/test/+page.svelte` - SQLite Tests
**Status:** ✅ Completed

Add a new "Database Tests" card with:

| Test | What it does |
|------|--------------|
| **Create Table** | Creates a `demo_items` table if not exists |
| **Insert Row** | Adds a row with timestamp |
| **Query All** | Selects all rows from the table |
| **Delete All** | Clears the table |
| **Full CRUD Cycle** | Runs create → insert → query → delete in sequence |

**Frontend code needed:**
```typescript
import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

async function getDb() {
  if (!db) {
    db = await Database.load("sqlite:demo.db");
  }
  return db;
}

async function testSqliteCreate() {
  const database = await getDb();
  await database.execute(`
    CREATE TABLE IF NOT EXISTS demo_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  return "✅ Table created";
}

async function testSqliteInsert() {
  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    "INSERT INTO demo_items (name, created_at) VALUES ($1, $2)",
    [`Item ${Date.now()}`, now]
  );
  return "✅ Row inserted";
}

async function testSqliteQuery() {
  const database = await getDb();
  const rows = await database.select("SELECT * FROM demo_items ORDER BY id DESC LIMIT 10");
  return `✅ Found ${rows.length} rows`;
}

async function testSqliteDelete() {
  const database = await getDb();
  await database.execute("DELETE FROM demo_items");
  return "✅ All rows deleted";
}
```

---

### 10. `frontend/src/routes/test/+page.svelte` - Filesystem Tests
**Status:** ✅ Completed

Add a "Filesystem Tests" card with:

| Test | What it does |
|------|--------------|
| **Check App Data Dir** | Verifies app data directory exists |
| **Write File** | Writes a test file to app data |
| **Read File** | Reads the test file back |
| **File Exists** | Checks if the file exists |
| **Delete File** | Removes the test file |

**Frontend code needed:**
```typescript
import { 
  exists, 
  writeTextFile, 
  readTextFile, 
  remove,
  BaseDirectory 
} from "@tauri-apps/plugin-fs";

async function testFsWrite() {
  await writeTextFile("test-file.txt", `Test content: ${Date.now()}`, {
    baseDir: BaseDirectory.AppData
  });
  return "✅ File written to AppData";
}

async function testFsRead() {
  const content = await readTextFile("test-file.txt", {
    baseDir: BaseDirectory.AppData
  });
  return `✅ Read: "${content.substring(0, 50)}..."`;
}

async function testFsExists() {
  const fileExists = await exists("test-file.txt", {
    baseDir: BaseDirectory.AppData
  });
  return fileExists ? "✅ File exists" : "⚠️ File not found";
}

async function testFsDelete() {
  await remove("test-file.txt", { baseDir: BaseDirectory.AppData });
  return "✅ File deleted";
}
```

---

### 11. `backend/capabilities/default.json`
**Status:** ✅ Completed

Need to add capabilities for the new plugins:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capabilities for the app",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "shell:allow-open",
    "dialog:default",
    "fs:default",
    "sql:default"
  ]
}
```

---

## Additional Discovered Items

### 12. `frontend/eslint.config.js`
**Status:** ✅ Completed

Template is missing ESLint config. Copy from weekly-writing-tracker:
- Flat config format (modern ESLint)
- Svelte + TypeScript parser setup
- Prettier integration

---

### 13. `frontend/tsconfig.json`
**Status:** ✅ Completed

Template is missing explicit tsconfig. Add:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "skipLibCheck": true,
    "types": ["svelte", "node"]
  }
}
```

---

### 14. `frontend/src/routes/+page.svelte` - Home Page Styling
**Status:** ✅ Completed

Update home page to match new aesthetic:
- Change `gray-*` classes → `neutral-*` classes
- Add cyan/fuchsia accent colors
- Match the visual style of test page and layout

---

### 15. `setup.sh` - Prerequisite Checks
**Status:** ✅ Completed

Added Node.js/npm prerequisite checks at the start.

---

## Optional / Nice-to-Have

### 16. `frontend/src/lib/tauri.ts`
**Status:** ⬜ Optional

Keep as-is or expand with more helper functions.

---

## Execution Order

1. ✅ Backend: `Cargo.toml` → `main.rs` → `tauri.conf.json` → `capabilities/default.json`
2. ✅ Frontend: `package.json` → `app.css` → `+layout.svelte`
3. ✅ Test Page: Add SQLite tests → Add Filesystem tests
4. ✅ Scripts: `setup.sh` → `dev.sh` → `build.sh`
5. ✅ Frontend Config: `eslint.config.js` → `tsconfig.json`
6. ✅ Home Page: Update `+page.svelte` styling to match new aesthetic
7. ⬜ Install & Test: Run `./setup.sh` then `./dev.sh` and verify everything works
8. ⬜ Commit: "feat: add view transitions, fs/sql plugins, enhanced test suite"

---

## Notes

- The weekly-writing-tracker has additional routes (`/settings`, `/week/[year]/[week]`) - those are app-specific, don't copy
- The `storage.ts` file is app-specific - don't copy
- Keep the template's simple demo page that shows system info
- The new SQLite/FS tests will make the template way more useful as a starting point
- Users can see working examples of database + filesystem operations right out of the box

---

## Summary

**Before:** Template has basic Tauri+SvelteKit setup with simple tests

**After:** Template will have:
- ✨ View transitions (smooth page navigation)
- 🌙 Proper dark/light mode with persistence
- 🎨 Beautiful gradient backgrounds
- 🗄️ SQLite plugin + working demo tests
- 📁 Filesystem plugin + working demo tests
- 🔧 Better dev/build/setup scripts with prerequisite checks
- 📋 Comprehensive test suite showing all plugin features
- 🧹 Proper ESLint config for Svelte + TypeScript
- 📝 Explicit tsconfig.json for better IDE support
