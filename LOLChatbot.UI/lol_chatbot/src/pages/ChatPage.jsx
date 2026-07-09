import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addMessageToChat,
  createChat,
  deleteChat,
  getChatById,
  getMyChats,
  renameChat,
} from "../api/ChatClient";
import { logout } from "../api/AuthClient";
import HexLogo from "../components/HexLogo";
import DiamondDot from "../components/icons/DiamondDot";
import SearchIcon from "../components/icons/SearchIcon";
import HexAvatar from "../components/icons/HexAvatar";
import Modal from "../components/Modal";
import HexPulseLoader from "../components/HexPulseLoader";
import FracturedSigilError from "../components/FracturedSigilError";
import { C } from "../constants/theme";

function groupChatsByDate(chats) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups = { TODAY: [], YESTERDAY: [], "PREVIOUS 7 DAYS": [], OLDER: [] };
  for (const chat of chats) {
    const d = new Date(chat.lastUpdate);
    d.setHours(0, 0, 0, 0);
    if (d >= today) groups.TODAY.push(chat);
    else if (d >= yesterday) groups.YESTERDAY.push(chat);
    else if (d >= sevenDaysAgo) groups["PREVIOUS 7 DAYS"].push(chat);
    else groups.OLDER.push(chat);
  }
  return groups;
}

