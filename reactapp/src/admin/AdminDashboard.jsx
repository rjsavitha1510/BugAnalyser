import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import adminImg from "../assets/AdminImg.png";
import adminAvatar from "../assets/Admin.png";   
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBugs();
    fetchProjects();
    fetchAnalytics();
  }, []);

  const fetchBugs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bugs");
      setBugs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={adminAvatar} alt="Admin" className="avatar" />
          <h3>{user?.fullName || "Admin"}</h3>
          <p>{user?.email || "admin@example.com"}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Overview
          </button>
          <Link to="/users"><button>User</button></Link>
          <Link to="/bugs"><button>Bug</button></Link>
          <Link to="/bug-attachments"><button>Bug Attachments</button></Link>
          <Link to="/projects"><button>Project</button></Link>
          <Link to="/quality"><button>Quality</button></Link>
          <Link to="/reporting"><button>Reporting</button></Link>
          <Link to="/notifications"><button>Notifications</button></Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </aside>

      
      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="dashboard-overview">
            <h2>Welcome, {user?.fullName || "Admin"}!</h2>
            <p>Your dashboard is ready — manage bugs efficiently, track progress seamlessly, and ensure top software quality with ease 🚀</p>

            {/* Image */}
            <div className="overview-image">
              <img
                src={adminImg}
                alt="Dashboard Overview"
                className="dashboard-img"
              />
            </div>

            
            <div className="module-overview">
              <div className="module-card">
                <h3>User Management</h3>
                <p>Full access: create, update, assign roles, deactivate users.</p>
              </div>
              <div className="module-card">
                <h3>Bug Management</h3>
                <p>View & manage all bugs.</p>
              </div>
              <div className="module-card">
                <h3>Bug Comments</h3>
                <p>View & manage all comments.</p>
              </div>
              <div className="module-card">
                <h3>Bug Attachments</h3>
                <p>View & manage all attachments.</p>
              </div>
              <div className="module-card">
                <h3>Project Management</h3>
                <p>Full control: create, update, assign managers, close projects.</p>
              </div>
              <div className="module-card">
                <h3>Quality Metrics</h3>
                <p>Full access: view, calculate, compare metrics.</p>
              </div>
              <div className="module-card">
                <h3>Analytics & Reporting</h3>
                <p>Full access: generate, export, schedule reports.</p>
              </div>
              <div className="module-card">
                <h3>Notifications</h3>
                <p>Receive all system notifications.</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
