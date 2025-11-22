'use client';

import { useState, useEffect } from "react";

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

import axios from "axios";

export default function InicioSesion() {
    const router = useRouter();


    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    // Nuevo estado para guardar la respuesta del servicio y errores
    const [createdSesion, setCreatedSesion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lista de usuarios
    const [sesions, setFollows] = useState([]);
    const [loadingFollows, setLoadingFollows] = useState(false);

    // Función para actualizar el estado cuando el usuario escribe
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        console.log("Enviando datos:", formData);
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/auth/login", // URL del backend
                {
                    username: formData.username,
                    password: formData.password
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("Respuesta del servidor:", response.headers);
            const accessToken = response.headers['authorization'];

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                console.log("Token de Acceso guardado:", accessToken);
                localStorage.setItem('perfil', formData.username);
                console.log("Perfil guardado", formData.username);
            }
            setCreatedSesion(response.data);
            console.log("Sesion creada:", response.data);

            // Save in local storage User info TODOOOOOOOOOOOOOOOOO Camviar perfil, guardar la resp en una variable y guardar la variable en localstorage
            const resp = await axios.get(
                    `http://localhost:8080/users/${formData.username}`,
                    {
                      headers: {
                        // Simplemente enviamos el valor completo "Bearer <token>"
                        'Authorization': accessToken
                      }
                    }
                  );
                  console.log("Usuario obtenido:", resp.data);

            sessionStorage.setItem("UserInfo", JSON.stringify(resp.data));

            setLoading(false);
            router.push(`/inicio?perfil=${formData.username}`);

        } catch (error) {
            console.error("Error al logear:", error);
            setError(error);
            alert("Hubo un error al enviar los datos");
            window.location.reload();
        }
    };

    return (
        <div>
            <h1>Bienvenido a USCLink</h1>
            <form className={styles["create-form"]} onSubmit={handleSubmit}>
                <label className={styles["tweet-label"]}>
                    Nombre de usuario:
                </label>
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    className={styles["tweet-input"]}
                    value={formData.username}
                    onChange={handleChange}
                />
                <label className={styles["tweet-label"]}>
                    Contraseña:
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className={styles["tweet-input"]}
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit" className={styles["tweet-button"]}>
                    Iniciar Sesión
                </button>
            </form>
            <h3 style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => router.push('/users/registry')}>
                ¿No tienes una cuenta? Regístrate pulsando aquí:
            </h3>
        </div>
    );
}
