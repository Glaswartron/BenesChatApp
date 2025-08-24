import "./MessageCard.css";

function MessageCard(props) {
    if (props.user) {
        return (
            <div className="message-card">
                <h2>{props.user}</h2>
                <p>{props.text}</p>
            </div>
        )
    } else {
        return (
            <div className="message-card-user">
                <p>{props.text}</p>
            </div>
        );
    }
}

export default MessageCard;