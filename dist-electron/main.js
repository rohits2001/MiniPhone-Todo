"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
let mainWindow = null;
const isDev = !electron_1.app.isPackaged;
const createWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating window...');
        // Get the primary display
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;
        // Create window centered on primary display with phone-like dimensions
        mainWindow = new electron_1.BrowserWindow({
            width: 375, // Standard mobile viewport width
            height: 667, // Typical mobile viewport height (iPhone 6/7/8)
            minWidth: 150, // Minimum width as specified
            minHeight: 165, // Minimum height as specified
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
            yield mainWindow.loadURL('http://localhost:5173');
            console.log('Connected to Vite dev server');
        }
        else {
            console.log('Loading production build...');
            yield mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
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
    }
    catch (e) {
        console.error('Error in createWindow:', e);
        if (mainWindow) {
            mainWindow.destroy();
        }
        throw e;
    }
    return mainWindow;
});
electron_1.app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('App is ready');
    try {
        yield createWindow();
        console.log('Window created successfully');
    }
    catch (e) {
        console.error('Failed to create window:', e);
        electron_1.app.quit();
    }
}));
electron_1.app.on('window-all-closed', () => {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('App activated');
    if (!mainWindow) {
        try {
            yield createWindow();
            console.log('Window created on activate');
        }
        catch (e) {
            console.error('Failed to create window on activate:', e);
        }
    }
}));
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    if (mainWindow) {
        mainWindow.destroy();
    }
    electron_1.app.quit();
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    if (mainWindow) {
        mainWindow.destroy();
    }
    electron_1.app.quit();
});
