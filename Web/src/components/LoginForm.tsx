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
      onLoginSuccess && onLoginSuccess();
    } else {
      setError(data.message || "Error en login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block mb-1 font-semibold text-gray-800">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="hello@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">
          Password
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Row inferior */}
      <div className="flex items-center justify-between text-sm mt-2">

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700">Remember my preference</span>
        </label>

        <a href="#" className="text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Botón */}
      <div className="text-center">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign Me In
        </button>
      </div>
    </form>
  );
}
