'use client';

import { useState, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function CreatePostsForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        user: "",
        pathToFile: "",
        caption: ""
    });

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [createdPost, setCreatedPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchPosts = async () => {
        try {
            setLoadingPosts(true);
            const resp = await axios.get("http://localhost:8080/posts");
            console.log("Publicaciones obtenidas:", resp.data.content);
            setPosts(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las publicaciones:", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Función para actualizar el estado cuando el usuario escribe
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "pathToFile") {
            setFormData({ ...formData, pathToFile: files[0] }); // guarda el archivo
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const formDataToSend = new FormData();
        // El backend espera que el JSON venga como "user" (string)
        formDataToSend.append("user", new Blob([JSON.stringify({ username: formData.user })], { type: "application/json" }));
        formDataToSend.append("file", formData.pathToFile);
        formDataToSend.append("caption", formData.caption);

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/posts", // URL del backend
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            setCreatedPost(response.data);

            // Limpiar formulario
            setFormData({ user: "", pathToFile: "", caption: ""});

        } catch (error) {
            console.error("Error al publicar:", error);
            setError(error);
            alert("Hubo un error al enviar los datos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form className={styles["create-form"]} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="user"
                    placeholder="Nombre de usuario"
                    className={styles["tweet-input"]}
                    value={formData.user}
                    onChange={handleChange}
                />
                <input
                    type="file"
                    name="pathToFile"
                    className={styles["tweet-input"]}
                    onChange={handleChange}
                />
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
            {/* Mostrar resultado cuando llegue la respuesta */}
            {createdPost && (
                <>
                    <p id="label">Post creado:</p>
                    <pre id="user">{JSON.stringify(createdPost, null, 2)}</pre>
                </>
            )}

            {/* Mensaje de error */}
            {error && <p style={{ color: "red" }}>Error al crear el post. Revisa la consola.</p>}

            <hr style={{ margin: "20px 0" }} />

            <h3>Publicaciones</h3>
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
