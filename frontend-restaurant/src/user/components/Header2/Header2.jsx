/* eslint-disable no-unused-vars */
import React from "react";
import "./Header2.css";
import { useNavigate } from "react-router-dom"; // 🟢 Import useNavigate

const Header2 = () => {
  const navigate = useNavigate(); // 🟢 Hook for navigation

  return (
    <div className="header2">
      <div className="header2-contents">
        <h2>Book Your Table here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients. Our mission is to satisfy your
          cravings and elevate your dining experience, one delicious meal at a time.
        </p>
        <button onClick={() => navigate("/booking")}>Book a Table</button>
      </div>
    </div>
  );
};

export default Header2;
