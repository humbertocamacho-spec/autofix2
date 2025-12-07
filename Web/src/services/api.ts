const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  console.log("Respuesta cruda de login:", data);
  return data;
}

export async function register(name: string, phone: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, email, password }),
  });
  return res.json();
}

export async function me(token: string) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("Respuesta cruda de /me:", data);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${data.message || "Token inválido"}`);
  }

  return data;
}

export const api = { login, register, me };
