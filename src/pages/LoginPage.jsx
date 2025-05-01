import hlalLogo from "/hlal-logo.svg";
import hlalLogoDark from "/logo-darkmode.png";
import authBanner from "../assets/auth-banner.png";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://kelompok2.serverku.org/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        setModalMessage("Terjadi kesalahan saat login.");
        setIsModalOpen(true);
        return;
      }

      if (response.ok && data.status === "Success") {
        localStorage.setItem("authToken", data.token);

        const loginSuccess = login(usernameOrEmail, password);
        if (loginSuccess) {
          setModalMessage(data.message);
          setIsModalOpen(true);

          setTimeout(() => {
            setIsModalOpen(false);
            navigate("/");
          }, 1500);
        } else {
          setModalMessage("Failed Authentication");
          setIsModalOpen(true);
        }
      } else {
        setModalMessage(data.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error saat Login:", error);
      setModalMessage("Terjadi kesalahan saat Login: " + error.message);
      setIsModalOpen(true);
    }
  };

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
            <Moon color="#F8AB39" size={28} />
          </div>
          <div
            className={`absolute transition-transform duration-300 ${isDark
                ? "transform -translate-y-full opacity-0"
                : "transform translate-y-0 opacity-100"
              }`}
          >
            <Sun color="#F8AB39" size={28} />
          </div>
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="hlal" src={isDark ? hlalLogoDark : hlalLogo} className="mx-auto h-10 w-auto" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                type="text"
                required
                value={usernameOrEmail}
                placeholder="Username or Email"
                className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                value={password}
                placeholder="Password"
                className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-300">
            Don't have an account?{" "}
            <NavLink to="/register" className="font-semibold text-primary">
              Register here
            </NavLink>
          </p>
        </div>
      </div>

      <div className="w-1/2 hidden lg:block">
        <img className="h-full object-cover" src={authBanner} alt="" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="p-8 text-center text-lg text-gray-800 dark:text-gray-100">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full border bg-primary text-white py-2 px-4 rounded hover:opacity-90"
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
