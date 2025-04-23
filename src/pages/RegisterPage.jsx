import Logo from "/hlal-logo.svg";
import authBanner from "../assets/auth-banner.png";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ModalTnC from "../components/ModalTnC";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/login");

    const firstName = fullName.split(" ")[0];
    const lastName = fullName.split(" ")[1];

    alert(
      `Berhasil mendaftar!\nNama Lengkap: ${firstName} ${lastName}\nUsername: ${username}\nNo HP: ${phoneNumber}`
    );
  };

  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen overflow-hidden dark:text-white">
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <button
          className="h-7 w-7 relative overflow-hidden flex items-center justify-center mb-9"
          onClick={toggleTheme}
        >
          <div
            className={`absolute transition-transform duration-300 ${isDark
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-full opacity-0"
              }`}
          >
            <Moon key="moon" color="#F8AB39" size={28} />
          </div>
          <div
            className={`absolute transition-transform duration-300 ${isDark
              ? "transform -translate-y-full opacity-0"
              : "transform translate-y-0 opacity-100"
              }`}
          >
            <Sun key="sun" color="#F8AB39" size={28} />
          </div>
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Hlal" src={Logo} className="mx-auto h-10 w-auto" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <div className="mt-2">
                <input
                  id="fullname"
                  name="fullname"
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  required
                  placeholder="Username"
                  className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="phonenumber"
                  name="phonenumber"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  value={phoneNumber}
                  maxLength={12}
                  type="text"
                  placeholder="No Hp"
                  required
                  className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-10 text-left" >
              <label className="flex items-start gap-2 text-sm/6 text-gray-500 dark:text-gray-300">
                <input type="checkbox" className="mt-1.5 accent-primary" />
                <span className="text-left">
                  Yes, I have read and agree to HLAL’s{" "}
                  <span
        role="button"
        tabIndex={0}
        onClick={() => setShowModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
        className="font-semibold text-primary underline cursor-pointer inline"
      >
        Terms and Condition*
      </span>
                </span>
              </label>
            </div>

            <ModalTnC
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Terms and Conditions"
            >
            </ModalTnC>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text- font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
              >
                Daftar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-300">
            Sudah punya akun?{" "}
            <NavLink to="/login" className="font-semibold text-primary">
              Login di sini
            </NavLink>
          </p>
        </div>
      </div>

      <div className="w-1/2">
        <img className="h-full object-cover" src={authBanner} alt="" />
      </div>
    </div>
  );
};

export default RegisterPage;
