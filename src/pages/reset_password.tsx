import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/api"; // 👈 Importa la función del API

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) setToken(tokenFromURL);
    else setErrores(["Token inválido o ausente."]);
  }, [location.search]);

  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];

    if (!nuevaContrasena) {
      nuevosErrores.push("La nueva contraseña es obligatoria.");
    } else if (!validarContrasena(nuevaContrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    if (!confirmarContrasena) {
      nuevosErrores.push("Debes confirmar tu nueva contraseña.");
    } else if (nuevaContrasena !== confirmarContrasena) {
      nuevosErrores.push("Las contraseñas no coinciden.");
    }

    if (!token) {
      nuevosErrores.push("Token de restablecimiento no encontrado.");
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    try {
      //Llamada al servicio
      await resetPassword({ token: token!, newPassword: nuevaContrasena });

      setMensaje("¡Contraseña actualizada exitosamente!");
      setErrores([]);
      setTimeout(() => navigate("/sign_in"), 2000);
    } catch (error: any) {
      setErrores([error.message]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white relative">
        <button
          onClick={() => navigate("/sign_in")}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          ←
        </button>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Crea tu nueva contraseña
          </p>
        </div>

        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
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

          {mensaje && (
            <div className="bg-green-900/30 border border-green-600 rounded p-3 text-green-400 text-xs">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold transition-colors"
          >
            Restablecer Contraseña
          </button>

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
