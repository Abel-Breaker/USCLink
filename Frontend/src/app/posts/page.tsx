import Nav from "../Nav";
import CreatePost from "./Creation";

export default function CreatePostPage() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Gestión de los posts</h1>
        <CreatePost />
      </main>
    </div>
  );
}