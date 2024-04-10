const router = require("express").Router();
const path = require('path'); 
const { User, validate } = require("../models/user");
const CoursesModel = require('../models/course');
const AssModel = require('../models/Assignmnet');
const QuizModel = require('../models/Quiz');
const ModuleModel = require('../models/module');
const EnrollmentModel = require('../models/enrollment');
const MeetingModel = require('../models/meeting');
const SubmittedAssignmentModel = require('../models/SubmittedAssignment');

const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = './Courses';
        console.log('Destination Path:', destinationPath);
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + file.originalname;
        console.log('File Path:', filename);
        cb(null, filename);
    }
});

  
const upload = multer({ storage: storage });
// Create a new course
router.post("/createcourses", upload.single('file'), async (req, res) => {
  try {
    console.log('Received request to create a course', req.body.userId);
    const user = await User.findById(req.body.userId);
    console.log(req.body.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    } 
// Create course with additional details
    const courseDetails = {
      userId: user._id, 
      title: req.body.title,
      description: req.body.description,
      criteria: req.body.criteria,
      instructor: `${user.firstName} ${user.lastName}`,
      duration: req.body.duration,
      category: req.body.category,
      preRequisite: req.body.preRequisite,
      categorypaid: req.body.categorypaid,
      price: req.body.price,
      // capacity: req.body.capacity,
      file:req.file.filename,
    };

    const course = await CoursesModel.create(courseDetails);

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ error: "Failed to create course", details: error.message });
  }
});
router.get('/displaycourses', async (req, res) => {
  try {
    console.log('Request Headers:', req.headers);
    // Retrieve the user ID from the headers
    const userId = req.headers.authorization.split(' ')[1]; 

    console.log('Received request for courses for user ID:', userId);
    const courses = await CoursesModel.find({ userId });
    console.log('Sending courses:', courses);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/updatecourses/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const course = await CoursesModel.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  router.put('/updatecourses/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const updatedCourse = await CoursesModel.findByIdAndUpdate(
        { _id: id },
        {
          title: req.body.title,
          description: req.body.description,
          criteria: req.body.criteria,
          instructor: req.body.instructor,
          duration: req.body.duration,
          category: req.body.category,
          preRequisite: req.body.preRequisite,
          categorypaid: req.body.categorypaid,
          price: req.body.price,
          capacity: req.body.capacity,
        },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/deletecourses/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        // Find users enrolled in the course
        const usersEnrolled = await User.find({ enrolledCourses: courseId });

        // Update each user to remove the course from enrolledCourses array
        await Promise.all(usersEnrolled.map(async (user) => {
            user.enrolledCourses.pull(courseId);
            await user.save();
        }));

        // Delete the course
        const deletedCourse = await CoursesModel.findByIdAndDelete(courseId);
        
        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Delete related documents
        await AssModel.deleteMany({ courseId: courseId });
        await QuizModel.deleteMany({ courseId: courseId });
        await ModuleModel.deleteMany({ courseId: courseId });
        await EnrollmentModel.deleteMany({ courseId: courseId });
        await MeetingModel.deleteMany({ courseId: courseId });
        await SubmittedAssignmentModel.deleteMany({ courseId: courseId });

        res.json({ message: 'Course and related documents deleted successfully' });
    } catch (error) {
        console.error('Error deleting course and related documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
  // router.delete('/deletecourses/:id', (req, res) => {
  //   const id = req.params.id;
  
  //   CoursesModel.findByIdAndDelete(id)
  //     .then(deletedCourse => {
  //       if (!deletedCourse) {
  //         return res.status(404).json({ error: 'Course not found' });
  //       }
  //       res.json({ message: 'Course deleted successfully' });
  //     })
  //     .catch(err => res.status(500).json({ error: err.message }));
  // });


  
  router.get('/searchcourses', async (req, res) => {
    try {
      const searchTerm = req.query.searchTerm;
      console.log('Search Term:', searchTerm);
  
      const searchRegex = new RegExp(searchTerm, 'i');
  
      const courses = await CoursesModel.find({
        $or: [
          { title: searchRegex },
          { category: searchRegex },
          { instructor: searchRegex },
        ],
      });
  
      console.log('Search Result:', courses);
  
      res.json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  // Route to fetch courses based on the selected category
  router.get('/courses/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
    
      // Query the database to get courses based on the category
      const courses = await CoursesModel.find({ category: category });
    
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/courses/:courseId/image', async (req, res) => {
    
    try {
      const { courseId } = req.params;
      
      const course = await CoursesModel.findById(courseId);
  
      const filename = course.file;

      if (!filename) {
        return res.status(404).send('Image not found for this course');
      }
      
      const imagePath = `./Courses/${filename}`;
      res.sendFile(imagePath, { root: process.cwd() });
    }
    catch (error) {
      console.error('Error fetching course image:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  //display all courses
  router.get('/courses', async (req, res) => {
    try {
      // Query the database to get all courses
      const courses = await CoursesModel.find();
    
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

  module.exports = router;