

const plugin_path = LiteLoader.plugins["nostalgic"].path.plugin;

function log(...args) {
  console.log(`[QQ怀旧模式]`, ...args);
  nostalgic.logToMain(...args);
}

const html_header_file_path = `local:///${plugin_path}/src/settings/header.html`;

let headerHTML = await (await fetch(html_header_file_path)).text();
const settings = await nostalgic.getSettings();
if (window.location.href.includes("app://./renderer/index.html")) {

  const findFuncMenuInterval = setInterval(() => {

    const funcMenu = document.querySelector('.func-menu')
    if (funcMenu) {
      clearInterval(findFuncMenuInterval)
      // 插入
      const topbar = document.querySelector('.contact-top-bar')
      try {
        if (LLAPI == undefined) {
          return
        }
        LLAPI.getAccountInfo().then((data) => {
          if (data.uid == undefined) {
            return
          }
          console.log(data)
          LLAPI.getUserInfo(data.uid).then((userinfo) => {
            console.log(userinfo)
            headerHTML = headerHTML.replace("{nickName}", userinfo?.nickName)
            headerHTML = headerHTML.replace("{bio}", userinfo?.bio || '这家伙很懒,什么也没留下')
            headerHTML = headerHTML.replace("{vip}", userinfo?.raw?.svipFlag ? 'svip' : (userinfo.raw?.vipFlag ? 'vip' : ''))
            // 页面加载完成时触发
            const element = document.createElement("style");
            element.id = "nostalgic-style"
            document.head.appendChild(element);
            nostalgic.updateStyle((event, message) => {
              element.textContent = message;
            });
            topbar.insertAdjacentHTML('afterbegin', headerHTML)
            document.querySelector('#app').insertAdjacentHTML('afterbegin', `<div class="nostalgic-qq-icon"><i class="q-icon icon"  style="--b4589f60: inherit;--6ef2e80d: 15px;"><svg t="1705867520276" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3650" width="14" height="14"><path d="M931.507451 840.8889c-23.05197 2.785996-89.719883-105.481862-89.719883-105.481862 0 62.689918-32.271958 144.493811-102.101866 203.571733 33.683956 10.383986 109.685856 38.33395 91.60588 68.84191-14.631981 24.685968-251.019672 15.761979-319.263582 8.07399-68.243911 7.68799-304.631601 16.611978-319.263582-8.07399-18.089976-30.49996 57.835924-58.427924 91.56588-68.82991-69.839909-59.077923-102.117866-140.889816-102.117866-203.583733 0 0-66.667913 108.267858-89.717883 105.481862-10.739986-1.299998-24.847967-59.287922 18.693975-199.407739 20.521973-66.047914 43.989942-120.955842 80.287895-211.557724C185.366427 196.125743 281.964301 0.012 512 0c227.473702 0.012 326.311573 192.265748 320.527581 429.925437 36.235953 90.445882 59.823922 145.699809 80.287894 211.555724 43.535943 140.119817 29.431961 198.105741 18.691976 199.407739z" p-id="3651" fill="#e6e6e6"></path></svg></i></div>`)
            const getHeadImgInterval = setInterval(() => {
              const headimgurl = document.querySelector('.avatar')?.style.backgroundImage
              if (!headimgurl.includes("renderer/img/default_avatar")) {
                clearInterval(getHeadImgInterval)
                document.querySelector(".nostalgic-user-avatar-img").style.backgroundImage = headimgurl
                let style = window.getComputedStyle(document.querySelector('.avatar__status'), null);
                document.querySelector(".nostalgic-user-avatar__status").style.backgroundImage = style?.backgroundImage
              }

            }, 200);

            nostalgic.rendererReady();
            //nostalgic.reSize()
            window.resizeTo(310, window.outerHeight < 650 ? 825 : window.outerHeight)

            if (!settings.initShow) {
              settings.initShow = true
              nostalgic.setSettings(settings);
              setTimeout(() => {
                alert("您已使用QQ怀旧模式,将鼠标放到头像上来显示侧栏＾-＾")
              }, 2000);

            }

            // 判断操作系统类型--未支持其它系统，待处理
            var osType = "";
            if (LiteLoader.os.platform === "win32") {
              osType = "windows";
            } else if (LiteLoader.os.platform === "linux") {
              osType = "linux";
            } else if (LiteLoader.os.platform === "darwin") {
              osType = "mac";
            }
            document.documentElement.classList.add(osType);

          })
        })
      } catch (error) {
        log("[渲染进程错误]", error);
      }
    }


  }, 100)

}

