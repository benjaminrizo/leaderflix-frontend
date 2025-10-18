import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juanperez@example.com",
    username: "juanflix",
  });

  const [formData, setFormData] = useState(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer."
    );
    if (confirmDelete) {
      // Aquí podrías llamar al backend para eliminar el usuario
      alert("Perfil eliminado exitosamente.");
      navigate("/"); // Redirige al home o login
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 border border-gray-800 relative">
          <h1 className="text-3xl font-bold mb-8 text-center text-red-500">
            Perfil de usuario
          </h1>

          {!isEditing ? (
            <div className="space-y-5">
              <div className="bg-[#242424] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Nombre</p>
                <p className="text-lg font-medium mt-1">{userData.name}</p>
              </div>

              <div className="bg-[#242424] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Usuario</p>
                <p className="text-lg font-medium mt-1">@{userData.username}</p>
              </div>

              <div className="bg-[#242424] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Correo electrónico</p>
                <p className="text-lg font-medium mt-1">{userData.email}</p>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition shadow-md"
                >
                  Editar perfil
                </button>

                <button
                  onClick={handleDelete}
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition text-red-400 hover:text-red-500"
                >
                  Eliminar perfil
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="px-8 py-3 bg-[#242424] hover:bg-[#333] rounded-xl font-semibold transition text-gray-300 hover:text-white"
                >
                  ← Regresar al Home
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#242424] text-white border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#242424] text-white border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#242424] text-white border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-center gap-5 pt-6">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition shadow-md"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-400 hover:text-white text-sm underline"
                >
                  ← Regresar al Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
