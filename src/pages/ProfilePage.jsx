import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    fullName: "Chelsea Islan",
    username: "Chelsea",
    email: "chelseaism@gmail.com",
    phone: "085607485253",
    newPassword: "",
    profileImage: "",
    isEditingUsername: false, 
  });

  const fileInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", profileData);
    alert("Profile updated successfully!");
  };

  const handleEditProfilePic = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, profileImage: imageUrl });
    }
  };

  return (
    <Layout>
      <div className="dark:text-white">
        <Navbar />
        <div className="flex items-start mb-8">
          <div className="basis-1/5 flex flex-col items-center mt-12 relative">
            <div className="relative">
              <img
                src={profileData.profileImage || "./src/assets/profile.jpg"}
                alt="Profile"
                className="w-[110px] h-[110px] rounded-full object-cover"
              />
              <button
                onClick={handleEditProfilePic}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
              >
                <img src="./src/assets/pena_edit.png" alt="Edit" className="w-4 h-4" />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <div className="mt-4 flex items-center">
              {profileData.isEditingUsername ? (
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  onBlur={() =>
                    setProfileData((prev) => ({ ...prev, isEditingUsername: false }))
                  }
                  className="text-lg font-semibold bg-transparent text-center border-none focus:ring-0"
                  ref={usernameInputRef}
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-lg font-semibold">{profileData.username}</span>
                  <button
                    onClick={() =>
                      setProfileData((prev) => ({ ...prev, isEditingUsername: true }))
                    }
                    className="ml-2"
                  >
                    <img
                      src="./src/assets/pena_edit.png"
                      alt="Edit"
                      className="w-4 h-4"
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="basis-4/5 flex flex-col items-start justify-start px-6 py-6">
            <div className="w-full max-w-5xl bg-white dark:bg-black rounded-2xl shadow-md p-10">
              <form onSubmit={handleSubmit} className="space-y-6 w-full text-left">
                <div>
                  <label className="block text-sm font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    disabled
                    className="w-full rounded-xl border px-4 py-2 bg-gray-100 dark:bg-gray-950 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full rounded-xl border px-4 py-2 bg-gray-100 dark:bg-gray-950 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    disabled
                    className="w-full rounded-xl border px-4 py-2 bg-gray-100 dark:bg-gray-950 cursor-not-allowed"
                  />
                </div>


                <div className="flex items-center justify-between">
                  <div className="w-full">
                  <div className="flex items-center">
                    <label className="block text-sm font-bold mb-1 mr-2">New Password</label>
                    <img src="./src/assets/pena_edit.png" alt="Edit" className="w-4 h-4" />
                  </div>

                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border px-4 py-2 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white dark:text-black py-2 px-4 w-full rounded-xl font-semibold hover:shadow-inner hover:drop-shadow-none drop-shadow-xl"
                >
                  Submit Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
