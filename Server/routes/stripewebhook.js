const router = require('express').Router();
const express = require('express');
const stripe = require("stripe")("sk_test_51OqInkSJlnzayyPBcSuXoUuFm4McyO9QzTadtHiOgrjvK57ZgoQuwQ2R9ALS1zTtWHo8zL4ULVspNZT7zHz0zXr400pHGXSS5S");
const OrderModel = require('../models/order');
const CartModel = require('../models/cart'); 
const EnrollmentModel = require('../models/enrollment');
const {User} = require("../models/user");
const CoursesModel = require('../models/course');



const enrollUser = async (customer, data) => {
  try {
      // const Items = JSON.parse(customer.metadata.cart);
      // const courseIds = Items.map(item => item.courseId);
      // console.log(courseIds);

      const courseIds= JSON.parse(customer.metadata.cart);
      const userId = customer.metadata.userId;

      // Retrieve user details using token or any other authentication method
      const user = await User.findById(userId);
      console.log('Retrieved User:', user);

      // Iterate over each course ID and enroll the user in each course
      for (const courseId of courseIds) {
          // Retrieve course details
          const course = await CoursesModel.findById(courseId);
          console.log('Retrieved Course:', course);

          if (!course) {
              console.error('Course not found:', courseId);
              continue; // Skip this iteration and move to the next course
          }

          // Check if the user is already enrolled in the course
          if (user.enrolledCourses.includes(course._id)) {
              console.log(`User is already enrolled in the course: ${course.title}`);
              continue; // Skip this iteration and move to the next course
          }
          

          // Create enrollment with additional details
          const enrollmentDetails = {
              userId: user._id,
              courseId: course._id,
              instructor: course.instructor,
              studentName: `${user.firstName} ${user.lastName}`,
              courseName: course.title,
              // Add any other fields you need for enrollment details
          };

          // Create enrollment entry
          const enrollment = await EnrollmentModel.create(enrollmentDetails);
          console.log('Enrollment created:', enrollment);

          // Update user's enrolledCourses field
          user.enrolledCourses.push(course._id);
          await user.save();
          console.log(`User enrolled in the course: ${course.title}`);
      }

      // res.status(201).json({ message: 'Enrollment completed successfully' });
  } catch (error) {
      console.error('Error creating enrollment:', error);
      // res.status(500).json({ error: 'Failed to create enrollment', details: error.message });
  }
};


// Create Order
const createOrder = async (customer, data, courses) => {
  const courseIds= JSON.parse(customer.metadata.cart);

  // const Items = JSON.parse(customer.metadata.cart);
  const userId = customer.metadata.userId;

  const subTotal = courses.reduce((total, course) => {
    // Assuming each course has a price field
    return total + parseFloat(course.price); // Convert price to float if it's a string
  }, 0);

  const newOrder= new OrderModel({
  userId: userId,
  customerId: data.customer,
  paymentIntentId: data.payment_intent,
  courses: courses.map(course => ({ courseId: course._id })),
  subtotal: subTotal,
  // total: data.amount_total,
  payment_status: data.payment_status,
  })

  try{
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
    
    // Delete the user's cart after successfully adding the order to the database
    await CartModel.findOneAndDelete({ userId });
    return savedOrder;
   

  }
    catch (err) {
      console.log(err);
      throw err;
  }
};



//strip webhook
let endpointSecret;
// endpointSecret = "whsec_b46760a11bb8936b32d40ffa96d5ba1026fd1861d0e9e3cad8ef0d6520be8f54";

router.post('/webhook', express.raw({type: 'application/json'}), async(req, res) => {
  const sig = req.headers['stripe-signature'];

   //check that request for webhook comes from stripe event
  let data;
  let eventType;

  if(endpointSecret){
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook Verified")
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data= event.data.object;
      eventType = event.type;
  } 
  else {
    data= req.body.data.object;
    eventType = req.body.type;
  }

// Handle the event
if (eventType == "checkout.session.completed") {
    // stripe.customers
    // .retrieve (data.customer)
    // .then((customer) =>{
    // console.log(customer);
    // console.log("data:", data);
    // createOrder (customer, data);

    //  // create enrollment record for paid courses
    //  enrollUser(customer, data); // Pass customer object and res to enrollUser

    // }).catch((err) => console.log(err.message));
    try {
      const customer = await stripe.customers.retrieve(data.customer);
      // Extract course IDs from customer metadata
      const courseIds = JSON.parse(customer.metadata.cart);
      // Find all courses with the provided courseIds
      const courses = await CoursesModel.find({ _id: { $in: courseIds } });
      // Process the order with course details
      await createOrder(customer, data, courses);
      // Enroll user in purchased courses
      await enrollUser(customer, data, courses);
      console.log("Order and enrollment processed successfully");
  } catch (error) {
      console.error('Error processing order and enrollment:', error);
  }
    }
   
  // Return a 200 response to acknowledge receipt of the event
  
  res.send().end();
});

module.exports = router;