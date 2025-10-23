import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

/**
 * SignUp Component
 * User registration form with comprehensive validation
 * Includes username, email, birthdate, password fields with visibility toggles
 * @returns {JSX.Element} Sign up form
 */
export default function SignUp() {
  // Hook for programmatic navigation after successful registration
  const navigate = useNavigate();
  
  // Form input states for all registration fields
  const [usuario, setUsuario] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>("");
  
  // Password visibility toggle states for both password fields
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  
  // Terms and conditions acceptance state
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  
  // Error messages array state
  const [errores, setErrores] = useState<string[]>([]);

  /**
   * Validates email format using regex pattern
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email format is valid
   */
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Validates password strength requirements
   * Must contain at least 8 characters, 1 uppercase letter, and 1 special character
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets all requirements
   */
  const validarContrasena = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /**
   * Handles form submission with comprehensive validation
   * Validates all fields, registers user via API, and redirects to sign in on success
   * @param {React.FormEvent} e - Form submission event
   */
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    // Validate username field - required
    if (!usuario) {
      nuevosErrores.push("El nombre de usuario es obligatorio.");
    }

    // Validate email field - required and must match email format
    if (!email) {
      nuevosErrores.push("El correo electrónico es obligatorio.");
    } else if (!validarEmail(email)) {
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    }

    // Validate birthdate field - required
    if (!fechaNacimiento) {
      nuevosErrores.push("La fecha de nacimiento es obligatoria.");
    }

    // Validate password field - required and must meet strength requirements
    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    // Validate password confirmation - required and must match original password
    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu contraseña.");
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    // Validate terms acceptance - required
    if (!aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los Términos y Condiciones.");
    }

    // If validation errors exist, display them and stop submission
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Attempt to register user via API
    try {
      await registrarUsuario(usuario, email, fechaNacimiento, contrasena);
      // Show success message and redirect to sign in page
      alert("¡Registro exitoso!");
      navigate("/sign_in");
    } catch (error: any) {
      // Log error and display API error message
      console.error("Error:", error);
      setErrores([error.message || "Error del servidor."]);
    }
  };

  return (
    // Full-screen centered container with dark background
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      {/* Form card with semi-transparent black background */}
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        
        {/* Back button positioned absolutely in top-left corner */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Go back"
        >
          {/* Left chevron SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Header section with logo and welcome message */}
        <div className="flex flex-col items-center mb-8">
          {/* Platform logo */}
          <img src="/Logo.png" alt="Leaderflix logo" className="w-28 h-28 mb-4 mx-auto" />
          
          {/* Page title */}
          <h1 className="text-2xl font-bold text-center mb-2">Regístrate</h1>
          
          {/* Welcome message */}
          <p className="text-gray-400 text-sm text-center">
            Únete a Leaderflix
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          
          {/* Username input field */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Elige un nombre de usuario"
            />
          </div>

          {/* Email input field with validation */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="tu@email.com"
            />
          </div>

          {/* Birthdate input field with date picker */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Fecha de nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600
              [color-scheme:white]
              [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          {/* Password input field with visibility toggle */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <div className="relative">
              {/* Password input with dynamic type based on visibility state */}
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10"
                placeholder="Mínimo 8 caracteres"
              />
              {/* Toggle visibility button positioned absolutely in input */}
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                aria-label={
                  mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {/* Eye/EyeOff icon from lucide-react */}
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm password input field with separate visibility toggle */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Confirmar Contraseña
            </label>
            <div className="relative">
              {/* Confirmation input with independent visibility state */}
              <input
                type={mostrarConfirmarContrasena ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10"
                placeholder="Confirma tu contraseña"
              />
              {/* Independent toggle button for confirmation field */}
              <button
                type="button"
                onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                aria-label={
                  mostrarConfirmarContrasena
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
              >
                {mostrarConfirmarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms and conditions checkbox - required for registration */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
            <input
              type="checkbox"
              id="terms"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            <label htmlFor="terms">Acepto Términos y Condiciones</label>
          </div>

          {/* Error messages display - shown when validation fails */}
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

          {/* Submit button */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors"
          >
            Registrarse
          </button>

          {/* Link to sign in page for existing users */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Ya tienes cuenta?{" "}
            <Link to="/sign_in" className="text-red-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}