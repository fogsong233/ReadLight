export async function initAboutPage() {
  const aboutBtn = document.getElementById("about-btn");
  const aboutPageEle = document.getElementById("about");
  const mainPageEle = document.getElementById("content");
  aboutBtn.onclick = () => {
    mainPageEle.hidden = !mainPageEle.hidden;
    aboutPageEle.hidden = !aboutPageEle.hidden;
    aboutBtn.textContent = mainPageEle.hidden ? "返回" : "关于";
  };
  document.getElementById("github-go").onclick = () => {
    window.open("https://github.com/fogsong233/ReadLight", "_blank");
  };
  document.getElementById("home-go").onclick = () => {
    window.open("https://github.com/fogsong233/ReadLight", "_blank");
  };
}
