'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function Posts({ perfil }) {

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchPosts = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan posts");
            setPosts([]);
            return;
        }
        try {
            setLoadingPosts(true);
            const resp = await axios.get("http://localhost:8080/posts", {
                params: { followedBy: perfil },
            });
            console.log("Publicaciones obtenidas:", resp.data.content);
            setPosts(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las publicaciones:", err);
            setPosts([]);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    return (
        <div style={{ padding: 20 }}>
            {loadingPosts ? (
                <p>Cargando posts...</p>
            ) : posts.length === 0 ? (
                <p>No se encontraron posts.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, padding: 8 }}>
                    {posts.map((u, idx) => (
                        <div
                            key={u.id ?? idx}
                            style={{
                                background: 'var(--card)',
                                borderRadius: 12,
                                boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 360,           // altura fija consistente
                                minHeight: 360,
                            }}
                        >
                            {/* header: avatar + user */}
                            <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e6eef6' }}>
                                    {u.user?.avatar && (
                                        <img
                                            src={`http://localhost:8080/media/${encodeURI(u.user.avatar)}`} //TODO: añadir fotos de perfil
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    )}
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.user?.username ?? '-'}</div>
                            </div>

                            {/* imagen: área centrada que muestra la imagen completa */}
                            <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {u.pathToFile ? (
                                    <img
                                        src={`http://localhost:8080/media/${encodeURI(u.pathToFile ?? '')}`}
                                        alt="Imagen del post"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain', // muestra la imagen completa
                                            display: 'block'
                                        }}
                                    />
                                ) : (
                                    <div style={{ color: 'var(--muted)' }}>No image</div>
                                )}
                            </div>

                            {/* contenido: ocupa el resto y permite scroll si es necesario */}
                            <div style={{ padding: 12, fontSize: 14, color: 'var(--text)', overflow: 'auto', flex: '1 1 auto' }}>
                                {u.caption ? (
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}><b>{u.user.username + " "}</b>{u.caption}</p>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--muted)' }}><b>{u.user.username + " "}</b> Sin descripción</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}