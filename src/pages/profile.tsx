import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Mail, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../services/api";

/**
 * Profile Component
 * Displays and manages user profile information
 * @returns {JSX.Element} User profile page
 */
export default function Profile() {
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to store user data fetched from the server
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    birthdate: "", // Birth date
  });

  // State to manage form data (editable fields)
  const [formData, setFormData] = useState(userData);

  /**
   * Effect to load profile data when component mounts
   */
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

  /**
   * Handler to update form input fields
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handler to save profile changes
   */
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      const updated = await updateUserProfile(userId, formData);
      setUserData(updated);
      alert("Perfil actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo guardar los cambios");
    }
  };

  /**
   * Handler to delete user account
   */
  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu perfil? Esta acción es irreversible.")) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      await deleteUserAccount(userId);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Perfil eliminado correctamente.");
      navigate("/sign_in");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la cuenta.");
    }
  };

  // Loading screen while fetching data
  if (loading) {
    return (
      <div className="bg-[#141414] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="relative w-full max-w-md bg-black/80 rounded-2xl shadow-2xl p-8 border border-gray-800">
          {/* Back button to return to home page */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition mb-6 font-medium"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          {/* Page title */}
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Mi perfil</h1>

          {/* User avatar */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>

          {/* Section with editable profile fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Información de la cuenta
            </h3>

            {/* Input field: Username */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">Nombre de usuario</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Input field: Email */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">Correo electrónico</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Input field: Birth date */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">Fecha de nacimiento</span>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1
                    [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons section */}
          <div className="flex flex-col gap-3">
            {/* Button to save profile changes */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition shadow-md"
            >
              Guardar cambios
            </button>
            
            {/* Button to delete user account */}
            <button
              onClick={handleDelete}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold transition shadow-md"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}