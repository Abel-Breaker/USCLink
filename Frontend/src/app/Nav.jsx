import Link from "next/link";
import styles from "./page.module.css";

export default function Nav() {
  return (
    <nav style={styles.nav}>
      <Link href="/inicio">Inicio</Link>
      <Link href="/inicio">Perfil</Link>
      <Link href="/users">Usuarios</Link>
      <Link href="/posts">Posts</Link>
      <Link href="/comments">Comentarios</Link>
      <Link href="/follows">Seguidores</Link>
      <Link href="/messages">Mensajes</Link>
    </nav>
  );
}