import "./index.css";
import './App.css';
import ChatField from './ChatField';
import ChatTextField from './ChatTextField';

import 'emoji-picker-element';
import EmojiPicker from './EmojiPicker';

import { useState, useEffect, useRef } from 'react';


function App() {
  const socketRef = useRef(null);

  let [messages, setMessages] = useState([]);

  // Only runs once when the component mounts
  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:4000/ws');

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      console.log('Received:', event.data);

      let messageJson = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, messageJson]);
    };

    return () => {
      socketRef.current.close();
    };
  }, []); 

  return (
    <div className="App">
      <h1>Benes Chat App</h1>
      <input id="name-field" class="name-field" type="text" placeholder="Gib deinen Namen ein..." />
      <ChatField messages={messages} />
      <ChatTextField />
      <div class="chat-controls">
        <button class="send-button" onClick={() => handleSend(socketRef, setMessages)}>
          <span>Senden</span>
          <span class="send-icon-container">
            <img src="send-alt-1-svgrepo-com.svg" alt="Senden" class="send-icon" />
          </span>
        </button>
        <button class="emoji-button" onClick={showEmojiPicker}>Emoji</button>
      </div>
      <div id="emoji-picker-container" style={{ display: 'none'}}>
        <EmojiPicker emojiSelectCallback={emojiSelectCallback} />
      </div>
    </div>
  );
}

function handleSend(socketRef, setMessages) {
  // Send a message through the WebSocket
  if (socketRef) {
    // Send content of the ChatTextField
    const messageText = document.getElementById("chat-text-field").value;
    const name = document.getElementById("name-field").value;

    if (!messageText) {
      // Popup alert if message is empty
      alert("Bitte gib eine Nachricht ein.");
      return;
    } else if (!name) {
      alert("Bitte gib deinen Namen ein.");
      return;
    }

    const message = JSON.stringify({ user: name, text: messageText });
    socketRef.current.send(message);
    setMessages(prevMessages => [...prevMessages, { user: null, text: messageText }]);
  } else {
    console.error("WebSocket is not connected.");
  }

  console.log("Message sent!");
}

function emojiSelectCallback(event) {
  const chatTextField = document.getElementById("chat-text-field");
  chatTextField.value += event.detail.unicode;

  // Hide the emoji picker after selecting an emoji
  const emojiPickerContainer = document.getElementById("emoji-picker-container");
  emojiPickerContainer.style.display = "none";
}

function showEmojiPicker() {
  const emojiPickerContainer = document.getElementById("emoji-picker-container");
  if (emojiPickerContainer.style.display === "none") {
    emojiPickerContainer.style.display = "block";
  } else {
    emojiPickerContainer.style.display = "none";
  }
}


export default App;