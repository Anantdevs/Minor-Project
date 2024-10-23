import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { UserData } from "../context/User";
import SearchSection from "./SearchSection"; // Import the SearchSection

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State for toggling search visibility
  const [isSearchActive, setIsSearchActive] = useState(false); // State for button press effect

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev); // Toggle the search visibility
  };

  const handleSearch = (query) => {
    console.log("Search Query:", query);
    // Implement the logic for handling the search query here
  };

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.home_icon} className="w-6" alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div
          className={`flex items-center gap-3 pl-8 cursor-pointer ${
            isSearchActive ? "bg-[#1b1b1b] scale-95" : ""
          }`}
          onClick={() => {
            handleSearchToggle(); // Use the toggle function
            setIsSearchActive(true); // Set active state on click
          }}
          onMouseLeave={() => setIsSearchActive(false)} // Reset on mouse leave
        >
          <img src={assets.search_icon} className="w-6" alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      {/* Conditionally render SearchSection based on isSearchVisible state */}
      {isSearchVisible && <SearchSection onSearch={handleSearch} />}

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
    </div>
  );
};

export default Sidebar;