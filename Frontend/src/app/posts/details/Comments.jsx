'use client';

import { useState, useEffect } from "react";
import axios from "axios";


export default function Comments({ id, perfil }) {

    // Lista de comments
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchComments = async () => {
        if (!id) {
            console.warn("No id del post proporcionado, no se consultan comments");
            setComments([]);
            return;
        }
        try {
            setLoadingComments(true);
            const resp = await axios.get("http://localhost:8080/comments", {
                params: { postId: id },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Comentarios obtenidos:", resp.data.content);
            setComments(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las Comentarios:", err);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);


    return (
        <div style={{ padding: 20 }}>
            {loadingComments ? (
                <p>Cargando comments...</p>
            ) : comments.length === 0 ? (
                <p>No se encontraron comments.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, padding: 8 }}>
                    {comments.map((u, idx) => (
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

                            {/* contenido: ocupa el resto y permite scroll si es necesario */}
                            <div style={{ padding: 12, fontSize: 14, color: 'var(--text)', overflow: 'auto', flex: '1 1 auto' }} onDoubleClick={() => {
                                if (u.likes.some(likeUser => likeUser.username === perfil)) {
                                    axios.delete(`http://localhost:8080/comments/${u.id}/likes`, {
                                        data: { username: perfil }, headers: { 'Authorization': accessToken }
                                    }).then(() => {
                                        console.log("Comment disliked");
                                        fetchComments(); // Refrescar comments para actualizar el conteo de likes
                                    }).catch(err => {
                                        console.error("Error liking post:", err);
                                    }); // ya le ha dado like
                                }
                                // Acción de "like" al hacer doble clic
                                axios.post(`http://localhost:8080/comments/${u.id}/likes`, { username: perfil }, {
                                    headers: {
                                        'Authorization': accessToken
                                    }
                                }).then(() => {
                                    console.log("Comment liked");
                                    fetchComments(); // Refrescar comments para actualizar el conteo de likes
                                }).catch(err => {
                                    console.error("Error liking post:", err);
                                });
                            }}>
                                {u.likes && (
                                    <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--muted)' }}>
                                        ❤️ {u.likes.length} {u.likes.length === 1 ? 'like' : 'likes'}
                                    </p>
                                )}
                                {u.content ? (
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}><b>{u.user.username + " "}</b>{u.content}</p>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--muted)' }}><b>{u.user.username + " "}</b> Sin descripción</p>
                                )}
                                <p style={{ margin: '8px 0 0 0', fontSize: 10, color: 'var(--muted)' }}>{new Date(u.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}