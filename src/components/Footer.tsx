// src/components/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-gray-300 py-10 mt-10 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        
        {/* Columna 1 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Leaderflix</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">Inicio</Link></li>
            <li><Link to="/home" className="hover:text-white transition">Películas</Link></li>
            <li><Link to="/series" className="hover:text-white transition">Series</Link></li>
            <li><Link to="/directors" className="hover:text-white transition">Directores</Link></li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Cuenta</h3>
          <ul className="space-y-2">
            <li><Link to="/profile" className="hover:text-white transition">Perfil</Link></li>
            <li><Link to="/favorites" className="hover:text-white transition">Favoritos</Link></li>
            <li><Link to="/settings" className="hover:text-white transition">Configuración</Link></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Acerca de</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white transition">Nosotros</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Términos de uso</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacidad</Link></li>
          </ul>
        </div>

        {/* Columna 4 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Soporte</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-white transition">Centro de ayuda</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contáctanos</Link></li>
            <li><Link to="/feedback" className="hover:text-white transition">Sugerencias</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} Leaderflix. Todos los derechos reservados.
      </div>
    </footer>
  );
}
