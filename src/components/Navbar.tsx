import { Search, Star, User, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Navbar Component
 * Main navigation bar with search, favorites, profile and logout functionality
 * Features responsive design with mobile hamburger menu
 * @returns {JSX.Element} Navigation bar component
 */
export default function Navbar() {
  // Hook for programmatic navigation after logout
  const navigate = useNavigate();
  
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Handles user logout
   * Clears authentication token from localStorage and redirects to sign in page
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  return (
    <nav className="bg-[#141414] text-white">
      {/* Main navigation container */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        
        {/* Logo section with brand identity */}
        <div className="flex items-center gap-3">
          {/* Brand icon with white background and red text */}
          <div className="bg-white rounded-xl p-2">
            <span className="text-red-600 font-bold text-xl">LF</span>
          </div>
          {/* Brand name and tagline - hidden on small screens */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">Leaderflix</h1>
            <p className="text-xs text-gray-400">Explora - Mira - Califica</p>
          </div>
        </div>

        {/* Search bar - Desktop only (hidden on mobile/tablet) */}
        <div className="hidden md:flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full w-1/3 max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar películas, Directores, Series"
            className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
          />
        </div>

        {/* Desktop navigation icons - shown on medium+ screens */}
        <div className="hidden md:flex items-center gap-3">
          {/* Favorites button */}
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <Star size={18} /> 
            {/* Label shown only on large screens */}
            <span className="hidden lg:inline">Favoritas</span>
          </button>

          {/* Profile button with link to profile page */}
          <Link to="/profile">
            <button 
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
              aria-label="Profile"
            >
              <User size={18} />
            </button>
          </Link>

          {/* Logout button styled with red color to indicate destructive action */}
          <button
            onClick={handleLogout}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile menu toggle button - shown only on small/medium screens */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {/* Toggle between X (close) and Menu (hamburger) icons */}
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Search bar - Mobile version (shown only on small/medium screens) */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
          />
        </div>
      </div>

      {/* Mobile Menu - Dropdown navigation for small/medium screens */}
      {/* Conditionally rendered based on isMenuOpen state */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1f1f1f] border-t border-gray-800">
          <div className="flex flex-col gap-2 p-4">
            {/* Favorites option */}
            <button className="flex items-center gap-3 text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800">
              <Star size={18} /> Favoritas
            </button>

            {/* Profile link - closes menu on click */}
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800">
                <User size={18} /> Perfil
              </button>
            </Link>

            {/* Logout option - styled in red and closes menu after logout */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 text-red-400 hover:text-red-300 transition py-3 px-4 rounded-lg hover:bg-gray-800"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}