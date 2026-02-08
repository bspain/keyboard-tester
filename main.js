const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
let mainWindow;

const mediaShortcuts = [
  { accelerator: "VolumeMute", code: "MediaMute", label: "Mute" },
  { accelerator: "VolumeDown", code: "MediaVolumeDown", label: "Vol-" },
  { accelerator: "VolumeUp", code: "MediaVolumeUp", label: "Vol+" },
  { accelerator: "MediaPlayPause", code: "MediaPlayPause", label: "Play" },
  { accelerator: "MediaPreviousTrack", code: "MediaPreviousTrack", label: "Prev" },
  { accelerator: "MediaNextTrack", code: "MediaNextTrack", label: "Next" }
];

const registerMediaShortcuts = (win) => {
  mediaShortcuts.forEach(({ accelerator, code, label }) => {
    globalShortcut.register(accelerator, () => {
      if (!win || win.isDestroyed()) return;
      win.webContents.send("media-key", { code, label });
    });
  });
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 520,
    resizable: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "index.html"));
  return win;
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  mainWindow = createWindow();
  registerMediaShortcuts(mainWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
      registerMediaShortcuts(mainWindow);
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
