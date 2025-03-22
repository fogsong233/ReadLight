"use strict";

import nlp from "compromise";
import {
  addHighlightClassOfEle,
  highlight,
  initStyleElement,
} from "./common/highlight";
import {
  Config,
  ConfigNames,
  HighlightMode,
  initStore,
  Store,
} from "./common/store";
import speechPlugin from "compromise-speech";
import "./popup.css";
import { formatNumber } from "./common/util";
import { CurrentTabSender } from "./popup/communicate";
import { MyMsgType } from "./common/message";

nlp.plugin(speechPlugin);

const lightBtnText = {
  [true]: "已点亮",
  [false]: "点亮此页面",
};

window.onload = async () => {
  await initStore();
  document.querySelectorAll(".title").forEach(addHighlightClassOfEle);
  initStyleElement();
  highlight();
  const lightBtn = document.querySelector("#light-btn");
  const nowEnabled = !!(await CurrentTabSender.isEnabled());
  console.log(nowEnabled);
  lightBtn.textContent = lightBtnText[nowEnabled];
  lightBtn.onclick = async () => {
    CurrentTabSender.enableHighlight();
    lightBtn.textContent = lightBtnText[true];
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
    }
    selectStyleEle.appendChild(opt);
  }

  selectStyleEle.onchange = () => {
    document.getElementById(int2Id[befValue][0]).classList.add("hidden");
    befValue = parseInt(selectStyleEle.value);
    document.getElementById(int2Id[befValue][0]).classList.remove("hidden");
    Store.set(ConfigNames.HIGHLIGHT_TYPE, befValue);

    // 填充相应的数据
    relevantStyleBind(befValue, ...int2Id[befValue]);
  };
};

chrome.storage.onChanged.addListener((changes) => {
  if (changes[ConfigNames.MODIFIED_WORD_NUM]?.newValue !== null) {
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
  }
}
