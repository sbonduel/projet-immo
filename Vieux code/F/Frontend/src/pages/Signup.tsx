import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, form);
    alert("Inscription réussie !");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border" placeholder="Nom" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Mot de passe" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">S’inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
