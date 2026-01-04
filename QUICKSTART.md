# QuickCompress - Quick Start Guide

## Get Started in 3 Steps

### 1. Run the Development App

```bash
npm start
```

This will launch the application in development mode. The app window will open automatically.

### 2. Test the App

1. Drag and drop some JPG or PNG images into the app
2. Adjust the quality slider
3. Click "Compress" button
4. Check the source folder - you'll find `_comp.jpg` files next to originals

### 3. Create Windows Installer (Optional)

```bash
npm run package
```

Find the installer in `release/QuickCompress-Setup-1.0.0.exe`

## Common Issues

### Issue: `npm start` fails

**Solution**: Make sure you ran `npm install` first

### Issue: App window is blank

**Solution**:

- Wait a few seconds for Vite to start
- Check the terminal for the Vite dev server URL
- Make sure port 5173 is not in use

### Issue: Compression fails

**Solution**:

- Make sure the files are actual JPG/PNG images
- Check that you have write permission in the source folder
- Try with smaller images first

### Issue: Can't find compressed files

**Solution**:

- Compressed files are saved in the SAME folder as the original
- Look for files ending with `_comp.jpg`
- Example: If you compress `C:\Photos\sunset.jpg`, the output will be `C:\Photos\sunset_comp.jpg`

## Adding a Custom Icon

1. Create a 256x256 PNG icon
2. Convert to ICO format using: https://convertio.co/png-ico/
3. Save as `resources/icon.ico`
4. Run `npm run package` again

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the UI in `src/components/`
- Modify compression settings in `electron/services/compressionService.ts`
- Change the color scheme in `tailwind.config.js`

## Project Files Overview

### Key Files to Understand:

- [electron/main.ts](electron/main.ts) - Electron app entry point
- [electron/services/compressionService.ts](electron/services/compressionService.ts) - Image compression logic
- [src/App.tsx](src/App.tsx) - Main React component
- [src/store/useImageStore.ts](src/store/useImageStore.ts) - App state management

### To Change UI:

- [src/components/](src/components/) - All UI components
- [src/index.css](src/index.css) - Global styles
- [tailwind.config.js](tailwind.config.js) - Theme colors

### To Change Compression:

- [electron/services/compressionService.ts](electron/services/compressionService.ts) - Adjust quality mapping or Sharp settings

## Development Tips

1. **Hot Reload**: Changes to React components reload automatically
2. **DevTools**: The app opens with Chrome DevTools in development mode
3. **Debugging**: Use `console.log()` - outputs appear in the DevTools console
4. **State**: Use Zustand DevTools browser extension to inspect state

Enjoy building with QuickCompress!
