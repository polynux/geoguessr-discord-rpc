chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "url") {
    chrome.runtime.sendMessage({ message: "url", url: window.location.href });
  }
});

function sendState() {
  if (!window.location.href.match(/\/game\//g)) {
    chrome.runtime.sendMessage({ message: "idle" });
  } else {
    chrome.runtime.sendMessage({ message: "play" });
  }
}

window.onbeforeunload = () => {
  chrome.runtime.sendMessage({ message: "close" });
};

window.onfocus = () => {
  sendState();
};

window.onblur = () => {
  chrome.runtime.sendMessage({ message: "leave" });
};

window.onload = () => {
  sendState();
};

window.onpopstate = () => {
  sendState();
};
