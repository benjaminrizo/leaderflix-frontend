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

    return data; // Puede incluir el token JWT u otros datos del usuario
}
