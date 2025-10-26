'use client';

import { useState, useEffect } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "../page.module.css";

export default function CreateUserForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        telephone: 0,
    });

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [createdUser, setCreatedUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de usuarios
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const resp = await axios.get("http://localhost:8080/users"); 
            console.log("Usuarios obtenidos:", resp.data.content);
            setUsers(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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
            ...formData,
            telephone: Number(formData.telephone) // convierte a número
        };
        console.log("Enviando datos:", dataToSend);

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/users", // URL del backend
                dataToSend
            );
            setCreatedUser(response.data);
            if (response.data) {
                setUsers(prev => [response.data, ...prev]);
            } else {
                // si no devuelve, refrescar la lista
                fetchUsers();
            }

            // Limpiar formulario
            setFormData({ username: "", email: "", telephone: "" });
            
        } catch (error) {
            console.error("Error al crear usuario:", error);
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
                    name="username"
                    placeholder="Nombre de usuario"
                    className={styles["tweet-input"]}
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Correo electrónico"
                    className={styles["tweet-input"]}
                    value={formData.email}
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
                    Crear
                </button>
            </form>
            {/* Mostrar resultado cuando llegue la respuesta */}
            {createdUser && (
                <>
                    <p id="label">Usuario creado:</p>
                    <pre id="user">{JSON.stringify(createdUser, null, 2)}</pre>
                </>
            )}

            {/* Mensaje de error */}
            {error && <p style={{ color: "red" }}>Error al crear usuario. Revisa la consola.</p>}

            <hr style={{ margin: "20px 0" }} />

            <h3>Usuarios</h3>
            {loadingUsers ? (
                <p>Cargando usuarios...</p>
            ) : users.length === 0 ? (
                <p>No se encontraron usuarios.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Email</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => (
                                <tr key={u.id ?? idx}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.username ?? u.name ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.email ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.telephone ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
