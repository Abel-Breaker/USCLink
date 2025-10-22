'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function Posts({ perfil }) {

    // Lista de posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Obtener lista de usuarios desde el backend
    const fetchPosts = async () => {
        if (!perfil) {
            console.warn("No perfil proporcionado, no se consultan posts");
            setPosts([]);
            return;
        }
        try {
            setLoadingPosts(true);
            const resp = await axios.get("http://localhost:8080/posts/", {
                params: { followedBy: perfil },
                // timeout: 5000, // opcional
            });
            console.log("Publicaciones obtenidas:", resp.data.content);
            setPosts(Array.isArray(resp.data.content) ? resp.data.content : []);
        } catch (err) {
            console.error("Error al obtener las publicaciones:", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    return (
        <div style={{ padding: 20 }}>
            {loadingPosts ? (
                <p>Cargando posts...</p>
            ) : posts.length === 0 ? (
                <p>No se encontraron posts.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Usuario</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>PathToFile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((u, idx) => (
                                <tr key={u.id ?? idx}>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.user.username ?? "-"}</td>
                                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{u.pathToFile ? <img
                                        src={`http://localhost:8080/media/${encodeURI(u.pathToFile ?? "")}`}
                                        alt="Imagen del usuario"
                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} /> : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}