const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const RPC = require("discord-rpc");
const rpc = new RPC.Client({
  transport: "ipc"
});

function setActivity(activity, type) {
  if (type === "streak") {
    rpc.setActivity({
      details: "Geomerding",
      state: activity.game + " - " + activity.score,
      largeImageKey: "geoguessr_1024",
      largeImageText: "Geoguessr"
    });
  } else {
    rpc.setActivity({
      details: "Geomerding",
      state: activity.game + " - " + activity.number + " - " + activity.score,
      largeImageKey: "geoguessr_1024",
      largeImageText: "Geoguessr"
    });
  }
}

const parse = JSON.parse;

wss.on("connection", ws => {
  console.log("client connected");

  ws.on("close", () => {
    rpc.clearActivity();
    console.log("client disconnected");
  });

  ws.on("message", data => {
    data = JSON.parse(data);

    if (data.game === "country-streak") {
      data.game = "Country Streak";
      setActivity(data, "streak");
    } else {
      setActivity(data);
    }

    // if (data.state === "play") {
    //   setActivity({ state: "playing" });
    // } else if (data.state === "idle") {
    //   setActivity({ state: "idle" });
    // } else if (data.state === "leave") {
    //   rpc.clearActivity();
    // }
  });
});

rpc.on("ready", () => {
  console.log("Rich presence ready");
});

rpc.login({
  clientId: "811914104511528990"
});
