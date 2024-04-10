import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { navigate } from '@reach/router';
//import CategoriesNavbar from "../../components/Navbar/CategoriesNavbar"
import Topbar from '../../components/Navbar/DiscoverPageNavbar'
import CourseCard from "../../customcomponents/Card";
import SearchBar from '../../customcomponents/SearchBar';
import hero from '../../assets/hero2.png';

function Discover() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const hardcodedCategories = [
    "Machine Learning",
    "Programming and Development",
    "Database Management",
    "Networking",
    "Programming Languages",
    "Operating Systems",
    "Software Engineering",
  ];

  const fetchCourses = async (searchTerm, category) => {
    try {
      let url = 'http://localhost:8080/api/';
      
       if (searchTerm) {
        url += `searchcourses?searchTerm=${searchTerm}`;
        setSelectedCategory(null);
      } 
      else if (category) {
        url += `courses/category/${category}`;
      }
      else{
        url += `courses`;
      }
      const response = await axios.get(url);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleSearch = () => {
    console.log('Search term:', searchTerm); // Log the search term
    fetchCourses(searchTerm);
    setSelectedCategory(null);
   
  };

  useEffect(() => {
    fetchCourses(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

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
            navigate('/enrolledcourses');}
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

    <div>
     <div className='' ><Topbar/>  </div>   
        <div className=" " 
        style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "50vh",
    }}>
      <div className='flex flex-col '>
      <div className=' max-w-auto mt-32 text-white text-3xl pl-80 ml-[43rem]'>
      <p className='sm:text-[2.5rem] text-[1.825rem] font-bold text-white'>Explore Your Future: </p> 
      <div className='text-base leading-7 text-Solitude max-w-sm mt-2'>
      <p>"Dive into a World of Education with Educareer's Top-Tier Selection of Popular Courses!"</p>
      </div>
      
      </div>
      <div className='px-24 mt-8'>
      <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />

      </div>
      </div>
        </div>
      
     
      <div className="flex flex-col mt-0">
        {/* CategoriesNavbar appears on top */}
         <div className="px-24 mx-auto">
          <h2 className="text-2xl text-Teal font-bold mb-4">Select a Category</h2>
          <div className="flex flex-wrap gap-2">
            {hardcodedCategories.map((category) => (
              <div
                key={category}
                className={`cursor-pointer tab-btn ${selectedCategory === category ? 'text-Teal bg-gray-200' : 'text-Teal bg-gray-100 hover:bg-gray-200'} border border-gray-300  p-2`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </div>
            ))}
          </div>
          </div>

          <div className="container mx-auto py-4">
          <h2 className="text-2xl font-bold my-4">{selectedCategory ? `Courses in ${selectedCategory}` : "Search Results"}</h2>
          {courses.length === 0 && (
            <div className="text-gray-500 mt-4">No Courses Matching the Selection!</div>
          )}
          {courses.length > 0 && (
            <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  type="student"
                  course={course}
                  onEnroll={(event) => handleEnroll(course._id, event)}
                  onAddToCart={(event) => handleAddToCart(course._id, event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;

