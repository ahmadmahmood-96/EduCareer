import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate  } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DynamicAccordion from './DynamicAccordion';
import Topbar from '../../components/Navbar/NavbarPage'
import { FaStar } from 'react-icons/fa';
import { motion } from "framer-motion";


const AccessCourseContent = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseRating, setCourseRating] = useState(null);
  const [courseReview, setCourseReview] = useState(null);
  const [instructorRating, setInstructorRating] = useState(null);
  const [instructorReview, setInstructorReview] = useState(null);
  const [hover, setHover] = useState(null);
  const [totalStars, setTotalStars] = useState(5);

  const navigate = useNavigate();

  const container = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  
 const handleCourseRatingChange = (value) => {
    setCourseRating(value);
  };

  const handleInstructorRatingChange = (value) => {
    setInstructorRating(value);
  };


  const submitRating = async () => {
    try {
      const userId=localStorage.getItem("token");
      const response = await axios.post('http://localhost:8080/api/ratings-reviews', {
        userId,
        courseId,
        courseRating,
        courseReview,
        instructorRating,
        instructorReview,
      });

      console.log('Rating and review submitted:', response.data);
      toggleModal(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting rating and review:', error);
      // Handle error
    }
  };

  const handleCourseReviewChange = (event) => {
    const value = event.target.value;
    setCourseReview(value); 
  };

  const handleInstructorReviewChange = (event) => {
    const value = event.target.value;
    setInstructorReview(value); 
  };

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
        <div className="border border-Teal shadow-lg rounded p-4 w-3/4 overflow-hidden" >
          <DocViewer className='relative'
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

        {/* Rating Option */}
        <div>
              <button className=' bg-Solitude text-xl p-2 m-2'
              onClick={toggleModal}>
              leave a rating 
              </button>
              </div>

           
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden="true"
            className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen w-full`}
          >
            {/* Modal content */}
            <div className="relative p-4 w-full max-w-lg max-h-full">
              <div className="relative bg-white shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b dark:border-gray-600">
                  <h3 className="text-2xl font-semibold dark:text-white">
                    How would you rate this course and its instructor?
                  </h3>
                  <button type="button" onClick={toggleModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <p>Tell us about your expereice with this course</p>
                  <p className="text-lg mb-4">
                    {courseRating !== null
                      ? courseRating === 1
                        ? "Awful, not what I expected at all"
                        : courseRating === 2
                        ? "Poor, pretty disappointed"
                        : courseRating === 3
                        ? "Average, could be better"
                        : courseRating === 4
                        ? "Good, what I expected"
                        : "Amazing, above expectations!"
                      : "Select your rating:"}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    {[...Array(totalStars)].map((star, index) => {
                      const currentRating = index + 1;

                      return (
                        <span
                          key={index}
                          className="star"
                          style={{
                            color:
                              currentRating <= (hover || courseRating) ? "#ffc107" : "#e4e5e9"
                          }}
                          onClick={() => handleCourseRatingChange(currentRating)}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <FaStar size={30} />
                        </span>
                      );
                    })}
                  </div>

                  <textarea
                    name="review"
                    value={courseReview}
                    onChange={handleCourseReviewChange}
                    className="w-full mt-4 p-2 border "
                    rows={5} 
                    placeholder="Tell us about your own experience taking this course. Was it a goos match?"
                  />
                  
                  
                  <p>Tell us about your expereice with this course</p>
                  <p className="text-lg mb-4">
                    {instructorRating !== null
                      ? instructorRating === 1
                        ? "Awful, not what I expected at all"
                        : instructorRating === 2
                        ? "Poor, pretty disappointed"
                        : instructorRating === 3
                        ? "Average, could be better"
                        : instructorRating === 4
                        ? "Good, what I expected"
                        : "Amazing, above expectations!"
                      : "Select your rating:"}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    {[...Array(totalStars)].map((star, index) => {
                      const currentRating = index + 1;

                      return (
                        <span
                          key={index}
                          className="star"
                          style={{
                            color:
                              currentRating <= (hover || instructorRating) ? "#ffc107" : "#e4e5e9"
                          }}
                          onClick={() => handleInstructorRatingChange(currentRating)}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <FaStar size={30} />
                        </span>
                      );
                    })}
                  </div>

                  <textarea
                    name="review"
                    value={instructorReview}
                    onChange={handleInstructorReviewChange}
                    className="w-full mt-4 p-2 border "
                    rows={5} 
                    placeholder="Tell us about your own experience taking this course. Was it a goos match?"
                  />

                  <button
                    onClick={submitRating}
                    className="text-sm mt-5 text-white bg-Teal sm:p-3 p-2 shadow-md font-bold"
                  >
                    Submit Rating
                  </button>

                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
