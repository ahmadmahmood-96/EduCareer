const express = require('express');
const ModuleModel = require('../models/module');
const CoursesModel = require('../models/course');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = './modules';
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

// Add Data
router.post("/AddModule", upload.single("file"), async (req, res) => {
    console.log("Received request:", req.body);
    console.log("Received file:", req.file);
    try {
        console.log("Received request:", req.body);
        const course = await CoursesModel.findById(req.query.courseId);
  
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const courseId = course._id;
        const { title, description } = req.body;
        const file = req.file.filename;
        await ModuleModel.create({ courseId, title, file, description });
        res.send({ status: "ok" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// View Data
router.get("/api/ViewModule", async (req, res) => {
  try {
    const courseId = req.query.courseId;
    console.log('Received request for courseId:', courseId);

    if (!courseId) {
      return res.status(400).send("Course ID is required");
    }

    ModuleModel.find({ courseId: courseId }).then((data) => {
      console.log('Received data from database for courseId:', courseId, data);
      res.send({ status: "ok", data: data });
    }).catch((error) => {
      console.error('Error fetching data from the database:', error);
      res.status(500).send("Internal Server Error");
    });
  } catch (error) {
    console.error('Error in try-catch block:', error);
    res.status(500).send("Internal Server Error");
  }
});
// to delete the module content...
router.delete('/api/DeleteModule/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting module with ID:', id);

    const module = await ModuleModel.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'module not found' });
    }

    const fileName = module.file;
    const filePath = `./modules/${fileName}`;
    fs.unlinkSync(filePath);

    await ModuleModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'module and file deleted successfully' });
  } catch (error) {
    console.error('Error deleting module and file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// View 1st step for to view the data in the form
router.get("/api/ViewdetailModule/:Id", async (req, res) => {
  try {
    
    const Id = req.params.Id;
    console.log('Received request for Id:', Id);

    ModuleModel.findById(Id).then((data) => {
      console.log("Server Data Sent:", data);

      console.log("File:", data.file);
    

      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update form for update
router.put('/api/UpdateModule/:Id', upload.single('file'), async (req, res) => {
  try {
    const Id = req.params.Id;
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.file) {
      // A new file is uploaded, delete the previous file
      const existingModule = await ModuleModel.findById(Id);
      if (existingModule.file) {
        const filePath = `./modules/${existingModule.file}`;
        fs.unlinkSync(filePath);
      }

      updatedData.file = req.file.filename;
    }

    const updatedmodule = await ModuleModel.findByIdAndUpdate(Id, updatedData, { new: true });

    res.status(200).json({ data: updatedmodule });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
