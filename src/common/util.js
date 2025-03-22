export const STYLE_CLASS_NAME = "__readlight-highlight-v1__";
export const STYLE_ELE_ID = "__readlight-style-v1__";
export const QUERY_SELECTOR_STR =
  "body " +
  ["table", "code", "style", "header", "footer", "img", "a", "pre"]
    .map((tag) => `:not(${tag}):not(${tag} *)`)
    .join("");

export function getCurrentUrlWithoutProtocol() {
  const fullUrl = window.location.href;
  return fullUrl.substring(fullUrl.indexOf("//") + 2);
}

export function formatNumber(num) {
  if (num < 1000) {
    return num.toString();
  }

  const units = ["k", "M", "B", "T"];
  let order = Math.floor(Math.log10(num) / 3);
  let scaledNumber = num / Math.pow(1000, order);

  return scaledNumber.toFixed(1) + units[order - 1];
}
