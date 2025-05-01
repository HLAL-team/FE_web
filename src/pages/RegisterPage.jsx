import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import hlalLogo from "/hlal-logo.svg";
import hlalLogoDark from "/logo-darkmode.png";
import authBanner from "../assets/auth-banner.png";
import { useTheme } from "../contexts/ThemeContext";
import ModalTnC from "../components/ModalTnC";
import ModalAlert from "../components/ModalAlert";


const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
const [showAlert, setShowAlert] = useState(false);


  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://kelompok2.serverku.org/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: fullName,
          username: username,
          email: email,
          password: password,
          phoneNumber: phoneNumber,
        }),
      });

      console.log(fullName);
      console.log(username);
      console.log(email);
      console.log(password);
      console.log(phoneNumber);

      const data = await response.json();

      if (response.ok && data.status === "Success") {
        setAlertMessage(data.message );
        setShowAlert(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setAlertMessage(data.message );
        setShowAlert(true);
      }
      
    } catch (error) {
      console.error("Error saat mendaftar:", error);
      alert("Terjadi kesalahan saat mendaftar: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden dark:text-white">
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <button
          className="h-7 w-7 relative overflow-hidden flex items-center justify-center mb-9"
          onClick={toggleTheme}
        >
          <div
            className={`absolute transition-transform duration-300 ${
              isDark
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <Moon color="#F8AB39" size={28} />
          </div>
          <div
            className={`absolute transition-transform duration-300 ${
              isDark
                ? "-translate-y-full opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <Sun color="#F8AB39" size={28} />
          </div>
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={isDark ? hlalLogoDark : hlalLogo} alt="HLAL" className="mx-auto h-10 w-auto" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />

            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />

            <input
              type="text"
              placeholder="Phone Number"
              required
              maxLength={12}
              value={phoneNumber}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value))
                  setPhoneNumber(e.target.value);
              }}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />


            <label className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-300 text-left">
              <input
                type="checkbox"
                className="mt-1.5 accent-primary"
                required
              />
              <span>
                Yes, I have read and agree to HLAL’s{" "}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowModal(true)}
                  onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
                  className="font-semibold text-primary underline cursor-pointer"
                >
                  Terms and Conditions*
                </span>
              </span>
            </label>

            <ModalTnC
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Terms and Conditions"
            />

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-white dark:text-black"
            >
              Register
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
            Already have an account?{" "}
            <NavLink to="/login" className="font-semibold text-primary">
              Login here
            </NavLink>
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-1/2">
        <img
          className="h-full object-cover"
          src={authBanner}
          alt="Auth Visual"
        />
      </div>
      <ModalAlert
  isOpen={showAlert}
  message={alertMessage}
  onClose={() => setShowAlert(false)}
/>

    </div>
  );
};

export default RegisterPage;