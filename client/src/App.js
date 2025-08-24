import './App.css';
import ChatField from './ChatField';
import ChatTextField from './ChatTextField';

import 'emoji-picker-element';
import EmojiPicker from './EmojiPicker';

import { useState, useEffect, useRef, createElement } from 'react';


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
      Hallo Welt!
      <p>Dies ist eine React App.</p>
      <p>Sie läuft auf dem Client.</p>
      <input id="name-field" type="text" placeholder="Gib deinen Namen ein..." style={{height: "20px", margin: "10px"}}/>
      <ChatField messages={messages} />
      <ChatTextField />
      <EmojiPicker emojiSelectCallback={emojiSelectCallback} />
      <button onClick={() => handleSend(socketRef, setMessages)}>Senden</button>
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
}


export default App;