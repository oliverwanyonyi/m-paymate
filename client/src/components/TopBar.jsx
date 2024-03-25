import React from "react";
import logo from '../assets/m-paymate.png'

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="topbar-container landing-container">
        <img src={logo} alt="M-Paymante" />

        <div className="list-items-container">
          <li className="list-item">
            <a href="#features" className="list-link">
              Features
            </a>
          </li>

          {/* <li className="list-item">
            <Link to="/register" className="list-link">
              Get Started
            </Link>
          </li> */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