//定时更新头像和状态等
setInterval(() => {
  const funcMenu = document.querySelector('.func-menu')
  if (funcMenu) {
    try {
      const styleWin = document.querySelector('.two-col-layout__aside')?.style?.cssText??""
      const switchBtn = document.querySelector('path[d="M6 3H12.4C12.6965 3 12.8588 3.00078 12.9754 3.0103L12.9886 3.01145L12.9897 3.02463C12.9992 3.14122 13 3.30347 13 3.6V12.4C13 12.6965 12.9992 12.8588 12.9897 12.9754L12.9886 12.9886L12.9754 12.9897C12.8588 12.9992 12.6965 13 12.4 13H6L6 3ZM5 2H6H12.4C12.9601 2 13.2401 2 13.454 2.10899C13.6422 2.20487 13.7951 2.35785 13.891 2.54601C14 2.75992 14 3.03995 14 3.6V12.4C14 12.9601 14 13.2401 13.891 13.454C13.7951 13.6422 13.6422 13.7951 13.454 13.891C13.2401 14 12.9601 14 12.4 14H6H5H3.6C3.03995 14 2.75992 14 2.54601 13.891C2.35785 13.7951 2.20487 13.6422 2.10899 13.454C2 13.2401 2 12.9601 2 12.4V3.6C2 3.03995 2 2.75992 2.10899 2.54601C2.20487 2.35785 2.35785 2.20487 2.54601 2.10899C2.75992 2 3.03995 2 3.6 2H5ZM5 13H3.6C3.30347 13 3.14122 12.9992 3.02463 12.9897L3.01145 12.9886L3.0103 12.9754C3.00078 12.8588 3 12.6965 3 12.4V3.6C3 3.30347 3.00078 3.14122 3.0103 3.02463L3.01145 3.01145L3.02463 3.0103C3.14122 3.00078 3.30347 3 3.6 3H5L5 13Z"]')?.parentElement?.parentElement?.parentElement
      const areaBtn = document.querySelector('.window-control-area')
      const areaBtns = document.querySelectorAll('.window-control-area i')
      if (!styleWin?.includes("--max-width-aside: 320px")) {
        switchBtn?.style && (switchBtn.style.display = 'none')
        if (settings.useOldTheme) {
          areaBtn?.style && (areaBtn.style.backgroundColor = "none!important")
          for (let i = 0; i < areaBtns.length; i++) {
            areaBtns[i].style.color = "var(--header-oldTheme-background-color-light)"
          }
        }

      } else {
        switchBtn?.style && (switchBtn.style.display = '')
        if (settings.useOldTheme) {
          for (let i = 0; i < areaBtns.length; i++) {
            areaBtns[i].style.color &&= "var(--5f831aae)"
          }
          areaBtn?.style && (areaBtn.style.backgroundColor = "var( --header-oldTheme-color)!important")
        }
      }
      const headimgurl = document.querySelector('.avatar')?.style.backgroundImage
      if (!headimgurl.includes("renderer/img/default_avatar")) {
        document.querySelector(".nostalgic-user-avatar-img").style.backgroundImage = headimgurl
        const style = window.getComputedStyle(document.querySelector('.avatar__status'), null);
        document.querySelector(".nostalgic-user-avatar__status").style.backgroundImage = style?.backgroundImage
      }
    } catch (error) {
      log(error)
    }
  }


}, 1500)

