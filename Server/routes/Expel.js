
const router = require('express').Router();
const EnrollmentModel = require('../models/enrollment');
const { User, validate } = require("../models/user");
const CoursesModel = require('../models/course');

router.delete('/:studentId/enrolled-students', async (req, res) => {
  try {
      const studentId = req.params.studentId;

      if (!studentId) {
          return res.status(400).json({ error: 'Student ID cannot be null' });
      }

      // Find the enrollment record of the student
      const enrollment = await EnrollmentModel.findOneAndDelete({ 'userId': studentId }).exec();

      if (!enrollment) {
          return res.status(404).json({ error: 'Enrollment not found' });
      }

      // Retrieve the courseId from the enrollment
      const courseId = enrollment.courseId;

      // Find the user using their ID
      const user = await User.findById(studentId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update the user to remove the student from enrolledCourses array for the specific courseId
      user.enrolledCourses.pull(courseId);
      await user.save();

      res.json({ message: 'Student expelled successfully' });
  } catch (error) {
      console.error('Error expelling student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  module.exports = router;
