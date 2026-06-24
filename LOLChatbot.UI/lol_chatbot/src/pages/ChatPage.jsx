import { useEffect, useRef, useState } from "react";
import {
  addMessageToChat,
  createChat,
  deleteChat,
  getChatById,
  getChatsByUserId,
  renameChat,
} from "../api/ChatClient";

const C = {
  bg: "#0a1428",
  sidebarBg: "#0a1830",
  border: "#1b2c4d",
  gold: "#c8aa6e",
  textLight: "#f0e6d2",
  textMed: "#cdbe91",
  textMuted: "#a09b8c",
  textSubtle: "#5b6b87",
  inputBg: "#06101f",
  userMsgBg: "#0e2348",
  inputBarBg: "#0a1830",
  inputBarBorder: "#2a4271",
};

function HexLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke={C.gold} strokeWidth="1.5" fill="none" />
      <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill={C.gold} />
    </svg>
  );
}

function HexAvatar() {
  return (
    <div style={{
      flexShrink: 0,
      width: "30px",
      height: "30px",
      border: `1px solid ${C.gold}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke={C.gold} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function DiamondDot() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10">
      <polygon points="5,0 10,5 5,10 0,5" fill={C.gold} />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
      <circle cx="11" cy="11" r="7" stroke={C.textSubtle} strokeWidth="2" />
      <line x1="16" y1="16" x2="20" y2="20" stroke={C.textSubtle} strokeWidth="2" />
    </svg>
  );
}

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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "22px" }}>
        <div style={{
          maxWidth: "78%",
          background: C.userMsgBg,
          border: `1px solid ${C.gold}`,
          padding: "12px 16px",
          color: C.textLight,
          fontSize: "14px",
          lineHeight: "1.5",
        }}>
          {message}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
      <HexAvatar />
      <div style={{ flex: 1, maxWidth: "78%" }}>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: C.gold,
          marginBottom: "8px",
        }}>ATLAS</div>
        <div style={{ fontSize: "14px", lineHeight: "1.6", color: C.textMed }}>
          {message}
        </div>
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
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [newChatModal, setNewChatModal] = useState({ open: false, value: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, chatId: null, chatName: "" });
  const [renameModal, setRenameModal] = useState({ open: false, chatId: null, value: "" });
  const messagesEndRef = useRef(null);
  const newChatInputRef = useRef(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getChatsByUserId("user-1")
      .then(setChats)
      .catch((err) => console.error("Failed to fetch chats:", err));
  }, []);

  const refreshChats = async () => {
    const userChats = await getChatsByUserId("user-1");
    setChats(userChats);
  };

  const handleChatClick = async (chatId) => {
    try {
      setSelectedChatId(chatId);
      const chat = await getChatById(chatId);
      setMessages(
        (chat.messages ?? []).map((text, i) => ({ text, isUser: i % 2 === 0 }))
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
    try {
      const reply = await addMessageToChat(selectedChatId, text);
      setMessages((prev) => [...prev, { text: reply, isUser: false }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const visibleChats = chats
    .slice()
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .filter((chat) =>
      (chat.chatName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: C.bg,
      display: "flex",
      fontFamily: "'Inter', sans-serif",
      color: C.textMed,
      overflow: "hidden",
    }}>
      {/* ── Sidebar ── */}
      <div style={{
        width: "288px",
        flexShrink: 0,
        background: C.sidebarBg,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "22px 22px 18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <HexLogo />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: C.textLight,
              letterSpacing: "0.18em",
            }}>ARCANE ATLAS</span>
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
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> NEW SUMMONING
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
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: C.textSubtle,
                  padding: "6px 10px",
                  marginTop: "8px",
                }}>{group}</div>
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
                        background: isSelected ? "#0e2348" : isHovered ? "rgba(200,170,110,0.05)" : "transparent",
                        borderLeft: isSelected ? `2px solid ${C.gold}` : "2px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {chat.chatName}
                      </span>
                      {isHovered && (
                        <span style={{ display: "flex", gap: "4px", flexShrink: 0, marginLeft: "6px" }}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRenameChat(chat.id, chat.chatName); }}
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
                          >✎</button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
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
                          >✕</button>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selectedChatId ? (
          /* Empty state */
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "24px", opacity: 0.85 }}>
              <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke={C.gold} strokeWidth="1.2" fill="none" />
              <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" stroke={C.gold} strokeWidth="1" fill="none" />
            </svg>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "26px",
              fontWeight: 500,
              color: C.textLight,
              letterSpacing: "0.04em",
              marginBottom: "10px",
            }}>Summon a champion</div>
            <div style={{
              fontSize: "14px",
              color: C.textSubtle,
              marginBottom: "36px",
            }}>Select a chat or start a new summoning.</div>

            <div style={{ width: "100%", maxWidth: "640px", ...inputBarStyle }}>
              <input
                type="text"
                placeholder="What would you ask the Atlas?"
                disabled
                style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }}
              />
              <button type="button" disabled style={sendBtnStyle(true)}>SEND</button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{
              padding: "18px 28px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}>
              <DiamondDot />
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "14px",
                color: C.textLight,
                letterSpacing: "0.10em",
              }}>
                {selectedChat?.chatName?.toUpperCase()}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 56px" }}>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "18px 28px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
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
                  disabled={!inputText.trim()}
                  style={sendBtnStyle(!inputText.trim())}
                >SEND</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── New Chat Modal ── */}
      {newChatModal.open && (
        <div
          onClick={() => setNewChatModal({ open: false, value: "" })}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,16,31,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.sidebarBg,
              border: `1px solid ${C.gold}`,
              padding: "32px",
              minWidth: "400px",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}>
              <DiamondDot />
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "15px",
                fontWeight: 600,
                color: C.textLight,
                letterSpacing: "0.14em",
              }}>NEW SUMMONING</span>
            </div>

            <div style={{ height: "1px", background: C.border, marginBottom: "20px" }} />

            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.textSubtle,
              marginBottom: "8px",
            }}>Summoning name</div>
            <input
              ref={newChatInputRef}
              type="text"
              value={newChatModal.value}
              onChange={(e) => setNewChatModal((s) => ({ ...s, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewChat();
                if (e.key === "Escape") setNewChatModal({ open: false, value: "" });
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

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setNewChatModal({ open: false, value: "" })}
                style={{
                  padding: "9px 18px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                }}
              >CANCEL</button>
              <button
                type="button"
                onClick={submitNewChat}
                disabled={!newChatModal.value.trim()}
                style={{
                  padding: "9px 18px",
                  background: C.gold,
                  border: "none",
                  color: C.bg,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  cursor: newChatModal.value.trim() ? "pointer" : "default",
                  opacity: newChatModal.value.trim() ? 1 : 0.4,
                }}
              >CREATE</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rename Modal ── */}
      {renameModal.open && (
        <div
          onClick={() => setRenameModal({ open: false, chatId: null, value: "" })}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,16,31,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.sidebarBg,
              border: `1px solid ${C.gold}`,
              padding: "32px",
              minWidth: "400px",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}>
              <DiamondDot />
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "15px",
                fontWeight: 600,
                color: C.textLight,
                letterSpacing: "0.14em",
              }}>RENAME SUMMONING</span>
            </div>

            <div style={{ height: "1px", background: C.border, marginBottom: "20px" }} />

            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.textSubtle,
              marginBottom: "8px",
            }}>New name</div>
            <input
              ref={renameInputRef}
              type="text"
              value={renameModal.value}
              onChange={(e) => setRenameModal((s) => ({ ...s, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRenameChat();
                if (e.key === "Escape") setRenameModal({ open: false, chatId: null, value: "" });
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

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setRenameModal({ open: false, chatId: null, value: "" })}
                style={{
                  padding: "9px 18px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                }}
              >CANCEL</button>
              <button
                type="button"
                onClick={submitRenameChat}
                disabled={!renameModal.value.trim()}
                style={{
                  padding: "9px 18px",
                  background: C.gold,
                  border: "none",
                  color: C.bg,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  cursor: renameModal.value.trim() ? "pointer" : "default",
                  opacity: renameModal.value.trim() ? 1 : 0.4,
                }}
              >RENAME</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal.open && (
        <div
          onClick={() => setDeleteModal({ open: false, chatId: null, chatName: "" })}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,16,31,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.sidebarBg,
              border: `1px solid ${C.border}`,
              padding: "32px",
              minWidth: "400px",
            }}
          >
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "15px",
              fontWeight: 600,
              color: C.textLight,
              letterSpacing: "0.14em",
              marginBottom: "20px",
            }}>CONFIRM DELETION</div>

            <div style={{ height: "1px", background: C.border, marginBottom: "20px" }} />

            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: C.textMuted,
              lineHeight: "1.6",
            }}>
              Delete{" "}
              <span style={{ color: C.textLight, fontStyle: "italic" }}>
                "{deleteModal.chatName}"
              </span>
              ? This cannot be undone.
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, chatId: null, chatName: "" })}
                style={{
                  padding: "9px 18px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                }}
              >CANCEL</button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                style={{
                  padding: "9px 18px",
                  background: "transparent",
                  border: "1px solid #c8503a",
                  color: "#c8503a",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  cursor: "pointer",
                }}
              >DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
