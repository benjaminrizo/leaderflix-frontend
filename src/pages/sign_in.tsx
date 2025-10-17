import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUsuario } from "../services/api";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    // Validar todos los campos
    if (!usuario) {
      nuevosErrores.push("El correo electrónico es obligatorio.");
    } else if (!validarEmail(usuario)) {
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    }

    if (!contrasena) {
      nuevosErrores.push("La contraseña es obligatoria.");
    } else if (!validarContrasena(contrasena)) {
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );
    }

    if (!aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los Términos y Condiciones.");
    }

    // Si hay errores, mostrarlos y detener
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const data = await loginUsuario(usuario, contrasena);

      //Guarda el token en localStorage (si tu backend lo devuelve)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Inicio de sesión exitoso");
      navigate("/home"); // Redirige al dashboard o página principal
    } catch (error: any) {
      console.error("Error:", error);
      setErrores([error.message || "Credenciales inválidas."]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141414]">
      <div className="bg-black/80 p-10 rounded-2xl shadow-lg w-96 text-white">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Leaderflix logo"
            className="w-28 h-28 mb-4 mx-auto"
          />
          <h1 className="text-2xl font-bold text-center mb-2">Inicia sesión</h1>
          <p className="text-gray-400 text-sm text-center">
            Bienvenido de nuevo a Leaderflix
          </p>
        </div>

        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
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
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <a href="#" className="hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </a>
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
            Iniciar Sesión
          </button>

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