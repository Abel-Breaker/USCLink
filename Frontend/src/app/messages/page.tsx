import Nav from "../Nav";
import Mesagge from "./Creation";

export default function CreatePostPage() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Mensajes</h1>
        <Mesagge />
      </main>
    </div>
  );
}