// Importing the Link component for client-side navigation between routes
import { Link } from "react-router-dom";
// Importing the Film icon from lucide-react for brand illustration
import { Film } from "lucide-react";

// Functional component representing the application's footer section
export default function Footer() {
  return (
    // Footer container with background color, padding, and top border
    <footer className="bg-black/50 text-gray-400 py-8 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main footer layout divided into three columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand information section including logo and short description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {/* Film icon representing the movie theme */}
              <Film className="text-red-600" size={24} />
              {/* Brand name */}
              <h3 className="text-white font-bold text-lg">Leaderflix</h3>
            </div>
            {/* Short descriptive text about the platform */}
            <p className="text-sm text-gray-500 leading-relaxed">
              Tu plataforma de películas favoritas. Descubre y disfruta del mejor contenido cinematográfico.
            </p>
          </div>

          {/* Navigation links to main pages */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* Link to homepage */}
                <Link to="/" className="hover:text-red-500 transition">
                  Inicio
                </Link>
              </li>
              <li>
                {/* Link to movies section */}
                <Link to="/home" className="hover:text-red-500 transition">
                  Películas
                </Link>
              </li>
              <li>
                {/* Link to about page */}
                <Link to="/about" className="hover:text-red-500 transition">
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          {/* Account-related links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* Link to login page */}
                <Link to="/sign_in" className="hover:text-red-500 transition">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                {/* Link to registration page */}
                <Link to="/sign_up" className="hover:text-red-500 transition">
                  Registrarse
                </Link>
              </li>
              <li>
                {/* Link to user profile */}
                <Link to="/profile" className="hover:text-red-500 transition">
                  Mi perfil
                </Link>
              </li>
              <li>
                {/* Link to password recovery page */}
                <Link to="/forgot-password" className="hover:text-red-500 transition">
                  Recuperar contraseña
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section showing copyright */}
        <div className="text-center text-gray-600 text-xs pt-6 border-t border-gray-800">
          {/* Displays the current year dynamically */}
          <p>© {new Date().getFullYear()} Leaderflix. Proyecto académico sin fines comerciales.</p>
        </div>
      </div>
    </footer>
  );
}
