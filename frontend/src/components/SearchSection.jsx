import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm); // Call the onSearch function passed as a prop
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border rounded p-2 w-full md:w-64 bg-gray-800 text-white" // Added bg color for better visibility
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white rounded p-2">
        Search
      </button>
    </form>
  );
};

export default SearchSection;
