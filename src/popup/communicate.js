"use strict";
import { disableHighlight, highlight } from "../common/highlight";
import { MyMsgType } from "../common/message";

export async function getCurrentTab() {
  const res = await chrome.tabs.query({ active: true, currentWindow: true });
  return res[0];
}

export const CurrentTabSender = {
  async isEnabled() {
    let res = await chrome.tabs.sendMessage((await getCurrentTab()).id, {
      [MyMsgType.isEnabled]: 1,
    });
    // console.log(`popupreceive: ${JSON.stringify(res)}`);
    return res[MyMsgType.ResponseTag];
  },
  async enableHighlight() {
    return (
      await chrome.tabs.sendMessage((await getCurrentTab()).id, {
        [MyMsgType.enableCmd]: 1,
      })
    )[MyMsgType.ResponseTag];
  },
  async disableHighlight() {
    return (
      await chrome.tabs.sendMessage((await getCurrentTab()).id, {
        [MyMsgType.disableCmd]: 1,
      })
    )[MyMsgType.ResponseTag];
  },
  async reloadHighlight() {
    return (
      await chrome.tabs.sendMessage((await getCurrentTab()).id, {
        [MyMsgType.changeStyleCmd]: 1,
      })
    )[MyMsgType.ResponseTag];
  },
};
