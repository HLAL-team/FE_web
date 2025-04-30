import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const ProfileDropdown = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    avatarUrl: ''
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch("https://kelompok2.serverku.org/api/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile data", data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Construct the full image URL
  const imageUrl = profileData.avatarUrl 
    ? `https://kelompok2.serverku.org${profileData.avatarUrl}` 
    : "./src/assets/profile.jpg";

  return (
    <div ref={dropdownRef} className="ml-8 relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center"
      >
        <img
          src={imageUrl}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover border-2 border-primary"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-10">
          <Link
            to="/account"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Profile
          </Link>
          <button
            onClick={onClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;