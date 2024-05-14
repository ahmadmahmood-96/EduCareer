const mongoose = require('mongoose');
const ratingReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  courseRating: { type: Number, required: true },
  courseReview: { type: String },
  instructorRating: { type: Number, required: true },
  instructorReview: { type: String }
});

const RatingReviewModel = mongoose.model('RatingReview', ratingReviewSchema);
module.exports = RatingReviewModel;
