import { useState, useEffect, useRef } from "react";
import photo from "../assets/profile.jpg";
import { useAuth } from "../contexts/AuthContext";
import {useNavigate } from "react-router";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

    const { logout } = useAuth();
    const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative group">
      {/* Foto Profil (hover atau click untuk toggle) */}
      <button
        onClick={() => setOpen(!open)}
        className= "flex items-center gap-1 focus:outline-none"
      >
        <img
          src={photo} 
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300"
        /> 

        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        className={`${
          open ? "block" : "hidden"
        } absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50 group-hover:block`}
      >
        <ul className="py-2 text-gray-700">
          <li>
            <a href="#account" className="block px-4 py-2 hover:bg-gray-100">
              My Account
            </a>
          </li>
          <li>

            <a className="block px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>
                Sign Out
              </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
