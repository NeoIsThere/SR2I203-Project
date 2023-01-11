import "./Console.css";
import React, { useEffect, useState } from "react";

function Console({ onSendCallback, messagesProps }) {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  useEffect(() => {
    setMessages(messagesProps);
  }, [messagesProps]); /*[log] is the variable we want to listen to for changes*/

  const onEditInput = (e) => {
    setCurrentInput((prevInput) => e.target.value);
  };

  const onSendCommand = () => {
    setCurrentInput("");
    onSendCallback(currentInput);
  };

  const onKeyUp = (key) => {
    if (key.code == "Enter") {
      onSendCommand();
    }
  };

  return (
    <div className="console" onKeyUp={onKeyUp}>
      <div className="console-header">Console</div>
      <div className="console-body">
        {messages.map((msg, index) => {
          if (msg.isFromServer) {
            return (
              <div className="console-output" key={index}>
                {msg.text}
              </div>
            );
          }
          return (
            <div className="console-output blue-text" key={index}>
              {msg.text}
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
