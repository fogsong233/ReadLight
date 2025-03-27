import { Config, ConfigNames, Store } from "../common/store";
import { getCurrentUrlWithoutProtocol } from "../common/util";

export async function initAutoConfig() {
  const urlInput = document.querySelector("#auto-input");
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  urlInput.value = tab.url;
  const setUrlBtn = document.getElementById("set-url");
  setUrlBtn.onclick = async () => {
    setUrlBtn.textContent = "加载中";
    await Store.set(ConfigNames.AUTO_URL_PATTERN_LIST, [
      ...new Set([
        ...Config[ConfigNames.AUTO_URL_PATTERN_LIST],
        urlInput.value,
      ]),
    ]);
    setUrlBtn.textContent = "成功!";
    setTimeout(() => {
      setUrlBtn.textContent = "设定";
    }, 2000);
  };
  document.getElementById("manage-return").onclick = () => {
    document.getElementById("content").hidden = false;
    document.getElementById("about-btn").hidden = false;
    document.getElementById("manage-site").hidden = true;
  };

  document.querySelector("#auto-config a").onclick = () => {
    document.getElementById("content").hidden = true;
    document.getElementById("about").hidden = true;
    document.getElementById("manage-site").hidden = false;
    document.getElementById("about-btn").hidden = true;
    // 载入列表
    const itemListEle = document.querySelector("#site-list");
    for (const url of Config[ConfigNames.AUTO_URL_PATTERN_LIST]) {
      const item = document.createElement("div");
      item.classList.add("list-item");
      const urlDiv = document.createElement("div");
      if (url.length < 100) {
        urlDiv.textContent = url;
      } else {
        urlDiv.textContent = url.slice(0, 100) + "...";
      }
      const deleteBtn = document.createElement("a");
      deleteBtn.textContent = "删除";
      deleteBtn.onclick = async () => {
        await Store.set(
          ConfigNames.AUTO_URL_PATTERN_LIST,
          Config[ConfigNames.AUTO_URL_PATTERN_LIST].filter(
            (value) => value != url
          )
        );
        item.remove();
      };
      item.appendChild(urlDiv);
      item.appendChild(deleteBtn);
      itemListEle.appendChild(item);
    }
  };
}