// 打开设置界面时触发
export const onSettingWindowCreated = async view => {
  log("[设置]", "打开设置界面");
  try {
    //设置设置界面的图标
    document.querySelectorAll(".nav-item.liteloader").forEach(node => {
      if (node.textContent === "QQ怀旧模式") {
        node.classList.add("nostalgic")
        const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 1024 1024" width="16" fill="currentColor"><path 
        d="M802.952533 341.265067C798.378667 166.229333 673.792 34.747733 512.136533 34.133333 350.208 34.747733 225.621333 166.229333 221.047467 341.1968a154.897067 154.897067 0 0 0-29.696 117.623467C140.629333 520.260267 107.861333 582.656 102.673067 654.7456c-1.6384 34.269867 4.096 70.2464 19.2512 90.862933 25.8048 35.157333 62.190933 25.668267 93.047466-6.485333 4.778667 9.079467 10.0352 18.363733 15.906134 27.8528-47.035733 32.904533-64.3072 95.163733-36.181334 141.312 23.210667 38.0928 70.519467 59.665067 133.666134 59.665067 87.927467 0 146.773333-19.182933 183.637333-51.2 37.819733 32.290133 96.324267 51.2 183.637333 51.2 63.146667 0 110.455467-21.572267 133.597867-59.5968 28.125867-46.216533 10.922667-108.475733-36.181333-141.380267 5.9392-9.557333 11.264-18.773333 15.9744-27.8528 30.856533 32.085333 67.242667 41.642667 93.047466 6.485333 15.223467-20.6848 20.957867-56.661333 19.319467-90.112-5.188267-72.840533-37.956267-135.304533-88.746667-196.608a154.965333 154.965333 0 0 0-29.696-117.623466z m49.152 343.586133a152.234667 152.234667 0 0 1-19.2512-32.426667l-39.1168-86.698666-24.917333 91.818666c-7.7824 28.740267-24.849067 63.488-53.998933 103.424l-30.446934 41.642667 50.176 11.741867c33.1776 7.7824 47.445333 40.277333 36.386134 58.504533-9.489067 15.5648-34.2016 26.8288-75.3664 26.8288-76.1856 0-119.466667-15.428267-142.336-37.6832a55.978667 55.978667 0 0 0-41.1648-16.042667 56.661333 56.661333 0 0 0-42.120534 16.861867c-22.1184 21.435733-65.3312 36.864-141.585066 36.864-41.096533 0-65.877333-11.264-75.298134-26.8288-11.0592-18.158933 3.208533-50.722133 36.386134-58.504533l50.176-11.741867-30.446934-41.642667c-29.149867-39.867733-46.216533-74.683733-53.998933-103.424l-24.917333-91.818666-39.1168 86.698666a152.1664 152.1664 0 0 1-19.2512 32.426667 157.4912 157.4912 0 0 1-1.092267-26.0096c4.164267-58.368 35.293867-113.322667 83.899733-169.096533l13.858134-15.9744-8.055467-19.524267c-6.144-14.9504-2.730667-54.340267 18.8416-76.049067l10.8544-10.922666-1.024-15.36c0-144.1792 97.006933-249.0368 222.958933-249.514667 125.610667 0.477867 222.685867 105.335467 222.685867 248.763733 0 1.092267-1.024 16.110933-1.024 16.110934l10.8544 10.922666c21.572267 21.7088 25.053867 61.166933 18.8416 75.9808l-8.123733 19.592534 13.9264 15.9744c48.469333 55.569067 79.598933 110.523733 83.899733 169.437866 0.4096 8.533333-0.136533 17.749333-1.092267 25.668267z"
        /></svg>`
        node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
      }
    })
    const html_file_path = `local:///${plugin_path}/src/settings/main.html`;

    view.innerHTML = await (await fetch(html_file_path)).text();

    // 获取设置
    const settings = await nostalgic.getSettings();
    const themeColor = settings.themeColor;

    // 给pick-color(input)设置默认颜色
    const pickColor = view.querySelector(".pick-color");
    pickColor.value = themeColor;

    // 给pick-color(input)添加事件监听
    pickColor.addEventListener("change", (event) => {
      // 修改settings的themeColor值
      settings.themeColor = event.target.value;
      // 将修改后的settings保存到settings.json
      nostalgic.setSettings(settings);
    });

    // 背景颜色透明
    const backgroundOpacity = settings.backgroundOpacity;
    // 给pick-opacity(input)设置默认值
    const pickOpacity = view.querySelector(".pick-opacity");
    pickOpacity.value = backgroundOpacity;
    // 给pick-opacity(input)添加事件监听 
    pickOpacity.addEventListener("change", (event) => {
      // 修改settings的backgroundOpacity值 
      settings.backgroundOpacity = event.target.value;
      // 将修改后的settings保存到settings.json 
      nostalgic.setSettings(settings);
    });

    // 选择id为heti的q-switch
    const useOldThemeSwitch = view.querySelector("#useOldTheme");
    if (settings.useOldTheme) {
      useOldThemeSwitch.setAttribute("is-active", "");
    }
    // 给hetiSwitch添加点击监听
    useOldThemeSwitch.addEventListener("click", (event) => {
      const isActive = event.currentTarget.hasAttribute("is-active");

      if (isActive) {
        event.currentTarget.removeAttribute("is-active")

        settings.useOldTheme = false;
      } else {
        event.currentTarget.setAttribute("is-active", "");

        settings.useOldTheme = true;
      }

      // 将修改后的settings保存到settings.json
      nostalgic.setSettings(settings);
    });
  } catch (error) {
    log("[设置页面错误]", error);
  }
}