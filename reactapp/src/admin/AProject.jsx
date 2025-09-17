import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/projects";

const AProject = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    managerId: ""
  });
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const getAuthHeaders = () => {
    const possibleKeys = ['token', 'authToken', 'jwtToken', 'accessToken', 'bearerToken'];
    let token = null;
    
    for (const key of possibleKeys) {
      token = localStorage.getItem(key);
      if (token) break;
    }
    
    if (!token) {
      for (const key of possibleKeys) {
        token = sessionStorage.getItem(key);
        if (token) break;
      }
    }
    
    if (!token) {
      toast.error("No authentication token found. Please login again.");
      return null;
    }
    
    return { Authorization: `Bearer ${token}` };
  };

  // Check if user is authenticated
  const checkAuth = () => {
    const possibleKeys = ['token', 'authToken', 'jwtToken', 'accessToken', 'bearerToken'];
    let token = null;
    
    for (const key of possibleKeys) {
      token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) break;
    }
    
    if (!token) {
      toast.error("Please login to access project management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllProjects(false);
  }, []);

  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE - Add new project
  const createProject = async () => {
    if (!checkAuth()) return;
    
    if (!formData.projectName || !formData.managerId) {
      toast.error("Project Name and Manager ID are required");
      return;
    }
    
    const managerId = Number(formData.managerId);
    if (managerId <= 0 || isNaN(managerId)) {
      toast.error("Manager ID must be a valid positive number");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const payload = {
        projectName: formData.projectName.trim(),
        managerId: managerId
      };
      
      // Only include dates if they are provided
      if (formData.startDate) {
        payload.startDate = formData.startDate;
      }
      if (formData.endDate) {
        payload.endDate = formData.endDate;
      }
      
      const res = await axios.post(`${API_BASE}/add`, payload, { headers });
      
      toast.success("Project added successfully");
      setFormData({ projectName: "", startDate: "", endDate: "", managerId: "" });
      fetchAllProjects(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can create projects.");
      } else if (err.response?.status === 400 || (err.response?.data && err.response.data.includes("Manager not found"))) {
        toast.error(`Manager with ID ${managerId} does not exist. Please verify the Manager ID.`);
      } else if (err.response?.data && err.response.data.includes("constraint")) {
        toast.error(`Database constraint error. Manager ID ${managerId} may not exist or there may be a data integrity issue.`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error creating project: " + errorMsg);
      }
    }
  };

  // READ - Get all projects
  const fetchAllProjects = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setProjects(res.data);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} projects successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching projects: " + errorMsg);
      }
    }
  };

  // READ - Get project by ID
  const fetchProjectById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedProjectId) {
      toast.error("Please enter Project ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedProjectId}`, { headers });
      setProjects([res.data]);
      toast.success(`Project ${selectedProjectId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Project with ID ${selectedProjectId} not found`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching project: " + errorMsg);
      }
    }
  };

  // READ - Get projects by manager ID
  const fetchProjectsByManager = async () => {
    if (!checkAuth()) return;
    
    if (!selectedManagerId) {
      toast.error("Please enter Manager ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/manager/${selectedManagerId}`, { headers });
      setProjects(res.data);
      toast.success(`Fetched projects for manager ${selectedManagerId} successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can view projects by manager.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching projects by manager: " + errorMsg);
      }
    }
  };

  // UPDATE - Update existing project
  const updateProject = async () => {
    if (!checkAuth()) return;
    
    if (!editingProject || !formData.projectName || !formData.managerId) {
      toast.error("Please select a project to edit and fill required fields");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.put(`${API_BASE}/update`, {
        projectId: editingProject.projectId,
        projectName: formData.projectName,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        managerId: Number(formData.managerId)
      }, { headers });
      
      toast.success("Project updated successfully");
      setEditingProject(null);
      setFormData({ projectName: "", startDate: "", endDate: "", managerId: "" });
      fetchAllProjects(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can update projects.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error updating project: " + errorMsg);
      }
    }
  };

  // DELETE - Delete project
  const deleteProject = async (projectId) => {
    if (!checkAuth()) return;
    
    if (!projectId) return;
    if (!window.confirm(`Are you sure you want to delete project ${projectId}?`)) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.delete(`${API_BASE}/delete/${projectId}`, { headers });
      toast.success("Project deleted successfully");
      fetchAllProjects(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can delete projects.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error deleting project: " + errorMsg);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      managerId: project.manager ? project.manager.userId : ""
    });
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({ projectName: "", startDate: "", endDate: "", managerId: "" });
    toast.success("Form reset successfully");
  };

  // 🎨 Light Blue Theme Styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      minHeight: "100vh"
    },
    card: {
      backgroundColor: "#f8fcff",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15)",
      marginBottom: "20px",
      border: "1px solid #e1f5fe"
    },
    heading: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#1565c0",
      textAlign: "center",
      background: "linear-gradient(45deg, #2196f3, #64b5f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: "bold"
    },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
      marginBottom: "20px",
      padding: "20px",
      backgroundColor: "#e3f2fd",
      borderRadius: "10px",
      border: "1px solid #bbdefb"
    },
    input: {
      padding: "12px",
      border: "2px solid #90caf9",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#fafffe",
      transition: "border-color 0.3s ease"
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    button: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)"
    },
    createBtn: { background: "linear-gradient(45deg, #42a5f5, #2196f3)", color: "white" },
    readBtn: { background: "linear-gradient(45deg, #64b5f6, #42a5f5)", color: "white" },
    updateBtn: { background: "linear-gradient(45deg, #81c784, #66bb6a)", color: "white" },
    deleteBtn: { background: "linear-gradient(45deg, #ef5350, #e53935)", color: "white" },
    resetBtn: { background: "linear-gradient(45deg, #90a4ae, #78909c)", color: "white" },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(33, 150, 243, 0.15)"
    },
    th: {
      padding: "15px",
      background: "linear-gradient(45deg, #1976d2, #1565c0)",
      color: "white",
      textAlign: "center",
      fontWeight: "bold"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #e3f2fd",
      textAlign: "center"
    },
    rowEven: { backgroundColor: "#f3f9ff" },
    rowOdd: { backgroundColor: "#fafffe" },
    message: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontWeight: "bold",
      textAlign: "center"
    },
    error: { backgroundColor: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2" },
    success: { backgroundColor: "#e8f5e8", color: "#2e7d32", border: "1px solid #c8e6c9" },
    actionButtons: { display: "flex", gap: "8px", justifyContent: "center" },
    smallBtn: { padding: "8px 15px", fontSize: "12px", borderRadius: "8px" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🏗️ Project Management System</h1>

        {/* Messages */}
        {error && <div style={{...styles.message, ...styles.error}}>{error}</div>}
        {success && <div style={{...styles.message, ...styles.success}}>{success}</div>}

        {/* Form */}
        <div style={styles.form}>
          <input
            type="text"
            name="projectName"
            placeholder="Project Name *"
            value={formData.projectName}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={formData.endDate}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            name="managerId"
            placeholder="Manager ID *"
            value={formData.managerId}
            onChange={handleChange}
            style={styles.input}
            min="1"
          />
          <input
            type="number"
            placeholder="Project ID (for GET by ID)"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Manager ID (for GET by Manager)"
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CRUD Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={createProject}
          >
            ➕ CREATE Project
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={() => fetchAllProjects(true)}
          >
            📋 READ All Projects
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchProjectById}
          >
            🔍 GET by ID
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchProjectsByManager}
          >
            👤 GET by Manager
          </button>
          <button 
            style={{...styles.button, ...styles.updateBtn}} 
            onClick={updateProject}
            disabled={!editingProject}
          >
            ✏️ UPDATE Project {editingProject ? `(ID: ${editingProject.projectId})` : ""}
          </button>
          <button 
            style={{...styles.button, ...styles.resetBtn}} 
            onClick={resetForm}
          >
            🔄 RESET Form
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <h3 style={{color: "#1e88e5", fontSize: "24px", textAlign: "center"}}>🏗️ Projects List ({projects.length} total)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Project ID</th>
              <th style={styles.th}>Project Name</th>
              <th style={styles.th}>Start Date</th>
              <th style={styles.th}>End Date</th>
              <th style={styles.th}>Manager ID</th>
              <th style={styles.th}>Manager Name</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr 
                  key={project.projectId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{project.projectId}</td>
                  <td style={styles.td}>{project.projectName}</td>
                  <td style={styles.td}>{project.startDate || "N/A"}</td>
                  <td style={styles.td}>{project.endDate || "N/A"}</td>
                  <td style={styles.td}>{project.manager ? project.manager.userId : "N/A"}</td>
                  <td style={styles.td}>{project.manager ? project.manager.username : "N/A"}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={{...styles.button, ...styles.updateBtn, ...styles.smallBtn}}
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        style={{...styles.button, ...styles.deleteBtn, ...styles.smallBtn}}
                        onClick={() => deleteProject(project.projectId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="7">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AProject;
