const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("nostalgic", {
    updateStyle: (callback) => ipcRenderer.on("LiteLoader.nostalgic.updateStyle", callback),
    reSize: () => ipcRenderer.send("LiteLoader.nostalgic.reSize"),
    rendererReady: () => ipcRenderer.send("LiteLoader.nostalgic.rendererReady"),
    getSettings: () => ipcRenderer.invoke("LiteLoader.nostalgic.getSettings"),
    setSettings: content => ipcRenderer.invoke("LiteLoader.nostalgic.setSettings", content),
    logToMain: (...args) => ipcRenderer.invoke("LiteLoader.nostalgic.logToMain", ...args),
});
