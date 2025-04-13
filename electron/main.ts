import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged;

const createWindow = async () => {
  try {
    console.log('Creating window...');
    
    // Get the primary display
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    // Create window centered on primary display with phone-like dimensions
    mainWindow = new BrowserWindow({
      width: 375,  // Standard mobile viewport width
      height: 667,  // Typical mobile viewport height (iPhone 6/7/8)
      minWidth: 150,  // Minimum width as specified
      minHeight: 165,  // Minimum height as specified
      x: Math.floor((width - 375) / 2),
      y: Math.floor((height - 667) / 2),
      show: true,
      frame: true,
      skipTaskbar: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    console.log('Primary display:', {
      size: primaryDisplay.size,
      workArea: primaryDisplay.workArea,
      scaleFactor: primaryDisplay.scaleFactor
    });

    // Enable DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    console.log('Window created with ID:', mainWindow.id);
    console.log('Window bounds:', mainWindow.getBounds());

    // Load content
    if (isDev) {
      console.log('Loading development server...');
      await mainWindow.loadURL('http://localhost:5173');
      console.log('Connected to Vite dev server');
    } else {
      console.log('Loading production build...');
      await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
      console.log('Loaded production build');
    }

    // Window event handlers
    mainWindow.on('show', () => {
      console.log('Window show event fired');
    });

    mainWindow.on('ready-to-show', () => {
      console.log('Window ready-to-show event fired');
    });

    mainWindow.on('closed', () => {
      console.log('Window closed');
      mainWindow = null;
    });

    // Check window visibility
    console.log('Window visibility state:', {
      isVisible: mainWindow.isVisible(),
      isMinimized: mainWindow.isMinimized(),
      isFocused: mainWindow.isFocused()
    });

  } catch (e) {
    console.error('Error in createWindow:', e);
    if (mainWindow) {
      mainWindow.destroy();
    }
    throw e;
  }

  return mainWindow;
};

app.on('ready', async () => {
  console.log('App is ready');
  try {
    await createWindow();
    console.log('Window created successfully');
  } catch (e) {
    console.error('Failed to create window:', e);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  console.log('App activated');
  if (!mainWindow) {
    try {
      await createWindow();
      console.log('Window created on activate');
    } catch (e) {
      console.error('Failed to create window on activate:', e);
    }
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (mainWindow) {
    mainWindow.destroy();
  }
  app.quit();
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  if (mainWindow) {
    mainWindow.destroy();
  }
  app.quit();
});
