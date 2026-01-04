# QuickCompress

A modern desktop application for compressing images without losing quality. Built with Electron, React, and TypeScript.

## Features

- **Drag & Drop Interface**: Simply drag images into the app or click to browse
- **Right-Click Context Menu**: Compress images directly from Windows Explorer
- **Smart Compression**: Uses Sharp library with mozjpeg for optimal compression
- **Quality Control**: Adjustable compression slider (0-100)
- **Batch Processing**: Compress multiple images at once
- **CLI Support**: Command-line interface for automation
- **Minimal UI**: Clean, distraction-free interface
- **Windows Integration**: Installable app searchable from Start menu

## Quick Links

- 📦 **[Build & Distribution Guide](BUILD_GUIDE.md)** - Create installer for friends
- 🎨 **[Icon Creation Guide](ICON_GUIDE.md)** - Add custom app icon
- 🖱️ **[Context Menu Usage](CONTEXT_MENU_USAGE.md)** - Right-click compression feature
- ✅ **[Distribution Checklist](DISTRIBUTION_CHECKLIST.md)** - Step-by-step sharing guide

## Supported Formats

- **Input**: JPG, PNG
- **Output**: JPG (always)

Compressed files are saved in the same folder as the original with `_comp` suffix.
Example: `photo.jpg` → `photo_comp.jpg`

## Development

### Prerequisites

- Node.js 18+ installed
- Windows OS (for building Windows installer)

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm start
```

This will:

1. Start Vite dev server on `http://localhost:5173`
2. Launch Electron app with hot reload

### Building

```bash
# Build the application
npm run build

# Create Windows installer
npm run package
```

The installer will be created in the `release/` directory.

## Project Structure

```
QuickCompress_2/
├── electron/              # Electron main process
│   ├── main.ts           # App entry point
│   ├── preload.ts        # IPC bridge
│   ├── services/         # Business logic
│   └── ipc/              # IPC handlers
│
├── src/                  # React renderer process
│   ├── components/       # UI components
│   ├── store/            # Zustand state
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
│
└── resources/            # App icons
```

## How It Works

1. **Main Process** (Electron):
   - Window management
   - File system operations
   - Image compression using Sharp

2. **Renderer Process** (React):
   - User interface
   - State management
   - File selection and preview

3. **IPC Communication**:
   - Secure bridge between processes
   - Context isolation enabled for security

## Compression Algorithm

The app maps the UI quality slider (0-100) to Sharp's quality settings:

- **Low (0-33)**: Sharp quality 60-75 (smaller files, more compression)
- **Medium (34-66)**: Sharp quality 76-85 (balanced)
- **High (67-100)**: Sharp quality 86-95 (better quality, larger files)

## Usage

### GUI Mode (Default)

```bash
npm start
```

Drag and drop images, adjust quality, and compress.

### CLI Mode (After Installation)

Compress images from command line or scripts:

```bash
# Basic compression (75% quality)
QuickCompress.exe --compress "C:\path\to\image.jpg"

# Custom quality
QuickCompress.exe --compress "C:\path\to\image.jpg" --quality 85
```

**Benefits**:

- No window opens
- Fast background processing
- Perfect for automation
- Shows Windows notification when done

### Context Menu (After Installation)

1. Right-click any JPG/PNG image in Windows Explorer
2. Click "Compress with QuickCompress"
3. Done! Compressed file appears instantly

## Scripts

- `npm start` - Run development environment
- `npm run dev` - Start Vite dev server only
- `npm run build` - Build renderer and electron code
- `npm run build:renderer` - Build React app
- `npm run build:electron` - Compile TypeScript
- `npm run package` - Create Windows installer

## Customization

### App Icon

1. Create a 256x256 PNG icon
2. Convert to `.ico` format
3. Save as `resources/icon.ico`
4. Rebuild the app

### Styling

The app uses Tailwind CSS. Modify colors and styles in:

- [tailwind.config.js](tailwind.config.js) - Theme configuration
- [src/index.css](src/index.css) - Global styles
- Component files - Component-specific styles

## Technologies

- **Electron** 28+ - Desktop app framework
- **React** 18+ - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Sharp** - Image processing
- **Zustand** - State management
- **Tailwind CSS** - Styling

## License

MIT
