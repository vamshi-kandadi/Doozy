import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 focus:outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 focus:outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg transition">
          Login
        </button>

        <p className="mt-4 text-center">
          New here?{" "}
          <Link to="/register" className="text-indigo-400">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}