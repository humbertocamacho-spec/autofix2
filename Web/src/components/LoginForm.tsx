import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

interface Props {
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onLoginSuccess }: Props) {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await login(email, password);

    if (ok) {
      onLoginSuccess?.();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Password"
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
          <span className="text-gray-700">Remember</span>
        </label>

        <button type="button" className="text-blue-600 hover:underline">
          ¿Forgot your password?
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <div className="text-center">
        <button type="submit" className="w-full bg-[#27B9BA] text-white py-3 rounded-lg font-semibold hover:bg-[#25afaf] transition">
          Login
        </button>
      </div>

    </form>
  );
}
