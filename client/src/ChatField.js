import "./ChatField.css";
import MessageCard from "./MessageCard";

function ChatField(props) {
    return (
        <div id="chat-field" className="chat-field">
            {props.messages.map((message, index) => 
                <MessageCard key={index} index={index} user={message.user} text={message.text} />
            )}
        </div>
    );
}

export default ChatField;