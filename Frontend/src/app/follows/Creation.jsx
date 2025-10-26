'use client';

import { useState, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function CreateFollowForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        user1: "",
        user2: ""
    });

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [createdFollow, setCreatedFollow] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de usuarios
    const [follows, setFollows] = useState([]);
    const [loadingFollows, setLoadingFollows] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchFollows = async () => {
        try {
            setLoadingFollows(true);
            const resp = await axios.get("http://localhost:8080/follows");
            console.log("Follows obtenidos:", resp.data.content);
            setFollows(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener follows:", err);
        } finally {
            setLoadingFollows(false);
        }
    };

    useEffect(() => {
        fetchFollows();
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
                "http://localhost:8080/follows", // URL del backend
                {
                    user1: {
                        username: formData.user1, // Aquí podría ser más info si lo tienes
                    },
                    user2: {
                        username: formData.user2, // Aquí podría ser más info si lo tienes
                    },
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setCreatedFollow(response.data);

            // Limpiar formulario
            setFormData({ user1: "", user2: ""});

        } catch (error) {
            console.error("Error al crear follow:", error);
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
                    name="user1"
                    placeholder="Nombre de usuario 1"
                    className={styles["tweet-input"]}
                    value={formData.user1}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="user2"
                    placeholder="Nombre de usuario 2"
                    className={styles["tweet-input"]}
                    value={formData.user2}
                    onChange={handleChange}
                />
                <button type="submit" className={styles["tweet-button"]}>
                    Crear
                </button>
            </form>
            {/* Mostrar resultado cuando llegue la respuesta */}
            {createdFollow && (
                <>
                    <p id="label">Follow creado:</p>
                    <pre id="follow">{JSON.stringify(createdFollow, null, 2)}</pre>
                </>
            )}

            {/* Mensaje de error */}
            {error && <p style={{ color: "red" }}>Error al crear follow. Revisa la consola.</p>}

            <hr style={{ margin: "20px 0" }} />

            <h3>Follows</h3>
            {loadingFollows ? (
                <p>Cargando follows...</p>
            ) : follows.length === 0 ? (
                <p>No se encontraron follows.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Id</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario1</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario2</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {follows.map((u, idx) => {
                                const key =
                                  u?.id?.user1Username && u?.id?.user2Username
                                    ? `${u.id.user1Username}-${u.id.user2Username}`
                                    : (u.id ? JSON.stringify(u.id) : idx);

                                return (
                                  <tr key={key}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                                      {u.id?.user1Username
                                        ? `${u.id.user1Username}→${u.id.user2Username}`
                                        : (u.id ?? "-")}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                                      {u.user1?.username ?? "-"}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                                      {u.user2?.username ?? "-"}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                                      {u.timestamp ?? u.timeStamp ?? "-"}
                                    </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
