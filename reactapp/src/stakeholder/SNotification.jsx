import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/notifications";

const SNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  
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
      toast.error("Please login to access notification features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllNotifications(false);
    
    // Start polling for new notifications every 5 seconds
    const pollInterval = setInterval(() => {
      if (isPolling) {
        checkForNewNotifications();
      }
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, [isPolling, lastNotificationCount]);
  
  // Check for new notifications and show toast
  const checkForNewNotifications = async () => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      const currentCount = res.data.length;
      
      if (isInitialized && lastNotificationCount > 0 && currentCount > lastNotificationCount) {
        const newCount = currentCount - lastNotificationCount;
        toast.info(`🔔 ${newCount} new notification${newCount > 1 ? 's' : ''} received`);
        setNotifications(res.data);
      }
      
      setLastNotificationCount(currentCount);
    } catch (err) {
      // Silent fail for polling
    }
  };

  // READ - Get all notifications
  const fetchAllNotifications = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setNotifications(res.data);
      setLastNotificationCount(res.data.length);
      setIsInitialized(true);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} notifications successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching notifications: " + errorMsg);
      }
    }
  };

  // READ - Get notification by ID
  const fetchNotificationById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedNotificationId) {
      toast.error("Please enter Notification ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedNotificationId}`, { headers });
      setNotifications([res.data]);
      toast.success(`Notification ${selectedNotificationId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Notification with ID ${selectedNotificationId} not found`);
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching notification: " + errorMsg);
      }
    }
  };

  // READ - Get notifications by user ID
  const fetchNotificationsByUser = async () => {
    if (!checkAuth()) return;
    
    if (!selectedUserId) {
      toast.error("Please enter User ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/user/${selectedUserId}`, { headers });
      setNotifications(res.data);
      toast.success(`Fetched notifications for user ${selectedUserId} successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        const errorMsg = typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message || err.message || 'Unknown error occurred';
        toast.error("Error fetching notifications by user: " + errorMsg);
      }
    }
  };

  // Light Blue Theme Styles
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
    readBtn: { background: "linear-gradient(45deg, #64b5f6, #42a5f5)", color: "white" },
    deleteBtn: { background: "linear-gradient(45deg, #ef5350, #e53935)", color: "white" },
    updateBtn: { background: "linear-gradient(45deg, #81c784, #66bb6a)", color: "white" },
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
    messageCell: { maxWidth: "250px", wordWrap: "break-word", textAlign: "left", padding: "12px" },
    readBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white"
    },
    readTrue: { backgroundColor: "#4caf50" },
    readFalse: { backgroundColor: "#f44336" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🔔 Notification Viewer (Stakeholder)</h1>

        <div style={styles.form}>
          <input
            type="number"
            placeholder="Notification ID (for GET by ID)"
            value={selectedNotificationId}
            onChange={(e) => setSelectedNotificationId(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="User ID (for GET by User)"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchAllNotifications}
          >
            📋 VIEW All Notifications
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchNotificationById}
          >
            🔍 GET by ID
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchNotificationsByUser}
          >
            👤 GET by User
          </button>
          <button 
            style={{...styles.button, ...(isPolling ? styles.deleteBtn : styles.updateBtn)}} 
            onClick={() => setIsPolling(!isPolling)}
          >
            {isPolling ? '🔕 Stop Real-time' : '🔔 Start Real-time'}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{color: "#1e88e5", fontSize: "24px", textAlign: "center"}}>
        🔔 Notifications List ({notifications.length} total) 
        {isPolling && <span style={{color: "#4caf50", fontSize: "14px"}}> • Live Updates ON</span>}
      </h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Is Read</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <tr 
                  key={notification.id} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{notification.id}</td>
                  <td style={styles.td}>{notification.user ? notification.user.userId : "N/A"}</td>
                  <td style={styles.td}>{notification.user ? notification.user.username : "N/A"}</td>
                  <td style={styles.td}>{notification.type || "N/A"}</td>
                  <td style={{...styles.td, ...styles.messageCell}}>{notification.message || "N/A"}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.readBadge,
                      ...(notification.isRead ? styles.readTrue : styles.readFalse)
                    }}>
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="6">
                  No notifications found
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

export default SNotification;
