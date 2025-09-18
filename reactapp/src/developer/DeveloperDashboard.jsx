import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import developerImg from "../assets/DeveloperImg.png"; 
import developericon from "../assets/Developer.png";
import "./DeveloperDashboard.css";

const DeveloperDashboard = () => {
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
          <img src={developericon} alt="Developer" className="avatar" />
          <h3>{user?.fullName || "Developer"}</h3>
          <p>{user?.email || "developer@example.com"}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Overview
          </button>
          <Link to="/bugd"><button>Bug</button></Link>
          <Link to="/attach"><button>Bug Attachment</button></Link>
          <Link to="/metric"><button>Quality</button></Link>
          <Link to="/reports"><button>Reporting</button></Link>
          <Link to="/notify"><button>Notification</button></Link>
          <button onClick={handleLogout} className="logout-btn" style={{backgroundColor: '#ff4d4d', color: 'white'}}>
            Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="dashboard-overview">
            <h2>Welcome, {user?.fullName || "Developer"}!</h2>
            <p>Your development workspace is ready — code with confidence, fix bugs efficiently, and deliver high-quality software solutions 💻</p>

            {/* Image */}
            <div className="overview-image">
              <img
                src={developerImg}
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

export default DeveloperDashboard;
