import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import  CourseCard from "../../customcomponents/Card";

const SearchBar = ({ selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState('');
  const [sorting, setSorting] = useState('');

  useEffect(() => {
    // Fetch courses from the server based on the search term, filters, sorting, and selected category
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/searchcourses?searchTerm=${searchTerm}&filters=${filters}&sorting=${sorting}&category=${selectedCategory}`
        );
        setCourses(response.data);
        setHoveredCourse(null); // Reset hovered course when fetching new courses
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [searchTerm, filters, sorting, selectedCategory]);

  const handleSearch = () => {
    // Trigger a fetch when the search button is clicked
    fetchCourses();
  };

  const handleEnroll = async (courseId, event) => {
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
  
      console.log('Enrollment successful:', data);
      setMsg2(data.message);
      setError2('');
      navigate('/enrolledcourses');
    } catch (error) {
      console.error('Enrollment error:', error);
  
      if (error.message === 'Network Error') {
        setError2('Failed to connect to the server. Please check your internet connection.');
      } else {
        setError2(`Failed to enroll in the course. ${error.message}`);
      }
  
      setMsg2('');
    }
  };
  

  return (
    <>
      <div className="container mx-auto py-24  min-h-screen">
        <div className="relative  max-w-md mt-0">
          <div className="flex items-center bg-lightish-white rounded-full border border-gray-300 p-2">
            <div className="mr-2">
              <FiSearch className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Search for courses..."
              name="searchbar"
              id="searchbar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none outline-none bg-transparent"
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

      

        <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
          {courses.map((course) => (
            <CourseCard
              className="mb-4"
              key={course._id}
              type="student"
              course={course}
              onEnroll={(event) => handleEnroll(course._id, event)}
              onHover={(course) => setHoveredCourse(course)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
