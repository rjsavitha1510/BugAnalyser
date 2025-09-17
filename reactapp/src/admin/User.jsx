import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/users";

const User = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "ROLE_ADMIN",
    password: ""
  });
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

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

  const checkAuth = () => {
    const possibleKeys = ['token', 'authToken', 'jwtToken', 'accessToken', 'bearerToken'];
    let token = null;
    
    for (const key of possibleKeys) {
      token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) break;
    }
    
    if (!token) {
      toast.error("Please login to access user management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllUsers(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE - Add new user
  const createUser = async () => {
    if (!checkAuth()) return;
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Username, Email and Password are required");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.post(API_BASE, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password
      }, { headers });
      
      toast.success("User added successfully");
      setFormData({ username: "", email: "", role: "ROLE_USER", password: "" });
      fetchAllUsers(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can create users.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error creating user: " + errorMsg);
      }
    }
  };

  // READ - Get all users
  const fetchAllUsers = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setUsers(res.data);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} users successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can view users.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching users: " + errorMsg);
      }
    }
  };

  // READ - Get user by ID
  const fetchUserById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedUserId) {
      toast.error("Please enter User ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedUserId}`, { headers });
      setUsers([res.data]);
      toast.success(`User ${selectedUserId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can view users.");
      } else if (err.response?.status === 404) {
        toast.error(`User with ID ${selectedUserId} not found`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching user: " + errorMsg);
      }
    }
  };

  // UPDATE - Update existing user
  const updateUser = async () => {
    if (!checkAuth()) return;
    
    if (!editingUser || !formData.username || !formData.email) {
      toast.error("Please select a user to edit and fill required fields");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.put(`${API_BASE}/${editingUser.userId}`, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password
      }, { headers });
      
      toast.success("User updated successfully");
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "ROLE_USER", password: "" });
      fetchAllUsers(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can update users.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error updating user: " + errorMsg);
      }
    }
  };

  // DELETE - Delete user
  const deleteUser = async (userId) => {
    if (!checkAuth()) return;
    
    if (!userId) return;
    if (!window.confirm(`Are you sure you want to delete user ${userId}?`)) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.delete(`${API_BASE}/${userId}`, { headers });
      toast.success("User deleted successfully");
      fetchAllUsers(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Only admins can delete users.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error deleting user: " + errorMsg);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ""
    });
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", role: "ROLE_USER", password: "" });
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
    actionButtons: { display: "flex", gap: "8px", justifyContent: "center" },
    smallBtn: { padding: "8px 15px", fontSize: "12px", borderRadius: "8px" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>👥 User Management System</h1>

        {/* Form */}
        <div style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="ROLE_ADMIN">ADMIN</option>
            <option value="ROLE_DEVELOPER">DEVELOPER</option>
            <option value="ROLE_TESTER">TESTER</option>
            <option value="ROLE_STAKEHOLDER">STAKEHOLDER</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="User ID (for GET by ID)"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CRUD Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.createBtn}} 
            onClick={createUser}
          >
            ➕ CREATE User
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchAllUsers}
          >
            📋 READ All Users
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchUserById}
          >
            🔍 GET by ID
          </button>
          <button 
            style={{...styles.button, ...styles.updateBtn}} 
            onClick={updateUser}
            disabled={!editingUser}
          >
            ✏️ UPDATE User {editingUser ? `(ID: ${editingUser.userId})` : ""}
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
        <h3 style={{color: "#1e88e5", fontSize: "24px", textAlign: "center"}}>👥 Users List ({users.length} total)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr 
                  key={user.userId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{user.userId}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={{...styles.button, ...styles.updateBtn, ...styles.smallBtn}}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        style={{...styles.button, ...styles.deleteBtn, ...styles.smallBtn}}
                        onClick={() => deleteUser(user.userId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="5">
                  No users found
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

export default User;
