const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("keyboardTester", {
  version: "1.0.0",
  onMediaKey: (callback) => {
    ipcRenderer.on("media-key", (_event, payload) => {
      callback(payload);
    });
  }
});