function ChatMessage({ message, isUser }) {
  if (isUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            maxWidth: "78%",
            background: C.userMsgBg,
            border: `1px solid ${C.gold}`,
            padding: "12px 16px",
            color: C.textLight,
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {message}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
      <HexAvatar />
      <div style={{ flex: 1, maxWidth: "78%" }}>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: C.gold,
            marginBottom: "8px",
          }}
        >
          ATLAS
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.6", color: C.textMed }}>
          {message}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [failedMessageText, setFailedMessageText] = useState(null);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [newChatModal, setNewChatModal] = useState({ open: false, value: "" });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    chatId: null,
    chatName: "",
  });
  const [renameModal, setRenameModal] = useState({
    open: false,
    chatId: null,
    value: "",
  });
  const [chatsLoadError, setChatsLoadError] = useState(false);
  const messagesEndRef = useRef(null);
  const newChatInputRef = useRef(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAwaitingResponse, failedMessageText]);

  const loadChats = () => {
    setChatsLoadError(false);
    getMyChats()
      .then(setChats)
      .catch((err) => {
        console.error("Failed to fetch chats:", err);
        setChatsLoadError(true);
      });
  };

  useEffect(() => {
    loadChats();
  }, []);

  const refreshChats = async () => {
    const userChats = await getMyChats();
    setChats(userChats);
  };

  const handleChatClick = async (chatId) => {
    try {
      setSelectedChatId(chatId);
      setFailedMessageText(null);
      const chat = await getChatById(chatId);
      console.log(chat);
      setMessages(
        (chat.messages ?? []).map((msg) => ({
          text: msg.content,
          isUser: msg.role === "User",
        })),
      );
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      setMessages([]);
    }
  };

  const handleRenameChat = (chatId, currentName) => {
    setRenameModal({ open: true, chatId, value: currentName });
    setTimeout(() => renameInputRef.current?.select(), 0);
  };

  const submitRenameChat = async () => {
    const { chatId, value } = renameModal;
    const trimmed = value.trim();
    const currentName = chats.find((c) => c.id === chatId)?.chatName ?? "";
    if (!trimmed || trimmed === currentName) {
      setRenameModal({ open: false, chatId: null, value: "" });
      return;
    }
    setRenameModal({ open: false, chatId: null, value: "" });
    try {
      await renameChat(chatId, trimmed);
      await refreshChats();
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const handleDeleteChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setDeleteModal({ open: true, chatId, chatName: chat?.chatName ?? "" });
  };

  const confirmDeleteChat = async () => {
    const { chatId } = deleteModal;
    setDeleteModal({ open: false, chatId: null, chatName: "" });
    try {
      await deleteChat(chatId);
      setChats((curr) => curr.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleNewChat = () => {
    setNewChatModal({ open: true, value: "New chat" });
    setTimeout(() => newChatInputRef.current?.select(), 0);
  };

  const submitNewChat = async () => {
    const trimmed = newChatModal.value.trim();
    if (!trimmed) return;
    setNewChatModal({ open: false, value: "" });
    try {
      const newChat = await createChat(trimmed);
      setChats((curr) => [...curr, newChat]);
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
    setFailedMessageText(null);
    setIsAwaitingResponse(true);
    try {
      const reply = await addMessageToChat(selectedChatId, text);
      setIsAwaitingResponse(false);
      setMessages((prev) => [...prev, { text: reply, isUser: false }]);
    } catch (error) {
      setIsAwaitingResponse(false);
      setFailedMessageText(text);
      console.error("Failed to send message:", error);
    }
  };

  const handleRetry = async () => {
    const text = failedMessageText;
    if (!text || !selectedChatId) return;
    setFailedMessageText(null);
    setIsAwaitingResponse(true);
    try {
      const reply = await addMessageToChat(selectedChatId, text);
      setIsAwaitingResponse(false);
      setMessages((prev) => [...prev, { text: reply, isUser: false }]);
    } catch (error) {
      setIsAwaitingResponse(false);
      setFailedMessageText(text);
      console.error("Failed to send message:", error);
    }
  };

  const handleDismissError = () => setFailedMessageText(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleChats = chats
    .slice()
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .filter((chat) =>
      (chat.chatName ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const chatGroups = groupChatsByDate(visibleChats);
  const selectedChat = chats.find((c) => c.id === selectedChatId);

  const inputBarStyle = {
    background: C.inputBarBg,
    border: `1px solid ${C.inputBarBorder}`,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: C.textMed,
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
  };

  const sendBtnStyle = (disabled) => ({
    background: C.gold,
    color: C.bg,
    border: "none",
    padding: "9px 18px",
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.22em",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  if (chatsLoadError) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          color: C.textMed,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "20px",
            color: C.textLight,
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          The archives would not open
        </div>
        <div
          style={{
            fontSize: "14px",
            color: C.textSubtle,
            marginBottom: "28px",
          }}
        >
          Failed to load your chats.
        </div>
        <button
          type="button"
          onClick={loadChats}
          style={{
            background: "transparent",
            border: `1px solid ${C.gold}`,
            color: C.textLight,
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            padding: "11px 22px",
            cursor: "pointer",
          }}
        >
          REFRESH
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: C.bg,
        display: "flex",
        fontFamily: "'Inter', sans-serif",
        color: C.textMed,
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "288px",
          flexShrink: 0,
          background: C.sidebarBg,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "22px 22px 18px 22px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <HexLogo size={22} />
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: C.textLight,
                  letterSpacing: "0.18em",
                }}
              >
                ARCANE ATLAS
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.textSubtle,
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
                fontSize: "10px",
                letterSpacing: "0.14em",
                padding: "5px 8px",
              }}
            >
              LOGOUT
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            style={{
              width: "100%",
              padding: "11px 14px",
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.textLight,
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> NEW
            SUMMONING
          </button>

          <div style={{ position: "relative", marginTop: "14px" }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search the archives"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px 9px 34px",
                background: C.inputBg,
                border: `1px solid ${C.border}`,
                color: C.textMed,
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
          {Object.entries(chatGroups).map(([group, groupChats]) =>
            groupChats.length === 0 ? null : (
              <div key={group}>
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: C.textSubtle,
                    padding: "6px 10px",
                    marginTop: "8px",
                  }}
                >
                  {group}
                </div>
                {groupChats.map((chat) => {
                  const isSelected = selectedChatId === chat.id;
                  const isHovered = hoveredChatId === chat.id;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      onMouseEnter={() => setHoveredChatId(chat.id)}
                      onMouseLeave={() => setHoveredChatId(null)}
                      style={{
                        padding: "9px 10px",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: isSelected ? C.textLight : C.textMuted,
                        background: isSelected
                          ? "#0e2348"
                          : isHovered
                            ? "rgba(200,170,110,0.05)"
                            : "transparent",
                        borderLeft: isSelected
                          ? `2px solid ${C.gold}`
                          : "2px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {chat.chatName}
                      </span>
                      {isHovered && (
                        <span
                          style={{
                            display: "flex",
                            gap: "4px",
                            flexShrink: 0,
                            marginLeft: "6px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameChat(chat.id, chat.chatName);
                            }}
                            title="Rename"
                            style={{
                              background: "none",
                              border: "none",
                              color: C.gold,
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "2px 4px",
                              lineHeight: 1,
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            title="Delete"
                            style={{
                              background: "none",
                              border: "none",
                              color: C.textSubtle,
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "2px 4px",
                              lineHeight: 1,
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!selectedChatId ? (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginBottom: "24px", opacity: 0.85 }}
            >
              <polygon
                points="12,2 21,7 21,17 12,22 3,17 3,7"
                stroke={C.gold}
                strokeWidth="1.2"
                fill="none"
              />
              <polygon
                points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5"
                stroke={C.gold}
                strokeWidth="1"
                fill="none"
              />
            </svg>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "26px",
                fontWeight: 500,
                color: C.textLight,
                letterSpacing: "0.04em",
                marginBottom: "10px",
              }}
            >
              Summon a champion
            </div>
            <div
              style={{
                fontSize: "14px",
                color: C.textSubtle,
                marginBottom: "36px",
              }}
            >
              Select a chat or start a new summoning.
            </div>

            <div style={{ width: "100%", maxWidth: "640px", ...inputBarStyle }}>
              <input
                type="text"
                placeholder="What would you ask the Atlas?"
                disabled
                style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }}
              />
              <button type="button" disabled style={sendBtnStyle(true)}>
                SEND
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div
              style={{
                padding: "18px 28px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <DiamondDot />
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "14px",
                  color: C.textLight,
                  letterSpacing: "0.10em",
                }}
              >
                {selectedChat?.chatName?.toUpperCase()}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 56px" }}>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
              ))}
              {isAwaitingResponse && <HexPulseLoader />}
              {!isAwaitingResponse && failedMessageText && (
                <FracturedSigilError
                  onRetry={handleRetry}
                  onDismiss={handleDismissError}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              style={{
                padding: "18px 28px",
                borderTop: `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            >
              <div style={inputBarStyle}>
                <input
                  type="text"
                  placeholder="Continue the consultation…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isAwaitingResponse}
                  style={sendBtnStyle(!inputText.trim() || isAwaitingResponse)}
                >
                  SEND
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── New Chat Modal ── */}
      {newChatModal.open && (
        <Modal
          title="NEW SUMMONING"
          onClose={() => setNewChatModal({ open: false, value: "" })}
          onConfirm={submitNewChat}
          confirmLabel="CREATE"
          confirmDisabled={!newChatModal.value.trim()}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.textSubtle,
              marginBottom: "8px",
            }}
          >
            Summoning name
          </div>
          <input
            ref={newChatInputRef}
            type="text"
            value={newChatModal.value}
            onChange={(e) =>
              setNewChatModal((s) => ({ ...s, value: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") submitNewChat();
              if (e.key === "Escape")
                setNewChatModal({ open: false, value: "" });
            }}
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px",
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              color: C.textMed,
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </Modal>
      )}

      {/* ── Rename Modal ── */}
      {renameModal.open && (
        <Modal
          title="RENAME SUMMONING"
          onClose={() =>
            setRenameModal({ open: false, chatId: null, value: "" })
          }
          onConfirm={submitRenameChat}
          confirmLabel="RENAME"
          confirmDisabled={!renameModal.value.trim()}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.textSubtle,
              marginBottom: "8px",
            }}
          >
            New name
          </div>
          <input
            ref={renameInputRef}
            type="text"
            value={renameModal.value}
            onChange={(e) =>
              setRenameModal((s) => ({ ...s, value: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRenameChat();
              if (e.key === "Escape")
                setRenameModal({ open: false, chatId: null, value: "" });
            }}
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px",
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              color: C.textMed,
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal.open && (
        <Modal
          title="CONFIRM DELETION"
          onClose={() =>
            setDeleteModal({ open: false, chatId: null, chatName: "" })
          }
          onConfirm={confirmDeleteChat}
          confirmLabel="DELETE"
          confirmDanger={true}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: C.textMuted,
              lineHeight: "1.6",
            }}
          >
            Delete{" "}
            <span style={{ color: C.textLight, fontStyle: "italic" }}>
              "{deleteModal.chatName}"
            </span>
            ? This cannot be undone.
          </div>
        </Modal>
      )}
    </div>
  );
}
