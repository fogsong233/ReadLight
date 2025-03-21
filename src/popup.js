"use strict";

import nlp from "compromise";
import { addHighlightClassOfEle } from "./common/highlight";
import { initStore } from "./common/store";
import speechPlugin from "compromise-speech";
import "./popup.css";

nlp.plugin(speechPlugin);

window.onload = async () => {
  await initStore();
  document.querySelectorAll(".title").forEach(addHighlightClassOfEle);
};
