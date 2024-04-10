import React from 'react';
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCard = ({ course, onEnroll, onHover }) => {

  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);

  const handleCardClick = () => {
    // Navigate to the course details page when the card is clicked
    navigate(`/viewcoursedetails/${course._id}`);
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${course._id}/image`, {
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
  }, [course._id]);

  return (
    <div
      className="mt-10 p-2 shadow-lg max-w-[15rem] min-w-[15rem] bg-white rounded-md "
      onMouseEnter={() => onHover(course)}
      onClick={handleCardClick}
    >
      <div className="relative">
      <div className="relative">
        {imageData && (
          <img src={imageData} alt={course.title} className="w-full h-40 object-cover rounded-md mb-2" />
        )}
      </div>
      </div>
      <div className="text-xs text-teal-500">{course.category}</div>
      <div className="text-sm mt-2 font-bold">{course.title}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{course.participants}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{course.rating}</div>
        </div>
        <div className="text-sm font-bold">RS.{course.price || 0}</div>
      </div>
      <button
        className="bg-teal-500 text-white mt-2 px-4 py-2 rounded-md hover:bg-teal-600 focus:outline-none"
        onClick={(event) => onEnroll(course._id)}
      >
        Enroll
      </button>

      <button
        className="bg-teal-500 text-white mt-2 px-4 py-2 rounded-md hover:bg-teal-600 focus:outline-none"
        onClick={(event) => onEnroll(course._id)}
      >
        Add to Cart
      </button>
    </div>
  );
};


export default CourseCard;
