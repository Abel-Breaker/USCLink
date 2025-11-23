'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import Comments from "./Comments";
import Nav from "../../Nav";
import { isAxiosError } from "axios";
import Router from "next/router";

export default function PostDetails() {
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    console.error("Token de Acceso no encontrado. Redirigiendo a login.");
    Router.push('/');
    return;
  }
  
  const params = useSearchParams();
  const id = params.get('id');
  const perfil = params.get('perfil');

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`http://localhost:8080/posts/${id}`, {
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
              router.refresh();
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
    if (id) fetchPost();
  }, [id]);

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
              src={`http://localhost:8080/media/${encodeURI(post.user.avatar)}`}
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
            src={`http://localhost:8080/media/${encodeURI(post.pathToFile ?? '')}`}
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
        onDoubleClick={() => {
          if (post.likes?.some(likeUser => likeUser.username === perfil)) {
            axios.delete(`http://localhost:8080/posts/${post.id}/likes`, { data: { username: perfil }, headers: { 'Authorization': accessToken } })
              .then(() => {
                console.log("Post disliked");
                fetchPost();
              })
              .catch(err => console.error("Error al quitar like:", err));
          } else {
            axios.post(`http://localhost:8080/posts/${post.id}/likes`, { username: perfil }, { headers: { 'Authorization': accessToken } })
              .then(() => {
                console.log("Post liked");
                fetchPost();
              })
              .catch(err => console.error("Error al dar like:", err));
          }
        }}
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
      <Comments id={post.id} perfil={perfil} />
    </div>
  );
}
