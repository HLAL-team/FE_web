import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Logo from "/hlal-logo.svg";
import authBanner from "../assets/auth-banner.png";
import { useTheme } from "../contexts/ThemeContext";
import ModalTnC from "../components/ModalTnC";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

  
    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    if (avatar) formData.append("avatar", avatar);

    console.log(formData);
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        body: formData,
        // headers:{
        //   "Content-Type":"multipart/form-data"
        // }
      });

      const data = await response.json();

      if (response.ok && data.status === "Success") {
        alert(data.message || "Berhasil mendaftar!");
        // navigate("/login");
      } else {
        alert(data.message || "Gagal mendaftar. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saat mendaftar:", error);
      alert("Terjadi kesalahan saat mendaftar: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden dark:text-white">
      {/* Kiri - Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        {/* Theme Toggle */}
        <button
          className="h-7 w-7 relative overflow-hidden flex items-center justify-center mb-9"
          onClick={toggleTheme}
        >
          <div
            className={`absolute transition-transform duration-300 ${
              isDark ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <Moon color="#F8AB39" size={28} />
          </div>
          <div
            className={`absolute transition-transform duration-300 ${
              isDark ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <Sun color="#F8AB39" size={28} />
          </div>
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={Logo} alt="HLAL" className="mx-auto h-10 w-auto" />
        </div>

        {/* Formulir */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1"
            />

            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1"
            />

            <input
              type="text"
              placeholder="No HP"
              required
              maxLength={12}
              value={phoneNumber}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) setPhoneNumber(e.target.value);
              }}
              className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="block w-full text-sm text-gray-500"
            />

            <label className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-300">
              <input type="checkbox" className="mt-1.5 accent-primary" required />
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
              Daftar
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
            Sudah punya akun?{" "}
            <NavLink to="/login" className="font-semibold text-primary">
              Login di sini
            </NavLink>
          </p>
        </div>
      </div>

      {/* Kanan - Banner */}
      <div className="hidden lg:block w-1/2">
        <img className="h-full object-cover" src={authBanner} alt="Auth Visual" />
      </div>
    </div>
  );
};

export default RegisterPage;
