import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { getUserProfile, updateUserProfile, deleteUserAccount} from "../services/api";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
  });

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("No se encontró el ID del usuario");

        const data = await getUserProfile(userId);
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      const updated = await updateUserProfile(userId, formData);
      setUserData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar los cambios");
    }
  };

  const handleDelete = async () => {
  if (!confirm("¿Seguro que deseas eliminar tu perfil? Esta acción es irreversible.")) {
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("No se encontró el ID del usuario");

    // Llamar al backend para eliminar usuario
    await deleteUserAccount(userId);

    // Eliminar datos locales
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    alert("Perfil eliminado correctamente.");
    navigate("/sign_in");
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la cuenta.");
  }
};


  if (loading) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 border border-gray-800">
          {/* 🔙 Botón de volver */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-6 left-6 p-2 bg-[#242424] rounded-full hover:bg-[#333] transition"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-3xl font-bold mb-8 text-center text-red-500">
            Perfil de usuario
          </h1>

          {!isEditing ? (
            <div className="space-y-5">
               
              <div className="bg-[#242424] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Usuario</p>
                <p className="text-lg font-medium mt-1">{userData.username}</p>
              </div>

              <div className="bg-[#242424] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Correo electrónico</p>
                <p className="text-lg font-medium mt-1">{userData.email}</p>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-gray-600 hover:bg-red-700 rounded-xl font-semibold transition shadow-md"
                >
                  Editar perfil
                </button>

                <button
                  onClick={handleDelete}
                  className="px-8 py-3 bg-red-700 hover:bg-gray-600 rounded-xl font-semibold transition shadow-md"
                >
                  Eliminar perfil
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
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
                <label className="block text-gray-400 mb-1">Correo electrónico</label>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
