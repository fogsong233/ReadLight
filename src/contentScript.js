"use strict";

import nlp from "compromise";
import {
  addHighlightClass,
  disableHighlight,
  highlight,
  initStyleElement,
} from "./common/highlight";
import { Config, ConfigNames, initStore } from "./common/store";
import speechPlugin from "compromise-speech";
import wildcardMatch from "wildcard-match";
import { getCurrentUrlWithoutProtocol } from "./common/util";
import { MyMsgType } from "./common/message";
import { isReadlightEnabled, isTagAdded } from "./common/enable";

nlp.plugin(speechPlugin);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message[MyMsgType.isEnabled] === 1) {
    sendResponse({
      [MyMsgType.ResponseTag]: isReadlightEnabled(),
    });
  }

  if (message[MyMsgType.enableCmd] === 1) {
    if (!isReadlightEnabled()) {
      if (!isTagAdded()) {
        addHighlightClass();
      }
      highlight();
      sendResponse({
        [MyMsgType.ResponseTag]: true,
      });
      return true;
    }
    sendResponse({
      [MyMsgType.ResponseTag]: false,
    });
    return true;
  }
  if (message[MyMsgType.disableCmd] === 1) {
    if (isReadlightEnabled()) {
      disableHighlight();
      sendResponse({
        [MyMsgType.ResponseTag]: true,
      });
      return true;
    }
    sendResponse({
      [MyMsgType.ResponseTag]: false,
    });
    return true;
  }

  if (message[MyMsgType.changeStyleCmd] === 1) {
    if (isReadlightEnabled()) {
      disableHighlight();
      highlight();
      sendResponse({
        [MyMsgType.ResponseTag]: true,
      });
      return true;
    }
    sendResponse({
      [MyMsgType.ResponseTag]: false,
    });
    return true;
  }
});

window.addEventListener("load", async () => {
  await initStore();
  initStyleElement();
  // 是否为auto
  let isAuto = false;
  const currentUrl = window.location.href;
  for (const pattern of Config[ConfigNames.AUTO_URL_PATTERN_LIST]) {
    if (wildcardMatch(pattern)(currentUrl)) {
      isAuto = true;
      break;
    }
  }
  if (isAuto) {
    addHighlightClass();
    highlight();
  }

  // addHighlightClass();
  // highlight();
});

// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "COUNT") {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });
