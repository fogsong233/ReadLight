export function notSupportPageOn() {
  document.getElementById("config").hidden = true;
  const lightBtn = document.getElementById("light-btn");
  lightBtn.textContent = "不支持该页面";
  lightBtn.disabled = true;
}
