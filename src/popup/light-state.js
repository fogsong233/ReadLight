import { highlight } from "../common/highlight";
import { CurrentTabSender } from "./communicate";
import { notSupportPageOn } from "./err-page";
import { enableRefreshIcon } from "./style-config";

const lightBtnText = {
  light: "取消点亮",
  not: "点亮此页面",
  notReady: "加载中",
};

export let isLightened = undefined;

export let lightBtn;

let queryReadyStateTaskId;

export async function initLightBtn() {
  lightBtn = document.querySelector("#light-btn");
  lightBtn.disable = true;
  queryReadyStateTaskId = setInterval(async () => {
    try {
      if (await CurrentTabSender.queryReadyState()) {
        lightBtn.disable = false;
        refreshLightBtnState();
        clearInterval(queryReadyStateTaskId);
        // 对刷新按钮的操控
        enableRefreshIcon();
      }
    } catch (e) {
      notSupportPageOn();
      clearInterval(queryReadyStateTaskId);
    }
  }, 500);
  lightBtn.onclick = async () => {
    if (isLightened) {
      await CurrentTabSender.disableHighlight();
      lightBtn.textContent = lightBtnText.not;
      isLightened = false;
    } else {
      await CurrentTabSender.enableHighlight();
      lightBtn.textContent = lightBtnText.light;
      isLightened = true;
      highlight();
    }
  };
}

export async function refreshLightBtnState() {
  isLightened = !!(await CurrentTabSender.isEnabled());
  lightBtn.textContent = isLightened ? lightBtnText.light : lightBtnText.not;
}
