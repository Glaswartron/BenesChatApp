import "./ChatTextField.css";

function ChatTextField() {
  return (
    <div>
      <input id="chat-text-field" className="chat-text-field" type="text" placeholder="Type your message here..." />
    </div>
  );
}

export default ChatTextField;