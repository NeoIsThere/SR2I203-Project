import { useState, useEffect } from "react";
import "./App.css";
import Console from "./components/console/Console";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", { query: { role: "admin" } });

/*Do not forget that since app is running in Strict mode it will run twice at every startup.*/
function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => console.log("connected!:"));

    socket.on("log", (log) => {
      updateMessages(log, true);
    });
  }, []);

  function onSendCommand(command) {
    updateMessages(command, false);
    socket.emit("send-command", command);
  }

  function updateMessages(newMessage, isFromServer) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, isFromServer },
    ]); /*this changes the state which causes a rerender so the child get the new log*/
  }

  return (
    <div className="root-container">
      <Console onSendCallback={onSendCommand} messagesProps={messages}></Console>
    </div>
  );
}

export default App;
