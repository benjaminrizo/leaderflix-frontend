import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * SignIn Component
 * User authentication form with email and password validation
 * Includes password visibility toggle and terms acceptance
 * @returns {JSX.Element} Sign in form
 */
const SignIn: React.FC = () => {
  // Hook for programmatic navigation after successful login
  const navigate = useNavigate();
  
  // Form state management
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API request

  /**
   * Validates email format using regex
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email format is valid
   */
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Validates password strength requirements
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets requirements (8+ chars, 1 uppercase, 1 special char)
   */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /**
   * Handles form submission
   * Validates all fields, authenticates user via API, stores token and redirects to home
   * @param {React.FormEvent} e - Form submission event
   */
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    // Validate email field
    if (!usuario) {
      nuevosErrores.push("El correo electrónico es obligatorio.");
    } else if (!validarEmail(usuario)) {
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    }

    // Validate password field
    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    // Validate terms acceptance
    if (!aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los Términos y Condiciones.");
    }

    // If validation errors exist, display them and stop submission
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Start loading state
    setIsLoading(true);
    setErrores([]); // Clear previous errors

    // Attempt authentication via API
    try {
      const data = await loginUsuario(usuario, contrasena);

      // Store authentication token and user ID in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      // Show success message and redirect to home page
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error: any) {
      // Log error and display authentication failure message
      console.error("Error:", error);
      setErrores([error.message || "Credenciales inválidas."]);
    } finally {
      // Stop loading state regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    // Full-screen centered container with dark background
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      {/* Form card with semi-transparent black background */}
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white">
        
        {/* Header section with logo and welcome message */}
        <div className="flex flex-col items-center mb-8">
          {/* Platform logo */}
          <img src="/Logo.png" alt="Leaderflix logo" className="w-28 h-28 mb-4 mx-auto" />
          
          {/* Page title */}
          <h1 className="text-2xl font-bold text-center mb-2">Inicia sesión</h1>
          
          {/* Welcome message */}
          <p className="text-gray-400 text-sm text-center">
            Bienvenido de nuevo a Leaderflix
          </p>
        </div>

        {/* Sign in form */}
        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          
          {/* Email input field */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={isLoading} // Disable input while loading
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password field with show/hide toggle button */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <div className="relative">
              {/* Password input with dynamic type based on visibility state */}
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={isLoading} // Disable input while loading
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu contraseña"
              />
              {/* Toggle visibility button positioned absolutely in input */}
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                disabled={isLoading} // Disable button while loading
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={
                  mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {/* Eye/EyeOff icon from lucide-react */}
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="flex justify-center text-xs text-gray-400">
            <Link to="/forgot_password" className="hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Terms and conditions checkbox */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
            <input
              type="checkbox"
              id="terms"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              disabled={isLoading} // Disable checkbox while loading
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="terms">Acepto Términos y Condiciones</label>
          </div>

          {/* Error messages container - displayed when validation fails */}
          {errores.length > 0 && (
            <div className="bg-red-900/30 border border-red-600 rounded p-3 space-y-1">
              {/* Error list with bullet points */}
              {errores.map((error, index) => (
                <div key={index} className="text-red-400 text-xs flex items-start">
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={isLoading} // Disable button while loading
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {/* Show spinner icon when loading */}
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {/* Sign up link for new users */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿No tienes cuenta?{" "}
            <Link to="/sign_up" className="text-red-500 hover:underline">
              Regístrate ya
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;