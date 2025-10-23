const API_URL = import.meta.env.VITE_API_URL;

/**
 * Register new user with username, email, birthdate, and password
 * @param {string} username - User's chosen username
 * @param {string} email - User's email address
 * @param {string} birthdate - User's birth date (format: YYYY-MM-DD)
 * @param {string} password - User's chosen password
 * @returns {Promise<any>} API response JSON
 */
export async function registrarUsuario(
  username: string,
  email: string,
  birthdate: string,
  password: string
) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, birthdate, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  return data;
}

/**
 * Login user with email and password
 */
export async function loginUsuario(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

/**
 * Send password reset email
 */
export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/password/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error al enviar el correo");
  }

  return data;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(id: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Error al obtener el perfil");
  return await response.json();
}

/**
 * Update user profile information
 */
export async function updateUserProfile(id: string, formData: {
  email: string;
  username: string;
  birthdate: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Error al actualizar perfil");
  return await response.json();
}

/**
 * Reset password using token from email
 */
export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) {
  try {
    const response = await fetch(`${API_URL}/password/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar la contraseña.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
}

/**
 * Delete user account permanently
 */
export async function deleteUserAccount(id: string) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la cuenta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
}