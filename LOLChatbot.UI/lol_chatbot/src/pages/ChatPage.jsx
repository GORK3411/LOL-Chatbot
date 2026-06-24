import { useEffect, useState } from "react";
import {
  addMessageToChat,
  createChat,
  deleteChat,
  getChatById,
  getChatsByUserId,
  renameChat,
} from "../api/ChatClient";

function ChatMessage(props) {
  return (
    <div
      style={{
        backgroundColor: props.isUser ? "lightgray" : "lightblue",
        gridColumn: props.isUser ? "span 3 / -1" : "1 / span 3",
        height: "100%",
      }}
    >
      <p>{props.message}</p>
    </div>
  );
}

function ChatHistory(props) {
  return (
    <div style={{ height: "100%" }}>
      <div className="ChatHistory">
        {props.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userChats = await getChatsByUserId("user-1");
        setChats(userChats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = async (chatId) => {
    try {
      setSelectedChatId(chatId);
      const chat = await getChatById(chatId);
      const chatMessages = (chat.messages ?? []).map((message, index) => ({
        text: message,
        isUser: index % 2 === 0,
      }));

      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      setMessages([]);
    }
  };

  const refreshChats = async () => {
    const userChats = await getChatsByUserId("user-1");
    setChats(userChats);
  };

  const handleRenameChat = async (chatId, currentName) => {
    const newName = window.prompt("Rename chat", currentName);

    if (newName === null) {
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName || trimmedName === currentName) {
      return;
    }

    try {
      await renameChat(chatId, trimmedName);
      await refreshChats();
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    const confirmed = window.confirm("Delete this chat?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteChat(chatId);
      setChats((currentChats) =>
        currentChats.filter((chat) => chat.id !== chatId),
      );

      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleNewChat = async () => {
    const chatName = window.prompt("New chat name", "New chat");

    if (chatName === null) {
      return;
    }

    const trimmedName = chatName.trim();

    if (!trimmedName) {
      return;
    }

    try {
      const newChat = await createChat(trimmedName);
      setChats((currentChats) => [...currentChats, newChat]);
      setSelectedChatId(newChat.id);
      setMessages([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || !selectedChatId) return;
    setMessages((prev) => [...prev, { text, isUser: true }]);
    setInputText("");

    try {
      const agentReply = await addMessageToChat(selectedChatId, text);
      setMessages((prev) => [...prev, { text: agentReply, isUser: false }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const visibleChats = chats
    .slice()
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .filter((chat) =>
      (chat.chatName ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

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
        <div>
          <button type="button" onClick={handleNewChat}>
            New Chat
          </button>
          <br />
          <input
            type="text"
            placeholder="Search chats..."
            id="searchBar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div id="chats">
          {visibleChats.map((chat) => (
            <div
              key={chat.id}
              style={{
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
              onClick={() => handleChatClick(chat.id)}
            >
              <span>{chat.chatName}</span>
              <span style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameChat(chat.id, chat.chatName);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          gridColumn: "2 / -1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatHistory messages={messages} />
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!selectedChatId}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!selectedChatId || !inputText.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
