let ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("connected");
};

ws.onerror = () => {
  let tryConnect = setInterval(() => {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      clearInterval(tryConnect);
      console.log("connected");
    };
  }, 10000);
};

const str = JSON.stringify;

function sendWebsocketState(state) {
  ws.send(str({ state: state }));
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "url") {
    sendWebsocketState("play");
  }

  if (request.message === "close") {
    sendWebsocketState("leave");
  }
});

chrome.tabs.onActivated.addListener(() => {
  let count = 0;
  chrome.tabs.query({ active: true, currentWindow: true, url: "https://www.geoguessr.com/*" }, tabs => {
    sendWebsocketState("play");
    if (tabs.length !== 0) count = 1;
  });

  if (count === 0) {
    sendWebsocketState("leave");
  }
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ url: "https://www.geoguessr.com/*" }, tabs => {
    sendWebsocketState("leave");
  });
});
