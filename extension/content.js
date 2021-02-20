chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "url") {
    chrome.runtime.sendMessage({ message: "url", url: window.location.href });
  }
});

function sendStreak(streak) {
  chrome.runtime.sendMessage({
    game: "country-streak",
    score: streak[0].innerText
  });
}

function sendMap(body) {
  chrome.runtime.sendMessage({
    game: body[0].innerText,
    number: body[1].innerText,
    score: body[2].innerText
  });
}

function observe(body, func) {
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "characterData") {
        func(body.getElementsByClassName("game-status__body"));
      }
    }
  });

  let config = { attributes: true, childList: true, subtree: true, characterData: true };

  body.childNodes.forEach(node => observer.observe(node, config));
}

function sendState() {
  let statuses = document.getElementsByClassName("game-statuses")[0];
  let body = document.getElementsByClassName("game-statuses")[0].getElementsByClassName("game-status__body");
  let status = document.getElementsByClassName("game-status")[0];

  if (window.location.href.match(/\/game\//g)) {
    if (status.dataset.qa === "round-number") {
      sendStreak(body);
      observe(statuses, sendStreak);
    } else {
      sendMap(body);
      observe(statuses, sendMap);
    }

    // } else {
    //   chrome.runtime.sendMessage({ message: "idle" });
    // }
  }
}

// window.onbeforeunload = () => {
//   chrome.runtime.sendMessage({ message: "close" });
// };

window.onfocus = () => {
  sendState();
};

// window.onblur = () => {
//   chrome.runtime.sendMessage({ message: "leave" });
// };

window.onload = () => {
  sendState();
};

window.onpopstate = () => {
  sendState();
};
