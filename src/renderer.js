
const plugin_path = LiteLoader.plugins["nostalgic"].path.plugin;
function log(...args) {
  console.log(`\x1b[35m[QQ怀旧模式]\x1b[0m`, ...args);
  nostalgic.logToMain(...args);
}
//防抖
function debounce(func, delay) {
  let timerId;
  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

let windowStyleMini = false
//菜单按钮
const BTN_MENU_HTML = `
    <div id="nostalgic-leftTools" style="transform:rotate(268deg)" class="func-menu__item_wrap" >
      <div class="sidebar-tooltips vue-component">
        <div class="func-menu-more-component func-menu__item vue-component" >
          <span class="q-badge q-badge__red update-badge vue-component" style="vertical-align: middle;">
            <div class="icon-item sidebar-icon vue-component" role="button" tabindex="-1" aria-label="菜单" style="--hover-color: var(--brand_standard);">
              <i class="q-icon vue-component" style="--b4589f60: var(--icon_primary); --6ef2e80d: 24px;"><svg fill="currentColor" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M208.83158 483.043016h184.940735a72.952401 72.952401 0 0 0 72.845746-72.845745V225.363191a73.059056 73.059056 0 0 0-72.845746-72.9524H208.83158a72.952401 72.952401 0 0 0-72.845745 72.9524v184.83408a72.845745 72.845745 0 0 0 72.845745 72.845745z m204.458702-72.845745a19.517967 19.517967 0 0 1-19.517967 19.517967H208.83158a19.517967 19.517967 0 0 1-19.517967-19.517967V225.363191a19.624622 19.624622 0 0 1 19.517967-19.624622h184.940735a19.624622 19.624622 0 0 1 19.517967 19.624622zM402.624727 547.03635h-191.980002a74.65889 74.65889 0 0 0-74.65889 74.65889v191.980002a74.65889 74.65889 0 0 0 74.65889 74.65889h191.980002a74.65889 74.65889 0 0 0 74.658889-74.65889v-191.980002a74.65889 74.65889 0 0 0-74.658889-74.65889z m-213.311114 74.65889a21.331111 21.331111 0 0 1 21.331112-21.331111h191.980002a21.331111 21.331111 0 0 1 21.331111 21.331111v191.980002a21.331111 21.331111 0 0 1-21.331111 21.331112h-191.980002a21.331111 21.331111 0 0 1-21.331112-21.331112zM799.063431 552.369128H614.122696a72.952401 72.952401 0 0 0-72.845746 72.952401V810.688887a72.845745 72.845745 0 0 0 72.845746 72.845745h184.940735A72.952401 72.952401 0 0 0 871.909176 810.688887V625.321529a73.059056 73.059056 0 0 0-72.845745-72.952401z m-204.458702 72.952401a19.624622 19.624622 0 0 1 19.517967-19.624622h184.940735a19.624622 19.624622 0 0 1 19.517967 19.624622V810.688887a19.517967 19.517967 0 0 1-19.517967 19.517966H614.122696A19.517967 19.517967 0 0 1 594.604729 810.688887zM701.260285 508.853661a68.152901 68.152901 0 0 0 48.421623-20.051245l118.174357-118.174356a68.472867 68.472867 0 0 0 0-96.843246L749.681908 155.503802a68.579523 68.579523 0 0 0-96.843245 0L534.55765 273.784814a68.792834 68.792834 0 0 0 0 96.843246l118.281013 118.174356a68.046245 68.046245 0 0 0 48.421622 20.051245z m10.665556-315.593792L830.206853 311.540881a15.145089 15.145089 0 0 1 0 21.331112L711.925841 451.153005a15.145089 15.145089 0 0 1-21.331111 0L572.313717 332.871993a15.145089 15.145089 0 0 1 0-21.331112l118.281013-118.281012a15.3584 15.3584 0 0 1 21.331111 0z"></path></svg>
              </i>
            </div>
          </span>
        </div>
      </div>
    </div>
`

const setExtBtn = () => {
  try {
    // 插入菜单按钮
    const funcMenu = document.querySelector('.func-menu')
    !document.querySelector('#nostalgic-leftTools') && funcMenu.insertAdjacentHTML('beforeend', BTN_MENU_HTML)
    const leftToolsBtn = document.querySelector('#nostalgic-leftTools')
    const sidebarNav = document.querySelector('.sidebar__nav')
    //菜单按钮点击事件处理
    leftToolsBtn.addEventListener('click', (e) => {
      if (sidebarNav.classList.contains("sidebar__nav_show")) {
        sidebarNav.classList.remove('sidebar__nav_show')
        document.querySelector('#nostalgic-leftTools').style.transform = 'rotate(270deg)'
      } else {
        sidebarNav.classList.add('sidebar__nav_show')
        document.querySelector('#nostalgic-leftTools').style.transform = 'rotate(180deg)'
      }

    })
    //菜单面板点击后关闭
    document.querySelector('.sidebar__nav').addEventListener("click", (event) => {
      if (sidebarNav.classList.contains("sidebar__nav_show")) {
        sidebarNav.classList.remove('sidebar__nav_show')
        document.querySelector('#nostalgic-leftTools').style.transform = 'rotate(270deg)'
      }

    });


  } catch (error) {
    log('处理菜单按钮异常：', error)
  }

}
let settingsConfig = await nostalgic.getSettings();
const html_header_file_path = `local:///${plugin_path}/src/settings/header.html`;

let headerHTML = await (await fetch(html_header_file_path)).text();
let onloadInit = false
let headerInit = false
let userinfoMain = {}
const onload = async () => {

  if (window.location.href.includes("app://./renderer/index.html")) {
    var osType = "";
    if (LiteLoader.os.platform === "win32") {
      osType = "windows";
    } else if (LiteLoader.os.platform === "linux") {
      osType = "linux";

    } else if (LiteLoader.os.platform === "darwin") {
      osType = "mac";
      //不支持mac
      //log('不支持macOS')
      //return
    }


    const allWinInterval = setInterval(() => {
      const topbar = document.querySelector('.tab-container')

      if (!topbar) return
      clearInterval(allWinInterval)
      if (location.hash.includes("#/main/message") || location.hash.includes("#/main/contact/profile")) {
        try {

          //插入菜单按钮
          setExtBtn()

          //插入js文件并写入css
          const element = document.createElement("style");
          element.id = "nostalgic-style"
          document.head.appendChild(element);
          const updateHeader = (userinfo) => {
            if (userinfo.nick != userinfoMain.nick || userinfo.longNick != userinfoMain.longNick) {

              //替换用户信息
              let headerHTMLUserinfo = headerHTML.slice().replace("{nickName}", userinfo?.nick)
              headerHTMLUserinfo = headerHTMLUserinfo.replace("{bio}", userinfo?.longNick || '这家伙很懒,什么也没留下')
              headerHTMLUserinfo = headerHTMLUserinfo.replace("{vip}", userinfo?.svipFlag ? 'svip' : (userinfo.vipFlag ? 'vip' : ''))
              document.querySelector('.nostalgic-header-main') && document.querySelector('.nostalgic-header-main').remove()
              !document.querySelector('.nostalgic-header-main') && (topbar.insertAdjacentHTML('afterbegin', headerHTMLUserinfo))

              //左上角QQ图标事件监听
              const qqBtn = document.querySelector('.nostalgic-qq-icon')
              const sidebarLower = document.querySelector('.sidebar__lower')
              qqBtn.addEventListener('click', (e) => {
                if (sidebarLower?.style?.display == 'none') {
                  sidebarLower && (sidebarLower.style.display = '')
                } else {
                  sidebarLower && (sidebarLower.style.display = 'none')
                }


              })

              document.querySelector('.nostalgic-header-main').style.display = "unset"
              const buttons = document.querySelectorAll('.nostalgic-menu-tab .item');
              buttons.forEach(button => {
                button.addEventListener('click', () => {
                  if (!button.classList.contains('zone')) {
                    buttons.forEach(button => {
                      button.classList.remove('select');
                    });
                  }

                  if (button.classList.contains('message')) {
                    button.classList.add('select')
                    document.querySelector("#app").__vue_app__.config.globalProperties.$router.replace("/main/message")
                  }
                  if (button.classList.contains('contact')) {
                    button.classList.add('select')
                    document.querySelector("#app").__vue_app__.config.globalProperties.$router.replace("/main/contact/profile")
                  }



                  if (button.classList.contains('zone')) {
                    document.querySelector('.nav-item[aria-label="空间"]').click()
                  }


                });
                button.addEventListener('dblclick', () => {
                  if (button.classList.contains('message')) {
                    document.querySelector('.recent-contact .list-toggler .recent-contact-list').scrollTop = 0;
                  }
                  if (button.classList.contains('contact')) {
                    document.querySelector('.contact-layout__content-area .contact-list').scrollTop = 0;
                    document.querySelector('.contact-layout__content-area').scrollTop = 0;
                  }

                })
              });
              userinfoMain = userinfo
              headerInit = true
            }
          }

          const updateUserinfoChange = debounce(updateHeader, 500);
          //监听主进程发来的用户消息变更
          nostalgic.updateUserinfo((event, userinfo) => {
            updateUserinfoChange(userinfo)
          });


          //监听主进程发来的消息样式变更
          nostalgic.updateStyle((event, message) => {
            nostalgic.getSettings().then((config) => {
              if (config.useOldThemeMegList) {
                message = message.replace("/*++", '').replace('++*/', '')
              }
              element.textContent = message;
              //在配置界面调整，强小面板模式
              if (document.querySelector('.nostalgic-header-main') && window.outerWidth >= 400 && !message.includes('大面板')) {

                window.resizeTo(295, window.outerHeight < 650 ? 825 : window.outerHeight)
                windowStyleMini = true

              }
              if (!message.includes('大面板')) {

                nostalgic.getSettings().then((settings) => {
                  changeBtn(settings)
                  changeAreaBtn(settings)

                })
              }

            });

          });

          changeAreaBtn(settingsConfig)

          nostalgic.rendererReady();

          //调整窗口大小
          if (window.outerWidth >= 400) {
            if (settingsConfig.useOldThemeWin) {
              window.resizeTo(295, window.outerHeight < 650 ? 825 : window.outerHeight)
              windowStyleMini = true
            }

          } else {
            windowStyleMini = false
          }
          onloadInit = true
          setTimeout(() => {
            nostalgic.updateStyleExt(windowStyleMini ? 'mini' : 'Big')
            updateMode()
          }, 100);

        } catch (error) {
          log("[渲染进程错误]", error);
        }

      }
    }, 300);

  }
}
onload()

//处理收缩侧栏按钮
const changeBtn = (settings) => {
  //收缩侧栏按钮
  const switchBtn = document.querySelector('path[d^="M6 3H12.4C12.6965"]')?.parentElement?.parentElement?.parentElement
  //调整按钮颜色过亮的问题
  switchBtn && (switchBtn.style.opacity = '0.55')
  switchBtn?.style && (settings.hideSwitchBtn ? (switchBtn.style.display = 'none') : (switchBtn.style.display = ''))
}


//处理右上角按钮区域
const changeAreaBtn = (settings) => {

  //右上角按钮区域
  const areaBtn = document.querySelector('.window-control-area')
  //右上角按钮区域所有图标
  const areaBtns = document.querySelectorAll('.window-control-area i')
  if (windowStyleMini) {
    //如果使用header面板染色，则更新图标颜色
    if (settings.useOldTheme) {
      areaBtn?.style && (areaBtn.style.backgroundColor = "none!important")
      for (let i = 0; i < areaBtns.length; i++) {
        areaBtns[i].style.color = "var(--header-oldTheme-text-color)"
      }
    }

  } else {
    //如果使用header面板染色，则更新图标颜色
    if (settings.useOldTheme) {
      for (let i = 0; i < areaBtns.length; i++) {
        areaBtns[i].style.color &&= "var(--5f831aae)"
      }

    }
  }
}

const updateMode = async () => {
  if (!onloadInit) return
  try {
    const styleWin = document.querySelector('.two-col-layout__main')?.style?.display == 'none' ? "none" : ''

    //none为小面板模式
    if (styleWin == 'none') {

      //变换为小面板
      if (!windowStyleMini) {
        windowStyleMini = true
        nostalgic.updateStyleExt('mini')
        settingsConfig = await nostalgic.getSettings();
      }
      changeAreaBtn(settingsConfig)

    } else {

      //变动为合并面板
      if (windowStyleMini) {
        windowStyleMini = false
        nostalgic.updateStyleExt('Big')
        settingsConfig = await nostalgic.getSettings();
      }
      changeAreaBtn(settingsConfig)
    }

  } catch (error) {
    log(error)
  }
}

const windowSizeChange = debounce(updateMode, 100);
window.addEventListener('resize', function () {
  if (location.hash.includes("#/main/message") || location.hash.includes("#/main/contact/profile")) {
    windowSizeChange()

  }
});



/**********设置界面相关***********/


const switchChange = (view, id, settings) => {
  const domSwitch = view.querySelector(`#${id}`);
  if (settings[id]) {
    domSwitch.setAttribute("is-active", "");
  }
  //添加点击监听
  domSwitch.addEventListener("click", (event) => {
    const isActive = event.currentTarget.hasAttribute("is-active");
    if (isActive) {
      event.currentTarget.removeAttribute("is-active")
      settings[id] = false;
    } else {
      event.currentTarget.setAttribute("is-active", "");
      settings[id] = true;
    }
    // 将修改后的settings保存到settings.json
    //console.log(settings[id], settings)
    nostalgic.setSettings(settings);
    settingsConfig = settings;

    if (id == 'useOldTheme') {
      const dom = view.querySelector('.nostalgic-header-config-ext')
      settings[id] ? dom.classList.remove('nostalgic-disabled') : (dom.classList.contains('nostalgic-disabled') || dom.classList.add('nostalgic-disabled'))
    }

  });
}
const colorChange = (view, id, settings) => {
  // 给pick-color(input)设置默认颜色
  const pickColor = view.querySelector(`#${id}`);
  pickColor.value = settings[id];
  // 给pick-color(input)添加事件监听
  pickColor.addEventListener("change", (event) => {
    // 修改settings的themeColor值
    settings[id] = event.target.value;
    // 将修改后的settings保存到settings.json
    nostalgic.setSettings(settings);
    settingsConfig = settings;
  });
}
// 打开设置界面时触发
export const onSettingWindowCreated = async view => {
  log('打开设置界面')
  try {
    //设置设置界面的图标

    document.querySelectorAll(".nav-item.liteloader").forEach(node => {
      //log(node.textContent)
      if (node.textContent === "QQ怀旧模式") {
        node.classList.add("nostalgic")
        node.classList.add('appearance')
        const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 1024 1024" width="16" fill="currentColor">
          <path d="M802.952533 341.265067C798.378667 166.229333 673.792 34.747733 512.136533 34.133333 350.208 34.747733 225.621333 166.229333 221.047467 341.1968a154.897067 154.897067 0 0 0-29.696 117.623467C140.629333 520.260267 107.861333 582.656 102.673067 654.7456c-1.6384 34.269867 4.096 70.2464 19.2512 90.862933 25.8048 35.157333 62.190933 25.668267 93.047466-6.485333 4.778667 9.079467 10.0352 18.363733 15.906134 27.8528-47.035733 32.904533-64.3072 95.163733-36.181334 141.312 23.210667 38.0928 70.519467 59.665067 133.666134 59.665067 87.927467 0 146.773333-19.182933 183.637333-51.2 37.819733 32.290133 96.324267 51.2 183.637333 51.2 63.146667 0 110.455467-21.572267 133.597867-59.5968 28.125867-46.216533 10.922667-108.475733-36.181333-141.380267 5.9392-9.557333 11.264-18.773333 15.9744-27.8528 30.856533 32.085333 67.242667 41.642667 93.047466 6.485333 15.223467-20.6848 20.957867-56.661333 19.319467-90.112-5.188267-72.840533-37.956267-135.304533-88.746667-196.608a154.965333 154.965333 0 0 0-29.696-117.623466z m49.152 343.586133a152.234667 152.234667 0 0 1-19.2512-32.426667l-39.1168-86.698666-24.917333 91.818666c-7.7824 28.740267-24.849067 63.488-53.998933 103.424l-30.446934 41.642667 50.176 11.741867c33.1776 7.7824 47.445333 40.277333 36.386134 58.504533-9.489067 15.5648-34.2016 26.8288-75.3664 26.8288-76.1856 0-119.466667-15.428267-142.336-37.6832a55.978667 55.978667 0 0 0-41.1648-16.042667 56.661333 56.661333 0 0 0-42.120534 16.861867c-22.1184 21.435733-65.3312 36.864-141.585066 36.864-41.096533 0-65.877333-11.264-75.298134-26.8288-11.0592-18.158933 3.208533-50.722133 36.386134-58.504533l50.176-11.741867-30.446934-41.642667c-29.149867-39.867733-46.216533-74.683733-53.998933-103.424l-24.917333-91.818666-39.1168 86.698666a152.1664 152.1664 0 0 1-19.2512 32.426667 157.4912 157.4912 0 0 1-1.092267-26.0096c4.164267-58.368 35.293867-113.322667 83.899733-169.096533l13.858134-15.9744-8.055467-19.524267c-6.144-14.9504-2.730667-54.340267 18.8416-76.049067l10.8544-10.922666-1.024-15.36c0-144.1792 97.006933-249.0368 222.958933-249.514667 125.610667 0.477867 222.685867 105.335467 222.685867 248.763733 0 1.092267-1.024 16.110933-1.024 16.110934l10.8544 10.922666c21.572267 21.7088 25.053867 61.166933 18.8416 75.9808l-8.123733 19.592534 13.9264 15.9744c48.469333 55.569067 79.598933 110.523733 83.899733 169.437866 0.4096 8.533333-0.136533 17.749333-1.092267 25.668267z" /></svg>`
        node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
      }
    })

    setTimeout(() => {
      document.querySelectorAll(".nav-item.liteloader").forEach(node => {
        //强迫症添加图标..
        if (!node.querySelector(".q-icon.icon>svg")) {

          const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 1024 1024" width="16" fill="currentColor"><path
        d="M310.954667 844.842667c-11.093333-19.2 7.509333-47.530667 26.752-58.666667a78.762667 78.762667 0 1 0-78.762667-136.405333c-19.242667 11.093333-53.077333 13.056-64.213333-6.186667l-73.173334-126.72a26.24 26.24 0 0 1 9.6-35.882667l115.968-66.986666a131.84 131.84 0 0 1-26.24-45.44 131.328 131.328 0 0 1 249.088-83.2l70.485334-40.704c12.586667-7.253333 28.629333-2.944 35.84 9.642666l66.986666 115.968a131.84 131.84 0 0 1 45.482667-26.282666 131.328 131.328 0 0 1 83.2 249.088l40.661333 70.485333c7.253333 12.586667 2.986667 28.629333-9.6 35.882667l-409.301333 236.288a26.24 26.24 0 0 1-35.84-9.6l-46.933333-81.28z m174.848-507.989334a42.666667 42.666667 0 0 1-61.781334-23.381333l-3.84-11.434667a78.762667 78.762667 0 1 0-133.717333 77.226667l8.021333 8.96a42.666667 42.666667 0 0 1-10.666666 65.28l-103.68 59.818667 52.522666 90.965333a131.285333 131.285333 0 0 1 131.285334 227.413333l26.282666 45.44 363.818667-210.048-33.578667-58.197333a42.666667 42.666667 0 0 1 23.381334-61.781333l11.392-3.84a78.762667 78.762667 0 1 0-77.226667-133.717334l-8.96 8.021334a42.666667 42.666667 0 0 1-65.194667-10.666667l-59.861333-103.68-58.197333 33.621333z" p-id="15049"></path><path d="M310.954667 844.842667c-11.093333-19.2 7.509333-47.530667 26.752-58.666667a78.762667 78.762667 0 1 0-78.762667-136.405333c-19.242667 11.093333-53.077333 13.056-64.213333-6.186667l-73.173334-126.72a26.24 26.24 0 0 1 9.6-35.882667l115.968-66.986666a131.84 131.84 0 0 1-26.24-45.44 131.328 131.328 0 0 1 249.088-83.2l70.485334-40.704c12.586667-7.253333 28.629333-2.944 35.84 9.642666l66.986666 115.968a131.84 131.84 0 0 1 45.482667-26.282666 131.328 131.328 0 0 1 83.2 249.088l40.661333 70.485333c7.253333 12.586667 2.986667 28.629333-9.6 35.882667l-409.301333 236.288a26.24 26.24 0 0 1-35.84-9.6l-46.933333-81.28z m174.848-507.989334a42.666667 42.666667 0 0 1-61.781334-23.381333l-3.84-11.434667a78.762667 78.762667 0 1 0-133.717333 77.226667l8.021333 8.96a42.666667 42.666667 0 0 1-10.666666 65.28l-103.68 59.818667 52.522666 90.965333a131.285333 131.285333 0 0 1 131.285334 227.413333l26.282666 45.44 363.818667-210.048-33.578667-58.197333a42.666667 42.666667 0 0 1 23.381334-61.781333l11.392-3.84a78.762667 78.762667 0 1 0-77.226667-133.717334l-8.96 8.021334a42.666667 42.666667 0 0 1-65.194667-10.666667l-59.861333-103.68-58.197333 33.621333z"
        /></svg>`

          node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
        }
      })
    }, 800);
    const html_file_path = `local:///${plugin_path}/src/settings/main.html`;

    view.innerHTML = await (await fetch(html_file_path)).text();

    // 获取设置
    const settings = await nostalgic.getSettings();
    if (!settings.useOldTheme) {
      const dom = view.querySelector('.nostalgic-header-config-ext')
      dom.classList.contains('nostalgic-disabled') || dom.classList.add('nostalgic-disabled')
    }
    // 颜色透明设置
    const backgroundOpacity = settings.backgroundOpacity;
    const pickOpacity = view.querySelector(".pick-opacity");
    pickOpacity.value = backgroundOpacity;
    pickOpacity.addEventListener("change", (event) => {
      settings.backgroundOpacity = event.target.value;
      nostalgic.setSettings(settings);
    });
    //颜色 设置
    const colorSettingList = ['themeColor', 'themeColor2', 'themeColor3']
    colorSettingList.forEach((id) => {
      colorChange(view, id, settings)
    })
    //配置设置
    const switchSettingList = ['useOldTheme', 'useOldThemeWin', 'hideSwitchBtn', 'useOldThemeMegList']
    switchSettingList.forEach((id) => {
      switchChange(view, id, settings)
    })

  } catch (error) {
    log("[设置页面错误]", error);
  }
}
