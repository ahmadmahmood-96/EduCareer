const router = require("express").Router();
const CoursesModel = require('../models/course');
const ModuleModel = require('../models/module');

// Get course details by courseId
router.get('/accesscontent/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        console.log(courseId);

        if (!courseId) {
            // Handle the case where courseId is null
            return res.status(400).json({ error: 'courseId cannot be null' });
        }

        const courseDetails = await CoursesModel.findById(courseId);

        if (!courseDetails) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(courseDetails);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/modules/:accesscontent', async (req, res) => {
    try {
      const courseId = req.params.courseId;
      console.log(courseId);
  
      if (!courseId) {
        return res.status(400).json({ error: 'courseId cannot be null' });
      }
  
      const modules = await ModuleModel.find({ courseId });
  
      if (!modules) {
        return res.status(404).json({ error: 'Modules not found for the given course' });
      }
  
      res.json(modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


module.exports = router;
