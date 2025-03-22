import { Config, ConfigNames, SplitMode, Store } from "../common/store";

export async function initSplitConfig() {
  const select = document.querySelector("#split-select");
  console.log(select);
  const splitName2Value = {
    前两个音节: SplitMode.twoSyllable,
    一个音节: SplitMode.firstSyllable,
    半个单词: SplitMode.half,
    三分之一: SplitMode.oneThird,
    自适应: SplitMode.auto,
  };
  for (let entries of Object.entries(splitName2Value)) {
    const opt = document.createElement("option");
    opt.value = entries[1];
    opt.textContent = entries[0];
    if (Config[ConfigNames.SPLIT_MODE] === entries[1]) {
      opt.selected = true;
    }
    select.appendChild(opt);
  }

  select.onchange = async () => {
    Store.set(ConfigNames.SPLIT_MODE, parseInt(select.value));
  };
}
