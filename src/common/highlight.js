"use strict";

import { splitWord } from "./split-word";
import { Config, ConfigNames } from "./store";
import { STYLE_CLASS_NAME } from "./util";

export function addHighlightClass() {
  document.body.querySelectorAll("*").forEach((element) => {
    addHighlightClassOfEle(element);
  });
}

export function addHighlightClassOfEle(element) {
  element.childNodes.forEach((node) => {
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    if (fontSize >= Config[ConfigNames.FONT_SIZE_THRESHOLD]) return;

    if (node.nodeType == Node.TEXT_NODE) {
      let newEle = document.createElement("span");
      newEle.classList.add(STYLE_CLASS_NAME);
      let befText = node.nodeValue;
      newEle.innerHTML = befText.replace(/\b[a-zA-Z'\-]{2,}\b/g, (word) => {
        let parts = splitWord(word);
        console.log(parts);
        return `<span>${parts[0]}</span>${parts[1]}`;
      });
      element.replaceChild(newEle, node);
    }
  });
}
