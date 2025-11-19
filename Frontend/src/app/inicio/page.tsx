"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import axios, { isAxiosError } from "axios";
import styles from "../page.module.css";
import CreateUser from "../users/Creation";
import Nav from "../Nav";
import Posts from "../Posts";
import Stats from "../Stats";
import Recomendations from "../Recomendations";
import { useRouter } from "next/navigation";

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
  // 1. Obtener los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();

  // 2. Extraer el valor 'perfil' de los parámetros
  const perfil = searchParams.get('perfil') || localStorage.getItem('perfil');

  // Lista de usuarios
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error("Token de Acceso no encontrado. Redirigiendo a login.");
    router.push('/');
    return;
  }

  // Obtener lista de usuarios desde el backend
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const resp = await axios.get(
        `http://localhost:8080/users/${perfil}`,
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
        if (err.response?.status === 401) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.get(
              `http://localhost:8080/auth/refresh`,
              { withCredentials: true }
            );
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

  useEffect(() => {
    fetchUser();
  }, [accessToken, router]);

  return (
    <div>
      <Nav />
      <div className={styles["profile-container"]}>
        {/* Encabezado */}
        <div className={styles["profile-header"]}>
          <ul>
            <li>
              <img src={`http://localhost:8080/media/${user?.avatar}`} alt="Avatar" />
            </li>
            <li>
              <h2>{perfil}</h2>
              <p>@{perfil}</p>
              <p>{user?.biography}</p>
            </li>
          </ul>
        </div>

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
