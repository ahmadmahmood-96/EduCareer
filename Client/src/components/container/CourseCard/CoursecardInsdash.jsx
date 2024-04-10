
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const CourseCard = ({ course, onEnroll, onUpdate, onDelete }) => {
  const [imageData, setImageData] = useState(null);
const navigate=useNavigate();
const handleUpdateClick = () => {
  navigate(`/UpdateCourse/${course._id}`);
};
  const handleDeleteClick = () => {
    onDelete(course._id);
  };

  const handleExploreClick = () => {
    onEnroll(course._id, course.title);
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
    <div className="mt-10 p-2 shadow-lg max-w-[15rem] min-w-[15rem] bg-white rounded-md">
      <div className="relative">
        {imageData && (
          <img src={imageData} alt={course.title} className="w-full h-40 object-cover rounded-md mb-2" />
        )}
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
      <div className="flex items-center gap-2 mt-2">
        {/* Explore Button */}
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 focus:outline-none"
          onClick={handleExploreClick}
        >
          Explore
        </button>

        {/* Update Icon */}
        <button onClick={handleUpdateClick}>
          <FaPencilAlt />
        </button>

        {/* Delete Icon */}
        <button onClick={handleDeleteClick}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
