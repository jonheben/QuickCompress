# What's New - Context Menu & CLI Features

## New Features Added! 🎉

### 1. Right-Click Context Menu Integration

**What it does**: Compress images without opening the app!

**How to use**:

1. Right-click any JPG or PNG image in Windows Explorer
2. Click "Compress with QuickCompress"
3. Done! Compressed version appears in same folder

**Features**:

- ⚡ Instant compression
- 📢 Windows notification shows success
- 🎯 Fixed 75% quality (optimal balance)
- 📁 Output: `filename_comp.jpg`

**Installation**: Automatically installs with the app installer

---

### 2. Command-Line Interface (CLI)

**What it does**: Compress images from command line or scripts

**Basic usage**:

```bash
QuickCompress.exe --compress "C:\Photos\vacation.jpg"
```

**With custom quality**:

```bash
QuickCompress.exe --compress "C:\Photos\vacation.jpg" --quality 85
```

**Perfect for**:

- Automation scripts
- Batch processing
- Integration with other tools
- Power users

---

## How Context Menu Works

### Installation Process

When you install QuickCompress, the installer:

1. Installs the application
2. Adds registry entries for JPG, JPEG, and PNG files
3. Creates context menu shortcuts
4. No manual setup needed!

### Behind the Scenes

When you right-click → "Compress with QuickCompress":

1. Windows runs: `QuickCompress.exe --compress "filepath" --quality 75`
2. App compresses in background (no window)
3. Shows notification when done
4. Exits automatically

### Uninstallation

Uninstalling QuickCompress automatically removes the context menu entries.

---

## Technical Details

### Files Added

```
scripts/
├── install-context-menu.reg    # Manual installer (if needed)
├── uninstall-context-menu.reg  # Manual uninstaller
└── installer.nsh               # NSIS script for auto-install
```

### Registry Keys

The installer creates these Windows registry entries:

```
HKEY_CLASSES_ROOT\
  SystemFileAssociations\
    .jpg\shell\QuickCompress\
    .jpeg\shell\QuickCompress\
    .png\shell\QuickCompress\
```

### Code Changes

**New Files**:

- `scripts/install-context-menu.reg` - Registry template
- `scripts/uninstall-context-menu.reg` - Cleanup template
- `scripts/installer.nsh` - NSIS installation script

**Modified Files**:

- `electron/main.ts` - Added CLI argument parsing
- `package.json` - Updated build configuration

---

## Usage Examples

### Example 1: Quick Single Image

```
1. Find image in Windows Explorer
2. Right-click → "Compress with QuickCompress"
3. ✓ Done! (1-2 seconds)
```

### Example 2: Batch Script

Create `compress-all.bat`:

```batch
@echo off
for %%f in (*.jpg) do (
    "C:\Program Files\QuickCompress\QuickCompress.exe" --compress "%%f"
)
```

Run this in any folder to compress all JPG files!

### Example 3: PowerShell Automation

```powershell
# Compress all images in a folder
Get-ChildItem "C:\Photos" -Filter *.jpg | ForEach-Object {
    & "C:\Program Files\QuickCompress\QuickCompress.exe" --compress $_.FullName --quality 80
}
```

### Example 4: Scheduled Task

Automatically compress images dropped in a folder:

1. Create folder: `C:\Auto-Compress\`
2. Create PowerShell script to monitor folder
3. Add Windows Task Scheduler job
4. Auto-compress any image placed there!

---

## Comparison: Before vs After

### Before (v1.0.0)

- ✅ Drag & drop GUI
- ✅ Batch processing
- ✅ Quality slider
- ❌ Had to open app every time
- ❌ No automation support

### After (v1.0.1 - Current)

- ✅ Everything from before, PLUS:
- ✅ Right-click context menu
- ✅ Command-line support
- ✅ Background compression
- ✅ Windows notifications
- ✅ Automation-ready
- ✅ No need to open app for quick jobs

---

## User Benefits

### For Casual Users

- **Faster**: Right-click → Done (vs opening app)
- **Simpler**: No UI to navigate
- **Convenient**: Compress while browsing files

### For Power Users

- **Scriptable**: Automate with batch/PowerShell
- **Integrable**: Use in workflows
- **Efficient**: Background processing

### For Everyone

- **Flexible**: Use GUI when needed, CLI when convenient
- **Reliable**: Same compression engine
- **Safe**: Original files never touched

---

## Troubleshooting

### Context Menu Not Appearing

**Cause**: Registry not updated

**Fix**:

1. Go to: `C:\Program Files\QuickCompress\resources\scripts\`
2. Right-click `install-context-menu.reg`
3. Click "Merge"
4. Click "Yes" to confirm
5. Restart File Explorer (or reboot)

### CLI Not Working

**Cause**: Wrong path or permissions

**Fix**:

```bash
# Use full path
"C:\Program Files\QuickCompress\QuickCompress.exe" --compress "C:\full\path\to\image.jpg"

# Check file exists
dir "C:\Program Files\QuickCompress\QuickCompress.exe"
```

### Notification Not Showing

**Cause**: Windows notifications disabled

**Fix**:

1. Settings → System → Notifications
2. Find QuickCompress
3. Enable notifications

---

## Advanced Tips

### Tip 1: Custom Quality in Context Menu

Want different default quality? Edit the registry:

1. Press `Win + R` → type `regedit`
2. Navigate to:
   ```
   HKEY_CLASSES_ROOT\SystemFileAssociations\.jpg\shell\QuickCompress\command
   ```
3. Change `--quality 75` to your preferred value (e.g., `--quality 90`)

### Tip 2: Batch Compression

Select multiple files in Explorer:

- Each right-click compresses one file
- OR use PowerShell for true batch:

```powershell
$files = Get-ChildItem *.jpg
foreach ($file in $files) {
    & "C:\Program Files\QuickCompress\QuickCompress.exe" --compress $file.FullName
}
```

### Tip 3: Different Folders

Want compressed files in different folder?

Currently not supported via context menu, but you can:

1. Use full app with custom output folder feature (future update)
2. Use PowerShell script to move files after compression

---

## Future Improvements

Ideas for next version:

- [ ] "Compress to folder..." option in context menu
- [ ] Multiple quality presets in context menu
- [ ] Progress bar for large files
- [ ] Drag multiple files onto app icon
- [ ] Watch folder for auto-compression
- [ ] More output formats (WebP, AVIF)
- [ ] Resize option in CLI
- [ ] Compress and email option

---

## Feedback Welcome!

Using the new features? Let us know:

- What works well?
- What could be better?
- What features would you like?

Your feedback helps make QuickCompress better!

---

## Summary

**What changed**: Added right-click context menu and CLI support

**Why it matters**: Faster, more convenient, automation-ready

**How to use**:

1. **Quick**: Right-click image → Compress
2. **Scripted**: `QuickCompress.exe --compress "file.jpg"`
3. **Traditional**: Open app and drag & drop

**Installation**: Just run the new installer - everything auto-configures!

Enjoy the new features! 🚀
