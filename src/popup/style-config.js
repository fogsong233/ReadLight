import { rehighlight } from "../common/highlight";
import {
  Config,
  ConfigNames,
  HighlightMode,
  HighlightModeDefaultValue,
  Store,
} from "../common/store";
import { CurrentTabSender } from "./communicate";
import { isLightened, refreshLightBtnState } from "./light-state";

export function enableRefreshIcon() {
  refreshIconChangeState = function (hidden = false) {
    // 加载刷新按钮
    document.getElementById("refresh-icon").hidden = hidden;
  };
}

export function refreshIconChangeState(hidden = false) {}

function initRefreshBtn() {
  document.getElementById("refresh-icon").onclick = async () => {
    rehighlight();
    await CurrentTabSender.reloadHighlight();
    refreshIconChangeState(true);
    refreshLightBtnState();
  };
}

export function initStyleCfg() {
  initRefreshBtn();
  // 填充选择器
  const selectStyleEle = document.querySelector("#style-select");
  const styles = {
    加粗: HighlightMode.bold,
    背景: HighlightMode.bg,
    上色: HighlightMode.color,
    自定义: HighlightMode.style,
  };
  let befValue = -1;
  const int2Id = {
    [HighlightMode.bold]: ["bold", "bold-select"],
    [HighlightMode.bg]: ["bg", "bg-select"],
    [HighlightMode.color]: ["color", "color-select"],
    [HighlightMode.style]: ["style", "style-textarea"],
  };
  for (let entries of Object.entries(styles)) {
    const opt = document.createElement("option");
    opt.value = entries[1];
    opt.textContent = entries[0];
    if (Config[ConfigNames.HIGHLIGHT_TYPE] === entries[1]) {
      opt.selected = true;
      befValue = entries[1];
      document.getElementById(int2Id[befValue][0]).classList.remove("hidden");
      relevantStyleBind(befValue, ...int2Id[befValue]);
    }
    selectStyleEle.appendChild(opt);
  }

  selectStyleEle.onchange = async () => {
    document.getElementById(int2Id[befValue][0]).classList.add("hidden");
    befValue = parseInt(selectStyleEle.value);
    document.getElementById(int2Id[befValue][0]).classList.remove("hidden");
    await Store.set(ConfigNames.HIGHLIGHT_TYPE, befValue);
    // 填充相应的数据
    relevantStyleBind(befValue, ...int2Id[befValue]);
    refreshIconChangeState();
  };
}

function relevantStyleBind(highlightModeId, elementId, inputId) {
  const ele = document.getElementById(inputId);
  switch (highlightModeId) {
    case HighlightMode.bold:
      for (const opt of ele.querySelectorAll("option")) {
        if (opt.value === "" + Config[ConfigNames.BOLD_STORE]) {
          opt.selected = true;
        }
      }
      ele.onchange = async () => {
        await Store.set(ConfigNames.BOLD_STORE, ele.value);
        refreshIconChangeState();
      };
      break;
    case HighlightMode.bg:
      ele.value = Config[ConfigNames.BG_STORE];
      ele.onchange = async () => {
        Store.set(ConfigNames.BG_STORE, ele.value);
        refreshIconChangeState();
      };
      break;
    case HighlightMode.color:
      ele.value = Config[ConfigNames.COLOR_STORE];
      ele.onchange = async () => {
        await Store.set(ConfigNames.COLOR_STORE, ele.value);
        refreshIconChangeState();
      };
      break;
    case HighlightMode.style:
      ele.value = Config[ConfigNames.STYLE_STORE];
      ele.onchange = async () => {
        Store.set(ConfigNames.STYLE_STORE, ele.value);
        refreshIconChangeState();
      };
      break;
  }
}
