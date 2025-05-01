import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import ModalAlert from "../components/ModalAlert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';


const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    newPassword: "",
    isEditingUsername: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fileInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setModalMessage("You need to be logged in to access this page.");
        setIsModalOpen(true);
        return;
      }

      const response = await fetch('https://kelompok2.serverku.org/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();

      setProfileData({
        fullName: data.fullname || "",
        username: data.username || "",
        email: data.email || "",
        phone: data.phoneNumber || "",
        newPassword: "",
        isEditingUsername: false,
      });

      if (data.avatarUrl) {
        setAvatarUrl(`https://kelompok2.serverku.org${data.avatarUrl}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setModalMessage("Error loading profile data");
      setIsModalOpen(true);
    }
  };

  const handleEditProfilePic = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setModalMessage("Please select an image file");
      setIsModalOpen(true);
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Authentication token not found");

      const formData = new FormData();

      formData.append("fullname", profileData.fullName.trim());

      if (profileData.isEditingUsername) {
        formData.append("username", profileData.username.trim());
      }

      if (profileData.newPassword) {
        formData.append("password", profileData.newPassword);
      }

      if (selectedImage) {
        formData.append("avatar", selectedImage, selectedImage.name);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`Sending ${key}:`, value instanceof File ? value.name : value);
      }

      const response = await fetch('https://kelompok2.serverku.org/api/auth/edit-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || "Invalid input data");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(data.message || "Failed to update profile");
        }
      }

      if (data.avatarUrl) {
        setAvatarUrl(`https://kelompok2.serverku.org${data.avatarUrl}`);
        setSelectedImage(null);
      }

      setModalMessage("Profile updated successfully!");
      setIsModalOpen(true);

      setProfileData(prev => ({
        ...prev,
        newPassword: "",
        isEditingUsername: false
      }));

      await fetchProfileData();

    } catch (error) {
      console.error("Error updating profile:", error);
      setModalMessage(error.message || "Failed to update profile");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
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
                src={avatarUrl || "./src/assets/profile.jpg"}
                alt="Profile"
                className="w-[110px] h-[110px] rounded-full object-cover"
                onError={(e) => {
                  console.error('Image loading error');
                  e.target.src = "./src/assets/profile.jpg";
                }}
              />
              <button
                onClick={handleEditProfilePic}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
                disabled={isLoading}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="w-3 h-3 text-gray-600"
                />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                ref={fileInputRef}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center">
              {profileData.isEditingUsername ? (
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  onBlur={() => setProfileData(prev => ({
                    ...prev,
                    isEditingUsername: false
                  }))}
                  className="text-lg font-semibold bg-transparent text-center border-none focus:ring-0"
                  ref={usernameInputRef}
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-lg font-semibold">
                    {profileData.username}
                  </span>
                  <button
                    onClick={() => setProfileData(prev => ({
                      ...prev,
                      isEditingUsername: true
                    }))}
                    className="ml-2"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-3 h-3 text-gray-600"
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
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-2 bg-white dark:bg-gray-800"
                    disabled={isLoading}
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
                      <label className="block text-sm font-bold mb-1 mr-2">
                        New Password
                      </label>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="w-3 h-3 text-gray-600"
                      />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border px-4 py-2 bg-white dark:bg-gray-800"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white dark:text-black py-2 px-4 w-full rounded-xl font-semibold hover:shadow-inner hover:drop-shadow-none drop-shadow-xl disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Submit Changes"}
                </button>
              </form>

              <ModalAlert
                open={isModalOpen}
                message={modalMessage}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;