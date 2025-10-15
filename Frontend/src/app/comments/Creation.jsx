'use client';

import { useState, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function CreateCommentForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        user: "",
        post: 0,
        content: "",
    });

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [createdComment, setCreatedComment] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de usuarios
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const resp = await axios.get("http://localhost:8080/comments/");
            console.log("Comments obtenidos:", resp.data.content);
            setComments(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener comments:", err);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

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

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/comments/", // URL del backend
                {
                    user: {
                        username: formData.user, // Aquí podría ser más info si lo tienes
                    },
                    post: {
                        id: Number(formData.post),
                    },
                    content: formData.content,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setCreatedComment(response.data);

            // Limpiar formulario
            setFormData({ user: "", post: "", content: "" });

        } catch (error) {
            console.error("Error al crear comentario:", error);
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
                    type="number"
                    name="post"
                    placeholder="ID del Post"
                    className={styles["tweet-input"]}
                    value={formData.post}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="content"
                    placeholder="Contenido del comentario"
                    className={styles["tweet-input"]}
                    value={formData.content}
                    onChange={handleChange}
                />
                <button type="submit" className={styles["tweet-button"]}>
                    Crear
                </button>
            </form>
            {/* Mostrar resultado cuando llegue la respuesta */}
            {createdComment && (
                <>
                    <p id="label">Comment creado:</p>
                    <pre id="comment">{JSON.stringify(createdComment, null, 2)}</pre>
                </>
            )}

            {/* Mensaje de error */}
            {error && <p style={{ color: "red" }}>Error al crear comment. Revisa la consola.</p>}

            <hr style={{ margin: "20px 0" }} />

            <h3>Comments</h3>
            {loadingComments ? (
                <p>Cargando comments...</p>
            ) : comments.length === 0 ? (
                <p>No se encontraron comentarios.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>ID Post</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Contenido</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((u, idx) => (
                                <tr key={u.id ?? idx}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.user.username ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.post.id ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.content ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.timestamp ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
