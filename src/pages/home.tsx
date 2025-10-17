import Navbar from "../components/Navbar";
import MovieSection from "../components/MovieSection";

export default function Home() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />
      <main className="pt-4">
        <MovieSection title="Recomendadas para ti" />
        <MovieSection title="Más populares" />
        <MovieSection title="Nuevos lanzamientos" />
        <MovieSection title="Series destacadas" />
      </main>
    </div>
  );
}
