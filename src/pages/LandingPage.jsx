import React from "react";
import bgImage from "../assets/Landing-page.png";
import icon from "../assets/icon-landing.png";
import NavbarLanding from "../components/NavbarLandingPage";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <NavbarLanding />
      <div className="p-16 mt-16 text-center max-w-xl">
        <h1 className="text-3xl font-bold text-primary">
          Everyday Halal Wallet.
        </h1>
        <h1 className="text-3xl font-bold text-primary">
          Stay blessed every transaction.
          Shariah-compliant. Stress-free.
        </h1>
        <img src={icon} className="px-6" />

        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
        >
          Join now
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
