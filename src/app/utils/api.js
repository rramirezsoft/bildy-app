'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

// llamada a la api para el registro de usuario
export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.get("name"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password: formData.get("password"),
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error registrando usuario");
    }
    const data = await response.json();
    return data;
}

export async function register(formData) {
    try {
        const user = await registerUser(formData);
        if (user && user.token) {
            return { success: true, token: user.token, redirectTo: '/verification' };
        }
        return { success: false, message: "No se pudo obtener el token" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// llamada a la api para validar el email
export async function validateEmail(code, token) {
    const response = await fetch(`${API_BASE_URL}/user/validation`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        throw new Error("Error validando el correo");
    }

    const data = await response.json();
    return data;
}

// llamada a la api para el inicio de sesión
export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Error iniciando sesión");
    }

    const data = await response.json();
    return data;
}
