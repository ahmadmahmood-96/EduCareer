import React, { useState, useEffect } from "react";
import { FaUser, FaHome } from "react-icons/fa";
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { HiUserCircle } from 'react-icons/hi';

const Topbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [active, setActive] = useState(null);
  // const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const scrollActive = () => {
      setActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", scrollActive);
    return () => window.removeEventListener("scroll", scrollActive);
  }, [active]);

  return (
    <div
      className={`${
        active ? "shadow-lg bg-Teal" : ""
      } fixed w-full top-0 left-0 z-20`}
    >
      <div>
        <div
          className={`${
            active ? " transition-all duration-300" : ""
          }   mx-auto flex items-center justify-between px-2`}
        >
      <div className="container mx-auto flex justify-between items-center p-1">
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
            className="text-3xl cursor-pointer text-black"
            onClick={toggleDropdown}
          />
          <Dropdown isOpen={isDropdownOpen} closeDropdown={closeDropdown} />
        </div>
      </div>
    </div>
    </div>
   </div> 

  );
};

export default Topbar;
