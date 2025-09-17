
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import LoginImage from "../assets/Login.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("⚠️ Please fill in all required fields");
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        const decoded = JSON.parse(atob(accessToken.split(".")[1]));
        const role = decoded.role;
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        switch (role) {
          case "ROLE_ADMIN":
            navigate("/admin");
            break;
          case "ROLE_DEVELOPER":
            navigate("/developer");
            break;
          case "ROLE_TESTER":
            navigate("/tester");
            break;
          case "ROLE_STAKEHOLDER":
            navigate("/stakeholder");
            break;
          default:
            navigate("/");
        }
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        const data = error.response.data;
        // ✅ Better error messages
        if (typeof data === "string") {
          alert(`🚨 ${data}`);
        } else if (data?.message) {
          alert(`🚨 ${data.message}`);
        } else {
          alert(`🚨 ${JSON.stringify(data)}`);
        }
      } else if (error.request) {
        alert("🚨 Backend not responding. Make sure Spring Boot is running.");
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
        <img src={LoginImage} alt="Login" />
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-form-box border shadow p-4 rounded">
          <h2 className="mb-4 text-primary text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
