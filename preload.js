const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("keyboardTester", {
  version: "1.0.0"
});
