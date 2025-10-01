import Image from "next/image";
import styles from "./page.module.css";
import CreateUser from "./CreateUser";

export default function Home() {
  return (
    <div>
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
        <div className={styles.stats}>
          <span><strong>150</strong> Siguiendo</span>
          <span><strong>200</strong> Seguidores</span>
          <span><strong>50</strong> Posts</span>
        </div>

        {/* Tweets */}
        <div className={styles.tweet}>
          <p className={styles["tweet-user"]}>Abel Breaker</p>
          <p className={styles["tweet-text"]}>Mi primer post</p>
        </div>

        <div className={styles.tweet}>
          <p className={styles["tweet-user"]}>El gato</p>
          <p className={styles["tweet-text"]}>Me encanta programar con CSS 😍</p>
        </div>

        <div className={styles.tweet}>
          <p className={styles["tweet-user"]}>Juan Pérez</p>
          <p className={styles["tweet-text"]}>Practicando un clon de Twitter 🐦</p>
        </div>
      </div>
      <footer className={styles.footer}>
        <CreateUser />
      </footer>
    </div>
  );
}
