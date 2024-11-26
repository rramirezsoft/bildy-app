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
    const data = await response.json();
    if (!response.ok) {
        throw { message: data.message || "Error registering user", status: response.status };
    }
    return data;
}

export async function register(formData) {
    try {
        const user = await registerUser(formData);
        if (user && user.token) {
            return { 
                success: true, 
                token: user.token, 
                redirectTo: `/verification`,
            };
        }
        return { success: false, message: "Failed to get Token" };
    } catch (error) { 
        return { success: false, message: error.message || "Unknown error" };
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
        throw new Error("Error");
    }

    const data = await response.json();
    return data;
}

// Función para obtener la información del usuario
export async function getUser(token) {
    if (!token) {
      throw new Error("Token is required");
    }
  
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Enviamos el token almacenado en coockies
          "Content-Type": "application/json", 
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
  

// llamada a la api para crear clientes
export async function addClient(clientData, token) {
    const response = await fetch(`${API_BASE_URL}/api/client`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // pasamos el token de autenticación
        },
        body: JSON.stringify(clientData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error adding client", response.status);
    }

    return data;
}
    