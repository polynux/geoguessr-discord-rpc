chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "url") {
    chrome.runtime.sendMessage({ message: "url", url: window.location.href });
  }
});

window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({ message: "close" });
});
