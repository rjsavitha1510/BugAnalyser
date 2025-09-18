import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/qualities";

const TQuality = () => {
  const [qualities, setQualities] = useState([]);
  const [formData, setFormData] = useState({
    projectId: "",
    bugCount: "",
    resolvedCount: "",
    qualityScore: "",
    calculatedDate: ""
  });
  const [editingQuality, setEditingQuality] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedQualityId, setSelectedQualityId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Get JWT token from localStorage
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
      toast.error("Please login to access quality management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllQualities(false);
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

  // CREATE - Add new quality
  const createQuality = async () => {
    if (!checkAuth()) return;
    
    if (!formData.projectId || !formData.bugCount || !formData.resolvedCount || !formData.qualityScore) {
      toast.error("Project ID, Bug Count, Resolved Count, and Quality Score are required");
      return;
    }
    
    const projectId = Number(formData.projectId);
    const bugCount = Number(formData.bugCount);
    const resolvedCount = Number(formData.resolvedCount);
    const qualityScore = Number(formData.qualityScore);
    
    if (projectId <= 0 || isNaN(projectId) || bugCount < 0 || isNaN(bugCount) || 
        resolvedCount < 0 || isNaN(resolvedCount) || qualityScore < 0 || isNaN(qualityScore)) {
      toast.error("Please enter valid positive numbers for all numeric fields");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const payload = {
        projectId: projectId,
        bugCount: bugCount,
        resolvedCount: resolvedCount,
        qualityScore: qualityScore
      };
      
      if (formData.calculatedDate) {
        payload.calculatedDate = formData.calculatedDate;
      }
      
      const res = await axios.post(API_BASE, payload, { headers });
      
      toast.success("Quality added successfully");
      setFormData({ projectId: "", bugCount: "", resolvedCount: "", qualityScore: "", calculatedDate: "" });
      fetchAllQualities(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions or login again.");
      } else if (err.response?.status === 400 || (err.response?.data && err.response.data.includes("Project not found"))) {
        toast.error(`Project with ID ${projectId} does not exist. Please verify the Project ID.`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error creating quality: " + errorMsg);
      }
    }
  };

  // READ - Get all qualities
  const fetchAllQualities = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setQualities(res.data);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} quality records successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching qualities: " + errorMsg);
      }
    }
  };

  // READ - Get quality by ID
  const fetchQualityById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedQualityId) {
      toast.error("Please enter Quality ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedQualityId}`, { headers });
      setQualities([res.data]);
      toast.success(`Quality ${selectedQualityId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Quality with ID ${selectedQualityId} not found`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching quality: " + errorMsg);
      }
    }
  };

  // READ - Get qualities by project ID
  const fetchQualitiesByProject = async () => {
    if (!checkAuth()) return;
    
    if (!selectedProjectId) {
      toast.error("Please enter Project ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/project/${selectedProjectId}`, { headers });
      setQualities(res.data);
      toast.success(`Fetched qualities for project ${selectedProjectId} successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching qualities by project: " + errorMsg);
      }
    }
  };

  // UPDATE - Update existing quality
  const updateQuality = async () => {
    if (!checkAuth()) return;
    
    if (!editingQuality || !formData.projectId || !formData.bugCount || !formData.resolvedCount || !formData.qualityScore) {
      toast.error("Please select a quality to edit and fill required fields");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const payload = {
        projectId: Number(formData.projectId),
        bugCount: Number(formData.bugCount),
        resolvedCount: Number(formData.resolvedCount),
        qualityScore: Number(formData.qualityScore)
      };
      
      if (formData.calculatedDate) {
        payload.calculatedDate = formData.calculatedDate;
      }
      
      const res = await axios.put(`${API_BASE}/${editingQuality.metricId}`, payload, { headers });
      
      toast.success("Quality updated successfully");
      setEditingQuality(null);
      setFormData({ projectId: "", bugCount: "", resolvedCount: "", qualityScore: "", calculatedDate: "" });
      fetchAllQualities(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error updating quality: " + errorMsg);
      }
    }
  };

  // DELETE - Delete quality
  const deleteQuality = async (qualityId) => {
    if (!checkAuth()) return;
    
    if (!qualityId) return;
    if (!window.confirm(`Are you sure you want to delete quality ${qualityId}?`)) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.delete(`${API_BASE}/${qualityId}`, { headers });
      toast.success("Quality deleted successfully");
      fetchAllQualities(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only authorized users can delete qualities.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error deleting quality: " + errorMsg);
      }
    }
  };

  const handleEdit = (quality) => {
    setEditingQuality(quality);
    setFormData({
      projectId: quality.project ? quality.project.projectId : "",
      bugCount: quality.bugCount.toString(),
      resolvedCount: quality.resolvedCount.toString(),
      qualityScore: quality.qualityScore.toString(),
      calculatedDate: quality.calculatedDate || ""
    });
  };

  const resetForm = () => {
    setEditingQuality(null);
    setFormData({ projectId: "", bugCount: "", resolvedCount: "", qualityScore: "", calculatedDate: "" });
    toast.success("Form reset successfully");
  };

  const setCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ ...formData, calculatedDate: today });
    toast.success("Current date set successfully");
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
        <h1 style={styles.heading}>📊 Quality Management System</h1>

        {/* Messages */}
        {error && <div style={{...styles.message, ...styles.error}}>{error}</div>}
        {success && <div style={{...styles.message, ...styles.success}}>{success}</div>}

        {/* Form */}
        <div style={styles.form}>
          <input
            type="number"
            name="projectId"
            placeholder="Project ID *"
            value={formData.projectId}
            onChange={handleChange}
            style={styles.input}
            min="1"
          />
          <input
            type="number"
            name="bugCount"
            placeholder="Bug Count *"
            value={formData.bugCount}
            onChange={handleChange}
            style={styles.input}
            min="0"
          />
          <input
            type="number"
            name="resolvedCount"
            placeholder="Resolved Count *"
            value={formData.resolvedCount}
            onChange={handleChange}
            style={styles.input}
            min="0"
          />
          <input
            type="number"
            name="qualityScore"
            placeholder="Quality Score *"
            value={formData.qualityScore}
            onChange={handleChange}
            style={styles.input}
            min="0"
            step="0.01"
          />
          <input
            type="date"
            name="calculatedDate"
            placeholder="Calculated Date"
            value={formData.calculatedDate}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quality ID (for GET by ID)"
            value={selectedQualityId}
            onChange={(e) => setSelectedQualityId(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Project ID (for GET by Project)"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CRUD Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={createQuality}
          >
            ➕ CREATE Quality
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={() => fetchAllQualities(true)}
          >
            📋 READ All Qualities
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchQualityById}
          >
            🔍 GET by ID
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchQualitiesByProject}
          >
            🏗️ GET by Project
          </button>
          <button 
            style={{...styles.button, ...styles.updateBtn}} 
            onClick={updateQuality}
            disabled={!editingQuality}
          >
            ✏️ UPDATE Quality {editingQuality ? `(ID: ${editingQuality.metricId})` : ""}
          </button>
          <button 
            style={{...styles.button, ...styles.resetBtn}} 
            onClick={resetForm}
          >
            🔄 RESET Form
          </button>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={setCurrentDate}
          >
            📅 Set Current Date
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <h3 style={{color: "#1e88e5", fontSize: "24px", textAlign: "center"}}>📊 Quality Records List ({qualities.length} total)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Metric ID</th>
              <th style={styles.th}>Project ID</th>
              <th style={styles.th}>Project Name</th>
              <th style={styles.th}>Bug Count</th>
              <th style={styles.th}>Resolved Count</th>
              <th style={styles.th}>Quality Score</th>
              <th style={styles.th}>Calculated Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {qualities.length > 0 ? (
              qualities.map((quality, index) => (
                <tr 
                  key={quality.metricId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{quality.metricId}</td>
                  <td style={styles.td}>{quality.project ? quality.project.projectId : "N/A"}</td>
                  <td style={styles.td}>{quality.project ? quality.project.projectName : "N/A"}</td>
                  <td style={styles.td}>{quality.bugCount}</td>
                  <td style={styles.td}>{quality.resolvedCount}</td>
                  <td style={styles.td}>{quality.qualityScore}</td>
                  <td style={styles.td}>{quality.calculatedDate || "N/A"}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={{...styles.button, ...styles.updateBtn, ...styles.smallBtn}}
                        onClick={() => handleEdit(quality)}
                      >
                        Edit
                      </button>
                      <button
                        style={{...styles.button, ...styles.deleteBtn, ...styles.smallBtn}}
                        onClick={() => deleteQuality(quality.metricId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="8">
                  No quality records found
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

export default TQuality;
