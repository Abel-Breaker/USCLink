'use client';

// Messages.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "./Messages.module.css";

export default function Messages() {

  /////// INTERFACES ///////

  interface User {
    username: string;
  }

  interface Chat {
    id: number;
    nameChat: string;
    timestamp: string;
    users: User[];
  }

  interface Message {
    id?: number;
    chat: Chat;
    sender: User;
    timestamp?: string;
    messageContent: string;
  }

  /////// USER SESSION (TEMPORAL) ///////
  const userSesion: User = { username: "Abel" }; // Usuario que inicio sesión (TEMPORAL DEBUG)


  /////// VARIABLES ///////
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState(""); // Send a message
  const [messages, setMessages] = useState<Message[]>([]); // Message's variable
  const messagesEndRef = useRef(null);

  /////// FUNCTIONS ///////

  // Obtain chats from backend
  const fetchChats = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/chat", {
        params: { username: userSesion.username } // TODO: Que pase el usuario entero? No solo el username (Ns si hará falta)
      });
      setChats(resp.data.content);
      console.log("Chats obtenidos:", resp.data.content);
    } catch (err) {
      console.error("Error al obtener las publicaciones:", err);
    }
  };

  // Send a message to backend
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      // Ojo, entiendo que no estas pasando todos los atributos de los objetos (chat, sender), pero sí los necesarios para la base datos
      // Por ejemplo, de sender solo mandas el username, el nombre realmente no hace falta
      // Al recargar la página ya si que asocia todo desde la base de datos
      const messageToSend: Message = {
        chat: activeChat,
        sender: userSesion,
        messageContent: newMessage,
      };

      // Send to backend (and respond with the created message)
      const resp = await axios.post("http://localhost:8080/messages", messageToSend);

      // Update local messages
      setMessages([...messages, resp.data]);

      // Clean input
      setNewMessage("");

    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Get list of messages from the backend
  const fetchMessages = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/messages", {
        params: { chatId: activeChat?.id }
      });
      setMessages(resp.data.content);
      console.log("Mensajes obtenidos:", resp.data.content);
    } catch (err) {
      console.error("Error al obtener las publicaciones:", err);
    }
  };


  /////// FUNCTIONS CALLS (UseEffects) ///////

  useEffect(() => {
    fetchChats();
  }, []);

  // Llama a fetchMessages cuando activeChat cambie
  useEffect(() => {
    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat]);


  return (
    <div className={styles.container}>
      {/* Sidebar de conversaciones */}
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Mensajes</h2>
        <ul className={styles.chatList}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`${styles.chatItem} ${activeChat?.id === chat.id ? styles.activeChat : ""}`}
              onClick={() => setActiveChat(chat)}
            >
              {chat.nameChat || "Chat sin nombre"}
            </li>
          ))}
        </ul>
      </aside>

      {/* Ventana principal del chat */}
      <main className={styles.chatWindow}>
        <header className={styles.chatHeader}>
          {activeChat?.nameChat || ""}
        </header>

        <section className={styles.messageList}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.messageBubble} ${msg.sender.username === userSesion.username
                  ? styles.messageSent
                  : styles.messageReceived
                }`}
            >
              {msg.sender.username + ": " + msg.messageContent}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </section>

        <footer className={styles.inputArea}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className={styles.input}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            Enviar
          </button>
        </footer>
      </main>
    </div>
  );
}
