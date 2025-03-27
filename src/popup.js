"use strict";

import nlp from "compromise";
import {
  addHighlightClassOfEle,
  highlight,
  initStyleElement,
} from "./common/highlight";
import {
  addConfigChgListener,
  Config,
  ConfigNames,
  initStore,
} from "./common/store";
import speechPlugin from "compromise-speech";
import "./popup.css";
import { formatNumber } from "./common/util";
import { initSplitConfig } from "./popup/split-config";
import { initAutoConfig } from "./popup/auto-highlight";
import { initAboutPage } from "./popup/about";
import { initStyleCfg } from "./popup/style-config";
import { initLightBtn, lightBtn } from "./popup/light-state";

nlp.plugin(speechPlugin);

window.onload = async () => {
  try {
    await initStore();
    document.querySelectorAll(".title").forEach(addHighlightClassOfEle);
    initStyleElement();
    highlight();

    addConfigChgListener(() => {
      document.querySelector("#word-num").textContent = formatNumber(
        Config[ConfigNames.MODIFIED_WORD_NUM]
      );
    });

    // 网站的配置
    initStyleCfg();
    initLightBtn();
    initSplitConfig();
    initAutoConfig();
    initAboutPage();
  } catch (e) {
    console.log(e);
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
