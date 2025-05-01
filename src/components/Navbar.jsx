import { NavLink, useNavigate } from "react-router";
import hlalLogo from "/hlal-logo.svg";
import hlalLogoDark from "/logo-darkmode.png";
import { useAuth } from "../contexts/AuthContext";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ProfileDropdown from "./ProfileDropdown";
import React from "react";

const Navbar = () => {
  let activeNavLink = "ml-8 font-bold text-primary";
  let inactiveNavLink = "ml-8";

  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-black dark:text-white mb-9 px-6 sm:px-4 lg:px-8 sticky top-0 z-50">
      <div>
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <NavLink to="/" end>
                <img
                  src={isDark ? hlalLogoDark : hlalLogo}
                  alt="Walled"
                  className="h-7"
                />
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center border-r border-gray-400 pr-4 gap-6 h-10">
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeNavLink : inactiveNavLink
                }
                to="/"
                end
              >
                Dashboard
              </NavLink>


              <NavLink
                className={({ isActive }) =>
                  isActive ? activeNavLink : inactiveNavLink
                }
                to="/tracker"
                end
              >
                My Tracker
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive ? activeNavLink : inactiveNavLink
                }
                to="/transfer"
                end
              >
                Transfer
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive ? activeNavLink : inactiveNavLink
                }
                to="/topup"
                end
              >
                Top Up
              </NavLink>

              <ProfileDropdown onClick={handleLogout} />

            </div>
            <button
              className="ml-4 h-7 w-7 relative overflow-hidden flex items-center justify-center"
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
