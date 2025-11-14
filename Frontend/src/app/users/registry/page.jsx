'use client';

import { useState, useEffect } from "react";

import Image from "next/image";
import styles from "../../page.module.css";
import { useRouter } from "next/navigation";

import axios from "axios";

export default function Registro() {
    const router = useRouter();

    
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        telephone: 0,
        avatar: "",
        password: "",
        biografia: ""
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
        if (name === "avatar") {
            setFormData({ ...formData, avatar: files[0] }); // guarda el archivo
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("telephone", String(formData.telephone));
        formDataToSend.append("avatar", formData.avatar);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("biography", formData.biografia);
        formDataToSend.forEach((value, key) => { console.log(key + ': ' + value); });

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                "http://localhost:8080/auth/register", // URL del backend
                formDataToSend
            );
            setCreatedSesion(response.data);
            console.log("Usuario creado:", response.data);
            // Limpiar formulario
            setFormData({ username: "", email: "", telephone: 0, avatar: "", password: "", biografia: ""});

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
                <label className={styles["tweet-label"]}>
                    Email:
                </label>
                <input
                    type="text"
                    name="email"
                    placeholder="Correo electrónico"
                    className={styles["tweet-input"]}
                    value={formData.email}
                    onChange={handleChange}
                />
                <label className={styles["tweet-label"]}>
                    Teléfono:
                </label>
                <input
                    type="number"
                    name="telephone"
                    placeholder="Teléfono"
                    className={styles["tweet-input"]}
                    value={formData.telephone}
                    onChange={handleChange}
                />
                <label className={styles["tweet-label"]}>
                    Foto de perfil:
                </label>
                <input
                    type="file"
                    name="avatar"
                    className={styles["tweet-input"]}
                    onChange={handleChange}
                />
                <label className={styles["tweet-label"]}>
                    Biografía:
                </label>
                <input
                    type="text"
                    name="biografia"
                    placeholder="Biografía"
                    className={styles["tweet-input"]}
                    value={formData.biografia}
                    onChange={handleChange}
                />
                <button type="submit" className={styles["tweet-button"]}>
                    Registrarse
                </button>
            </form>
        </div>
    );
}
