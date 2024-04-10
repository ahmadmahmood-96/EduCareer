
// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  CourseCard from "../../customcomponents/Card";

const EnrolledCourses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        // Fetch the list of enrolled courses when the component mounts
        //const userId = localStorage.getItem('userId'); // Get the user ID from wherever it's stored
        const userToken = localStorage.getItem('token');
        console.log('User token:', userToken);


        axios.get(`http://localhost:8080/api/enrollments/user/${userToken}/enrolled-courses`)
            .then((response) => {
              
                setEnrolledCourses(response.data);
                console.log("222");

            })
            .catch((error) => {
                console.error('Error fetching enrolled courses:', error);
            });
    }, [enrolledCourses]); // Empty dependency array ensures the effect runs only once on mount

    return (
    //   <div>
    //       <h1>Enrolled Courses</h1>
    //       <ul>
    //           {enrolledCourses.map(course => (
    //               <li key={course._id}>
    //                   <div>
    //                       <strong>Course Name:</strong> {course.courseId?.title || 'N/A'}
    //                   </div>
    //                   <div>
    //                       <strong>Description:</strong> {course.courseId?.description || 'N/A'}
    //                   </div>
    //                   <div>
    //                       <strong>Instructor:</strong> {course.courseId?.instructor || 'N/A'}
    //                   </div>
    //                   <div>
    //                       <strong>Category:</strong> {course.courseId?.category || 'N/A'}
    //                   </div>
    //                   <div>
    //                       <strong>Category Paid:</strong> {course.courseId?.categorypaid || 'N/A'}
    //                   </div>
    //                   <div>
    //                       <strong>Price:</strong> {course.courseId?.price || 'N/A'}
    //                   </div>
    //                   {/* Add other fields you want to display */}
    //               </li>
    //           ))}
    //       </ul>
    //   </div>

//     <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
//     {enrolledCourses.map((course) => (
//       <CourseCard className="mb-4"
//         key={course._id}
//         course={course}
//         // onEnroll={(event) => handleEnroll(course._id, event)}  
//         // onHover={(course) => setHoveredCourse(course)}
//       />
//     ))}
//   </div>

<div className="flex  flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
{enrolledCourses.map((course) => (
  <CourseCard type="generic" key={course._id} course={course} 
  />
))}
</div>


  );
  
};

export default EnrolledCourses;
