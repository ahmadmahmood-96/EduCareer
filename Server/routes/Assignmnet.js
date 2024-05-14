const express = require('express');
const AssModel = require('../models/Assignmnet');
const CoursesModel = require('../models/course');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = './files';
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

const router = express.Router();

// Route to store data in the database
router.post("/api/Upload", upload.single("file"), async (req, res) => {
    try {
      // Multer middleware has processed the file, and it's available at req.file
  
      const course = await CoursesModel.findById(req.query.courseId);
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const courseId = course._id;
      const { title, description, dueDate } = req.body;
      const file = req.file.filename;
      
  
      // Check if the dueDate is a valid date
      // if (isNaN(parsedDueDate)) {
      //   return res.status(400).send({ status: "error", message: "Invalid dueDate format" });
      // }
  
      await AssModel.create({ courseId, title, file, dueDate, description });
      res.send({ status: "ok" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
    //route to view the data..
    router.get("/api/View", async (req, res) => {
        try {
          const courseId = req.query.courseId;
      
          if (!courseId) {
            return res.status(400).send("Course ID is required");
          }
      
          // Assuming AssModel has a field named 'courseId'
          AssModel.find({ courseId: courseId }).then((data) => {
            res.send({ status: "ok", data: data });
          });
        } catch (error) {
          console.error("Server error:", error);
          res.status(500).send("Internal Server Error");
        }
      });
      //to update first show it in the form...
      router.get("/api/Viewdetail/:Id", async (req, res) => {
        try {
          
          const Id = req.params.Id;
          console.log('Received request for Id:', Id);
      
          AssModel.findById(Id).then((data) => {
            console.log("Server Data Sent:", data);

            console.log("File:", data.file);
          

            res.send({ status: "ok", data: data });
          });
        } catch (error) {
          console.error("Server error:", error);
          res.status(500).send("Internal Server Error");
        }
      });
      router.put('/api/UpdateAssignment/:Id', upload.single('file'), async (req, res) => {
        try {
          const Id = req.params.Id;
          const updatedData = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
          };
      
          if (req.file) {
            // A new file is uploaded, delete the previous file
            const existingAssignment = await AssModel.findById(Id);
            if (existingAssignment.file) {
              const filePath = `./files/${existingAssignment.file}`;
              fs.unlinkSync(filePath);
            }
      
            updatedData.file = req.file.filename;
          }
      
          const updatedAssignment = await AssModel.findByIdAndUpdate(Id, updatedData, { new: true });
      
          res.status(200).json({ data: updatedAssignment });
        } catch (error) {
          console.error('Error updating assignment:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      });
     
      router.delete('/api/deleteAss/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const assignment = await AssModel.findById(id);
          if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
          }
          const fileName = assignment.file;
          const filePath = `./files/${fileName}`; 
          fs.unlinkSync(filePath);
          await AssModel.findByIdAndDelete(id);
          res.status(200).json({ message: 'Assignment and file deleted successfully' });
        } catch (error) {
          console.error('Error deleting assignment and file:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      });
      module.exports = router;