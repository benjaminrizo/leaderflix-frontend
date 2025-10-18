import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";


/**
 * ResetPassword Component
 * Allows users to create a new password after receiving a recovery link
 * @returns {JSX.Element} Password reset form
 */
const ResetPassword: React.FC = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // State to store the new password input value
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  
  // State to store the confirm password input value
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  
  // State to store validation errors as an array
  const [errores, setErrores] = useState<string[]>([]);
  
  // State to store success message
  const [mensaje, setMensaje] = useState("");

  /**
   * Validates password requirements
   * Must have at least 8 characters, one uppercase letter, and one special character
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets requirements
   */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /**
   * Handles form submission
   * Validates both password fields and simulates password reset
   * @param {React.FormEvent} e - Form event
   */
  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevosErrores: string[] = [];

    // Validate that new password field is not empty
    if (!nuevaContrasena) {
      nuevosErrores.push("La nueva contraseña es obligatoria.");
    } else if (!validarContrasena(nuevaContrasena)) {
      // Validate password meets security requirements
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    // Validate that confirm password field is not empty
    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu nueva contraseña.");
    } else if (nuevaContrasena !== confirmarContrasena) {
      // Validate that both passwords match
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    // If there are validation errors, display them and stop
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    // Clear errors and show success message
    setErrores([]);
    setMensaje("¡Contraseña actualizada exitosamente!");
    
    // Redirect to sign in page after 2 seconds
    setTimeout(() => {
      navigate("/sign_in");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        {/* Back button - navigates to sign in page */}
        <button
          onClick={() => navigate("/sign_in")}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Go back to sign in"
        >
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

        {/* Header section with logo and title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Leaderflix logo"
            className="w-28 h-28 mb-4 mx-auto"
          />
          <h1 className="text-2xl font-bold text-center mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Crea tu nueva contraseña
          </p>
        </div>

        {/* Password reset form */}
        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          {/* New password input field */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {/* Confirm password input field */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Confirma tu contraseña"
            />
          </div>

          {/* Error messages display */}
          {errores.length > 0 && (
            <div className="bg-red-900/30 border border-red-600 rounded p-3 space-y-1">
              {errores.map((error, index) => (
                <div key={index} className="text-red-400 text-xs flex items-start">
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Success message display */}
          {mensaje && (
            <div className="bg-green-900/30 border border-green-600 rounded p-3 text-green-400 text-xs">
              {mensaje}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors"
          >
            Restablecer Contraseña
          </button>

          {/* Link back to sign in page */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Recordaste tu contraseña?{" "}
            <Link to="/sign_in" className="text-red-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;