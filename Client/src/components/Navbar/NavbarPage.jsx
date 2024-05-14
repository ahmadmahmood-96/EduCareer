import React, { useState, useEffect } from "react";
import { FaUser, FaHome } from "react-icons/fa";
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { HiUserCircle } from 'react-icons/hi';

const Topbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      id="topbar"
      className={`bg-Teal border-b z-10 border-gray-300 ${
        isSticky ? "fixed top-0 w-full" : ""
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <button
          className="text-white hover:bg-white hover:text-Teal px-4 py-2 rounded-full focus:outline-none"
          onClick={() => navigate("/Home")}
        >
          <FaHome className="inline-block mr-2" />
          Educareer
        </button>

{/* Cart */}

       <button
          className="text-white hover:bg-white hover:text-Teal px-4 py-2 rounded-full focus:outline-none"
          onClick={() => navigate("/cart")}
        >
         
          <FaShoppingCart className="inline-block mr-2 " />
       
        </button>


        <div className="flex-grow"></div>

        <div className="relative">
          <HiUserCircle
            className="text-3xl cursor-pointer text-white"
            onClick={toggleDropdown}
          />
          <Dropdown isOpen={isDropdownOpen} closeDropdown={closeDropdown} />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;