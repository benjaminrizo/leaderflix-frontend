import { useState } from "react";
import { Mail } from "lucide-react";
import Logo from "../assets/Logo.png"; // Asegúrate de que el logo exista en assets

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email enviado:", email);
    // Aquí podrás llamar a tu API: e.g. forgotPassword(email)
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c3?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Capa oscura */}
      <div className="bg-black bg-opacity-70 p-10 rounded-xl shadow-lg w-[90%] max-w-md text-center text-white">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white rounded-xl p-3 mb-2">
            <img src={Logo} alt="Leaderflix Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-red-500">Leaderflix</h1>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold mb-2">Recupera tu Contraseña</h2>
        <p className="text-gray-300 text-sm mb-6">
          Ingresa el correo registrado por primera vez
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex items-center border-b border-gray-400 pb-2">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              required
              placeholder="Ingresar correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 transition rounded-md py-2 font-semibold text-white"
          >
            Enviar email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
