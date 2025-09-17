import React from "react";
import { Link } from "react-router-dom";
import BugIcon from "../assets/BgIcon.png";
import BugImage from "../assets/BgBanner.png";
function Home() {
  return (
    <div>
      <header className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-light sticky-top">
        <div className="d-flex align-items-center">
          <img
            src={BugIcon}
            alt="Bug Icon"
            style={{ width: 35, height: 35 }}
            className="me-2"
          />
          <h2 className="text-primary fw-bold mb-0">BUG ANALYSER</h2>
        </div>
        <div>
          <Link to="/login" className="btn btn-outline-primary me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      </header>
      <section
        className="d-flex flex-column flex-lg-row justify-content-between align-items-center text-center text-lg-start"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #e6f0ff, #cce0ff)",
          padding: "60px 10%",
        }}
      >
        <div className="col-lg-6">
          <h1 className="fw-bold text-primary mb-3 display-5">
            Track, Analyze & Manage Bugs Efficiently
          </h1>
          <p className="lead text-dark mb-4 fs-5">
            A powerful platform to manage software bugs, projects, and reports
            with role-based access control.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg shadow-sm">
            🚀 Get Started
          </Link>
        </div>
        <div className="col-lg-5 mt-4 mt-lg-0">
          <img
            src={BugImage}
            alt="Bug Illustration"
            className="img-fluid rounded shadow-lg"
          />
        </div>
      </section>
      <section
        id="about"
        className="py-5 text-dark"
        style={{ backgroundColor: "#b3d9ff" }}
      >
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4 display-5">About Us</h2>
          <p className="fs-5">
            Bug Analyzer is a <strong>collaborative bug tracking solution</strong> 
            that enables teams to identify, prioritize, and resolve software issues quickly. 
            Designed for <em>developers, testers, project managers, and stakeholders</em>, 
            our tool provides:
          </p>
          <ul className="fs-5 text-start d-inline-block">
            <li>✅ A central platform for reporting and managing bugs</li>
            <li>✅ Role-based access to ensure secure and organized workflows</li>
            <li>✅ Insightful metrics and analytics to monitor project health</li>
            <li>✅ Intuitive UI for seamless collaboration across teams</li>
          </ul>
          <p className="fs-5">
            By bringing clarity and accountability to software projects, Bug Analyzer helps 
            teams <strong>deliver high-quality products faster</strong>.
          </p>
        </div>
      </section>
      <section
        id="features"
        className="py-5 text-dark"
        style={{ backgroundColor: "#99ccff" }}
      >
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4 display-5">Features</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="p-3 bg-white shadow-sm rounded h-100">
                <h5 className="fw-bold">🔍 Bug Tracking</h5>
                <p>Report, assign, and resolve bugs with ease and transparency.</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="p-3 bg-white shadow-sm rounded h-100">
                <h5 className="fw-bold">📊 Analytics</h5>
                <p>Track project quality with detailed metrics and real-time dashboards.</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="p-3 bg-white shadow-sm rounded h-100">
                <h5 className="fw-bold">👨‍💻 Role-based Access</h5>
                <p>Admins, Developers, Testers, Managers, and Stakeholders each have dedicated access.</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="p-3 bg-white shadow-sm rounded h-100">
                <h5 className="fw-bold">📈 Productivity Boost</h5>
                <p>Reduce delays and improve code quality with smart workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="py-5 text-dark"
        style={{ backgroundColor: "#66b2ff" }} >
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4 display-5">Contact Us</h2>
          <p className="fs-5 mb-4">
            We’d love to hear from you! Reach out through any of the official channels below:
          </p>
          <div className="d-flex flex-column align-items-center">
            <p className="fs-5">📱 Official App: <strong>Bug Analyzer Mobile</strong></p>
            <p className="fs-5">📧 Email: <strong>support@buganalyzer.com</strong></p>
            <p className="fs-5">📞 Phone: <strong>+91 98765 43210</strong></p>
          </div>
        </div>
      </section>
      <footer className="bg-light text-center text-dark py-3 border-top">
        <div className="container">
          <p className="mb-1">
            © {new Date().getFullYear()} Bug Analyzer. All rights reserved.
          </p>
          <p className="mb-0">
            Developed by <strong>SAVITHA R J</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
