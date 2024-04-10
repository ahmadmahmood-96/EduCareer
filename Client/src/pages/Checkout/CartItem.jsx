import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const CartItem = ({ cartItem, removeFromCart }) => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/courses/${cartItem.courseId}/image`, {
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
      }, [cartItem.courseId]);
    
  return (
    <div className='grid grid-cols-2 border border-solid border-slate-200 p-4'>
      <div className='cart-item-img w-64 h-32 overflow-hidden'>
      {imageData && (
          <img src={imageData} alt={cartItem.title} className="w-full h-full object-cover rounded-md mb-2" />
        )}
      </div>
      <div >
        <p className='font-semibold text-lg'>{cartItem.title}</p>
        <span className='text-sm text-gray-500'>By {cartItem.instructor}</span>
        <div className='font-semibold text-black'>Rs.{cartItem.price}</div>
        <div className='cart-item-category bg-Teal text-xs text-white font-semibold capitalize inline-block py-1 px-2 rounded'>
          {cartItem.category}
        </div>
        <br />
        <button
          type='button'
          className='remove-btn text-sm text-gray-800 font-semibold mt-4 transition duration-300 hover:text-purple-700'
          onClick={() => removeFromCart(cartItem.courseId)}
        >
          Remove <span className='ml-1'><FaTrashAlt /></span>
        </button>
      </div>
    </div>
  )
}

export default CartItem
