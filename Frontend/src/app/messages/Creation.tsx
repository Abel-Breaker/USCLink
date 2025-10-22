'use client';

// Messages.jsx
import { useState, useRef } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function Messages() {
  const [conversations] = useState([
    { id: 1, name: "Ana" },
    { id: 2, name: "Carlos" },
    { id: 3, name: "Lucía" },
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    { from: "Ana", text: "¡Hola! ¿Cómo estás?" },
    { from: "Yo", text: "Todo bien 😄 ¿y tú?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages([...messages, { from: "Yo", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", height: "80vh", border: "1px solid #ccc" }}>
      {/* Sidebar de conversaciones */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h2>Mensajes</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv.id}
              style={{
                padding: "10px",
                marginBottom: "5px",
                cursor: "pointer",
                backgroundColor:
                  activeChat.id === conv.id ? "#eee" : "transparent",
              }}
              onClick={() => setActiveChat(conv)}
            >
              {conv.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat principal */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            fontWeight: "bold",
          }}
        >
          {activeChat.name}
        </div>

        <div
          style={{
            flexGrow: 1,
            padding: "10px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.from === "Yo" ? "flex-end" : "flex-start",
                backgroundColor: msg.from === "Yo" ? "#007bff" : "#eee",
                color: msg.from === "Yo" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "15px",
                marginBottom: "5px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje */}
        <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            style={{
              flexGrow: 1,
              padding: "8px",
              borderRadius: "15px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              borderRadius: "15px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
