const API_URL = import.meta.env.VITE_API_URL;

export async function registrarUsuario(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
    }

    return data;
}

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

export async function getUserProfile(id: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Error al obtener el perfil");
  return await response.json();
}

export async function updateUserProfile(id: string, formData: {
  email: string;
  username: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Error al actualizar perfil");
  return await response.json();
}

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
