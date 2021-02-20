const client = new Discord.Client({ transport: "websocket" });

client.on("ready", () => {
  console.log("connected");
});

client.on("debug", payload => console.log(payload));

chrome.storage.local.get(["token"], token => {
  console.log(token);
  client.login(token.token).catch(err => console.log(err));
});

function setActivity(data) {
  let activity = {
    name: "Geoguessr",
    details: data.game,
    state: data.number + " - Score: " + data.score
  };

  if (data.game === "country-streak") {
    activity.details = "Country Streak";
    activity.state = "Série: " + data.score;
  }

  client.user.setActivity(activity);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.hasOwnProperty("game")) {
    setActivity(request);
  }
  //else {
  //   if (request.message === "play") {
  //     sendWebsocketState("play");
  //   } else if (request.message === "idle") {
  //     sendWebsocketState("idle");
  //   } else if (request.message === "leave") {
  //     sendWebsocketState("leave");
  //   } else if (request.message === "close") {
  //     sendWebsocketState("leave");
  //   } else {
  //     console.log(request.message);
  //   }
  // }
});
