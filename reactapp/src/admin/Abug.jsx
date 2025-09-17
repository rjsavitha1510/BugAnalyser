import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/bugs";

const Abug = () => {
  const [bugs, setBugs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    projectId: ""
  });
  const [editingBug, setEditingBug] = useState(null);
  const [selectedBugId, setSelectedBugId] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [sortDir, setSortDir] = useState("asc");
  const [usePagination, setUsePagination] = useState(false);

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
      toast.error("Please login to access bug management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (usePagination) {
      fetchBugsWithPagination(false);
    } else {
      fetchAllBugs(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, filterPriority, usePagination]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createBug = async () => {
    if (!checkAuth()) return;
    
    if (!formData.title || !formData.projectId) {
      toast.error("Title and Project ID are required");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.post(`${API_BASE}/add`, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        projectId: Number(formData.projectId)
      }, { headers });
      
      toast.success("Bug added successfully");
      setFormData({ title: "", description: "", priority: "MEDIUM", projectId: "" });
      if (usePagination) {
        await fetchBugsWithPagination(false);
      } else {
        await fetchAllBugs(false);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions or login again.");
      } else {
        toast.error("Error creating bug: " + (err.response?.data || err.message));
      }
    }
  };

  const fetchAllBugs = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setBugs(res.data);
      setTotalElements(res.data.length);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} bugs successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        toast.error("Error fetching bugs: " + (err.response?.data || err.message));
      }
    }
  };

  const fetchBugsWithPagination = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      let url = `${API_BASE}/paginated?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
      
      if (filterPriority) {
        url = `${API_BASE}/filter/priority/${filterPriority}?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
      }
      
      const res = await axios.get(url, { headers });
      setBugs(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      if (showMessage) {
        toast.success(`Fetched ${res.data.content.length} bugs (Page ${currentPage + 1} of ${res.data.totalPages})`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        toast.error("Error fetching paginated bugs: " + (err.response?.data || err.message));
      }
    }
  };

  const fetchBugById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedBugId) {
      toast.error("Please enter Bug ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedBugId}`, { headers });
      setBugs([res.data]);
      toast.success(`Bug ${selectedBugId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Bug with ID ${selectedBugId} not found`);
      } else {
        toast.error("Error fetching bug: " + (err.response?.data || err.message));
      }
    }
  };

  const updateBug = async () => {
    if (!checkAuth()) return;
    
    if (!editingBug || !formData.title || !formData.projectId) {
      toast.error("Please select a bug to edit and fill required fields");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.put(`${API_BASE}/${editingBug.bugId}`, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        projectId: Number(formData.projectId)
      }, { headers });
      
      toast.success("Bug updated successfully");
      setEditingBug(null);
      setFormData({ title: "", description: "", priority: "MEDIUM", projectId: "" });
      if (usePagination) fetchBugsWithPagination(false);
      else fetchAllBugs(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error("Error updating bug: " + (err.response?.data || err.message));
      }
    }
  };

  const deleteBug = async (bugId) => {
    if (!checkAuth()) return;
    
    if (!bugId) return;
    if (!window.confirm(`Are you sure you want to delete bug ${bugId}?`)) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.delete(`${API_BASE}/${bugId}`, { headers });
      toast.success("Bug deleted successfully");
      if (usePagination) fetchBugsWithPagination(false);
      else fetchAllBugs(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can delete bugs.");
      } else {
        toast.error("Error deleting bug: " + (err.response?.data || err.message));
      }
    }
  };

  const handleEdit = (bug) => {
    setEditingBug(bug);
    setFormData({
      title: bug.title,
      description: bug.description,
      priority: bug.priority,
      projectId: bug.projectId || (bug.project ? bug.project.projectId : "")
    });
  };

  const resetForm = () => {
    setEditingBug(null);
    setFormData({ title: "", description: "", priority: "MEDIUM", projectId: "" });
    toast.success("Form reset successfully");
  };

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
    select: {
      padding: "12px",
      border: "2px solid #90caf9",
      borderRadius: "8px",
      fontSize: "14px",
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
    badge: {
      padding: "6px 12px",
      borderRadius: "20px",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold"
    },
    low: { background: "linear-gradient(45deg, #66bb6a, #4caf50)" },
    medium: { background: "linear-gradient(45deg, #ffb74d, #ff9800)" },
    high: { background: "linear-gradient(45deg, #ef5350, #f44336)" },
    controls: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px",
      flexWrap: "wrap",
      alignItems: "center",
      padding: "15px",
      backgroundColor: "#e1f5fe",
      borderRadius: "10px",
      border: "1px solid #b3e5fc"
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#e3f2fd",
      borderRadius: "10px",
      border: "1px solid #bbdefb"
    },
    pageBtn: {
      padding: "8px 12px",
      border: "1px solid #90caf9",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#fafffe",
      transition: "all 0.3s ease"
    },
    activePage: {
      backgroundColor: "#2196f3",
      color: "white",
      border: "1px solid #1976d2"
    }
  };

  const getPriorityBadge = (priority) => {
    let style = { ...styles.badge };
    if (priority === "LOW") style = { ...style, ...styles.low };
    if (priority === "MEDIUM") style = { ...style, ...styles.medium };
    if (priority === "HIGH") style = { ...style, ...styles.high };
    return <span style={style}>{priority}</span>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🐛 Bug Management System</h1>

        <div style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Bug Title *"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.input}
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <input
            type="number"
            name="projectId"
            placeholder="Project ID *"
            value={formData.projectId}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Bug ID (for GET by ID)"
            value={selectedBugId}
            onChange={(e) => setSelectedBugId(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={createBug}
          >
            ➕ CREATE Bug
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchAllBugs}
          >
            📋 READ All Bugs
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchBugById}
          >
            🔍 GET by ID
          </button>
          <button 
            style={{...styles.button, ...styles.updateBtn}} 
            onClick={updateBug}
            disabled={!editingBug}
          >
            ✏️ UPDATE Bug {editingBug ? `(ID: ${editingBug.bugId})` : ""}
          </button>
          <button 
            style={{...styles.button, ...styles.resetBtn}} 
            onClick={resetForm}
          >
            🔄 RESET Form
          </button>
        </div>

        <div style={styles.controls}>
          <label>
            <input
              type="checkbox"
              checked={usePagination}
              onChange={(e) => setUsePagination(e.target.checked)}
            />
            Enable Pagination
          </label>
          
          <select
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.select}
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.select}
          >
            <option value="priority">Sort by Priority</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => {
              setSortDir(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.select}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          {usePagination && (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              style={styles.select}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <h3>📊 Bugs List ({totalElements} total{usePagination ? ` - Page ${currentPage + 1} of ${totalPages}` : ""})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Bug ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Project ID</th>
              <th style={styles.th}>Created Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bugs.length > 0 ? (
              bugs.map((bug, index) => (
                <tr 
                  key={bug.bugId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{bug.bugId}</td>
                  <td style={styles.td}>{bug.title}</td>
                  <td style={styles.td}>{bug.description}</td>
                  <td style={styles.td}>{getPriorityBadge(bug.priority)}</td>
                  <td style={styles.td}>
                    {bug.projectId || (bug.project ? bug.project.projectId : "")}
                  </td>
                  <td style={styles.td}>{bug.createdDate}</td>
                  <td style={styles.td}>
                    <button
                      style={{...styles.button, ...styles.updateBtn, marginRight: "5px", padding: "8px 12px"}}
                      onClick={() => handleEdit(bug)}
                    >
                      Edit
                    </button>
                    <button
                      style={{...styles.button, ...styles.deleteBtn, padding: "8px 12px"}}
                      onClick={() => deleteBug(bug.bugId)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="7">
                  No bugs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {usePagination && totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              First
            </button>
            <button
              style={styles.pageBtn}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageIndex = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + index;
              if (pageIndex >= totalPages) return null;
              return (
                <button
                  key={pageIndex}
                  style={{
                    ...styles.pageBtn,
                    ...(currentPage === pageIndex ? styles.activePage : {})
                  }}
                  onClick={() => setCurrentPage(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
            
            <button
              style={styles.pageBtn}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
            <button
              style={styles.pageBtn}
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
            >
              Last
            </button>
          </div>
        )}
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

export default Abug;
