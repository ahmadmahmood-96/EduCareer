import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const CourseCard = ({ course, onEnroll, onHover,type , onUpdate, onDelete, onAddToCart}) => {

  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);


  const handleCardClick = () => {
    if (type =='generic') {
        const courseId = course.courseId?._id || course._id;
        console.log("Clicked on card with ID:", courseId);

        //Navigate to the course details page when the card is clicked
       navigate(`/accesscontent/${courseId}`);

    } 
    else if (type =='student') {
        navigate(`/viewcoursedetails/${course._id}`);
    }
  };


  const handleUpdateClick  =() => {
    onUpdate(course._id);

    // navigate(`/UpdateCourse/${course._id}`);
  };

  const handleDeleteClick = () => {
    onDelete(course._id);
  };

  // const handleAddToCartClick = () => {
  //   onAddToCart(course._id);
  // };

  const handleExploreClick = () => {
    onEnroll(course._id, course.title);
  };

  useEffect(() => {
    const fetchImageData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/courses/${course.courseId?._id  || course._id}/image`, {
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
  }, [course.courseId?._id]);

  return (
    <>
    <div
      className="mt-10 p-2 shadow-lg max-w-[15rem] min-w-[15rem] bg-white border-solid border-slate-200"
      onMouseEnter={() => onHover(course)}
      onClick={handleCardClick}
    >
      <div className="relative">
      <div className="relative ">
        {imageData && (
          <img src={imageData} alt={course.courseId?.title} className="w-full h-40 object-cover  mb-2" 
          />
        )}
      </div>
      </div>
      <div className="text-xs text-teal-500">{course.category}</div>
      <div className="text-sm mt-2 font-bold">{course.title}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{course.participants}</div>
        </div>
        </div>
        {type == 'student' && (
        <div>
         <div className="text-sm font-bold">RS.{course.price || 0}</div>
        
        <div className='flex items-center gap-2 mt-2'>
        {course.price == "" && (
        <div>
           <button
          className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
          onClick={(event) => onEnroll(course._id)}
      >
        Enroll
        </button>
        </div>
      )}

      {course.price !== "" && (
        <div>
            <button
            className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
            onClick={(event) => onAddToCart(course._id)}
        >
        Add to Cart
      </button>
        </div>
      )}

        </div>
         
      </div>
      )}

       {type == 'instructor' && (
        <div>
         <div className="text-sm font-bold">RS.{course.price || 0}</div>
     
      <div className="flex items-center gap-2 mt-2">
        {/* Explore Button */}
        <button
          className="bg-Teal text-white px-4 py-2  hover:bg-teal-600 focus:outline-none"
          onClick={handleExploreClick}
        >
          Explore
        </button>

        {/* Update Icon */}
        <button 
        // onClick={handleUpdateClick}
        onClick={ handleUpdateClick}
        >
          <FaPencilAlt />
        </button>

        {/* Delete Icon */}
        <button onClick={handleDeleteClick}>
          <FaTrash />
        </button>
      </div>
      </div>
      )}

        {type == 'generic' && (
        <div>
        {/* Additional Fields for generic type */}
        <strong>Title:</strong> {course.courseId?.title || 'N/A'}
        <br />
        <strong>Description:</strong> {course.courseId?.description || 'N/A'}
        <br />
        <strong>Instructor:</strong> {course.courseId?.instructor || 'N/A'}
        <br />
        <strong>Category:</strong> {course.courseId?.category || 'N/A'}
      </div>
      )}


      </div>
  
    </>
  );
};


export default CourseCard;
