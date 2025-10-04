import Nav from "../Nav";
import CreateUser from "./Creation";

export default function CreateUserPage() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Gestión de los usuarios</h1>
        <CreateUser />
      </main>
    </div>
  );
}