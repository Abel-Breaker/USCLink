import Nav from "../Nav";
import CreateFollow from "./Creation";

export default function CreateFollowPage() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Gestión de los seguidores</h1>
        <CreateFollow />
      </main>
    </div>
  );
}