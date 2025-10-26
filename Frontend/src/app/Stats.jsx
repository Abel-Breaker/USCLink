'use client';

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import axios from "axios";


export default function Stats({ perfil }) {

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [followedBy, setFollowedBy] = useState([]);
    const [follows, setFollows] = useState([]);

    // Obtener lista de usuarios desde el backend
    const fetchPosts = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan posts");
            setPosts([]);
            return;
        }
        try {
            const resp = await axios.get("http://localhost:8080/posts", {
                params: { perfil: perfil },
                // timeout: 5000, // opcional
            });
            console.log("Publicaciones obtenidas en las estadísticas:", resp.data.content);
            setPosts(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las publicaciones:", err);
        }
    };

    // Obtener lista de usuarios desde el backend
    const fetchFollowedBy = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan follows");
            setPosts([]);
            return;
        }
        try {
            const resp = await axios.get("http://localhost:8080/follows", {
                params: { followed: perfil },
                // timeout: 5000, // opcional
            });
            console.log("Follows obtenidos1:", resp.data.content);
            setFollowedBy(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener los follows:", err);
        }
    };

     // Obtener lista de usuarios desde el backend
    const fetchFollows = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan posts");
            setPosts([]);
            return;
        }
        try {
            const resp = await axios.get("http://localhost:8080/follows", {
                params: { followedBy: perfil },
                // timeout: 5000, // opcional
            });
            console.log("Follows obtenidos2:", resp.data.content);
            setFollows(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las follows:", err);
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

