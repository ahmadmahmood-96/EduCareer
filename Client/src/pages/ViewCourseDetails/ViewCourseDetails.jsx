import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DynamicAccordion from "../AccessCourseContent/DynamicAccordion"
import Topbar from '../../components/Navbar/NavbarPage';
import { useNavigate } from 'react-router-dom';

const ViewCourseDetails = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isCourseInCart, setIsCourseInCart] = useState(false);


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
    <div className="container mx-auto mt-8  mb-8">
    <h1 className="text-xl font-bold mb-2" >Course Details</h1>
    <div className='flex flex-row gap-2'>
        <div className='flex flex-col max-w-2xl mt-2'>

              <div className='h-auto max-w-2xl overflow-hidden'>
              {imageData && (
                  <img src={imageData} alt={courseId.title} className="w-full h-full object-cover rounded-md mb-2" />
                )}
              </div>
              
              <div className='mt-2'>
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
                <p className="text-md font-bold text-Teal">{courseDetails.category}</p>
                <p className="text-sm mb-4">{courseDetails.description}</p>
              </div>
          </div>

    <div className=''>
    <div className="text-lg font-bold text-Teal  flex-1 p-4 mt-2 mx-auto ">
           
    <div className="my-2 p-4 m-4 bg-Solitude">Instructor Name: {courseDetails.instructor}</div> 
    <div className="my-2 p-4 m-4 bg-Solitude" >Course Duration: {courseDetails.duration}</div> 
    <div className="my-2 p-4 m-4 bg-Solitude">Pre Requisites: {courseDetails.preRequisite}</div> 
          
          </div>
          <div className='bg-Solitude p-8 m-8 pl-16 mt-2  mb-5'>
              <h1 className="text-2xl font-bold">Price: Rs. {courseDetails.price}</h1>
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
                      className="mt-4 px-6 py-3 font-bold text-white bg-Teal text-sm"
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
    </div>
    </>
  );
};

export default ViewCourseDetails;