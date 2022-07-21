import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ balance }) => {
  return (
    <div className="nav">
      <div className="nav-1">Gainers</div>
      <div className="nav-2">
        <div className="nav-item">
          <Link to="/">Home</Link>
        </div>
        <div className="nav-item">
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="nav-item">
          <Link to="/create">Create</Link>
        </div>
      </div>
      <div className="nav-3">
        <div>{balance} cUSD</div>
      </div>
    </div>
  );
};

export default Navigation;
