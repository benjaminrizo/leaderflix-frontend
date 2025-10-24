import Navbar from "../components/Navbar";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";

/**
 * Home Component
 * Main landing page of the Leaderflix platform
 * Displays the navigation bar, multiple movie sections, and footer
 * @returns {JSX.Element} Home page with movie catalog sections
 */
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
      
      <Footer />
    </div>
  );
}