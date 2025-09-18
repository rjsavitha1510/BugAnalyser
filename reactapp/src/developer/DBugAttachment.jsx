import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/bugattachments";

const DBugAttachment = () => {
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    fileName: "",
    filePath: "",
    uploadedBy: "",
    fileType: "",
    fileSize: "",
    bugId: ""
  });
  const [editingAttachment, setEditingAttachment] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAttachmentId, setSelectedAttachmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const checkAuth = () => {
    const possibleKeys = ['token', 'authToken', 'jwtToken', 'accessToken', 'bearerToken'];
    let token = null;
    
    for (const key of possibleKeys) {
      token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) break;
    }
    
    if (!token) {
      toast.error("Please login to access attachment management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllAttachments(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFormData({
        ...formData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size.toString(),
        filePath: `uploads/${file.name}`
      });
    }
  };

  // CREATE - Upload new attachment
  const createAttachment = async () => {
    if (!checkAuth()) return;
    
    if (!formData.bugId || !formData.uploadedBy) {
      toast.error("Bug ID and Uploaded By are required");
      return;
    }

    if (!selectedFile && !formData.fileName) {
      toast.error("Please select a file or provide file details");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      let res;
      
      if (selectedFile) {
        // File upload
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);
        formDataUpload.append('uploadedBy', formData.uploadedBy);
        
        res = await axios.post(`${API_BASE}/${formData.bugId}`, formDataUpload, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Manual entry
        res = await axios.post(API_BASE, {
          bugId: Number(formData.bugId),
          fileName: formData.fileName,
          filePath: formData.filePath,
          uploadedBy: formData.uploadedBy,
          fileType: formData.fileType,
          fileSize: Number(formData.fileSize)
        }, { headers });
      }
      
      toast.success("Attachment added successfully");
      setFormData({ fileName: "", filePath: "", uploadedBy: "", fileType: "", fileSize: "", bugId: "" });
      setSelectedFile(null);
      fetchAllAttachments(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions or login again.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error creating attachment: " + errorMsg);
      }
    }
  };

  // READ - Get all attachments
  const fetchAllAttachments = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setAttachments(res.data);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} attachments successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching attachments: " + errorMsg);
      }
    }
  };

  // READ - Get attachment by ID
  const fetchAttachmentById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedAttachmentId) {
      toast.error("Please enter Attachment ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedAttachmentId}`, { headers });
      setAttachments([res.data]);
      toast.success(`Attachment ${selectedAttachmentId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Attachment with ID ${selectedAttachmentId} not found`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching attachment: " + errorMsg);
      }
    }
  };

  // DELETE - Delete attachment
  const deleteAttachment = async (attachmentId) => {
    if (!checkAuth()) return;
    
    if (!attachmentId) return;
    if (!window.confirm(`Are you sure you want to delete attachment ${attachmentId}?`)) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.delete(`${API_BASE}/${attachmentId}`, { headers });
      toast.success("Attachment deleted successfully");
      fetchAllAttachments(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only authorized users can delete attachments.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error deleting attachment: " + errorMsg);
      }
    }
  };

  const resetForm = () => {
    setEditingAttachment(null);
    setFormData({ fileName: "", filePath: "", uploadedBy: "", fileType: "", fileSize: "", bugId: "" });
    setSelectedFile(null);
    toast.success("Form reset successfully");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
    fileInput: {
      padding: "8px",
      border: "2px solid #90caf9",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#fafffe"
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
    smallBtn: { padding: "8px 15px", fontSize: "12px", borderRadius: "8px" },
    fileCell: { maxWidth: "200px", wordWrap: "break-word", textAlign: "left", padding: "12px" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📎 Bug Attachment Management System</h1>

        {/* Messages */}
        {error && <div style={{...styles.message, ...styles.error}}>{error}</div>}
        {success && <div style={{...styles.message, ...styles.success}}>{success}</div>}

        {/* Form */}
        <div style={styles.form}>
          <input
            type="number"
            name="bugId"
            placeholder="Bug ID *"
            value={formData.bugId}
            onChange={handleChange}
            style={styles.input}
            min="1"
          />
          <input
            type="text"
            name="uploadedBy"
            placeholder="Uploaded By *"
            value={formData.uploadedBy}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <input
            type="text"
            name="fileName"
            placeholder="File Name (or select file)"
            value={formData.fileName}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="filePath"
            placeholder="File Path"
            value={formData.filePath}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="fileType"
            placeholder="File Type"
            value={formData.fileType}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            name="fileSize"
            placeholder="File Size (bytes)"
            value={formData.fileSize}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Attachment ID (for GET by ID)"
            value={selectedAttachmentId}
            onChange={(e) => setSelectedAttachmentId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CRUD Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={createAttachment}
          >
            ➕ UPLOAD Attachment
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchAllAttachments}
          >
            📋 READ All Attachments
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchAttachmentById}
          >
            🔍 GET by ID
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
        <h3 style={{color: "#1e88e5", fontSize: "24px", textAlign: "center"}}>📎 Attachments List ({attachments.length} total)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Attachment ID</th>
              <th style={styles.th}>Bug ID</th>
              <th style={styles.th}>File Name</th>
              <th style={styles.th}>File Path</th>
              <th style={styles.th}>Uploaded By</th>
              <th style={styles.th}>Upload Date</th>
              <th style={styles.th}>File Type</th>
              <th style={styles.th}>File Size</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachments.length > 0 ? (
              attachments.map((attachment, index) => (
                <tr 
                  key={attachment.attachmentId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{attachment.attachmentId}</td>
                  <td style={styles.td}>{attachment.bug ? attachment.bug.bugId : "N/A"}</td>
                  <td style={{...styles.td, ...styles.fileCell}}>{attachment.fileName || "N/A"}</td>
                  <td style={{...styles.td, ...styles.fileCell}}>{attachment.filePath || "N/A"}</td>
                  <td style={styles.td}>{attachment.uploadedBy || "N/A"}</td>
                  <td style={styles.td}>{attachment.uploadedDate ? new Date(attachment.uploadedDate).toLocaleDateString() : "N/A"}</td>
                  <td style={styles.td}>{attachment.fileType || "N/A"}</td>
                  <td style={styles.td}>{formatFileSize(attachment.fileSize)}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={{...styles.button, ...styles.deleteBtn, ...styles.smallBtn}}
                        onClick={() => deleteAttachment(attachment.attachmentId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="9">
                  No attachments found
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

export default DBugAttachment;
