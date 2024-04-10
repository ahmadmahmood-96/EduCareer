import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartItem from './CartItem';
import {MdClear} from "react-icons/md";
import {loadStripe} from '@stripe/stripe-js';
import Topbar from '../../components/Navbar/NavbarPage';

const Cart = () => {
  const [addedCourses, setAddedCourses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  // if(addedCourses.length < 1){
  //   return (
  //     <div className='py-8 font-semibold'>
  //       <div className='container'>No items found in the cart.</div>
  //     </div>
  //   )
  // }


  useEffect(() => {
    // Fetch the list of added courses when the component mounts
   
    const userToken = localStorage.getItem('token');
    //console.log('User token:', userToken);


    axios.get(`http://localhost:8080/api/added-courses/${userToken}`)
        .then((response) => {
          
          setAddedCourses(response.data);
        })
        .catch((error) => {
            console.error('Error fetching added courses:', error);
        });
}, [addedCourses]); // Empty dependency array ensures the effect runs only once on mount

// Total amount and number of courses in cart
useEffect(() => {
  let amount = 0;
  let coursesCount = addedCourses.length;

  addedCourses.forEach(course => {
    // Parse price string to number and add it to the total amount
    amount += parseFloat(course.price);
  });

  setTotalAmount(amount);
  setTotalCourses(coursesCount);
}, [addedCourses]);

   // Function to remove an item from the cart
   const removeFromCart = (courseId) => {
    
    const userToken = localStorage.getItem('token');
    console.log('Deleting item with courseId:', courseId);

    const userId = userToken;
    console.log(userId)
  
    axios.delete('http://localhost:8080/api/remove-from-cart', {
      data: { userId, courseId}
    })
    .then(() => {
      // Update the UI after successful deletion
      //setAddedCourses(addedCourses.filter(course => course._id !== courseId));
      setAddedCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
    })
    .catch((error) => {
      console.error('Error removing course from cart:', error);
    });
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    axios.delete('http://localhost:8080/api/clear-cart', {
      data: { userId: localStorage.getItem('token') }
    })
    .then(() => {
      // Update the UI after successful clearing
      setAddedCourses([]);
    })
    .catch((error) => {
      console.error('Error clearing cart:', error);
    });
  };

  
  //payment integration
  const makePayment = async () => {
    const userToken = localStorage.getItem('token');
    const userId = userToken;

    console.log("id sent from front end" ,userId)
   
    console.log("makepayment 1");
    try {
      const stripe = await loadStripe("pk_test_51OqInkSJlnzayyPB6ZfYa1jrnYqzAGl4HTIKeJdhf0obalLW9DoBsFhf4yw8GL3Kkdo6htASp2NEEMv5fKPT0mhB00YJSWv9x1");
      const sessionData = {
        // courses: addedCourses,
        courseIds: addedCourses.map(course => course.courseId),
        userId: userId,
      };
    
      console.log("session data",sessionData);
      const response = await axios.post('http://localhost:8080/api/create-checkout-session', sessionData);
      const session = response.data;

      // clearCart();

      console.log(session)
      
      
      const result = await stripe.redirectToCheckout({
        //sessionId: session.id
        sessionId: session.sessionId 
      });

      
      
  
      if (result.error) {
        throw new Error(result.error.message);
      }
      else {
       
        // window.alert("Checkout completed successfully!");
      
    }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  

  // Function to handle payouts to instructors after successful payment
  // const handleSuccessfulPayment = async (courses) => {
  //   try {
  //     // Calculate total earnings for each instructor
  //     const earningsPerInstructor = {};
  //     courses.forEach(course => {
  //       if (!earningsPerInstructor[course.instructor]) {
  //         earningsPerInstructor[course.instructor] = 0;
  //       }
  //       earningsPerInstructor[course.instructor] += parseFloat(course.price);
  //     });
  
  //     // Create connected accounts for instructors if not already created
  //     const instructorAccounts = {};
  //     for (const instructorEmail of Object.keys(earningsPerInstructor)) {a
  //       if (!instructorAccounts[instructorEmail]) {
  //         const accountId = await createInstructorAccount(instructorEmail);
  //         instructorAccounts[instructorEmail] = accountId;
  //       }
  //     }
  
  //     // Initiate payouts to instructors
  //     for (const [instructorEmail, earnings] of Object.entries(earningsPerInstructor)) {
  //       await initiatePayout(instructorAccounts[instructorEmail], earnings);
  //     }
  
  //     console.log('Payouts initiated successfully');
  //   } catch (error) {
  //     console.error('Error handling payouts:', error);
  //   }
  // };


  return (
    <>
    <Topbar/>
    <div className='py-8 container mx-auto'>
    <div className=' container'>
      <div className='card-pg-title'>
        <h3 className='font-bold text-xl'>Shopping Cart</h3>
      </div>
      <div className=' grid'>
        {/* card grid left */}
        <div className='cart-grid-left'>
          <div className='flex flex-wrap items-center justify-between'>
            <div className='cart-count-info'>
              <span className='font-bold text-xl'>{totalCourses}</span> Course in Cart
            </div>
            <button
              type='button'
              className='cart-clear-btn flex items-center text-lg font-semibold'
              onClick={clearCart}
            >
              <MdClear className='text-black' />
              <span className='inline-block ml-2 text-black'>Clear All</span>
            </button>
          </div>
         <div className='overflow-y-scroll h-96 m-5'>
          <div className='cart-items-list grid gap-y-2'>
          {addedCourses.map((course) => (
       <CartItem key={course._id} cartItem={course} removeFromCart={removeFromCart} />
       
            ))}
          </div>
          </div>
        </div>
        {/* end of grid left */}
        {/* cart grid right */}
        <div className='cart-grid-right'>
          <div className='cart-total'>
            <span className='block text-l font-semibold'>Total:</span>
            <div className='font-extrabold text-3xl'>Rs. {totalAmount.toFixed(2)}</div>
            <button type='button' className='checkout-btn bg-Teal text-white font-semibold px-6 py-3 mt-4'
            onClick={makePayment}
            >Checkout</button>
          </div>
        </div>
        {/* end of cart grid right */}
      </div>
    </div>
  </div>
  </>
  )
}

export default Cart
