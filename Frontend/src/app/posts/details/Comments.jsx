'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";



export default function Comments({ id, perfil }) {
    let accessToken = null;

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
        accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Token de Acceso no encontrado. Redirigiendo a login.");
            router.push('/');
            return;
        }
        try {
            setLoadingComments(true);
            const resp = await axios.get("/api/comments", {
                params: { postId: id },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Comentarios obtenidos:", resp.data.content);
            setComments(Array.isArray(resp.data.content) ? resp.data.content : []);
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
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleLikeToggle = async (comment, e) => {
        e.preventDefault();
        if (comment.likes?.some(likeUser => likeUser.username === perfil)) {
            accessToken = sessionStorage.getItem('accessToken');
            try {
                const resp = await axios.delete(
                    `/api/comments/${comment.id}/likes`,
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
                fetchComments();
                comment.likes = comment.likes.filter(likeUser => likeUser.username !== perfil);// Actualiza el estado localmente para reflejar el cambio inmediato
            }
        } else {
            accessToken = sessionStorage.getItem('accessToken');
            try {
                const resp = await axios.post(
                    `/api/comments/${comment.id}/likes`,
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
                fetchComments();
                console.log(comment.likes.length);
            }
        }
    }

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
                                            src={`/api/media/${encodeURI(u.user.avatar)}`} //TODO: añadir fotos de perfil
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    )}
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.user?.username ?? '-'}</div>
                            </div>

                            {/* contenido: ocupa el resto y permite scroll si es necesario */}
                            <div style={{ padding: 12, fontSize: 14, color: 'var(--text)', overflow: 'auto', flex: '1 1 auto' }} onDoubleClick={(e) => handleLikeToggle(u, e)}>
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