import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // 👈 Importar como en sign_in

export default function SignUp() {  
  const navigate = useNavigate(); // 👈 Hook para navegación
  const [usuario, setUsuario] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarContrasena = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevosErrores: string[] = [];

    if (!usuario) {
      nuevosErrores.push("El nombre de usuario es obligatorio.");
    }

    if (!email) {
      nuevosErrores.push("El correo electrónico es obligatorio.");
    } else if (!validarEmail(email)) {
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    }

    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu contraseña.");
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    if (!aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los Términos y Condiciones.");
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores([]);
    alert("¡Registro exitoso!");
    navigate("/sign_in"); // Redirige al login después del registro
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        {/* 👇 Botón de volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Volver"
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

        <div className="flex flex-col items-center mb-8">
          <img 
            src={logo} 
            alt="Leaderflix logo" 
            className="w-28 h-28 mb-4 mx-auto" 
          />
          <h1 className="text-2xl font-bold text-center mb-2">Regístrate</h1>
          <p className="text-gray-400 text-sm text-center">
            Únete a Leaderflix
          </p>
        </div>

        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
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

          <div>
            <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <input 
              type="checkbox" 
              id="terms" 
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            <label htmlFor="terms">Acepto Términos y Condiciones</label>
          </div>

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

          <button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors"
          >
            Registrarse
          </button>

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