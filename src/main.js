const { BrowserWindow, ipcMain ,webContents} = require('electron')
const fs = require('fs')
const path = require('path')

let userInfo=undefined

function log(...args) {
    console.log(`\x1b[35m[QQ怀旧模式]\x1b[0m`, ...args);
}
let mainWindow
function updateStyle(webContent, settingsPath,winStyle) {

    try {
        // 读取settings.json
        const data = fs.readFileSync(settingsPath, "utf-8");
        const config = JSON.parse(data);
        const useOldTheme = config.useOldTheme;
        const themeColor = config.themeColor;
        const themeColor2 = config.themeColor2;
        const themeColor3 = config.themeColor3;
        const textOpacity = config.backgroundOpacity/100;
        const textOpacityHex = Math.round(config.backgroundOpacity * 2.55).toString(16).padStart(2, "0");
        let csspath = path.join(__dirname, "/settings/style.css");
        if(winStyle=='Big'){
            csspath = path.join(__dirname, "/settings/styleBig.css");
        }
        fs.readFile(csspath, "utf-8", (err, data) => {
            if (err) {
                console.error(err.message)
                return;
            }
            let preloadString = ''
            if (useOldTheme) {
                preloadString = `:root {
                    --header-oldTheme-color: ${themeColor};
                    --header-oldTheme-color2: ${themeColor2};
                    --header-oldTheme-color3: ${themeColor3};
                    --header-oldTheme-color3-opacity: ${textOpacity};
                    --header-oldTheme-color-linear:linear-gradient(-20deg,${themeColor} 0%, ${themeColor2} 100%);
                    --header-oldTheme-text-color: ${themeColor3}${textOpacityHex};
                    --header-oldTheme-theme-tag-color: ${themeColor + "3f"};
                    --header-oldTheme-text-selected-color: ${themeColor + "7f"};
                }`

            }
            //向渲染进程发送updateStyle消息
            if(mainWindow){
                mainWindow.webContents.send(
                    "LiteLoader.nostalgic.updateStyle",
                    preloadString + "\n\n" + data
                );
            }else{
             webContents.getAllWebContents().forEach((webContent) => {
                    webContent.send(
                        "LiteLoader.nostalgic.updateStyle",
                        preloadString + "\n\n" + data
                    );
                });
            }

         });
    } catch (error) {
        log(error.message)
    }

}
// 加载插件时触发
const pluginDataPath = LiteLoader.plugins["nostalgic"].path.data;
const settingsPath = path.join(pluginDataPath, "settings.json");

