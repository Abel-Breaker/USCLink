'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import styles from "./page.module.css";
import axios from "axios";


export default function Stats({ perfil }) {

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [followedBy, setFollowedBy] = useState([]);
    const [follows, setFollows] = useState([]);
    var accessToken = sessionStorage.getItem('accessToken');

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
        accessToken = sessionStorage.getItem('accessToken');
        try {
            const resp = await axios.get("/api/posts", {
                params: { perfil: perfil },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Publicaciones obtenidas en las estadísticas:", resp.data.content);
            setPosts(Array.isArray(resp.data.content) ? resp.data.content : []);
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
                            router.refresh();
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

    // Obtener lista de usuarios desde el backend
    const fetchFollowedBy = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan follows");
            setPosts([]);
            return;
        }
        accessToken = sessionStorage.getItem('accessToken');
        try {
            const resp = await axios.get("/api/follows", {
                params: { followed: perfil },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Follows obtenidos1:", resp.data.content);
            setFollowedBy(Array.isArray(resp.data.content) ? resp.data.content : []);
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
                            router.refresh();
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

    // Obtener lista de usuarios desde el backend
    const fetchFollows = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan posts");
            setPosts([]);
            return;
        }
        accessToken = sessionStorage.getItem('accessToken');
        try {
            const resp = await axios.get("/api/follows", {
                params: { followedBy: perfil },
                headers: {
                    // Simplemente enviamos el valor completo "Bearer <token>"
                    'Authorization': accessToken
                }
            });
            console.log("Follows obtenidos2:", resp.data.content);
            setFollows(Array.isArray(resp.data.content) ? resp.data.content : []);
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
                            router.refresh();
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
        fetchPosts();
        fetchFollowedBy();
        fetchFollows();

    }, []);


    return (
        <div className={styles.stats}>
            <span><strong>{follows.length}</strong> Siguiendo</span>
            <span><strong>{followedBy.length}</strong> Seguidores</span>
            <span><strong>{posts.length}</strong> Posts</span>
        </div>
    );
}

