import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenericCourseCard = ({ data, onHover }) => {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);

  const handleCardClick = () => {
    // Ensure data.courseId?._id is valid
    const courseId = data.courseId?._id || data._id;
    console.log("Clicked on card with ID:", courseId);

    // Navigate to the course details page when the card is clicked
    navigate(`/accesscontent/${courseId}`);
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${data.courseId?._id}/image`, {
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
  }, [data.courseId?._id]);

  return (
    <div
      className="mt-10 p-2 shadow-lg max-w-[15rem] min-w-[15rem] bg-white rounded-md "
      onMouseEnter={() => onHover(data)}
      onClick={handleCardClick}
    >
      <div className="relative">
        {imageData && (
          <img src={imageData} alt={data.title} className="w-full h-40 object-cover rounded-md mb-2" />
        )}
      </div>
      <div className="text-xs text-teal-500">{data.category}</div>
      <div className="text-sm mt-2 font-bold">{data.title}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{data.participants}</div>
        </div>
        
       
      </div>
      {/* Additional Fields */}
      <div>
        <strong>Title:</strong> {data.courseId?.title || 'N/A'}
      </div>
      <div>
        <strong>Description:</strong> {data.courseId?.description || 'N/A'}
      </div>
      <div>
        <strong>Instructor:</strong> {data.courseId?.instructor || 'N/A'}
      </div>
      <div>
        <strong>Category:</strong> {data.courseId?.category || 'N/A'}
      </div>
    </div>
  );
};

export default GenericCourseCard;
