import { useEffect, useState } from "react";
import "./App.css";
import Console from "./components/console/Console";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

/*Do not forget that since app is running in Strict mode it will run twice at every startup.*/
function App() {
  const [newLog, setNewLog] = useState("");

  socket.on("connect", () => console.log("connected!"));

  socket.on("log", (log) => {
    setNewLog(log); /*this changes the state which causes a rerender so the child get the new log*/
  });

  function onSendCommand(command) {
    socket.emit("send-command", command);
  }

  return (
    <div className="root-container">
      <Console onSendCallback={onSendCommand} log={newLog}></Console>
    </div>
  );
}

export default App;
