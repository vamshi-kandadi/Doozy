import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account 🚀</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition">
          Register
        </button>

        <p className="mt-4 text-center">
          Already have account?{" "}
          <Link to="/" className="text-indigo-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}