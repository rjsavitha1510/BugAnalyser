
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import RegisterImage from "../assets/Register.png";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    if (!password.trim()) {
      alert("⚠️ Password cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        passwordHash: password.trim(),  
        role: `ROLE_${role}`,   
      };

      console.log('Payload being sent:', payload); // Debug log

      const response = await axios.post(
        "http://localhost:8080/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 || response.status === 200) {
        alert("✅ Registration Successful");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        navigate("/login");
      } else {
        alert("❌ Registration failed. Try again.");
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (data?.message) alert(`❌ ${data.message}`);
        else if (typeof data === "string") alert(`❌ ${data}`);
        else alert(`❌ ${JSON.stringify(data)}`);
      } else if (error.request) {
        alert("🚨 Backend not responding. Check if server is running.");
      } else {
        alert(`🚨 ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex">
      <div className="auth-image">
        <img src={RegisterImage} alt="Register" />
      </div>

      <div className="auth-form-wrapper">
        <form className="auth-form-box border shadow p-4 rounded" onSubmit={handleRegister}>
          <h2 className="mb-4 text-primary text-center">Register</h2>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="form-select mb-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="DEVELOPER">Developer</option>
            <option value="TESTER">Tester</option>
            <option value="STAKEHOLDER">Stakeholder</option>
          </select>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
