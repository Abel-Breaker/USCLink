'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Posts({ perfil }) {
    const router = useRouter();

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const accessToken = localStorage.getItem('accessToken'); 
    
    if (!accessToken) {
        console.error("Token de Acceso no encontrado. Redirigiendo a login.");
        router.push('/'); 
        return; 
    }

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
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken 
                }
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
                            <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}onClick={() => {
                                console.log("Navegando a detalles del post", u.id);
                                router.push(`/posts/details?id=${u.id}&perfil=${perfil}`);
                            }}>
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
                            <div style={{ padding: 12, fontSize: 14, color: 'var(--text)', overflow: 'auto', flex: '1 1 auto' }} onDoubleClick={() => {
                                if (u.likes.some(likeUser => likeUser.username === perfil)) {
                                    axios.delete(`http://localhost:8080/posts/${u.id}/likes`, { data: {username: perfil }}).then(() => {
                                        console.log("Post disliked");
                                    }).catch(err => {
                                        console.error("Error liking post:", err);
                                    }); // ya le ha dado like
                                }
                                // Acción de "like" al hacer doble clic
                                axios.post(`http://localhost:8080/posts/${u.id}/likes`, { username: perfil }).then(() => {
                                    console.log("Post liked");
                                    fetchPosts(); // Refrescar posts para actualizar el conteo de likes
                                }).catch(err => {
                                    console.error("Error liking post:", err);
                                });
                            }}>
                                {u.likes && (
                                    <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--muted)' }}>
                                        ❤️ {u.likes.length} {u.likes.length === 1 ? 'like' : 'likes'}
                                    </p>
                                )}
                                {u.caption ? (
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}><b>{u.user.username + " "}</b>{u.caption}</p>
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