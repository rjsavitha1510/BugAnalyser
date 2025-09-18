// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import AdminDashboard from "./admin/AdminDashboard";
import User from "./admin/User";
import ABug from "./admin/Abug";
import ABugAttachment from "./admin/ABugAttachment"; 
import AProject from "./admin/AProject";
import AQuality from "./admin/AQuality";
import ANotification from "./admin/ANotification";
// import AnalyticsReport from "./admin/AnalyticsReport";
import DeveloperDashboard from "./developer/DeveloperDashboard";
import DBug from "./developer/DBug";
import TesterDashboard from "./tester/TesterDashboard";
import TBug from "./tester/TBug";
import DBugAttachment from "./developer/DBugAttachment";
import DQuality from "./developer/DQuality";
import DNotification from "./developer/DNotification";
import DAnalytics from "./developer/DAnalytics";
import TBugAttachment from "./tester/TBugAttachment";
import TQuality from "./tester/TQuality";
import TNotification from "./tester/TNotification";
import TAnalytics from "./tester/TAnalytics";
import StakeholderDashboard from "./stakeholder/StakeholderDashboard";
import SBug from "./stakeholder/SBug";
import SProject from "./stakeholder/SProject";
import SQuality from "./stakeholder/SQuality";
import SNotification from "./stakeholder/SNotification";
import SAnalytics from "./stakeholder/SAnalytics";
import NotFoundPage from "./Components/NotFoundPage";
import Report from "./admin/Report";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

           <Route path="/admin" element={<AdminDashboard/>}></Route>
           <Route path="/users" element={<User/>}></Route>
           <Route path="/bugs" element={<ABug/>}></Route>
           <Route path="/bug-attachments" element={<ABugAttachment/>}></Route>
           <Route path="/projects" element={<AProject/>}></Route>
           <Route path="/quality" element={<AQuality/>}></Route>
           <Route path="/notifications" element={<ANotification/>}></Route>
           {/* <Route path="/reporting" element={<AnalyticsReport/>}></Route> */}
           <Route path="/reporting" element={<Report/>}></Route>

           
           <Route path="/notify" element={<DNotification/>}></Route>
           <Route path="/developer" element={<DeveloperDashboard/>}></Route>
           <Route path="/bugd" element={<DBug/>}></Route>
           <Route path="/attach" element={<DBugAttachment/>}></Route>
           <Route path="/metric" element={<DQuality/>}></Route>
           <Route path="/reports" element={<DAnalytics/>}></Route>

           <Route path="/tester" element={<TesterDashboard/>}></Route>
           <Route path="/bugt" element={<TBug/>}></Route>
           <Route path="/tattach" element={<TBugAttachment/>}></Route>
           <Route path="/tmetric" element={<TQuality/>}></Route>
           <Route path="/tnotify" element={<TNotification/>}></Route>
           <Route path="/reported" element={<TAnalytics/>}></Route>

           <Route path="/stakeholder" element={<StakeholderDashboard/>}></Route>
           <Route path="/bugstack" element={<SBug/>}></Route>
           <Route path="/projectstack" element={<SProject/>}></Route>
           <Route path="/qualitystack" element={<SQuality/>}></Route>
           <Route path="/notification" element={<SNotification/>}></Route>
           <Route path="/reportingstack" element={<SAnalytics/>}></Route>

           <Route path="*" element={<NotFoundPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
