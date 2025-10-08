import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{
      display: "flex",
      gap: 20,
      padding: "12px 20px",
      alignItems: "center",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      background: "rgba(255,255,255,0.6)"
    }}>
      <Link href="/">Perfil</Link>
      <Link href="/users">Usuarios</Link>
      <Link href="/posts">Posts</Link>
      <Link href="/comments">Comentarios</Link>
      <Link href="/">Inicio</Link>
    </nav>
  );
}