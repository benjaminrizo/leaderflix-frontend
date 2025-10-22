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
    // Main container with dark background and minimum full-screen height
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* Top navigation bar with search, favorites, and user options */}
      <Navbar />
      
      {/* Main content area with top padding to avoid navbar overlap */}
      <main className="pt-4">
        {/* Personalized recommendations section */}
        <MovieSection title="Recomendadas para ti" />
        
        {/* Most popular content section */}
        <MovieSection title="Más populares" />
        
        {/* New releases section */}
        <MovieSection title="Nuevos lanzamientos" />
        
        {/* Featured series section */}
        <MovieSection title="Series destacadas" />
      </main>
      
      {/* Page footer with additional links and information */}
      <Footer />
    </div>
  );
}