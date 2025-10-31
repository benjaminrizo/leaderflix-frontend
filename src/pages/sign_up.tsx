import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarContrasena = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
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

    if (!fechaNacimiento) {
      nuevosErrores.push("La fecha de nacimiento es obligatoria.");
    }

    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo.");
    }

    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu contraseña.");
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      await registrarUsuario(usuario, email, fechaNacimiento, contrasena);
      alert("¡Registro exitoso!");
      navigate("/sign_in");
    } catch (error: any) {
      console.error("Error:", error);
      setErrores([error.message || "Error del servidor."]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Regresar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-center mb-8">
          <img src="/Logo.png" alt="Leaderflix logo" className="w-28 h-28 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-center mb-2">Regístrate</h1>
          <p className="text-gray-400 text-sm text-center">Únete a Leaderflix</p>
        </div>

        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5" noValidate>
          {/* Usuario */}
          <div>
            <label htmlFor="usuario" className="block text-sm mb-1 text-gray-300">Usuario</label>
            <input
              id="usuario"
              aria-label="Nombre de usuario"
              aria-invalid={errores.some((e) => e.includes("usuario"))}
              aria-describedby={errores.some((e) => e.includes("usuario")) ? "error-usuario" : undefined}
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="Elige un nombre de usuario"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-300">Correo Electrónico</label>
            <input
              id="email"
              aria-label="Correo electrónico"
              aria-invalid={errores.some((e) => e.includes("correo"))}
              aria-describedby={errores.some((e) => e.includes("correo")) ? "error-email" : undefined}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600"
              placeholder="tu@email.com"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label htmlFor="fecha" className="block text-sm mb-1 text-gray-300">Fecha de nacimiento</label>
            <input
              id="fecha"
              aria-label="Fecha de nacimiento"
              aria-invalid={errores.some((e) => e.includes("nacimiento"))}
              aria-describedby={errores.some((e) => e.includes("nacimiento")) ? "error-fecha" : undefined}
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600
              [color-scheme:white]
              [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                aria-label="Contraseña"
                aria-invalid={errores.some((e) => e.includes("contraseña"))}
                aria-describedby={errores.some((e) => e.includes("contraseña")) ? "error-password" : undefined}
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirmar" className="block text-sm mb-1 text-gray-300">Confirmar Contraseña</label>
            <div className="relative">
              <input
                id="confirmar"
                aria-label="Confirmar contraseña"
                aria-invalid={errores.some((e) => e.includes("confirmar")) || errores.some((e) => e.includes("coinciden"))}
                aria-describedby={errores.some((e) => e.includes("confirmar")) || errores.some((e) => e.includes("coinciden")) ? "error-confirmar" : undefined}
                type={mostrarConfirmarContrasena ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:border-red-600 pr-10"
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                aria-label={mostrarConfirmarContrasena ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
              >
                {mostrarConfirmarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Mensajes de error accesibles */}
          {errores.length > 0 && (
            <div
              className="bg-red-900/30 border border-red-600 rounded p-3 space-y-1"
              role="alert"
              aria-live="assertive"
            >
              {errores.map((error, index) => (
                <p
                  key={index}
                  id={`error-${index}`}
                  className="text-red-400 text-xs flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </p>
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
