import ChatHistory from "../components/ChatMessage";
export default function ChatPage() {
  return (
    <div
      style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "auto",
      }}
    >
      <div>
        <h2>1 Day Ago</h2>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h2>1 Week Ago</h2>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
        <h3>Chat Page</h3>
      </div>
      <div style={{ gridColumn: "2 / -1" }}>
        <ChatHistory
          messages={[
            { text: "Hello, world!", isUser: true },
            { text: "Hi there!", isUser: false },
            { text: "Hi there!", isUser: true },
            { text: "Hi there!", isUser: false },
          ]}
        />
      </div>
    </div>
  );
}
