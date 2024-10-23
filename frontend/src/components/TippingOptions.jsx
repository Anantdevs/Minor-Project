// TippingOptions.js
import React from "react";

const TippingOptions = ({ onSelect }) => {
  const amounts = [50, 100, 1000, 5000]; // Tipping options in INR

  return (
    <div className="flex gap-4 mt-4">
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className="bg-blue-500 text-white rounded p-2"
        >
          ₹{amount}
        </button>
      ))}
    </div>
  );
};

export default TippingOptions;
