// Sidebar.jsx
import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { UserData } from "../context/User";
import SearchSection from "./SearchSection";
import UserProfile from './userProfile';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [upiId, setUpiId] = useState(user.upi_id); 


  const createdAt = new Date(user.createdAt);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = createdAt.toLocaleDateString('en-US', options);


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const updateUpiId = async () => {
    try {
        const response = await fetch('/api/user/update-upi-id', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ upi_id: upiId }), 
        });
        if (response.ok) {
            alert('UPI ID updated successfully!');
        } else {
            alert('Failed to update UPI ID.');
        }
    } catch (error) {
        console.error('Error updating UPI ID:', error);
        alert('An error occurred. Please try again.');
    }
};

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`/api/song/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const results = await response.json();
      setSearchResults(results); // Store search results
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <>
    {isSidebarOpen?(      
      <div className="w-[25%] h-full p-2 flex-col gap-1 text-white hidden lg:flex">

      <div className="pt-4 bg-[#121212] h-[29%] rounded flex flex-col justify-around">
        
      <div
                className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer"
                onClick={toggleSidebar} // Update here to call toggleSidebar
            >
                <img src={assets.profile_icon} className="w-6" style={{ filter: 'invert(1)' }} alt="" />
                <p className="font-bold">Profile</p>
            </div>
        <div
          className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.home_icon} className="w-6" alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={handleSearchToggle}
        >
          <img src={assets.search_icon} className="w-6" alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      {isSearchVisible && <SearchSection onSearch={handleSearch} />}

      {/* Display search results */}
      {isSearchVisible && searchResults.length > 0 && (
        <div className="bg-[#121212] p-4 rounded mt-2">
          <h2 className="bg-black font-semibold">Search Results:</h2>
          <ul>
            {searchResults.map((song) => (
              <li key={song._id} className="text-white">{song.title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-[#121212] h-[70%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={assets.stack_icon} className="w-8" alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img src={assets.arrow_icon} className="w-8" alt="" />
            <img src={assets.plus_icon} className="w-8" alt="" />
          </div>
        </div>
        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>
        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1>Let's find some podcasts to follow</h1>
          <p className="font-light">We'll keep you updated on new episodes</p>

          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>

        {user && user.role === "admin" && (
          <button
            className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </button>
        )}
      </div>
    </div>):
    (
      
    <div className="w-[25%] h-full p-2 flex-col gap-1 text-white hidden lg:flex">
      <div className="pt-2 bg-[#121212] h-[100%] rounded flex flex-col justify-around">
        <div className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer" onClick={toggleSidebar} >
          <img src={assets.profile_icon} className="w-6" style={{ filter: 'invert(1)' }} alt="" />
          <p className="font-bold">Profile</p>
        </div>
        <div className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer">
            Profile Name: <span>{user.name}</span>
        </div>
        <div className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer">
            Profile Email: <span>{user.email}</span>
        </div>
        <div className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer">
            Cake Day: <span>{formattedDate}</span>
        </div>
          <div className="flex flex-col mb-2 pb-4 items-center gap-3 pl-8">
          <span>Your UPI ID:</span>
            {user.upi_id === 'upi_id' ? (
                <div className="flex items-center mt-1">
                    <input 
                        type="text" 
                        placeholder="Please Update Your UPI ID for Receiving Tips" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)} // Update state on change
                        className="border rounded px-2 w-full max-w-md h-10 text-black"
                    />
                    <button 
                        onClick={updateUpiId} 
                        className="ml-2 bg-blue-500 text-white rounded px-4 h-10"
                    >
                        Update
                    </button>
                </div>
            ) : (
                <span>{user.upi_id}</span>
            )}
          </div>


      </div>
    </div>
    )}
    </>
    
  );
};

export default Sidebar;
