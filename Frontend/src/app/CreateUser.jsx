'use client';

import { useState } from "react";
import axios from "axios"; // Para enviar la petición al backend
import styles from "./page.module.css";

export default function CreateUserForm() {
    // Estado para almacenar los valores del formulario
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        telephone: 0,
    });

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

        try {
            console.log("http://localhost:8080/users/add", dataToSend);
            const response = await axios.post(
                "http://localhost:8080/users/add", // URL de tu backend
                formData
            );
            console.log("Usuario creado:", response.data);
            alert("Usuario creado correctamente");

            // Limpiar formulario
            setFormData({ username: "", email: "", telephone: "" });
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert("Hubo un error al enviar los datos");
        }
    };

    return (
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
    );
}
