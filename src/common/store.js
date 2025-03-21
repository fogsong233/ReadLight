export const Store = {
  async set(key, value) {
    return await chrome.storage.sync.set([key], value);
  },
  async get(key) {
    return await chrome.storage.sync.get(key);
  },
};

export const ConfigNames = {
  FONT_SIZE_THRESHOLD: "font_size_threshold",
  DISABLE_URL_PATTERN_LIST: "disable_list",
  AUTO_URL_PATTERN_LIST: "auto_list",
  // 1:是加粗,值是weight; 2是颜色:值是颜色的hex,3是自定义,一个css代码, 4是背景,值是颜色的hex
  HIGHLIGHT_TYPE: "highlight_type",
  HIGHLIGHT_VALUE: "highlight_value",
  MODIFIED_WORD_NUM: "word_num",
  // 1: 前2个字节,2前1个字节,3:字符串前一半,4:字符串前1/3, 5:是智能
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

export let Config = {};

export async function initStore() {
  await chrome.storage.sync.clear();
  if (
    !(await chrome.storage.sync.get({ [ConfigNames.IS_INIT]: false })[
      ConfigNames.IS_INIT
    ])
  ) {
    await chrome.storage.sync.set({
      [ConfigNames.FONT_SIZE_THRESHOLD]: 30,
      [ConfigNames.DISABLE_URL_PATTERN_LIST]: [],
      [ConfigNames.AUTO_URL_PATTERN_LIST]: [],
      [ConfigNames.HIGHLIGHT_TYPE]: 1,
      [ConfigNames.HIGHLIGHT_VALUE]: "600",
      [ConfigNames.MODIFIED_WORD_NUM]: 0,
      [ConfigNames.SPLIT_MODE]: 5,
      [ConfigNames.IS_INIT]: true,
    });
  }
  // 读取值
  Config = await chrome.storage.sync.get(null);
  console.log("now config");
  console.log(Config);
}

chrome.storage.onChanged.addListener((changes) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    Config[key] = newValue;
    console.log(`update: ${Config}`);
  }
});
