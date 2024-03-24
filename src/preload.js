const { contextBridge, ipcRenderer } = require('electron')


//on 监听主进程发来的消息
//send 用于向主进程发送消息
//invoke 发起异步调用到主进程，并等待返回结果
contextBridge.exposeInMainWorld("nostalgic", {

    updateStyle: (callback) => ipcRenderer.on("LiteLoader.nostalgic.updateStyle", callback),
    updateUserinfo: (callback) => ipcRenderer.on("LiteLoader.nostalgic.updateUserinfo", callback),
    updateWindowResize: (callback) => ipcRenderer.on("LiteLoader.nostalgic.updateWindowResize", callback),
    updateStyleExt: (winStyle) => ipcRenderer.send("LiteLoader.nostalgic.updateStyleExt", winStyle),
    reSize: () => ipcRenderer.send("LiteLoader.nostalgic.reSize"),
    rendererReady: () => ipcRenderer.send("LiteLoader.nostalgic.rendererReady"),
    getSettings: () => ipcRenderer.invoke("LiteLoader.nostalgic.getSettings"),
    getProfileDetailInfo:() => ipcRenderer.invoke("LiteLoader.nostalgic.getProfileDetailInfo"),
    setSettings: content => ipcRenderer.invoke("LiteLoader.nostalgic.setSettings", content),
    logToMain: (...args) => ipcRenderer.invoke("LiteLoader.nostalgic.logToMain", ...args),
    setDebug: open => ipcRenderer.invoke("LiteLoader.nostalgic.setDebug", open),
});
