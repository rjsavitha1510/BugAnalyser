import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import testerImg from "../assets/TesterImg.png"; 
import testericon from "../assets/Tester.png";
import "./TesterDashboard.css";

const TesterDashboard = () => {
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
          <img src={testericon} alt="Tester" className="avatar" />
          <h3>{user?.fullName || "Tester"}</h3>
          <p>{user?.email || "tester@example.com"}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Overview
          </button>
          <Link to="/bugt"><button>Bug</button></Link>
          <Link to="/tattach"><button>Bug Attachment</button></Link>
          <Link to="/tmetric"><button>Quality</button></Link>
          <Link to="/reported"><button>Reporting</button></Link>
          <Link to="/tnotify"><button>Notification</button></Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="dashboard-overview">
            <h2>Welcome, {user?.fullName || "Tester"}!</h2>
            <p>Your testing environment is ready — test thoroughly, catch bugs early, and ensure flawless software quality 🔍</p>

            {/* Image */}
            <div className="overview-image">
              <img
                src={testerImg}
                alt="Dashboard Overview"
                className="dashboard-img"
              />
            </div>

            {/* Module Overview */}
            <div className="module-overview">
              <div className="module-card">
                <h3>Bug Management</h3>
                <p>View, create, and manage bugs assigned to you.</p>
              </div>
              <div className="module-card">
                <h3>Bug Comments</h3>
                <p>Add comments and collaborate on bug resolution.</p>
              </div>
              <div className="module-card">
                <h3>Bug Attachments</h3>
                <p>Upload and manage bug-related files and screenshots.</p>
              </div>
              <div className="module-card">
                <h3>Quality Metrics</h3>
                <p>View quality metrics and code analysis reports.</p>
              </div>
              <div className="module-card">
                <h3>Notifications</h3>
                <p>Stay updated with bug assignments and project updates.</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TesterDashboard;
