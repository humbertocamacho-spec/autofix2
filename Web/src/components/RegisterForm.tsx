import React, { useState } from 'react';
import { register } from '../services/api';
import type { AuthResponse } from '../types';

interface Props {
  onRegisterSuccess: () => void;
}

export default function RegisterForm({ onRegisterSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: AuthResponse = await register(name, phone , email, password);

    if (data.ok) {
      onRegisterSuccess();
    } else {
      setError(data.message || 'Error en registro');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Telefono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
