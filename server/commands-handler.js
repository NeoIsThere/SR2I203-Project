import { io } from "./server.js";

export function executeCommand(command) {
  io.emit("log", "Received: " + command);
}
