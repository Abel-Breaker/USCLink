"use client";

import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import axios, { AxiosError, isAxiosError } from "axios";
import styles from "../page.module.css";
import CreateUser from "../users/Creation";
import Nav from "../Nav";
import Posts from "../Posts";
import Stats from "../Stats";
import Recomendations from "../Recomendations";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";


// Define la estructura de los datos de usuario
interface User {
  username: string;
  avatar: string;
  email: string;
  telephone: number;
  biography: string;
}

export default function Home() {
  const router = useRouter();

  const [perfil, setPerfil] = useState<string | null>(null);

  // Lista de usuarios
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState<{ user: string; pathToFile: File | string; caption: string }>({
    user: "",
    pathToFile: "",
    caption: ""
  });

  // Nuevo estado para guardar la respuesta del servicio y errores
  const [createdPost, setCreatedPost] = useState(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado para la vista previa de la imagen
  const [preview, setPreview] = useState<string | null>(null);

  // Lista de posts
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  let accessToken = null;

  useEffect(() => {
    accessToken = sessionStorage.getItem('accessToken');
    const currentPerfil = sessionStorage.getItem('perfil');
    // Actualiza el estado solo si el valor de sessionStorage es diferente del estado actual
    if (currentPerfil && currentPerfil !== perfil) {
      setPerfil(currentPerfil);
    }
    console.log("Perfil obtenido en inicio:", perfil);
    if (!accessToken) {
      console.error("Token de Acceso no encontrado. Redirigiendo a login.");
      router.push('/');
    }else if (currentPerfil){
      fetchUser();
    }
  }, [perfil, router]);

  // Obtener lista de usuarios desde el backend
  const fetchUser = async () => {
    accessToken = sessionStorage.getItem('accessToken');
    const currentPerfil = sessionStorage.getItem('perfil');
    try {
      setLoadingUser(true);
      const resp = await axios.get(
        `/api/users/${currentPerfil}`,
        {
          headers: {
            // Simplemente enviamos el valor completo "Bearer <token>"
            'Authorization': accessToken
          }
        }
      );
      console.log("Usuario obtenido:", resp.data);
      setUser(resp.data);
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `/api/auth/refresh`,
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

              alert("Token refrescado. La página se recargará para continuar.");
              // Recargar la página entera
              window.location.reload();
            }
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    // Comprobación de que 'files' existe (para el input de tipo 'file')
    if (name === "pathToFile" && files) {
      // Almacena el primer archivo de la lista
      setFormData({ ...formData, pathToFile: files[0] as unknown as string });

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página se recargue
    const currentPerfil = sessionStorage.getItem('perfil');
    accessToken = sessionStorage.getItem('accessToken');
    const formDataToSend = new FormData();
    // El backend espera que el JSON venga como "user" (string)
    formDataToSend.append("user", new Blob([JSON.stringify({ username: currentPerfil })], { type: "application/json" }));
    formDataToSend.append("file", formData.pathToFile);
    formDataToSend.append("caption", formData.caption);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "/api/posts", // URL del backend
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data", 'Authorization': accessToken }
        }
      );
      setCreatedPost(response.data);

      // Limpiar formulario
      setFormData({ user: "", pathToFile: "", caption: "" });
      setPreview(null);
    } catch (err) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `/api/auth/refresh`,
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
            }

            alert("Token refrescado. La página se recargará para continuar.");
            window.location.reload();
          } catch (refreshErr) {
            console.error("Fallo al refrescar el token.", refreshErr);
          }
        }
      } else {
        console.error("Error desconocido/no-Axios:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles["profile-container"]}>
        {/* Encabezado */}
        <div className={styles["profile-header"]}>
          <ul>
            <li>
              <img src={`/api/media/${user?.avatar}`} alt="Avatar" />
            </li>
            <li>
              <h2>{perfil}</h2>
              <p>@{perfil}</p>
              <p>{user?.biography}</p>
            </li>
          </ul>
        </div>
        <form className={styles["create-form"]} onSubmit={handleSubmit}>
          <input
            type="file"
            name="pathToFile"
            className={styles["tweet-input"]}
            onChange={handleChange}
          />
          {/* Vista previa de la imagen */}
          {preview && (
            <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
              <img
                src={preview}
                alt="Vista previa"
                style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
            </div>
          )}
          <input
            type="text"
            name="caption"
            placeholder="Texto del post"
            className={styles["tweet-input"]}
            onChange={handleChange}
          />
          <button type="submit" className={styles["tweet-button"]}>
            Publicar
          </button>
        </form>

        {/* Stats */}
        <Stats perfil={perfil} />

        {/* Posts */}
        <Posts perfil={perfil} />
      </div>
      <footer className={styles.footer}>
        <Recomendations perfil={perfil} />
      </footer>
    </div>
  );
}
