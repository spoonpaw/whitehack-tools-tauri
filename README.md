# Tauri + SvelteKit + Tailwind CSS Boilerplate

A modern, production-ready boilerplate for building cross-platform desktop applications with Tauri, SvelteKit, and Tailwind CSS.

## ✨ Features

- 🦀 **Tauri v2** - Secure, fast, and lightweight Rust backend
- ⚡ **SvelteKit** - Modern web framework with SSG support  
- 🎨 **Tailwind CSS** - Utility-first CSS with dark mode
- 🌙 **Dark Mode** - Persistent theme switching
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript** - Full type safety
- 🚀 **Hot Reload** - Fast development experience
- 📦 **Optimized Build** - Small bundle size
- 🧪 **Test Suite** - Complete testing interface included

## 📂 Project Structure

```
├── frontend/                 # SvelteKit application
│   ├── src/
│   │   ├── routes/          # SvelteKit routes
│   │   ├── lib/             # Shared utilities
│   │   └── components/      # Reusable components
│   ├── static/              # Static assets
│   └── package.json
├── backend/                  # Tauri application
│   ├── src/
│   │   └── main.rs         # Rust commands and logic
│   ├── Cargo.toml
│   └── tauri.conf.json     # Tauri configuration
└── dev.bat                  # Development script
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://rustup.rs/)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation

1. **Install dependencies**

   ```bash
./setup.sh
   ```

### Development

**Using the dev script (recommended):**
```bash
dev.bat
```

**macOS / Linux:**
```bash
./dev.sh
```

### Build (macOS / Linux)

```bash
./build.sh
```

Outputs (macOS) will be under `backend/target/release/bundle/` (e.g. `.app`, `.dmg`).

**Or manually:**
```bash
# Terminal 1 - Start frontend dev server
cd frontend
npm run dev

# Terminal 2 - Start Tauri app
cd backend
tauri dev
```

### Building for Production

```bash
cd backend
cargo tauri build
```

The built application will be available in `backend/target/release/bundle/`.

## 🔧 Available Scripts

**Frontend (`frontend/` directory):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend (`backend/` directory):**
- `cargo tauri dev` - Start development with hot reload
- `cargo tauri build` - Build production executable

## 🧪 Testing

The boilerplate includes a comprehensive test suite accessible at `/test` route:

- **Basic Operations** - Function calls, math operations, greetings
- **System Integration** - OS information, file operations
- **Performance Tests** - Memory usage, async operations, network simulation
- **Error Handling** - Proper error management testing

## 📖 API Reference

### Rust Commands

The following Tauri commands are available from the frontend:

```typescript
import { invoke } from '@tauri-apps/api/core';

// Get system information
const systemInfo = await invoke('get_system_info');

// Perform basic operations
const result = await invoke('test_basic_operation');

// Math operations
const sum = await invoke('test_math_operation', { a: 5, b: 3 });

// File operations
const fileResult = await invoke('test_file_operations');

// JSON parsing
const parsed = await invoke('test_json_parsing', { jsonStr: '{"key": "value"}' });
```

## 🎨 Customization

### Tailwind Configuration

Modify `frontend/tailwind.config.js` to customize your design system:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      }
    }
  }
}
```

### Tauri Configuration

Edit `backend/tauri.conf.json` to:
- Change app name and identifier
- Modify window properties
- Configure app icons
- Set up permissions

## 🔒 Security

- Tauri's security features are enabled by default
- Only explicitly defined commands are exposed to the frontend
- CSP (Content Security Policy) ready
- Secure communication between Rust and frontend

## 📦 Distribution

### Windows
- `.msi` installer
- `.exe` executable

### macOS
- `.dmg` disk image
- `.app` application bundle

### Linux
- `.deb` package
- `.AppImage` portable app

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Desktop app framework
- [SvelteKit](https://kit.svelte.dev/) - Web application framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Ready to build amazing desktop applications! 🚀**
