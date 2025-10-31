import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

    const nuevosErrores: typeof errores = {};

    if (!usuario) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!validarEmail(usuario)) {
      nuevosErrores.email = "Debes ingresar un correo electrónico válido.";
    }

    if (!contrasena) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.password =
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setIsLoading(true);
    setErrores({});

    try {
      const data = await loginUsuario(usuario, contrasena);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error: any) {
      console.error("Error:", error);
      setErrores({
        general: error.message || "Credenciales inválidas. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div
        className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white"
        role="form"
        aria-labelledby="titulo-login"
      >
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/Logo.png"
            alt="Logo de Leaderflix"
            className="w-28 h-28 mb-4 mx-auto"
          />
          <h1 id="titulo-login" className="text-2xl font-bold text-center mb-2">
            Inicia sesión
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Bienvenido de nuevo a Leaderflix
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSubmit} noValidate aria-describedby="errores-generales" className="flex flex-col space-y-5">

          {/* Campo: Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={isLoading}
              aria-required="true"
              aria-invalid={!!errores.email}
              aria-describedby={errores.email ? "error-email" : undefined}
              className={`w-full p-2 rounded bg-[#1c1c1c] border ${
                errores.email ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="tu@email.com"
            />
            {errores.email && (
              <p
                id="error-email"
                className="text-red-400 text-xs mt-1"
                role="alert"
                aria-live="assertive"
              >
                {errores.email}
              </p>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={isLoading}
                aria-required="true"
                aria-invalid={!!errores.password}
                aria-describedby={errores.password ? "error-password" : undefined}
                className={`w-full p-2 rounded bg-[#1c1c1c] border ${
                  errores.password ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:border-red-600 pr-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                disabled={isLoading}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errores.password && (
              <p
                id="error-password"
                className="text-red-400 text-xs mt-1"
                role="alert"
                aria-live="assertive"
              >
                {errores.password}
              </p>
            )}
          </div>

          {/* Enlace recuperar contraseña */}
          <div className="flex justify-center text-xs text-gray-400">
            <Link to="/forgot_password" className="hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error general (API, credenciales, etc.) */}
          {errores.general && (
            <div
              id="errores-generales"
              role="alert"
              aria-live="assertive"
              className="bg-red-900/30 border border-red-600 rounded p-3"
            >
              <p className="text-red-400 text-xs">{errores.general}</p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          {/* Registro */}
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
