# Whitehack Tools for Windows/macOS/Linux

A cross-platform desktop application for managing characters in the Whitehack tabletop role-playing game. Built with Tauri v2 + SvelteKit, this app provides a modern and intuitive interface for creating, managing, and sharing Whitehack characters.

## Features

- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Character Management**:
  - Create and edit character sheets
  - Track attributes, groups, equipment, and more
  - Import/Export character data (JSON format)
  - Cross-platform import from Swift (iOS/macOS) and Kotlin (Android) versions
  - Manage multiple characters with bulk operations
- **Modern Interface**:
  - Clean, intuitive SvelteKit + Tailwind design
  - Dark/Light mode support
  - Responsive layout
- **Character Features**:
  - Track character attributes (standard or custom)
  - Manage character groups (Species, Vocation, Affiliation)
  - Equipment and encumbrance tracking with detailed breakdowns
  - Combat stats and weapons
  - Full support for all character classes:
    - **Strong** - Combat options and conflict looting
    - **Deft** - Attunement slots and daily powers
    - **Wise** - Miracle slots and magic items
    - **Brave** - Quirks and comeback dice
    - **Clever** - Knacks and unorthodox solutions
    - **Fortunate** - Luck, standing, retainers, and signature objects
  - Gold and inventory management

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- [Rust](https://rustup.rs/) (latest stable)
- Platform-specific requirements:
  - **Windows**: WebView2 (usually pre-installed on Windows 10/11)
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk, libappindicator

## Installation

1. Clone the repository
2. Run the setup script:
   ```bash
   ./setup.sh      # macOS/Linux
   # or
   ./setup.ps1     # Windows
   ```

## Development

Start the development server:

```bash
./dev.sh          # macOS/Linux
# or
./dev.bat         # Windows
```

This starts both the SvelteKit frontend and Tauri backend with hot reload.

## Building

Build the production app:

```bash
./build.sh        # macOS/Linux
# or
./build.ps1       # Windows
```

Built applications are output to `backend/target/release/bundle/`:
- **Windows**: `.msi` installer, `.exe` executable
- **macOS**: `.dmg` disk image, `.app` bundle
- **Linux**: `.deb` package, `.AppImage`

## Project Structure

```
whitehack-tools-tauri/
├── frontend/               # SvelteKit application
│   ├── src/
│   │   ├── routes/        # Pages and layouts
│   │   ├── lib/
│   │   │   ├── components/  # UI components
│   │   │   ├── models/      # TypeScript types
│   │   │   ├── stores/      # Svelte stores
│   │   │   ├── utils/       # Utilities
│   │   │   └── data/        # Preset data
│   │   └── app.css        # Global styles
│   └── package.json
├── backend/               # Tauri/Rust application
│   ├── src/
│   │   └── main.rs       # Rust entry point
│   ├── icons/            # App icons
│   └── tauri.conf.json   # Tauri configuration
├── dev.sh / dev.bat      # Development scripts
├── build.sh / build.ps1  # Build scripts
└── DEVELOPMENT_PLAN.md   # Detailed implementation plan
```

## Cross-Platform Compatibility

This app can import and export character data compatible with:
- **Whitehack Tools for iOS/macOS** (Swift version)
- **Whitehack Tools for Android** (Kotlin version)

The import system automatically detects and normalizes data from either platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is available under the MIT license. See the LICENSE file for more info.

## Acknowledgments

- Built for use with the Whitehack role-playing game
- Uses [Phosphor Icons](https://phosphoricons.com/) via phosphor-svelte
- Built with [Tauri](https://tauri.app/), [SvelteKit](https://kit.svelte.dev/), and [Tailwind CSS](https://tailwindcss.com/)

---
*Note: This app is a fan-made tool and is not officially affiliated with Whitehack or its creators.*
