'use client';

// Messages.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "./Messages.module.css";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

export default function Messages() {
  const router = useRouter();

  /////// INTERFACES ///////

  // Define la estructura de los datos de usuario
  interface User {
    username: string;
    avatar: string;
    email: string;
    telephone: number;
    biography: string;
    //password: string;
    roles: string[];
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
    users: User[];
  }

  /////// USER SESSION (TEMPORAL) ///////
  //const userSesion: User = { username: "Abel" }; // Usuario que inicio sesión (TEMPORAL DEBUG)
  const [userSession, setUserSession] = useState<User | null>(null);


  /////// VARIABLES ///////
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState(""); // Send a message
  const [messages, setMessages] = useState<Message[]>([]); // Message's variable

  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatUsers, setNewChatUsers] = useState<string>(""); // usernames separados por coma

  const messagesEndRef = useRef(null);
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    console.error("Token de Acceso no encontrado. Redirigiendo a login.");
    router.push('/');
    return;
  }

  /////// FUNCTIONS ///////

  const obtainUserSession = async () => {
    try {
      const storedUserRaw = sessionStorage.getItem("UserInfo");

      if (storedUserRaw) {
        const parsed = JSON.parse(storedUserRaw);

        const user: User = {
          username: parsed.username,
          avatar: parsed.avatar,
          email: parsed.email,
          telephone: parsed.telephone,
          biography: parsed.biography,
          //password: parsed.password,
          roles: parsed.roles,
        };

        setUserSession(user);
      }
    } catch (err) {
      console.error("Error al obtener el user:", err);
    }
  };

  // Obtain chats from backend
  const fetchChats = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/chat", {
        params: { username: userSession!.username }, // TODO: Que pase el usuario entero? No solo el username (Ns si hará falta)
        headers: {
          // Simplemente enviamos el valor completo "Bearer <token>"
          'Authorization': accessToken
        }
      });
      setChats(resp.data.content);
      console.log("Chats obtenidos:", resp.data.content);
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `http://localhost:8080/auth/refresh`,
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            const accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);
              // Reintentar la solicitud original después de refrescar el token
              router.refresh();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
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
        chat: { id: activeChat.id, nameChat: "", timestamp: "", users: [] }, // Solo enviamos el id del chat
        sender: {username: userSession?.username || "", avatar: "", email: "", telephone: 0, biography: "", roles: []}, // Solo enviamos el username del sender
        messageContent: newMessage,
        users: [], // Array vacío
      };
      console.log(messageToSend);
      console.log(accessToken);

      // Send to backend (and respond with the created message)
      const resp = await axios.post("http://localhost:8080/messages", messageToSend, {
        headers: {
          // Simplemente enviamos el valor completo "Bearer <token>"
          'Authorization': accessToken
        }
      });

      // Update local messages
      setMessages([...messages, resp.data]);

      // Clean input
      setNewMessage("");

    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `http://localhost:8080/auth/refresh`,
              {},
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            const accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);
              // Reintentar la solicitud original después de refrescar el token
              router.refresh();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    }
  };

  // Get list of messages from the backend
  const fetchMessages = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/messages", {
        params: { chatId: activeChat?.id },
        headers: {
          // Simplemente enviamos el valor completo "Bearer <token>"
          'Authorization': accessToken
        }
      });
      setMessages(resp.data.content);
      console.log("Mensajes obtenidos:", resp.data.content);
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `http://localhost:8080/auth/refresh`,
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            const accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);
              // Reintentar la solicitud original después de refrescar el token
              router.refresh();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    }
  };

  // Give a like to a message
  const handleLike = async (message: Message) => {
    try {
      let resp;

      if (message.users.some(user => user.username === userSession!.username)) {
        resp = await axios.delete(
          "http://localhost:8080/messages/like",
          {
            params: {
              messageId: message.id,
              username: userSession!.username,
            },
            headers: {
              // Simplemente enviamos el valor completo "Bearer <token>"
              'Authorization': accessToken
            }
          }
        );
      } else {
        resp = await axios.post(
          "http://localhost:8080/messages/like",
          null, // No body
          {
            params: {
              messageId: message.id,
              username: userSession!.username,
            },
            headers: {
              // Simplemente enviamos el valor completo "Bearer <token>"
              'Authorization': accessToken
            }
          }
        );
      }


      fetchMessages();

      console.log("Like dado:", resp.data);
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `http://localhost:8080/auth/refresh`,
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            const accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);
              // Reintentar la solicitud original después de refrescar el token
              router.refresh();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    }
  };

  const handleCreateChat = async () => {
    let usersArray = newChatUsers.split(",").map(u => u.trim());
    usersArray.push(userSession!.username);
    const usersSet = new Set(usersArray);
    usersArray = Array.from(usersSet);

    try {
      const resp = await axios.post(
        "http://localhost:8080/chat",
        null, // No body
        {
          params: {
            nameChat: newChatName,
            users: usersArray
          },
          headers: {
            // Simplemente enviamos el valor completo "Bearer <token>"
            'Authorization': accessToken
          }
        }
      );
      console.log("Chat creado:", resp.data);
      fetchChats();
      setShowCreateChatModal(false);
      setNewChatName("");
      setNewChatUsers("");
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `http://localhost:8080/auth/refresh`,
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            const accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);
              // Reintentar la solicitud original después de refrescar el token
              router.refresh();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    }
  };



  /////// FUNCTIONS CALLS (UseEffects) ///////

  useEffect(() => {
    obtainUserSession();
  }, []); // solo cargamos la sesión al inicio

  useEffect(() => {
    if (userSession) {
      fetchChats(); // ahora userSession ya existe
    }
  }, [userSession]); // se ejecuta cada vez que userSession cambia


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

        {/* Botón para crear grupo */}
        <button
          className={styles.createChatButton}
          onClick={() => setShowCreateChatModal(true)}
        >
          + Crear grupo
        </button>

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
              className={`${styles.messageBubble} ${msg.sender.username === userSession!.username
                ? styles.messageSent
                : styles.messageReceived
                }`}
              onDoubleClick={() => handleLike(msg)}
            >
              {/* Contenedor con el mensaje y el emoji si tiene likes */}
              <div className={styles.messageContent}>
                {msg.sender.username + ": " + msg.messageContent}
              </div>

              {msg.users && msg.users.length > 0 && (
                <div className={styles.likeEmoji}>
                  ❤️{msg.users.length}
                </div>
              )}

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

      {/* Modal para crear grupo */}
      {showCreateChatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Crear nuevo grupo</h3>
            <input
              type="text"
              placeholder="Nombre del grupo"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Usuarios (separados por coma)"
              value={newChatUsers}
              onChange={(e) => setNewChatUsers(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleCreateChat} className={styles.modalButton}>
                Crear
              </button>
              <button
                onClick={() => setShowCreateChatModal(false)}
                className={styles.modalButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
