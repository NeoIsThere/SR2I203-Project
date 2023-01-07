import { executeCommand } from "./commands-handler.js";

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

//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("User connected");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("User disconnected");
  });

  socket.on("send-command", (command) => {
    executeCommand(command);
  });

  socket.on("error", () => {});
});

httpServer.listen(8080, function () {
  console.log("listening on port 8080");
});
