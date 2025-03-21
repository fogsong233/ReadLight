"use strict";

import nlp from "compromise";
import { Config, ConfigNames, SplitMode } from "./store";

function splitBySyllables(word, splitPoint = 2) {
  const res = Array.from(nlp(word).syllables()).flat();
  if (res.length <= splitPoint) {
    return [res.join(""), ""];
  }
  return [res.slice(0, splitPoint).join(""), res.slice(splitPoint).join("")];
}

function splitByProportion(word, first, second) {
  const index = Math.floor((word.length * first) / (first + second));
  return [word.slice(0, index), word.slice(index)];
}

export function splitWord(word) {
  switch (Config[ConfigNames.SPLIT_MODE]) {
    case SplitMode.twoSyllable:
      return splitBySyllables(word, 2);
    case SplitMode.firstSyllable:
      return splitBySyllables(word, 1);
    case SplitMode.half:
      return splitByProportion(word, 1, 2);
    case SplitMode.oneThird:
      return splitByProportion(word, 1, 3);
    case SplitMode.auto:
      if (word.length <= 2) {
        return ["", word];
      }
      if (word.length <= 5) {
        return splitByProportion(word, 1, 2);
      }
      if (word.length <= 10) {
        return splitBySyllables(word, 1);
      }
      return splitBySyllables(word, 2);
  }
}
