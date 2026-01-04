# QuickCompress - Build & Distribution Guide

This guide will help you create a distributable installer that your friends can install on their Windows computers.

## Table of Contents

1. [Adding a Custom Icon](#adding-a-custom-icon)
2. [Building the Installer](#building-the-installer)
3. [Distributing to Friends](#distributing-to-friends)
4. [Context Menu Feature](#context-menu-feature)

---

## Adding a Custom Icon

### Step 1: Create or Find an Icon

You need a **256x256** pixel PNG image for your app icon. You can:

- Design one yourself
- Use a free icon from [Icons8](https://icons8.com) or [Flaticon](https://www.flaticon.com)
- Use an AI tool like DALL-E or Midjourney

**Icon Suggestion**: Create an icon that represents compression (e.g., stacked images, down arrow, compression symbol)

### Step 2: Convert PNG to ICO Format

1. Go to an online converter: https://convertio.co/png-ico/
2. Upload your 256x256 PNG file
3. Download the converted `.ico` file
4. Name it `icon.ico`

### Step 3: Add Icon to Your Project

```bash
# Place the icon file here:
QuickCompress_2/resources/icon.ico
```

Also create a PNG version for notifications:

```bash
# Copy your original PNG here:
QuickCompress_2/resources/icon.png
```

That's it! The icon will automatically be used when you build the installer.

---

## Building the Installer

### Prerequisites

Make sure you have:

- Node.js installed (you already have this)
- All dependencies installed (`npm install`)

### Build Steps

#### 1. Build the Application

```bash
npm run build
```

This compiles both the React frontend and Electron backend.

#### 2. Create the Windows Installer

```bash
npm run package
```

This will:

- ✅ Build the complete application
- ✅ Create a Windows installer (.exe)
- ✅ Include your icon
- ✅ Set up context menu integration
- ✅ Create Start menu shortcuts

**Build time**: ~2-5 minutes (first build may take longer)

#### 3. Find Your Installer

The installer will be created in:

```
QuickCompress_2/release/QuickCompress-Setup-1.0.0.exe
```

**File size**: ~150-200 MB (includes all dependencies)

---

## Distributing to Friends

### Option 1: Direct File Sharing

1. Locate the installer:

   ```
   QuickCompress_2/release/QuickCompress-Setup-1.0.0.exe
   ```

2. Share via:
   - Google Drive
   - Dropbox
   - WeTransfer
   - USB drive

3. Send installation instructions (see below)

### Option 2: Cloud Storage with Link

**Recommended: Google Drive**

1. Upload `QuickCompress-Setup-1.0.0.exe` to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy the link
4. Share with friends

### Installation Instructions for Friends

Send this to your friends:

```
📦 QuickCompress Installation

1. Download QuickCompress-Setup-1.0.0.exe
2. Double-click the installer
3. If Windows shows "Unknown publisher" warning:
   - Click "More info"
   - Click "Run anyway"
4. Follow the installation wizard
5. Done! Find QuickCompress in Start menu

Features:
- Right-click any JPG/PNG image → "Compress with QuickCompress"
- Or open the app and drag & drop images
```

---

## Context Menu Feature

### How It Works

After installation, users can:

1. Right-click any JPG or PNG image
2. Select "Compress with QuickCompress"
3. Image compresses instantly in the background
4. Windows notification shows success
5. Compressed file appears as `filename_comp.jpg`

### Manual Installation (If Needed)

If the context menu doesn't appear automatically:

1. Navigate to installation folder:

   ```
   C:\Program Files\QuickCompress\resources\scripts\
   ```

2. Right-click `install-context-menu.reg`
3. Click "Merge"
4. Click "Yes" to confirm

### Removing Context Menu

To uninstall the context menu:

1. Go to:

   ```
   C:\Program Files\QuickCompress\resources\scripts\
   ```

2. Right-click `uninstall-context-menu.reg`
3. Click "Merge"

---

## Updating the Version

To create a new version:

1. Edit `package.json`:

   ```json
   {
     "version": "1.1.0"
   }
   ```

2. Rebuild:

   ```bash
   npm run package
   ```

3. New installer will be:
   ```
   QuickCompress-Setup-1.1.0.exe
   ```

---

## Troubleshooting

### Build Fails

**Error**: `sharp` build errors

**Solution**:

```bash
npm rebuild sharp
npm run build
npm run package
```

### Icon Doesn't Show

**Problem**: Icon appears as default Electron icon

**Solution**:

1. Make sure `icon.ico` exists in `resources/`
2. Rebuild: `npm run package`

### Context Menu Missing

**Problem**: Right-click menu doesn't show QuickCompress

**Solution**:

1. Run as administrator: `install-context-menu.reg`
2. Or reinstall the application

### Installer is Too Large

**Note**: The installer is large (~150-200 MB) because it includes:

- Electron runtime
- Sharp image processing library
- Node.js runtime

This is normal for Electron apps. Users only download once.

---

## Advanced: Code Signing (Optional)

To remove Windows security warnings, you can sign your app with a code signing certificate:

1. Purchase a code signing certificate (~$100-300/year)
   - Sectigo
   - DigiCert
   - SignPath (free for open source)

2. Add to `package.json`:
   ```json
   "win": {
     "certificateFile": "path/to/certificate.pfx",
     "certificatePassword": "your-password"
   }
   ```

This is optional but makes your app look more professional.

---

## Summary Checklist

Before distributing:

- [ ] Add custom icon (`resources/icon.ico` and `resources/icon.png`)
- [ ] Test the app locally (`npm start`)
- [ ] Build the installer (`npm run package`)
- [ ] Test the installer on your machine
- [ ] Test context menu feature
- [ ] Upload to cloud storage
- [ ] Share link with friends
- [ ] Send installation instructions

That's it! You now have a professional Windows application ready to share.

---

## Need Help?

Common issues:

1. **Build fails** → Try `npm install` again
2. **Icon missing** → Check file paths and rebuild
3. **Context menu not working** → Run registry file as admin
4. **App won't start** → Check if Sharp compiled correctly

For more help, check the main [README.md](README.md)
