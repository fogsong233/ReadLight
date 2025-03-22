"use strict";

import nlp from "compromise";
import {
  addHighlightClassOfEle,
  disableHighlight,
  highlight,
  initStyleElement,
} from "./common/highlight";
import {
  Config,
  ConfigNames,
  HighlightMode,
  HighlightModeDefaultValue,
  initStore,
  Store,
} from "./common/store";
import speechPlugin from "compromise-speech";
import "./popup.css";
import { formatNumber } from "./common/util";
import { CurrentTabSender } from "./popup/communicate";
import { MyMsgType } from "./common/message";
import { initSplitConfig } from "./popup/split-config";
import { initAutoConfig } from "./popup/auto-highlight";
import { initAboutPage } from "./popup/about";

nlp.plugin(speechPlugin);

const lightBtnText = {
  [true]: "取消点亮",
  [false]: "点亮此页面",
};

window.onload = async () => {
  const lightBtn = document.querySelector("#light-btn");
  try {
    await initStore();
    document.querySelectorAll(".title").forEach(addHighlightClassOfEle);
    initStyleElement();
    highlight();
    let nowEnabled = !!(await CurrentTabSender.isEnabled());
    lightBtn.textContent = lightBtnText[nowEnabled];
    lightBtn.onclick = async () => {
      if (nowEnabled) {
        await CurrentTabSender.disableHighlight();
        lightBtn.textContent = lightBtnText[false];
        nowEnabled = false;
        disableHighlight();
      } else {
        await CurrentTabSender.enableHighlight();
        lightBtn.textContent = lightBtnText[true];
        nowEnabled = true;
        highlight();
      }
    };
    document.querySelector("#word-num").textContent = formatNumber(
      Config[ConfigNames.MODIFIED_WORD_NUM]
    );

    // 填充选择器
    const selectStyleEle = document.querySelector("#style-select");
    const styles = {
      加粗: HighlightMode.bold,
      背景: HighlightMode.bg,
      上色: HighlightMode.color,
      自定义: HighlightMode.style,
    };
    let befValue = -1;
    const int2Id = {
      [HighlightMode.bold]: ["bold", "bold-select"],
      [HighlightMode.bg]: ["bg", "bg-select"],
      [HighlightMode.color]: ["color", "color-select"],
      [HighlightMode.style]: ["style", "style-textarea"],
    };
    for (let entries of Object.entries(styles)) {
      const opt = document.createElement("option");
      opt.value = entries[1];
      opt.textContent = entries[0];
      if (Config[ConfigNames.HIGHLIGHT_TYPE] === entries[1]) {
        opt.selected = true;
        befValue = entries[1];
        document.getElementById(int2Id[befValue][0]).classList.remove("hidden");
        relevantStyleBind(befValue, ...int2Id[befValue]);
      }
      selectStyleEle.appendChild(opt);
    }

    selectStyleEle.onchange = async () => {
      document.getElementById(int2Id[befValue][0]).classList.add("hidden");
      befValue = parseInt(selectStyleEle.value);
      document.getElementById(int2Id[befValue][0]).classList.remove("hidden");
      await Store.set(ConfigNames.HIGHLIGHT_TYPE, befValue);
      await Store.set(
        ConfigNames.HIGHLIGHT_VALUE,
        HighlightModeDefaultValue[Config[ConfigNames.HIGHLIGHT_TYPE]]
      );

      // 填充相应的数据
      relevantStyleBind(befValue, ...int2Id[befValue]);
    };
    // 分割的配置
    initSplitConfig();
    initAutoConfig();
    initAboutPage();
    // 网站的配置
  } catch (e) {
    lightBtn.disabled = true;
  }
};

chrome.storage.onChanged.addListener((changes) => {
  if (changes[ConfigNames.MODIFIED_WORD_NUM]?.newValue != null) {
    document.querySelector("#word-num").textContent = formatNumber(
      changes[ConfigNames.MODIFIED_WORD_NUM].newValue
    );
  }
});

function relevantStyleBind(highlightModeId, elementId, inputId) {
  const ele = document.getElementById(inputId);
  switch (highlightModeId) {
    case HighlightMode.bold:
      for (const opt of ele.querySelectorAll("option")) {
        if (opt.value === "" + Config[ConfigNames.HIGHLIGHT_VALUE]) {
          opt.selected = true;
        }
      }
      ele.onchange = () => {
        Store.set(ConfigNames.HIGHLIGHT_VALUE, ele.value);
      };
      break;
    case HighlightMode.bg:
      ele.value = Config[ConfigNames.HIGHLIGHT_VALUE];
      ele.onchange = () => {
        Store.set(ConfigNames.HIGHLIGHT_VALUE, ele.value);
      };
      break;
    case HighlightMode.color:
      ele.value = Config[ConfigNames.HIGHLIGHT_VALUE];
      ele.onchange = () => {
        Store.set(ConfigNames.HIGHLIGHT_VALUE, ele.value);
      };
      break;
    case HighlightMode.style:
      ele.value = Config[ConfigNames.HIGHLIGHT_VALUE];
      ele.onchange = () => {
        Store.set(ConfigNames.HIGHLIGHT_VALUE, ele.value);
      };
      break;
  }
}
