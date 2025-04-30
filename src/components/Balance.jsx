import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("https://kelompok2.serverku.org/api/auth/profile", {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`, 
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Error: Unable to fetch profile data</div>;
  }

  return (
    <div className="flex justify-between px-6 sm:px-4 lg:px-8 gap-8 mb-9 dark:text-white">
      <Greeting firstName={profileData.fullname} />
      <Profile 
        firstName={profileData.fullname.split(" ")[0]} 
        lastName={profileData.fullname.split(" ")[1]} 
        photo={profileData.avatarUrl} 
      />
    </div>
  );
};


const Greeting = ({ firstName }) => {
  return (
    <div className="flex text-left py-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Assalamualaikum, {firstName}</h1>
        <p className="text-xl">
          Check all your incoming and outgoing transactions here
        </p>
      </div>
    </div>
  );
};

const Profile = ({ firstName, lastName, photo }) => {
  const imageUrl = `https://kelompok2.serverku.org${photo}`;
  
  console.log(imageUrl); 

  return (
    <div className="flex items-center gap-6 py-8">
      <div className="text-right">
        <h3 className="font-bold">{`${firstName} ${lastName}`}</h3>
        <p>Personal Account</p>
      </div>
      <div className="flex justify-center items-center">
        <img
          className="max-h-24 max-w-24 border-4 rounded-full border-solid border-primary"
          src={imageUrl} 
          alt={`${firstName} ${lastName}`}
        />
      </div>
    </div>
  );
};

export default Hero;
