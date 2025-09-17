import React from "react";
import { Link } from "react-router-dom";
import BgIcon from "../assets/BgIcon.png";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <img src={BgIcon} alt="404 Not Found" className="not-found-image" />
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="back-home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
