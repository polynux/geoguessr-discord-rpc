const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const RPC = require("discord-rpc");
const rpc = new RPC.Client({
  transport: "ipc"
});

function setActivity(activity) {
  rpc.setActivity({
    details: "Geomerding",
    state: activity.state,
    largeImageKey: "geoguessr_1024",
    largeImageText: "Geoguessr"
  });
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
    console.log(data.state);

    if (data.state === "play") {
      setActivity({ state: "playing" });
    } else if (data.state === "idle") {
      setActivity({ state: "idle" });
    } else if (data.state === "leave") {
      rpc.clearActivity();
    }
  });
});

rpc.on("ready", () => {
  console.log("Rich presence ready");
});

rpc.login({
  clientId: "811914104511528990"
});