// fs判断插件路径是否存在，如果不存在则创建（同时创建父目录（如果不存在的话））
if (!fs.existsSync(pluginDataPath)) {
    fs.mkdirSync(pluginDataPath, { recursive: true });
}
// 判断settings.json是否存在，如果不存在则创建
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
        "useOldTheme": true,
        "themeColor": "#21d4fd",
        "themeColor2":"#3316c5",
        "themeColor3":"#ffffff",
        "backgroundOpacity": "85",
        "isDebug":false,
        "useOldThemeWin":true,
        "hideSwitchBtn":true,
        "useOldThemeMegList":false
    }));
} else {

    const data = fs.readFileSync(settingsPath, "utf-8");
    const config = JSON.parse(data);
    if (!config.useOldTheme) {
        config.useOldTheme = false;
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
    if (!config.themeColor) {
        config.themeColor =  "#21d4fd";
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
    if (!config.themeColor2) {
        config.themeColor2 = "#3316c5";
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
    if (!config.themeColor3) {
        config.themeColor3 = "#ffffff";
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
    if (!config.backgroundOpacity) {
        config.backgroundOpacity = "90";
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }

    if (config.useOldThemeWin==undefined||config.useOldThemeWin==null) {
        config.useOldThemeWin = true;
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
    if (config.useOldThemeMegList==undefined||config.useOldThemeMegList==null) {
        config.useOldThemeMegList = true;
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }

    if (config.hideSwitchBtn==undefined||config.hideSwitchBtn==null) {
        config.hideSwitchBtn = true;
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
     if (!config.isDebug) {
        config.isDebug = false;
        fs.writeFileSync(settingsPath, JSON.stringify(config));
    }
}

// 监听渲染进程的rendererReady事件
ipcMain.on(
    "LiteLoader.nostalgic.rendererReady",
    (event, message) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        updateStyle(window.webContents, settingsPath);
    }
);

// 监听渲染进程的updateStyleExt事件
ipcMain.on(
    "LiteLoader.nostalgic.updateStyleExt",
    (event, winStyle) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        const settingsPath = path.join(pluginDataPath, "settings.json");
        updateStyle(window.webContents, settingsPath,winStyle);
    });

// 监听渲染进程的watchCSSChange事件
ipcMain.on(
    "LiteLoader.nostalgic.watchCSSChange",
    (event, settingsPath) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        watchCSSChange(window.webContents, settingsPath);
    });

// 监听渲染进程的watchSettingsChange事件
ipcMain.on(
    "LiteLoader.nostalgic.watchSettingsChange",
    (event, settingsPath) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        watchSettingsChange(window.webContents, settingsPath);
    });

ipcMain.handle(
    "LiteLoader.nostalgic.getSettings",
    (event, message) => {
        try {
            //log("LiteLoader.nostalgic.getSettings",userInfo)
            const data = fs.readFileSync(settingsPath, "utf-8");
            const config = JSON.parse(data);
            return config;
        } catch (error) {
            log(error);
            return {};
        }
    }
);

ipcMain.handle(
    "LiteLoader.nostalgic.setSettings",
    (event, content) => {
        try {
            const new_config = JSON.stringify(content);
            fs.writeFileSync(settingsPath, new_config, "utf-8");
        } catch (error) {
            log(error);
        }
    }
);

ipcMain.handle(
    "LiteLoader.nostalgic.logToMain",
    (event, ...args) => {
        log(...args);
    }
);
ipcMain.handle(
    "LiteLoader.nostalgic.getProfileDetailInfo",
    (event) => {
        return userInfo;
    }
);

// 防抖函数
function debounce(fn, time) {
    let timer = null;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
}
//监听文件修改（开发时使用）
function watchCSSChange(webContents, settingsPath) {
    const filepath = path.join(__dirname, "/settings/style.css");
    watcherStyleFile= fs.watchFile(filepath,{interval: 20}, debounce(() => {
        updateStyle(webContents, settingsPath);
    }, 100));
}

ipcMain.handle(
    "LiteLoader.nostalgic.setDebug",
    (event, open) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        const filepath = path.join(__dirname, "/settings/style.css");
        open?watchCSSChange(window.webContents, settingsPath):(fs.unwatchFile(filepath),null);
});

// 监听配置文件修改
function watchSettingsChange(webContents, settingsPath) {
    fs.watch(settingsPath, "utf-8", debounce(() => {
        updateStyle(webContents, settingsPath);
    }, 100));
}

// 创建窗口时触发
module.exports.onBrowserWindowCreated = window => {

    const original_send = window.webContents.send;
    const patched_send = (channel, ...args) => {
        if(JSON.stringify(args).includes('nodeIKernelProfileListener/onProfileDetailInfoChanged')){
            //console.log(args?.[1]?.[0]?.payload.info,JSON.stringify(args?.[1]?.[0]?.payload))
            userInfo=args?.[1]?.[0]?.payload.info
           // log("用户信息更新",userInfo)
        }
        return original_send.call(window.webContents, channel, ...args);
    };
    window.webContents.send = patched_send;
    window.webContents.on("did-stop-loading", () => {
        if (window.webContents.getURL().indexOf("#/main/message") !== -1) {

            mainWindow = window;
             
            mainWindow.setMinimumSize(280, 600);
            //  mainWindow.setMaximumSize(400, 9999);
            // mainWindow.setResizable(false);
        }
    });
    const settingsPath = path.join(pluginDataPath, "settings.json");
    window.on("ready-to-show", () => {
        const url = window.webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            const data = fs.readFileSync(settingsPath, "utf-8");
            const config = JSON.parse(data);

            config.isDebug && watchCSSChange(window.webContents, settingsPath);
            watchSettingsChange(window.webContents, settingsPath);
        }
    });

}
