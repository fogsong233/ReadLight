"use strict";

import { addedTag, isReadlightEnabled, setReadLightStatus } from "./enable";
import { splitWord } from "./split-word";
import { Config, ConfigNames, HighlightMode, Store } from "./store";
import { QUERY_SELECTOR_STR, STYLE_CLASS_NAME, STYLE_ELE_ID } from "./util";

export function addHighlightClass() {
  let highlightWordNum = 0;
  document.body.querySelectorAll(QUERY_SELECTOR_STR).forEach((element) => {
    highlightWordNum += addHighlightClassOfEle(element);
  });
  Store.set(
    ConfigNames.MODIFIED_WORD_NUM,
    Config[ConfigNames.MODIFIED_WORD_NUM] + highlightWordNum
  );
  addedTag();
}

export function addHighlightClassOfEle(element) {
  let highlightWordNum = 0;
  element.childNodes.forEach((node) => {
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    if (fontSize >= Config[ConfigNames.FONT_SIZE_THRESHOLD]) return;

    if (node.nodeType == Node.TEXT_NODE) {
      let newEle = document.createElement("span");
      newEle.classList.add(STYLE_CLASS_NAME);
      let befText = node.nodeValue;
      newEle.innerHTML = befText.replace(/\b[a-zA-Z'\-]{2,}\b/g, (word) => {
        let parts = splitWord(word);
        return `<span>${parts[0]}</span>${parts[1]}`;
      });
      element.replaceChild(newEle, node);
      highlightWordNum++;
    }
  });
  return highlightWordNum;
}
export function initStyleElement() {
  const storeStyleEle = document.createElement("style");
  storeStyleEle.id = STYLE_ELE_ID;
  document.head.appendChild(storeStyleEle);
}

export function highlight() {
  if (isReadlightEnabled()) {
    return;
  }
  // 选择注入css
  const storeStyleEle = document.querySelector(`#${STYLE_ELE_ID}`);
  let cssStr = "";
  switch (Config[ConfigNames.HIGHLIGHT_TYPE]) {
    case HighlightMode.bold:
      cssStr = `font-weight: ${Config[ConfigNames.HIGHLIGHT_VALUE]};`;
      break;
    case HighlightMode.color:
      cssStr = `color: ${Config[ConfigNames.HIGHLIGHT_VALUE]};`;
      break;
    case HighlightMode.bg:
      cssStr = `background-color: ${Config[ConfigNames.HIGHLIGHT_VALUE]};`;
      break;
    case HighlightMode.style:
      cssStr = Config[ConfigNames.HIGHLIGHT_VALUE];
  }
  storeStyleEle.textContent = `
  .${STYLE_CLASS_NAME} > span {
    ${cssStr}
  }
  `;
  setReadLightStatus(true);
}

export function disableHighlight() {
  const storeStyleEle = document.querySelector(`#${STYLE_ELE_ID}`);
  storeStyleEle.textContent = "";
  setReadLightStatus(false);
}
