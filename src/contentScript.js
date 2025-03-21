"use strict";

import nlp from "compromise";
import { addHighlightClass } from "./common/highlight";
import { initStore } from "./common/store";
import speechPlugin from "compromise-speech";

initStore();
nlp.plugin(speechPlugin);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: "GREETINGS",
    payload: {
      message: "Hello, my name is Con. I am from ContentScript.",
    },
  },
  (response) => {
    console.log(response.message);
  }
);

window.addEventListener("load", () => {
  addHighlightClass();
});

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "COUNT") {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
