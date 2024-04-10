import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate  } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DynamicAccordion from './DynamicAccordion';
import Topbar from '../../components/Navbar/NavbarPage'


const AccessCourseContent = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/accesscontent/${courseId}`);
        setCourseDetails(courseResponse.data);
        console.log('12344')

        // Fetch modules for the course
        const modulesResponse = await axios.get(`http://localhost:8080/api/modules/${courseId}`);
        setModules(modulesResponse.data);
        console.log('12344')
      } catch (error) {
        console.log(error);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };
  
  const handleCancelEnrollment = async (courseId) => {
    const confirmDeletion = window.confirm('Are you sure you want to cancel enrollment in this course?');
    const url = 'http://localhost:8080/api/enrollments/cancelenrollment';
    const userToken = localStorage.getItem('token');
  
    console.log('Canceling enrollment for courseId:', courseId);
    console.log('User token:', userToken);
  
    if (confirmDeletion) {
    try {
      // Use the token itself as the user ID
      const userId = userToken;
      console.log(userId);
  
      // Make the request with the token as the user ID and courseId in the request body
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: { courseId, userId }, // Include courseId and userId in the request body
      });
  
      console.log('Enrollment cancellation successful');
      setSelectedModule(null);
      navigate('/studentdashboard');
    } catch (error) {
      console.error('Enrollment cancellation error:', error);
  
      if (error.message === 'Network Error') {
        // Handle network error
        console.error('Failed to connect to the server. Please check your internet connection.');
      } else {
        // Handle other errors
        console.error(`Failed to cancel enrollment. ${error.message}`);
      }
    }}
  };


  if (!courseDetails) {
    return <p>Unable to load</p>;
  }

  return (
<div>
    <Topbar className="fixed"/>
    <div className="  pr-16 pl-16 mt-8 p-4 bg-white rounded-md shadow-md mb-8">

      {/* Course information section */}
      <div className="flex-1 p-4 max-w-m  bg-Teal text-white mb-5">
        <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
        <h6 className="text-sm ">{courseDetails.description}</h6>
        <p className="text-sm text-white">{courseDetails.category}</p>
        <h2 className="text-sm">Created by: {courseDetails.instructor}</h2>

      </div>

      <div className="flex gap-2  h-screen">
      {/* Modules section */}
      <div className="flex-1 p-4 border-2 border-Teal rounded w-40">
        <h4 className="text-2xl text-center mb-4 bg-Teal text-white">Course Content</h4>
        <DynamicAccordion modules={modules} onModuleClick={handleModuleClick} />
      </div>

      {/* DocViewer section */}
      
      {selectedModule && (
        <div className=" border border-Teal shadow-lg rounded p-4 w-3/4">
          <DocViewer
            documents={[
              { uri: `http://localhost:8080/modules/${selectedModule.file}`, 
              // fileType: "doc",
            }
            ]}
            pluginRenderers={DocViewerRenderers}
            
          />
        </div>
      )}


        

      </div>

       {/* Cancel Enrollment button */}
       <button
          className="bg-red-500 mt-5 p-5 text-md rounded"
          onClick={() => handleCancelEnrollment(courseId)}
        >
          Cancel Enrollment
        </button>
      
    </div>
    </div>
  );
};

export default  AccessCourseContent;
