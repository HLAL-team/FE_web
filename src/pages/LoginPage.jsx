import hlalLogo from "/hlal-logo.svg";
import authBanner from "../assets/auth-banner.png";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.status === "Success") {
        alert(data.message || "Berhasil Login!");
        // navigate("/login");
      } else {
        alert(data.message || "Gagal Login. Silakan coba lagi.");
      }
    } catch {
      console.error("Error saat Login:", error);
      alert("Terjadi kesalahan saat Login: " + error.message);
    }

    // const isLoggedIn = login(username, password);
    // if (isLoggedIn) {
    //   navigate("/");
    // }
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
            className={`absolute transition-transform duration-300 ${
              isDark
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-full opacity-0"
            }`}
          >
            <Moon key="moon" color="#F8AB39" size={28} />
          </div>
          <div
            className={`absolute transition-transform duration-300 ${
              isDark
                ? "transform -translate-y-full opacity-0"
                : "transform translate-y-0 opacity-100"
            }`}
          >
            <Sun key="sun" color="#F8AB39" size={28} />
          </div>
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Walled" src={hlalLogo} className="mx-auto h-10 w-auto" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <div className="mt-2">
                <input
                  // id="username"
                  id="email"
                  // name="username"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  required
                  value={email}
                  // placeholder="Username"
                  placeholder="Email"
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
                  value={password}
                  className="block w-full rounded-md bg-white dark:bg-black px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text- font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-300">
            Belum punya akun?{" "}
            <NavLink to="/register" className="font-semibold text-primary">
              Daftar di sini
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

export default LoginPage;
