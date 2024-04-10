import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import Topbar from '../../components/Navbar/NavbarPage';
import CourseDisplay from '../Course/CourseDisplay';
import { FaPlus } from 'react-icons/fa';

function InstructorDashboard() {

  const navigate=useNavigate();
 
  const handleaddcourse = () => {
    navigate(`/AddCourse`);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Topbar />
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <div style={{ marginBottom: '16px' }}> 
            <button onClick={handleaddcourse}>
             <FaPlus />Add Course
          </button>
        </div>
        <CourseDisplay />
      </div>
    </div>
  );
}

export default InstructorDashboard;
