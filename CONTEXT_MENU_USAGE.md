# QuickCompress Context Menu - User Guide

## What is the Context Menu Feature?

After installing QuickCompress, you can compress images directly from Windows Explorer without opening the app!

---

## How to Use

### Method 1: Right-Click Compression (After Installation)

1. Find any JPG or PNG image in File Explorer
2. Right-click on the image
3. Click **"Compress with QuickCompress"**
4. Done! The compressed image appears in the same folder as `filename_comp.jpg`

**Visual Guide**:

```
Your Photo.jpg
    ↓ (right-click)
[Context Menu]
├── Open
├── Edit
├── Print
└── Compress with QuickCompress  ← Click this!
    ↓
Your Photo_comp.jpg created! ✓
```

### Method 2: Open the Full App

1. Double-click the image (or any image)
2. Click "Compress with QuickCompress" from context menu
   - OR -
3. Press Windows key, type "QuickCompress"
4. Drag & drop images
5. Adjust quality slider
6. Click "Compress"

---

## Features

### Automatic Compression

- **Quality**: Fixed at 75% (good balance of size/quality)
- **Speed**: Instant for most images (1-2 seconds)
- **Format**: Always outputs `.jpg`
- **Naming**: Original stays untouched, compressed version gets `_comp` suffix

### Notifications

After compression, you'll see a Windows notification showing:

- ✓ Success message
- 💾 Space saved percentage

---

## Examples

### Before:

```
📁 My Photos/
    └── vacation.jpg (5.2 MB)
```

### Right-click → Compress:

```
📁 My Photos/
    ├── vacation.jpg (5.2 MB)      ← Original
    └── vacation_comp.jpg (1.1 MB) ← Compressed (79% smaller!)
```

---

## Command Line Usage (Advanced)

You can also use QuickCompress from the command line or in scripts:

```bash
# Basic compression (75% quality)
QuickCompress.exe --compress "C:\Photos\image.jpg"

# Custom quality (0-100)
QuickCompress.exe --compress "C:\Photos\image.jpg" --quality 85

# Batch compression (in PowerShell)
Get-ChildItem *.jpg | ForEach-Object {
    & "C:\Program Files\QuickCompress\QuickCompress.exe" --compress $_.FullName
}
```

---

## Customizing Quality

The default context menu uses 75% quality. To change it:

### Option 1: Edit Registry (Advanced)

1. Press `Windows + R`
2. Type `regedit` and press Enter
3. Navigate to:
   ```
   HKEY_CLASSES_ROOT\SystemFileAssociations\.jpg\shell\QuickCompress\command
   ```
4. Change `--quality 75` to your preferred value (0-100)
5. Repeat for `.jpeg` and `.png`

### Option 2: Use the Full App

For one-time custom quality:

1. Open QuickCompress app
2. Drag & drop image
3. Adjust slider
4. Compress

---

## Troubleshooting

### Context Menu Not Showing

**Solution 1**: Reinstall the app

- Uninstall QuickCompress
- Reinstall from the .exe installer

**Solution 2**: Manual registry install

1. Go to: `C:\Program Files\QuickCompress\resources\scripts\`
2. Right-click `install-context-menu.reg`
3. Click "Merge"
4. Click "Yes"

### Notification Doesn't Appear

- Check Windows notification settings
- Make sure notifications are enabled for QuickCompress

### Compressed File Not Created

- Check you have write permission in the folder
- Check the original file is actually JPG/PNG
- Check disk space is available

### "Windows protected your PC" Warning

This appears for apps without code signing (expensive for developers).

**To install**:

1. Click "More info"
2. Click "Run anyway"

Your app is safe - Windows just doesn't recognize the publisher.

---

## Tips & Tricks

### Tip 1: Batch Compress

Select multiple images → Right-click one → "Compress with QuickCompress"
(Note: Current version compresses one at a time, but you can queue them)

### Tip 2: Before/After Comparison

1. Right-click image → Properties
2. Note the file size
3. Compress it
4. Right-click `_comp` version → Properties
5. Compare sizes!

### Tip 3: Web Optimization

For website images:

- Use 60-75% quality (smaller files)
- For print: Use 85-95% quality (better quality)

### Tip 4: Keep Originals

QuickCompress never deletes your original images - they're always safe!

---

## Uninstalling Context Menu

If you uninstall QuickCompress, the context menu should auto-remove.

If it doesn't:

1. Go to: `C:\Program Files\QuickCompress\resources\scripts\`
2. Right-click `uninstall-context-menu.reg`
3. Click "Merge"

Or manually:

1. Press `Windows + R` → type `regedit`
2. Delete these keys:
   - `HKEY_CLASSES_ROOT\SystemFileAssociations\.jpg\shell\QuickCompress`
   - `HKEY_CLASSES_ROOT\SystemFileAssociations\.jpeg\shell\QuickCompress`
   - `HKEY_CLASSES_ROOT\SystemFileAssociations\.png\shell\QuickCompress`

---

## Support

Having issues? Try these:

1. **Restart File Explorer**:
   - Right-click taskbar → Task Manager
   - Find "Windows Explorer"
   - Click "Restart"

2. **Reinstall the app**:
   - Often fixes all context menu issues

3. **Check app is installed**:
   - Should be in: `C:\Program Files\QuickCompress\`

---

## Comparison: Context Menu vs Full App

| Feature            | Context Menu  | Full App     |
| ------------------ | ------------- | ------------ |
| Speed              | ⚡ Instant    | Fast         |
| Quality Control    | Fixed (75%)   | ✓ Adjustable |
| Batch Processing   | One at a time | ✓ Multiple   |
| Preview            | ✗ No          | ✓ Yes        |
| Before/After Stats | ✗ No          | ✓ Yes        |
| Convenience        | ✓✓✓ Best      | Good         |

**Best for**:

- **Context Menu**: Quick single-image compression
- **Full App**: Batch processing, quality control, seeing results

---

Enjoy QuickCompress! 🎉
