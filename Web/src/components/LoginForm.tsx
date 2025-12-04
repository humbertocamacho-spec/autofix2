import React, { useState } from "react";
import { login } from "../services/api";
import type { AuthResponse } from "../types";

interface Props {
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: AuthResponse = await login(email, password);

    if (data.ok && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
      onLoginSuccess && onLoginSuccess();
    }else {
      setError(data.message || "Error en login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block mb-1 font-semibold text-gray-800"> Correo</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800"> Contraseña </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#27B9BA]"
          />
          <span className="text-gray-700">Recordar</span>
        </label>
        <button type="button" className="text-blue-600 hover:underline"> Olvidaste tu contraseña? </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="text-center">
        <button type="submit" className="w-full bg-[#27B9BA] text-white py-3 rounded-lg font-semibold hover:bg-[#25afaf] transition">
          Iniciar Sesión
        </button>
      </div>
    </form>
  );
}
