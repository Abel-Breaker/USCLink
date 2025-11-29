"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import Comments from "./Comments";
import Nav from "../../Nav";
import { isAxiosError } from "axios";
import Router from "next/router";
import styles from "../../page.module.css";

export default function PostDetails() {
  let accessToken = null;
  const [perfil, setPerfil] = useState(null);
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    user: "",
    post: 0,
    content: "",
  });

  const params = useSearchParams();
  const id = params.get('id');

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    accessToken = sessionStorage.getItem('accessToken') || null;
    const currentPerfil = sessionStorage.getItem('perfil');
    setPerfil(currentPerfil);
    try {
      setLoading(true);
      const resp = await axios.get(`/api/posts/${id}`, {
        headers: {
          'Authorization': accessToken
        }
      }
      );
      console.log("Post obtenido:", resp.data);
      setPost(resp.data);
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
              { withCredentials: true }
            );
            console.log("Respuesta del servidor:", resp.headers);
            accessToken = resp.headers['authorization'];

            if (accessToken) {
              if (sessionStorage.getItem('accessToken') !== null) {
                sessionStorage.removeItem('accessToken');
              }
              sessionStorage.setItem('accessToken', accessToken);
              console.log("Token de Acceso guardado:", accessToken);

              alert("Token refrescado. La página se recargará para continuar.");
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
      setLoading(false);
    }
  };

  useEffect(() => {
    accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("Token de Acceso no encontrado. Redirigiendo a login.");
      router.push('/');
      return;
    }
    if (id) fetchPost();
  }, [id]);

  // Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    accessToken = sessionStorage.getItem('accessToken');
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/comments", // URL del backend
        {
          user: {
            username: perfil, // Aquí podría ser más info si lo tienes
          },
          post: {
            id: Number(post.id),
          },
          content: formData.content,
        },
        {
          headers: { "Content-Type": "application/json", "Authorization": accessToken },
        }
      );
      setCreatedComment(response.data);

      // Limpiar formulario
      setFormData({ user: "", post: "", content: "" });

    } catch (error) {
      // 1. Comprobamos si el error es un error de Axios
      if (isAxiosError(err)) {
        console.error("Error de Axios:", err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Token expirado o no autorizado. Intentando refrescar...");
          // Lógica para refrescar el token
          try {
            const resp = await axios.post(
              `/api/auth/refresh`,
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
      setLoading(false);
    }
  };

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (post.likes?.some(likeUser => likeUser.username === perfil)) {
      accessToken = sessionStorage.getItem('accessToken');
      try {
        setLoading(true);
        const resp = await axios.delete(
          `/api/posts/${post.id}/likes`,
          {
            data: { username: perfil },
            headers: { 'Authorization': accessToken }
          }
        );

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
        setLoading(false);
        fetchPost();
        post.likes = post.likes.filter(likeUser => likeUser.username !== perfil);// Actualiza el estado localmente para reflejar el cambio inmediato
      }
    } else {
      accessToken = sessionStorage.getItem('accessToken');
      try {
        setLoading(true);
        const resp = await axios.post(
          `/api/posts/${post.id}/likes`,
          { username: perfil },
          { headers: { 'Authorization': accessToken } }
        );
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
        setLoading(false);
        fetchPost();
        console.log(post.likes.length);
      }
    }
  }

  if (loading) return <p>Cargando post...</p>;
  if (!post) return <p>No se encontró el post.</p>;



  return (
    <div
      key={post.id}
      style={{
        background: 'var(--card)',
        borderRadius: 12,
        boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: 400,
        margin: '20px auto'
      }}
    >
      <Nav></Nav>
      {/* Header: avatar + usuario */}
      <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e6eef6' }}>
          {post.user?.avatar && (
            <img
              src={`/api/media/${encodeURI(post.user.avatar)}`}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        <div style={{ fontWeight: 600, color: 'var(--text)' }}>
          {post.user?.username ?? '-'}
        </div>
      </div>

      {/* Imagen */}
      <div style={{
        flex: '0 0 200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
        {post.pathToFile ? (
          <img
            src={`/api/media/${encodeURI(post.pathToFile ?? '')}`}
            alt="Imagen del post"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        ) : (
          <div style={{ color: 'var(--muted)' }}>No image</div>
        )}
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: 12,
          fontSize: 14,
          color: 'var(--text)',
          overflow: 'auto',
          flex: '1 1 auto'
        }}
        onDoubleClick={handleLikeToggle}
      >
        {post.likes && (
          <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--muted)' }}>
            ❤️ {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </p>
        )}

        {post.caption ? (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            <b>{post.user.username} </b>{post.caption}
          </p>
        ) : (
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            <b>{post.user.username} </b>Sin descripción
          </p>
        )}

        <p style={{ margin: '8px 0 0 0', fontSize: 10, color: 'var(--muted)' }}>
          {new Date(post.timestamp).toLocaleString()}
        </p>
      </div>
      <form className={styles["create-form"]} onSubmit={handleSubmit}>
        <input
          type="text"
          name="content"
          placeholder="Contenido del comentario"
          className={styles["tweet-input"]}
          value={formData.content}
          onChange={handleChange}
        />
        <button type="submit" className={styles["tweet-button"]}>
          Comentar
        </button>
      </form>
      <Comments id={post.id} perfil={perfil} />
    </div>
  );
}
