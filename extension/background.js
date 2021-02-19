let ws = new WebSocket("ws://localhost:8080");

function onWsError() {
  let tryConnect = setInterval(() => {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      clearInterval(tryConnect);
      console.log("connected");
    };
  }, 10000);
}

ws.onopen = () => {
  console.log("connected");
};

ws.onerror = () => {
  onWsError();
};

ws.onclose = () => {
  onWsError();
};

const str = JSON.stringify;

function sendWebsocketState(state) {
  ws.send(str({ state: state }));
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "play") {
    sendWebsocketState("play");
  } else if (request.message === "idle") {
    sendWebsocketState("idle");
  } else if (request.message === "leave") {
    sendWebsocketState("leave");
  } else if (request.message === "close") {
    sendWebsocketState("leave");
  } else {
    console.log(request.message);
  }
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ url: "https://www.geoguessr.com/*" }, tabs => {
    sendWebsocketState("leave");
  });
});
