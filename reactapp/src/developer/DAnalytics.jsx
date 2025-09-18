import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:8080/api/reports";

const DAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    parameters: "",
    generatedBy: "",
    reportUrl: "",
    format: ""
  });
  const [editingReport, setEditingReport] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [chartData, setChartData] = useState([]);
  
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("type");
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

  // Check if user is authenticated
  const checkAuth = () => {
    const possibleKeys = ['token', 'authToken', 'jwtToken', 'accessToken', 'bearerToken'];
    let token = null;
    
    for (const key of possibleKeys) {
      token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) break;
    }
    
    if (!token) {
      toast.error("Please login to access analytics management features.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchAllReports(false);
  }, []);

  useEffect(() => {
    generateChartData();
  }, [reports]);

  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate chart data based on actual reports
  const generateChartData = () => {
    if (reports.length === 0) {
      setChartData([{ name: "No Reports", value: 1, color: "#e5e7eb" }]);
      return;
    }

    const formatCounts = reports.reduce((acc, report) => {
      const format = report.format || 'Unknown';
      acc[format] = (acc[format] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      'PDF': '#dc2626',
      'Excel': '#059669', 
      'CSV': '#2563eb',
      'Unknown': '#6b7280'
    };

    const data = Object.entries(formatCounts).map(([format, count]) => ({
      name: `${format} Reports`,
      value: count,
      color: colors[format] || '#8b5cf6'
    }));

    setChartData(data);
  };

  // READ - Get all reports
  const fetchAllReports = async (showMessage = true) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(API_BASE, { headers });
      setReports(res.data);
      setTotalElements(res.data.length);
      if (showMessage) {
        toast.success(`Fetched ${res.data.length} reports successfully`);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else {
        toast.error("Error fetching reports: " + (err.response?.data || err.message));
      }
    }
  };

  // READ - Get report by ID
  const fetchReportById = async () => {
    if (!checkAuth()) return;
    
    if (!selectedReportId) {
      toast.error("Please enter Report ID");
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/${selectedReportId}`, { headers });
      setReports([res.data]);
      toast.success(`Report ${selectedReportId} fetched successfully`);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login with proper permissions.");
      } else if (err.response?.status === 404) {
        toast.error(`Report with ID ${selectedReportId} not found`);
      } else {
        toast.error("Error fetching report: " + (err.response?.data || err.message));
      }
    }
  };

  // Download report
  const downloadReport = async (reportId) => {
    if (!checkAuth()) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await axios.get(`${API_BASE}/download/${reportId}`, { 
        headers,
        responseType: 'blob'
      });
      
      let filename = `report_${reportId}.txt`;
      
      const contentDisposition = res.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Report downloaded successfully`);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Report not found.');
      } else if (err.response?.status === 403) {
        toast.error('Access denied. Insufficient permissions.');
      } else {
        toast.error('Download failed. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setEditingReport(null);
    setFormData({ type: "", parameters: "", generatedBy: "", reportUrl: "", format: "" });
    setSelectedReportId("");
    toast.success("Form reset successfully");
  };

  // Blue Theme Styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      minHeight: "100vh"
    },
    card: {
      backgroundColor: "#f8fafc",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 8px 32px rgba(59, 130, 246, 0.25)",
      marginBottom: "20px",
      border: "1px solid #dbeafe"
    },
    heading: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#1e40af",
      textAlign: "center",
      background: "linear-gradient(45deg, #2563eb, #3b82f6)",
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
      backgroundColor: "#dbeafe",
      borderRadius: "10px",
      border: "1px solid #93c5fd"
    },
    input: {
      padding: "12px",
      border: "2px solid #60a5fa",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#ffffff",
      transition: "border-color 0.3s ease"
    },
    select: {
      padding: "12px",
      border: "2px solid #60a5fa",
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "#ffffff"
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
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
    },
    readBtn: {
      background: "linear-gradient(45deg, #3b82f6, #2563eb)",
      color: "white"
    },
    resetBtn: {
      background: "linear-gradient(45deg, #6b7280, #4b5563)",
      color: "white"
    },
    downloadBtn: {
      background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
      color: "white"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)"
    },
    th: {
      padding: "15px",
      background: "linear-gradient(45deg, #1e40af, #1d4ed8)",
      color: "white",
      textAlign: "center",
      fontWeight: "bold"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #dbeafe",
      textAlign: "center"
    },
    rowEven: {
      backgroundColor: "#f1f5f9"
    },
    rowOdd: {
      backgroundColor: "#ffffff"
    },
    badge: {
      padding: "6px 12px",
      borderRadius: "20px",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
      background: "linear-gradient(45deg, #3b82f6, #2563eb)"
    },
    message: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontWeight: "bold",
      textAlign: "center"
    },
    error: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca"
    },
    success: {
      backgroundColor: "#f0fdf4",
      color: "#16a34a",
      border: "1px solid #bbf7d0"
    },
    chartContainer: {
      height: "500px",
      width: "100%",
      marginTop: "20px",
      marginBottom: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.1)"
    },
    actionButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      minWidth: "120px"
    },
    actionBtn: {
      padding: "6px 10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
      transition: "all 0.3s ease",
      width: "100%"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📊 Analytics Report Management System</h1>



        {/* Form */}
        <div style={styles.form}>
          <input
            type="number"
            placeholder="Report ID (for GET by ID)"
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CRUD Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={() => fetchAllReports(true)}
          >
            📋 READ All Reports
          </button>
          <button 
            style={{...styles.button, ...styles.readBtn}} 
            onClick={fetchReportById}
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

        {/* Real-time Pie Chart */}
        <div style={styles.chartContainer}>
          <h3 style={{textAlign: "center", color: "#1e40af", marginBottom: "20px"}}>📈 Analytics Overview</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={800} height={400}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <h3>📊 Reports List ({totalElements} total)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Report ID</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Parameters</th>
              <th style={styles.th}>Generated By</th>
              <th style={styles.th}>Generated Date</th>
              <th style={styles.th}>Format</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr 
                  key={report.reportId} 
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{report.reportId}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{report.type}</span>
                  </td>
                  <td style={styles.td}>{report.parameters}</td>
                  <td style={styles.td}>{report.generatedBy}</td>
                  <td style={styles.td}>
                    {report.generatedDate ? new Date(report.generatedDate).toLocaleDateString() : ""}
                  </td>
                  <td style={styles.td}>{report.format}</td>
                  <td style={styles.td}>
                    <button
                      style={{...styles.actionBtn, ...styles.downloadBtn}}
                      onClick={() => downloadReport(report.reportId)}
                    >
                      📥 Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="7">
                  No reports found
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

export default DAnalytics;
