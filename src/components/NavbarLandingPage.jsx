import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/hlal-logo.svg";

const NavbarLanding = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="text-2xl font-bold text-primary">
          <img src={logo} alt="HLAL Logo" className="h-8" />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLanding;
