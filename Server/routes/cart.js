const router = require('express').Router();
const CartModel = require('../models/cart');
const CoursesModel = require('../models/course');
const { User } = require('../models/user');
const stripe = require("stripe")("sk_test_51OqInkSJlnzayyPBcSuXoUuFm4McyO9QzTadtHiOgrjvK57ZgoQuwQ2R9ALS1zTtWHo8zL4ULVspNZT7zHz0zXr400pHGXSS5S");


// Function to create a connected account for an instructor
// const createInstructorAccount = async (instructorEmail) => {
//     try {
//         const account = await stripe.accounts.create({
//             type: 'express',
//             email: 'instructorEmail',
//             capabilities: {
//                 transfers: { requested: true },
//             },
//         });
//         return account.id;
//     } catch (error) {
//         console.error('Error creating instructor account:', error);
//         throw new Error('Failed to create instructor account');
//     }
// };

// Function to initiate a payout to an instructor
// const initiatePayout = async (instructorAccountId, amount) => {
//     try {
//         const payout = await stripe.payouts.create({
//             amount: amount * 100, // Amount in cents
//             currency: 'pkr', // Change currency as per your requirements
//             destination: instructorAccountId,
//         });
//         return payout;
//     } catch (error) {
//         console.error('Error initiating payout:', error);
//         throw new Error('Failed to initiate payout');
//     }
// };


// Add course to cart
router.post('/add-to-cart', async (req, res) => {
    try {
        console.log("server hereeee")
        console.log("hello")
        const { userId, courseId } = req.body;

        const user = await User.findById(req.body.userId);
       
        // Retrieve course details
        const course = await CoursesModel.findById(courseId);
        console.log(course)
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        console.log("hello2")
        // Retrieve user's cart or create one if it doesn't exist
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                courses: []
            });
        }
        console.log("hello3")

         // Check if the user is the instructor of the course
         if (user._id.equals(course.userId)) {
            return res.send({ message:'Instructors cannot add their own course to cart' });
        }

        // Check if the user is already enrolled in the course
        if (user.enrolledCourses.includes(course._id)) {
            return res.send({ message: 'Cannot add already enrolled course' });
        }


        // Check if the course is already in the cart
        const isCourseInCart = cart.courses.some(cartItem => cartItem.courseId.equals(course._id));

        if (isCourseInCart) {
            // return res.status(400).json({ error: 'Course already in cart' });
            return res.send({ message: 'Course already in cart' });
        }

        else{
        // Add course to the cart
        cart.courses.push({
            courseId: course._id,
            title: course.title,
            category: course.category,
            instructor: course.instructor,
            price: course.price,
            file: course.file
            // You can include other course details here if needed
        });

        // Save the cart
        await cart.save();

        res.status(201).json(cart); }
    } catch (error) {
        console.error('Error adding course to cart:', error);
        res.status(500).json({ error: 'Failed to add course to cart', details: error.message });
    }
});



// Fetch added courses for a user
router.get('/added-courses/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Send the list of added courses in the cart
        res.json(cart.courses);
    } catch (error) {
        console.error('Error fetching added courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Remove courses from cart
router.delete('/remove-from-cart', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        console.log('userId:', userId);
        console.log('courseId:', courseId);

        // Find the user's cart
        const cart = await CartModel.findOne({ userId });
        //console.log('cart:', cart);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

       // Remove the course from the cart
        cart.courses = cart.courses.filter(cartItem => {
        console.log('Comparing courseId:', cartItem.courseId.toString(), 'with:', courseId);
        return cartItem.courseId.toString() !== courseId; });

        //console.log('Updated cart:', cart);


        // Save the updated cart
        await cart.save();

        
        
        res.status(204).end(); // No content - successful deletion

         //Check if there are no more courses in the cart
        //  if (cart.courses.length === 0) {
        //     // If no more courses, delete the cart entry
        //     await CartModel.findOneAndDelete({ userId });
        // }
    } catch (error) {
        console.error('Error removing course from cart:', error);
        res.status(500).json({ error: 'Failed to remove course from cart', details: error.message });
    }
});

// Clear all items from cart
router.delete('/clear-cart', async (req, res) => {
    try {
        const { userId } = req.body;

        // Find and delete the user's cart
        await CartModel.findOneAndDelete({ userId });

        res.status(204).end(); // No content - successful deletion
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart', details: error.message });
    }
});


//checkout session
router.post('/create-checkout-session', async(req,res) => {

    const {userId} = req.body;
    
    const customer = await stripe.customers.create({
        metadata:{
        userId: req.body.userId,
        // cart: JSON.stringify(req.body.courses)
        cart: JSON.stringify(req.body.courseIds)
        }
    })
        
    // console.log(req.body.courses)
    console.log("this is checkout session 1")
    const {courseIds} = req.body;
    console.log(courseIds);

    // Find all courses with the provided courseIds
    const courses = await CoursesModel.find({ _id: { $in: courseIds } });
    console.log("this is checkout session 2")


    const lineItems = courses.map((course)=>({
        price_data: {
            currency: "pkr", // Assuming you want USD as currency
            product_data: {
                name: course.title, // Assuming the title of the course is what you want to display
                // images: [course.file] // Add the image URL here
             
            },
            unit_amount: course.price * 100, // Multiplying by 100 to convert to cents
        },
        quantity: 1 // Assuming quantity is always 1 for each course
    }));

   
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: customer.id,
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/studentdashboard",
            cancel_url: "http://localhost:5173/cart",
            // billing_address_collection: 'null',
        });
        
    // res.json({ sessionId: session.id }); 
    // console.log(session)
    res.json({ sessionId: session.id });
   

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});


// Route to create instructor's connected account
// router.post('/create-instructor-account', async (req, res) => {
//     try {
//         const { instructorEmail } = req.body;

//         // Check if instructor already has an account
//         let instructor = await InstructorModel.findOne({ email: instructorEmail });

//         if (instructor && instructor.connectedAccountId) {
//             return res.status(400).json({ error: 'Instructor already has a connected account' });
//         }

//         // Create a connected account for the instructor
//         const accountId = await createInstructorAccount(instructorEmail);

//         // Save the connected account ID to the instructor's record
//         if (!instructor) {
//             instructor = new InstructorModel({ email: instructorEmail });
//         }
//         instructor.connectedAccountId = accountId;
//         await instructor.save();

//         res.status(201).json({ message: 'Connected account created successfully', accountId });
//     } catch (error) {
//         console.error('Error creating instructor account:', error);
//         res.status(500).json({ error: 'Failed to create instructor account', details: error.message });
//     }
// });

// // Route to initiate payouts to instructors
// router.post('/initiate-payout', async (req, res) => {
//     try {
//         const { instructorEmail, amount } = req.body;

//         // Find the instructor
//         const instructor = await InstructorModel.findOne({ email: instructorEmail });

//         if (!instructor || !instructor.connectedAccountId) {
//             return res.status(404).json({ error: 'Instructor not found or does not have a connected account' });
//         }

//         // Initiate payout to the instructor
//         const payout = await initiatePayout(instructor.connectedAccountId, amount);

//         res.status(200).json({ message: 'Payout initiated successfully', payout });
//     } catch (error) {
//         console.error('Error initiating payout:', error);
//         res.status(500).json({ error: 'Failed to initiate payout', details: error.message });
//     }
// });



module.exports = router;