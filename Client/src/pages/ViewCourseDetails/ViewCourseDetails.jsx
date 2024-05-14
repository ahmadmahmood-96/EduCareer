import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DynamicAccordion from "../AccessCourseContent/DynamicAccordion"
import Topbar from '../../components/Navbar/NavbarPage';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';

const ViewCourseDetails = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isCourseInCart, setIsCourseInCart] = useState(false);
  const [reviews, setReviews] = useState([]);


  const navigate=useNavigate();
  
  useEffect(() => {
    const fetchImageData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/courses/${courseId}/image`, {
              responseType: 'arraybuffer',
            });
        
    
        const arrayBuffer = response.data;
        const blob = new Blob([arrayBuffer]);
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          setImageData(imageData);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image data:', error);
        // Handle errors as needed
      }
    };

    fetchImageData();
  }, [courseId]);


  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/viewcoursedetails/${courseId}`);
        setCourseDetails(courseResponse.data);

        // Fetch modules for the course
        const modulesResponse = await axios.get(`http://localhost:8080/api/modules/${courseId}`);
        setModules(modulesResponse.data);

        // Check if the course is in the cart
        const userToken = localStorage.getItem('token');
        if (userToken) {
          const response = await axios.get(`http://localhost:8080/api/added-courses/${userToken}`);
          const addedCourses = response.data;
          setIsCourseInCart(addedCourses.some(course => course.courseId === courseId));
        }
      } catch (error) {
        console.log(error);
      }

      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/reviews/${courseId}`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      fetchReviews();
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  
  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  if (!courseDetails) {
    return <p>Loading...</p>;
  }


  const handleEnroll = async (courseId, event) => {
    const confirmEnrollment = window.confirm('Are you sure you want to enroll in this course?');
    if (confirmEnrollment) {
        const url = 'http://localhost:8080/api/enrollments';
        const userToken = localStorage.getItem('token');

        console.log('Enrolling with courseId:', courseId);
        console.log('User token:', userToken);

        try {
            // Use the token itself as the user ID
            const userId = userToken;
            console.log(userId)

            // Make the request with the token as the user ID
            const { data } = await axios.post(
                url,
                { courseId, userId },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            const responseData = data.data;

            if (data.status === 201) {
                // Enrollment successful
              //  alert('Enrollment successful');
                console.log(responseData); // Log the enrollment details
                navigate('/enrolledcourses');
            } else if (data.message === "Instructors cannot enroll in their own course") {
                // Instructor trying to enroll in own course
                alert('Instructors cannot enroll in their own course');
            } else if(data.message==='User is already enrolled in this course') {
                // Handle other status codes
                alert('User is already enrolled in this course');
            }else{

           // console.log('Enrollment successful:', data);
            // setMsg('');
            // setError2('');
            alert("Enrollment successful")
            navigate('/studentdashboard');}
        } catch (error) {
            console.error('Enrollment error:', error);

            }
        
    }
};



  const handleAddToCart = async (courseId, event) => {
    const url = 'http://localhost:8080/api/add-to-cart';
    const userToken = localStorage.getItem('token');
  
    console.log('Adding to cart with courseId:', courseId);
    console.log('User token:', userToken);
  
    try {

      const userId = userToken;
      console.log(userId)
      // Make the request with the token as the user ID
      const { data } = await axios.post(
        url,
        { courseId, userId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  
      console.log('Added to cart:', data);
      const responseData = data.data;
      if (data.message === "Course already in cart") {
        // Instructor trying to enroll in own course
        alert("Course already in cart");
    }
    else if(data.message === "Cannot add already enrolled course"){
      alert("Cannot add already enrolled course");
    }
    else if(data.message === "Instructors cannot add their own course to cart"){
      alert("Instructors cannot add their own course to cart");
    }
      else {alert('Added to Cart')}
      setMsg('Course added to cart successfully');
      setError('');
    } catch (error) {
      console.error('Error adding to cart:', error);
  
      if (error.message === 'Network Error') {
        setError('Failed to connect to the server. Please check your internet connection.');
      } else {
        setError(`Failed to add to cart. ${error.message}`);
        
      }
  
      setMsg('');
    }
  };
  

  

  return (
    <>
    <Topbar/>
    <div className="p-10 mt-8 mb-8 bg-offWhite mx-20 border-radius rounded-lg">
    <h1 className="text-3xl font-bold my-3" >Course Details</h1>
    <div className=''>
        <div className='flex flex-row mt-5 p-5 px-10 bg-white border-radius rounded-lg'>
              <div className='mt-5  overflow-hidden'>
              {imageData && (
                  <img 
                  src={imageData} alt={courseId.title} 
                  className="h-auto max-w-2xl rounded-lg mb-2" 
                  style={{ width: '600px' }} // Increase width here
                  />
                )}
              </div>
              <div className="border-l border-Solitude ml-8"></div>
              <div className='max-w-4xl m-5 p-5'>
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
                <p className="text-md font-bold text-Teal">{courseDetails.category}</p>
                <p className="text-md mb-4">{courseDetails.description}</p>
                <div><strong>Instructor Name:</strong> {courseDetails.instructor}</div> 
                <div><strong>Course Duration:</strong> {courseDetails.duration}</div> 
                <div><strong>Pre Requisites:</strong> {courseDetails.preRequisite}</div> 
              </div>
          </div>

    <div>
          <div className='flex flex-row  mt-8  mb-5'>
              <h1 className="text-2xl font-bold">Rs. {courseDetails.price}</h1>
                        {courseDetails.price == "" && (
                      <div>
                        <button
                        className="mt-4 px-6 py-3  font-bold text-white bg-Teal text-sm"
                        onClick={(event) => handleEnroll(courseDetails._id, event)}
                    >
                      Enroll
                      </button>
                      </div>
                    )}

                {!isCourseInCart && courseDetails.price !== "" && (
                  <div>
                    <button
                      className="px-6 py-3 mx-3 font-bold text-white bg-Teal text-sm"
                      onClick={(event) => handleAddToCart(courseDetails._id, event)}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}    

                {isCourseInCart ? (
                    <div>
                      <button
                        className="mt-4 px-6 py-3 font-bold text-white bg-Teal text-sm"
                        onClick={() => navigate('/cart')}
                      >
                        Go to Cart
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Render Enroll or Add to Cart button based on price */}
                    </div>
                )}
          </div>
          </div>
          <div>
          </div>

    </div>
      {/* Main content layout */}
      <div className="flex gap-2 border overflow-y-scroll h-96  ">
      {/* Modules section */}
      <div className="flex-1 p-4  rounded w-40">
        <h4 className="text-2xl text-center mb-4 bg-Teal text-white">Course Content</h4>
        <DynamicAccordion modules={modules} onModuleClick={handleModuleClick} />
      </div>
      </div>


      <div> 
      <h4 className="m-4 mt-8 text-2xl font-bold mb-4 ">Course Reviews:</h4>
      <ul>
        {reviews.map(review => (
          <li key={review._id} className='bg-white shadow m-4 border p-4'>
             
             <p style={{ display: 'flex', alignItems: 'center' }}>
              <FaUser size={24} className="text-gray-500 mr-2 border border-gray-300 rounded-full p-1" />
              <span>{review.userName}</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              Rating: 
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                {[...Array(review.courseRating)].map((_, index) => (
                  <FaStar key={index} className="ml-1 text-teal-500" style={{ color: '#ffc107' }} />
                ))}
              </span>
            </p>
            <p>{review.courseReview}</p>
          </li>
        ))}
      </ul>
    </div>

    <h4 className="m-4 mt-8 text-2xl font-bold mb-4 ">Instructor Reviews:</h4>
    <ul>
        {reviews.map(review => (
          <li key={review._id} className='bg-white shadow m-4 border p-4'>
             
             <p style={{ display: 'flex', alignItems: 'center' }}>
              <FaUser size={24} className="text-gray-500 mr-2 border border-gray-300 rounded-full p-1" />
              <span>{review.userName}</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              Rating: 
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                {[...Array(review.instructorRating)].map((_, index) => (
                  <FaStar key={index} className="ml-1 text-teal-500" style={{ color: '#ffc107' }} />
                ))}
              </span>
            </p>
            <p>{review.instructorReview}</p>
          </li>
        ))}
      </ul>

    </div>
    </>
  );
};

export default ViewCourseDetails;