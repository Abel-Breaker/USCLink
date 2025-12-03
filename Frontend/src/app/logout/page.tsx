"use client";

import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import axios, { AxiosError, isAxiosError } from "axios";
import styles from "../page.module.css";
import CreateUser from "../users/Creation";
import Nav from "../Nav";
import Posts from "../Posts";
import Stats from "../Stats";
import Recomendations from "../Recomendations";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";


// Define la estructura de los datos de usuario
interface User {
    username: string;
    avatar: string;
    email: string;
    telephone: number;
    biography: string;
}

export default function Home() {
    const router = useRouter();

    const [perfil, setPerfil] = useState<string | null>(null);

    // Lista de usuarios
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(false);

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState(false);

    let accessToken = null;

    useEffect(() => {
        accessToken = sessionStorage.getItem('accessToken');
        const currentPerfil = sessionStorage.getItem('perfil');
        // Actualiza el estado solo si el valor de sessionStorage es diferente del estado actual
        if (currentPerfil && currentPerfil !== perfil) {
            setPerfil(currentPerfil);
        }
        console.log("Perfil obtenido en inicio:", perfil);
        if (!accessToken) {
            console.error("Token de Acceso no encontrado. Redirigiendo a login.");
            router.push('/');
        }
    }, [perfil, router]);

    // Función que se ejecuta al pulsar el botón de cerrar sesión
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        const currentPerfil = sessionStorage.getItem('perfil');
        accessToken = sessionStorage.getItem('accessToken');
        console.log("Perfil actual en logout:", currentPerfil);
        console.log("Token de Acceso en logout:", accessToken);

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "/api/auth/logout", // URL del backend
                null,
                {
                    headers: { 'Authorization': accessToken }
                }
            );
            console.log("Respuesta del servidor al cerrar sesión:", response);
            alert("Sesión cerrada correctamente.");
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('perfil');
            sessionStorage.clear();
            router.push('/');

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
                        }

                        alert("Token refrescado. La página se recargará para continuar.");
                        window.location.reload();
                    } catch (refreshErr) {
                        console.error("Fallo al refrescar el token.", refreshErr);
                    }
                }
            } else {
                console.error("Error desconocido/no-Axios:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Función que se ejecuta al pulsar el botón de borrar cuenta
    const handleSubmitDelete = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        const currentPerfil = sessionStorage.getItem('perfil');
        accessToken = sessionStorage.getItem('accessToken');

        try {
            setLoading(true);
            setError(null);
            const response = await axios.delete(
                `/api/users/${currentPerfil}`, // URL del backend
                {
                    headers: {
                        // Simplemente enviamos el valor completo "Bearer <token>"
                        'Authorization': accessToken
                    }
                }
            );
            console.log("Respuesta del servidor al cerrar sesión:", response);
            alert("Sesión cerrada correctamente.");
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('perfil');
            sessionStorage.clear();
            router.push('/');

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
                        }

                        alert("Token refrescado. La página se recargará para continuar.");
                        window.location.reload();
                    } catch (refreshErr) {
                        console.error("Fallo al refrescar el token.", refreshErr);
                    }
                }
            } else {
                console.error("Error desconocido/no-Axios:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Nav />
            <div className={styles["profile-container"]}>
                <h2>Cerrar Sesión</h2>
                <form onSubmit={handleSubmit} className={styles["logout-form"]}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </button>
                </form>
                {/*<h2>Borrar Cuenta</h2>
                <form onSubmit={handleSubmitDelete} className={styles["logout-form"]}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Borrando cuenta...' : 'Borrar Cuenta'}
                    </button>
                </form>*/}
            </div>
        </div>
    );
}
