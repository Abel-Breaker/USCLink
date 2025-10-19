import Image from "next/image";
import styles from "./page.module.css";
import CreateUser from "./users/Creation";
import Nav from "./Nav";
import Posts from "./Posts";
import Stats from "./Stats";

export default function Home() {
  return (
    <div>
      <Nav/>
      <div className={styles["profile-container"]}>
        {/* Encabezado */}
        <div className={styles["profile-header"]}>
          <ul>
            <li>
              <img src="/ElPerro.jpg" alt="Avatar" />
            </li>
            <li>
              <h2>El perro 🐕</h2>
              <p>@ElPerro</p>
              <p>Aprendiendo React</p>
            </li>
          </ul>
        </div>

        {/* Stats */}
        <Stats perfil="vilarino16"/>

        {/* Posts */}
        <Posts perfil="vilarino16"/>
      </div>
      <footer className={styles.footer}>
        {/* Enlace a la página de creación de usuario */}
        <a href="/users">Ir a Crear Usuario</a>
      </footer>
    </div>
  );
}
