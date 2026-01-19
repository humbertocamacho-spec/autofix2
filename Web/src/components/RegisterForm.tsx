import React, { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../types";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: AuthResponse = await register(name, phone, email, password);

    if (!data.ok) {
      setError(data.message || "Error al registrarte");
      return;
    }

    navigate("/login");
  };

  return (
    // Register form
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Phone</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center text-sm mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
          <span className="text-gray-700">Accept the terms and conditions</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="text-center">
        <button type="submit" className="w-full bg-[#27B9BA] text-white py-3 rounded-lg font-semibold hover:bg-[#25afaf] transition">
          Create Account
        </button>
      </div>
    </form>
  );
}
