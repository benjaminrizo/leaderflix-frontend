import { Search, Star, User, LogOut, Menu, X, Keyboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Navbar Component
 * Includes keyboard navigation shortcuts, responsive design, and search functionality
 * Windows/Linux → Alt + H/P/A/M
 * Mac → Command (⌘) + H/P/A/M
 */
export default function Navbar() {
  const navigate = useNavigate();

  // Controla visibilidad del menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // Controla si los atajos de teclado están activados
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => {
    // Guarda la preferencia del usuario en localStorage
    return localStorage.getItem("shortcutsEnabled") === "true";
  });

  /** Maneja cierre de sesión */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  /** Maneja la búsqueda */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Limpiar el input después de buscar
    }
  };

  /** Listener de atajos de teclado */
  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const altOrCmd = isMac ? e.metaKey : e.altKey; // ⌘ en Mac, Alt en otros

      if (altOrCmd && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/home");
      } else if (altOrCmd && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/profile");
      } else if (altOrCmd && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/about");
      } else if (altOrCmd && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/favorites");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, shortcutsEnabled]);

  /** Cambia el estado de los atajos */
  const toggleShortcuts = () => {
    const newState = !shortcutsEnabled;
    setShortcutsEnabled(newState);
    localStorage.setItem("shortcutsEnabled", String(newState));
  };

  return (
    <nav className="bg-[#141414] text-white">
      {/* Barra principal */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo y nombre */}
        <Link to="/home" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-white rounded-xl p-2">
            <span className="text-red-600 font-bold text-xl">LF</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">Leaderflix</h1>
            <p className="text-xs text-gray-400">Explora - Mira - Califica</p>
          </div>
        </Link>

        {/* Barra de búsqueda - solo escritorio */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full w-1/3 max-w-md"
        >
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar películas, Directores, Series"
            className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
          />
        </form>

        {/* Íconos de navegación (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/favorites">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <Star size={18} />
              <span className="hidden lg:inline">Favoritas</span>
            </button>
          </Link>

          <Link to="/profile">
            <button
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
              aria-label="Profile"
            >
              <User size={18} />
            </button>
          </Link>

          {/* Botón para activar/desactivar navegación por teclado */}
          <button
            onClick={toggleShortcuts}
            className={`p-2 rounded-full transition ${
              shortcutsEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={
              shortcutsEnabled
                ? "Atajos de teclado ACTIVADOS"
                : "Atajos de teclado DESACTIVADOS"
            }
          >
            <Keyboard size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Menú hamburguesa (mobile) */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Barra de búsqueda móvil */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
          />
        </div>
      </form>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1f1f1f] border-t border-gray-800">
          <div className="flex flex-col gap-2 p-4">
            <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
              <button className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800">
                <Star size={18} /> Favoritas
              </button>
            </Link>

            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition py-3 px-4 rounded-lg hover:bg-gray-800">
                <User size={18} /> Perfil
              </button>
            </Link>

            <button
              onClick={toggleShortcuts}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                shortcutsEnabled
                  ? "text-green-400 hover:text-green-300"
                  : "text-gray-300 hover:text-white"
              } hover:bg-gray-800`}
            >
              <Keyboard size={18} />{" "}
              {shortcutsEnabled ? "Desactivar atajos" : "Activar atajos"}
            </button>

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