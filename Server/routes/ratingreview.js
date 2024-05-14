const router = require('express').Router();
const { User } = require("../models/user");
const CoursesModel = require('../models/course');
const RatingReviewModel = require('../models/review')

// Get all courses
router.post('/ratings-reviews', async (req, res) => {
    try {
        const { courseId, courseRating, courseReview, instructorRating,instructorReview, userId } = req.body;
        
        // Create a new RatingReview document
        const newRatingReview = new RatingReviewModel({
          userId,
          courseId,
          courseRating,
          courseReview,
          instructorRating,
          instructorReview,
        });
    
        // Save the rating and review to MongoDB
        await newRatingReview.save();
    
        res.status(201).send('Rating and review saved successfully');
      } catch (error) {
        console.error('Error saving rating and review:', error);
        res.status(500).send('Internal Server Error');
      }
    
});


//fetch reviews based on course ID
// router.get('/reviews/:courseId', async (req, res) => {
//   try {
//     const courseId = req.params.courseId;
//     const reviews = await RatingReviewModel.find({ courseId });
//     res.json(reviews);
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
    
//   }
// });

// Fetch reviews based on course ID and include user names using User ID from the user model
router.get('/reviews/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Fetch reviews based on the course ID
    const reviews = await RatingReviewModel.find({ courseId });

    // If reviews are found, fetch user names for each review
    if (reviews.length > 0) {
      const reviewsWithUserNames = await Promise.all(reviews.map(async (review) => {
        // Fetch user details using the userID in the review
        const user = await User.findById(review.userId);
        // Combine first name and last name to create full name
        const fullName = `${user.firstName} ${user.lastName}`;
        // Include user name in review object
        return {
          ...review.toObject(), // Convert Mongoose document to plain JavaScript object
          userName: fullName // Add userName field with full name
        };
      }));

      // Return reviews with user names
      res.json(reviewsWithUserNames);
    } else {
      // If no reviews found, return an empty array
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching reviews with user names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
