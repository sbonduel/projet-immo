import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border" type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;


