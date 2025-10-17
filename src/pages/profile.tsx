import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  // Datos de ejemplo (luego puedes cargarlos del backend o localStorage)
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

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Perfil de usuario</h1>

        {!isEditing ? (
          <div className="space-y-4 bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div>
              <p className="text-gray-400">Nombre</p>
              <p className="text-lg font-medium">{userData.name}</p>
            </div>

            <div>
              <p className="text-gray-400">Usuario</p>
              <p className="text-lg font-medium">@{userData.username}</p>
            </div>

            <div>
              <p className="text-gray-400">Correo electrónico</p>
              <p className="text-lg font-medium">{userData.email}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition"
            >
              Editar perfil
            </button>
          </div>
        ) : (
          <div className="space-y-4 bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div>
              <label className="block text-gray-400 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
