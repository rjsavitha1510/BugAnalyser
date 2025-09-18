import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import stakeholderImg from "../assets/StakeholderImg.png"; 
import stakehodlerIcon from "../assets/Stakeholder.png";
import "./StakeholderDashboard.css";

const StakeholderDashboard = () => {
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
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={stakehodlerIcon} alt="Stakeholder" className="avatar" />
          <h3>{user?.fullName || "Stakeholder"}</h3>
          <p>{user?.email || "stakeholder@example.com"}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Overview
          </button>
          <Link to="/bugstack"><button>Bug</button></Link>
          <Link to="/projectstack"><button>Project</button></Link>
          <Link to="/qualitystack"><button>Quality</button></Link>
          <Link to="/reportingstack"><button>Reporting</button></Link>
          <Link to="/notifications"><button>Notifications</button></Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </aside>

      
      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="dashboard-overview">
            <h2>Welcome, {user?.fullName || "Stakeholder"}!</h2>
            <p>Your strategic overview is ready — monitor project health, track quality metrics, and drive informed decisions for success 📊</p>

            {/* Image */}
            <div className="overview-image">
              <img
                src={stakeholderImg}
                alt="Dashboard Overview"
                className="dashboard-img"
              />
            </div>

            {/* Module Overview */}
            <div className="module-overview">
              <div className="module-card">
                <h3>Bug Management</h3>
                <p>View all bugs and track progress.</p>
              </div>
              <div className="module-card">
                <h3>Bug Comments</h3>
                <p>View all comments and discussions.</p>
              </div>
              <div className="module-card">
                <h3>Project Management</h3>
                <p>View project status and progress.</p>
              </div>
              <div className="module-card">
                <h3>Quality Metrics</h3>
                <p>View quality metrics and performance indicators.</p>
              </div>
              <div className="module-card">
                <h3>Analytics & Reporting</h3>
                <p>View reports and analytics data.</p>
              </div>
              <div className="module-card">
                <h3>Notifications</h3>
                <p>Receive system notifications and updates.</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StakeholderDashboard;
