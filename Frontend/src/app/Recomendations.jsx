'use client';

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import axios from "axios";


export default function Recomendations({ perfil }) {

    // Lista de recomendations
    const [recomendations, setRecomendations] = useState([]);
    const [followedBy, setFollowedBy] = useState([]);
    const [follows, setFollows] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.error("Token de Acceso no encontrado. Redirigiendo a login.");
        router.push('/');
        return;
    }

    // Obtener lista de usuarios desde el backend
    const fetchRecomendations = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan recomendations");
            setRecomendations([]);
            return;
        }
        try {
            const resp = await axios.get("http://localhost:8080/users", {
                params: { user: perfil },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Usuarios obtenidos en las sugerencias:", resp.data.content);
            setRecomendations(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las publicaciones:", err);
        }
    };

    useEffect(() => {
        fetchRecomendations();
    }, []);


    return (
        <div className={styles.recomendations}>
            <h3>Recomendaciones para ti</h3>
            {recomendations.length === 0 ? (
                <p>No se encontraron recomendaciones.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', alignItems: 'center'}} >
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
                            <img src={`http://localhost:8080/media/${u[1]}`} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e6eef6' }} />
                            <p><strong>{u[0]}</strong></p>
                            <p>{u[2]}</p>
                            <button onClick={
                                async () => {
                                    try {
                                        const response = await axios.post(
                                            "http://localhost:8080/follows", // URL del backend
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
                                    } catch (error) {
                                        console.error("Error al crear follow:", error);
                                        alert("Hubo un error al enviar los datos");
                                    }

                                }}>Seguir</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

