function ChatMessage(props) {
  return (
    <div
      style={{
        backgroundColor: props.isUser ? "lightgray" : "lightblue",
        gridColumn: props.isUser ? "span 3 / -1" : "1 / span 3",
      }}
    >
      <p>{props.message}</p>
    </div>
  );
}

export default function ChatHistory(props) {
  return (
    <div>
      <div className="ChatHistory">
        {props.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
      </div>
      <textarea
        placeholder="Type your message here..."
        style={{ width: "100%", height: "100px", marginTop: "10px" }}
      />
    </div>
  );
}
