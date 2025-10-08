'use client';

import { useState, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function CreatePostsForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        user: "",
        pathToFile: ""
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
            const resp = await axios.get("http://localhost:8080/posts/"); 
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        const dataToSend = {
            ...formData
        };
        console.log("Enviando datos:", dataToSend);

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/posts/", // URL del backend
                dataToSend
            );
            setCreatedPost(response.data);
            if (response.data) {
                setPosts(prev => [response.data, ...prev]);
            } else {
                // si no devuelve, refrescar la lista
                fetchPosts();
            }

            // Limpiar formulario
            setFormData({ user: "", pathToFile: ""});
            
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
                    placeholder="Correo electrónico"
                    className={styles["tweet-input"]}
                    value={formData.pathToFile}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="telephone"
                    placeholder="Teléfono"
                    className={styles["tweet-input"]}
                    value={formData.telephone}
                    onChange={handleChange}
                />
                <button type="submit" className={styles["tweet-button"]}>
                    Publicar
                </button>
            </form>
            {/* Mostrar resultado cuando llegue la respuesta */}
            {createdUser && (
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
                <p>No se encontraron usuarios.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>PathToFile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => (
                                <tr key={u.id ?? idx}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.user ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.pathToFile ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
