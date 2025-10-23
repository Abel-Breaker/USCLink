'use client';

// Messages.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function Messages() {

  const userSesion = "Dani"; // Usuario que inicio sesión (TEMPORAL DEBUG)

  interface User {
    username: string;
  }


const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);



  const handleSend = () => {
    if (!newMessage.trim()) return;

    //setMessages([...messages, { sender: { username: userSesion }, messageContent: newMessage }]);
    //setNewMessage("");
  };
  

  interface Message {
    id: number;
    chat: Chat;
    sender: User;
    timestamp: string;
    messageContent: string;
  }
  // Message's variable
  const [messages, setMessages] = useState<Message[]>([]);

  // Obtener lista de usuarios desde el backend
  const fetchMessages = async (chatId: number) => {
    try {
      const resp = await axios.get("http://localhost:8080/messages", {
        params: { chatId }
      });
      setMessages(resp.data.content);
      console.log("Mensajes obtenidos:", resp.data.content);
    } catch (err) {
      console.error("Error al obtener las publicaciones:", err);
    }
  };


  interface Chat {
    id: number;
    nameChat: string;
    timestamp: string;
    users: any[]; // TODO: Tipar Users
  }

  // Chat's variable
  const [chats, setChats] = useState<Chat[]>([]);

  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // Obtain chats from backend
  const fetchChats = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/chat", {
        params: { username: userSesion }
      });
      setChats(resp.data.content);
      console.log("Chats obtenidos:", resp.data.content);
    } catch (err) {
      console.error("Error al obtener las publicaciones:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

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
          {chats.map((chat) => (
            <li
              key={chat.id}
              style={{
                padding: "10px",
                marginBottom: "5px",
                cursor: "pointer",
                backgroundColor:
                  activeChat?.id === chat.id ? "#eee" : "transparent",
              }}
              onClick={() => {
                setActiveChat(chat);       // cambia el chat activo
                fetchMessages(chat.id);    // llama a la función con el id del chat
              }}

            >
              {chat.nameChat || "Chat sin nombre"}
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
          {activeChat?.nameChat || ""}
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
                alignSelf: msg.sender.username === userSesion ? "flex-end" : "flex-start",
                backgroundColor: msg.sender.username === userSesion ? "#007bff" : "#eee",
                color: msg.sender.username === userSesion ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "15px",
                marginBottom: "5px",
                maxWidth: "70%",
              }}
            >
              {msg.messageContent}
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
