import "./Console.css";
import React, { useEffect, useState } from "react";

function Console({ onSendCallback, log }) {
  const [messages, setMessages] = useState([""]);
  const [currentInput, setCurrentInput] = useState("");

  useEffect(() => {
    updateMessages(log);
  }, [log]); /*[log] is the variable we want to listen to for changes*/

  const onEditInput = (e) => {
    setCurrentInput((prevInput) => e.target.value);
  };

  const onSendCommand = () => {
    updateMessages(currentInput);
    setCurrentInput("");
    onSendCallback(currentInput);
  };

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="console">
      <div className="console-header">Console</div>
      <div className="console-body">
        {messages.map((msg, index) => {
          return (
            <div className="console-output" key={index}>
              {msg}
            </div>
          );
        })}
      </div>
      <div className="console-input">
        <input value={currentInput} type="text" placeholder="Enter a command" onChange={onEditInput} />
        <button onClick={onSendCommand}>Enter</button>
      </div>
    </div>
  );
}

export default Console;
