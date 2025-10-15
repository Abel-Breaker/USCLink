import Nav from "../Nav";
import CreateComment from "./Creation";

export default function CreateCommmentPage() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Gestión de los comentarios</h1>
        <CreateComment />
      </main>
    </div>
  );
}