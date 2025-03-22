export const Store = {
  async set(key, value) {
    await chrome.storage.sync.set({ [key]: value });
  },
  async get(key) {
    return await chrome.storage.sync.get(key);
  },
};

export const ConfigNames = {
  FONT_SIZE_THRESHOLD: "font_size_threshold",
  DISABLE_URL_PATTERN_LIST: "disable_list",
  AUTO_URL_PATTERN_LIST: "auto_list",
  HIGHLIGHT_TYPE: "highlight_type",
  HIGHLIGHT_VALUE: "highlight_value",
  MODIFIED_WORD_NUM: "word_num",
  SPLIT_MODE: "split_mode",
  IS_INIT: "is_init",
};

export const SplitMode = {
  twoSyllable: 1,
  firstSyllable: 2,
  half: 3,
  oneThird: 4,
  auto: 5,
};

export const HighlightMode = {
  bold: 1,
  color: 2,
  bg: 3,
  style: 4,
};

export const HighlightModeDefaultValue = {
  1: 700,
  2: "#eee",
  3: "#fff392",
  4: `
  /* 输入css的属性 */
  font-weight: 700;
  `,
};

export let Config = {};

export async function initStore() {
  // 读取值
  Config = await chrome.storage.sync.get(null);
}

export async function initOnInstalled() {
  await chrome.storage.sync.set({
    [ConfigNames.FONT_SIZE_THRESHOLD]: 30,
    [ConfigNames.DISABLE_URL_PATTERN_LIST]: [],
    [ConfigNames.AUTO_URL_PATTERN_LIST]: [],
    [ConfigNames.HIGHLIGHT_TYPE]: HighlightMode.bg,
    [ConfigNames.HIGHLIGHT_VALUE]: HighlightModeDefaultValue[HighlightMode.bg],
    [ConfigNames.MODIFIED_WORD_NUM]: 0,
    [ConfigNames.SPLIT_MODE]: SplitMode.auto,
    [ConfigNames.IS_INIT]: true,
  });
}

chrome.storage.onChanged.addListener((changes) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    Config[key] = newValue;
  }
});
