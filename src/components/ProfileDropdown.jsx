import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom"; // Jika kamu menggunakan react-router

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate(); // Hook untuk melakukan navigasi

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/auth/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const avatar = profile?.avatarUrl || "/default-avatar.png";

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Menghapus token dari localStorage
    navigate("/login"); // Redirect ke halaman login (sesuaikan dengan rute di aplikasi kamu)
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 focus:outline-none"
      >
        <img
          src={avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
          <ul className="text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100">
              <a href="account" className="block px-4 py-2 hover:bg-gray-100">
                My Account
              </a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <a
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout} 
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
