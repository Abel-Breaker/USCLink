'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { isAxiosError } from "axios";


export default function Recomendations({ perfil }) {

    // Lista de recomendations
    const [recomendations, setRecomendations] = useState([]);
    const [followedBy, setFollowedBy] = useState([]);
    const [follows, setFollows] = useState([]);
    let accessToken = null;

    // Obtener lista de usuarios desde el backend
    const fetchRecomendations = async () => {
        if (!perfil) {
            perfil = sessionStorage.getItem('perfil');
            if (!perfil) {
                console.warn("No perfil proporcionado, no se consultan recomendations");
                setRecomendations([]);
                return;
            }
        }
        accessToken = sessionStorage.getItem('accessToken');
        try {
            const resp = await axios.get("/api/users", {
                params: { user: perfil },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Usuarios obtenidos en las sugerencias:", resp.data.content);
            setRecomendations(Array.isArray(resp.data.content) ? resp.data.content : []);
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
        }
    };

    useEffect(() => {
        accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Token de Acceso no encontrado. Redirigiendo a login.");
            router.push('/');
            return;
        }
        fetchRecomendations();
    }, []);


    return (
        <div className={styles.recomendations}>
            <h3>Recomendaciones para ti</h3>
            {recomendations.length === 0 ? (
                <p>No se encontraron recomendaciones.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', alignItems: 'center' }} >
                    {recomendations.map((u, idx) => (
                        <div key={u.id ?? idx} style={{
                            background: 'var(--card)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            display: 'grid',
                            flexDirection: 'row',
                            height: 180,           // altura fija consistente
                            minHeight: 180,
                            width: 120,
                            alignItems: 'center',
                        }}>
                            <img src={`/api/media/${u[1]}`} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e6eef6' }} />
                            <p><strong>{u[0]}</strong></p>
                            <p>{u[2]}</p>
                            <button onClick={
                                async () => {
                                    accessToken = sessionStorage.getItem('accessToken');
                                    try {
                                        const response = await axios.post(
                                            "/api/follows", // URL del backend
                                            {
                                                user1: {
                                                    username: perfil,
                                                },
                                                user2: {
                                                    username: u[0],
                                                },
                                            },
                                            {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    'Authorization': accessToken
                                                },
                                            }
                                        );
                                        console.log("Follow creado:", response.data);
                                        alert(`Ahora sigues a ${u[0]}`);
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
                                    }

                                }}>Seguir</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

