"use strict";

import { initOnInstalled } from "./common/store";

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
chrome.runtime.onInstalled.addListener(() => {
  initOnInstalled();
});
