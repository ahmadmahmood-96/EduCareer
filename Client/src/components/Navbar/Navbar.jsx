import React, { useEffect, useState } from "react";
import { navLinks } from "../../Data";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import MobileNavLinks from "./MobileNavLinks";
import NavLink from "./NavLink";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Dropdown from "./Dropdown";
import { HiUserCircle } from 'react-icons/hi';

const Navbar = () => {

  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
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
            active ? "py-2 transition-all duration-300" : "py-4"
          }   mx-auto flex items-center justify-between px-2`}
        >
          <div className="flex items-center gap-4">
            <HiMenuAlt1
              className="text-3xl sm:hidden cursor-pointer"
              onClick={() => setToggle(true)}
            />
            <div className=" px-32 text-xl text-white uppercase tracking-wide">
             EduCareer
            </div>


          </div>

          <button
          className="text-lg text-white uppercase"
          onClick={() => navigate("/career-recommendation")}
        >
          Career
        </button>

          <div className="sm:flex items-center hidden  text-lg text-white uppercase tracking-wide">
            {navLinks.map((navLink) => {
              return <NavLink key={navLink.id} {...navLink} />;
            })}
          </div>

          {/* Profile icon for opening the dropdown */}
      <div className=" px-32 relative">
        <HiUserCircle
          className="text-3xl cursor-pointer"
          onClick={toggleDropdown}
        />
        {/* Render the Dropdown component */}
        <Dropdown isOpen={dropdownOpen} closeDropdown={closeDropdown} />
      </div>

  
          {toggle && (
            <motion.div
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed h-full w-96 top-0 left-0 z-20 bg-Teal text-white flex flex-col justify-center items-center shadow-lg gap-8 py-8"
            >
              {navLinks.map((navLink) => {
                return (
                  <MobileNavLinks
                    key={navLink.id}
                    {...navLink}
                    setToggle={setToggle}
                  />
                );
              })}
              <HiX
                className="absolute right-12 top-12 text-3xl cursor-pointer"
                onClick={(prev) => setToggle(!prev)}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;