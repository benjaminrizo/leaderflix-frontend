import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../services/api";

/**
 * Profile Component
 * Displays and manages user profile information
 * @returns {JSX.Element} User profile page
 */
export default function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Main user data
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    birthdate: "",
  });

  // Editable form data
  const [formData, setFormData] = useState(userData);

  // Password management
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  // Error message for password section
  const [passwordError, setPasswordError] = useState("");

  /**
   * Validates password strength requirements
   * Must contain at least 8 characters, 1 uppercase letter, and 1 special character
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets all requirements
   */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  /** Load user profile on mount */
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

  /** Handle text field changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle password field changes */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(""); // reset error on change
  };

  /** Toggle password visibility */
  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /** Save changes (profile + optional password) */
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró el ID del usuario");

      const { newPassword, confirmPassword } = passwordData;

      // ✅ Validate if user entered new password
      if (newPassword || confirmPassword) {
        // Check match
        if (newPassword !== confirmPassword) {
          setPasswordError("Las contraseñas no coinciden.");
          return;
        }

        // Check strength
        if (!validarContrasena(newPassword)) {
          setPasswordError(
            " La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial."
          );
          return;
        }
      }

      // Combine updates
      const updatedInfo = {
      username: formData.username,
      email: formData.email,
      birthdate: formData.birthdate,
      ...(newPassword && { password: newPassword }), 
};

      // Send to API
      const updated = await updateUserProfile(userId, updatedInfo);

      setUserData(updated);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setPasswordError("");
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar los cambios");
    }
  };

  /** Delete account handler */
  const handleDelete = async () => {
    if (
      !confirm(
        "¿Seguro que deseas eliminar tu perfil? Esta acción es irreversible."
      )
    )
      return;
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
          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition mb-6 font-medium"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Mi perfil
          </h1>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>

          {/* Editable fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Información de la cuenta
            </h3>

            {/* Username */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">
                    Nombre de usuario
                  </span>
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

            {/* Email */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">
                    Correo electrónico
                  </span>
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

            {/* Birth date */}
            <div className="bg-[#1c1c1c] rounded-xl p-4 border border-gray-700 mb-8">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">
                    Fecha de nacimiento
                  </span>
                  <input
                    type="date"
                    name="birthdate"
                    value={
                      formData.birthdate
                        ? formData.birthdate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Password update section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Actualizar contraseña
              </h3>

              {/* New password */}
              <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block">
                      Nueva contraseña
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm password */}
              <div className="bg-[#1c1c1c] rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block">
                      Confirmar nueva contraseña
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-gray-600 focus:border-red-500 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password error message */}
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 text-center font-medium">
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition shadow-md"
            >
              Guardar cambios
            </button>

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
