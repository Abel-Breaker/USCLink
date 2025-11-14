"use client";

import Image from "next/image";
import styles from "../page.module.css";
import CreateUser from "../users/Creation";
import Nav from "../Nav";
import Posts from "../Posts";
import Stats from "../Stats";

export default function Home({ perfil }: { perfil: string }) {
  console.log("Perfil recibido en inicio/page.tsx:", perfil);
  return (
    <div>
      <Nav/>
      <div className={styles["profile-container"]}>
        {/* Encabezado */}
        <div className={styles["profile-header"]}>
          <ul>
            <li>
              <img src={`http://localhost:8080/media/uploads/vilarino16/6bf274fb-5a09-4d99-8585-71894a1182b2_elperro.jpg`} alt="Avatar" />
            </li>
            <li>
              <h2>{perfil}</h2>
              <p>@ElPerro</p>
              <p>Aprendiendo React</p>
            </li>
          </ul>
        </div>

        {/* Stats */}
        <Stats perfil={perfil}/>

        {/* Posts */}
        <Posts perfil={perfil}/>
      </div>
      <footer className={styles.footer}>
        {/* Enlace a la página de creación de usuario */}
        <a href="/users">Ir a Crear Usuario</a>
      </footer>
    </div>
  );
}
