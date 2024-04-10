// Dropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const handleLogout = async () => {
    try {
      // Make a request to the logout API
      await axios.post('http://localhost:8080/api/logout');

      // Clear the token from localStorage (or wherever you store it)
      localStorage.removeItem('token');
      localStorage.removeItem('account type');

      // Optionally, redirect the user to the sign-in page
      // You can use React Router or any other method for redirection
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Handle any error that may occur during logout
    }
  };

const Dropdown = ({ isOpen, closeDropdown }) => {
  return (
    <div className={`flex flex-col absolute left-5 top-6 w-40 p-2 bg-white ${isOpen ? 'visible' : 'hidden'}`}>
      <ul className="flex flex-col gap-2 text-xs">
        <li>
          <Link to="/profilesettings" onClick={closeDropdown}>
            Profile Settings
          </Link>
        </li>
        {/* <li>
          <Link to="/account" onClick={closeDropdown}>
            Account Settings
          </Link>
        </li> */}
        <li>
          <Link to="/studentdashboard" onClick={closeDropdown}>
            Student Dashboard
          </Link>
        </li>
        <li>
          <Link to="/InstructorDasboard" onClick={closeDropdown}>
            Instructor Dashboard
          </Link>
        </li>
        <hr className="text-Solitude"></hr>
        <li>
          <Link to="/home" onClick={handleLogout}>
            Logout
          </Link>
        </li>
        <hr className="text-Solitude"></hr>
        <li>
          <Link to="/Messenger" onClick={closeDropdown}>
           Message
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;