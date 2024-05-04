const express = require('express');
const router = express.Router();
const SupportModel = require('../models/support');
const path = require('path'); 
const multer = require('multer');
const { User, validate } = require("../models/user");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = './SupportFiles';
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

// Route to add support form data
router.post('/support/:userid', upload.single('file'), async (req, res) => {
  try {
    //console.log("hitteddddddd meeeeee");
    // Log the received file
    if (req.file) {
      console.log("Received File:", req.file);
    } else {
      console.log("No file received.");
    }

    const userId = req.params.userid
    const { subject, description } = req.body;
    
    // Create a new support document
    const supportData = new SupportModel({
      userId,
      subject,
      description,
      attachment: req.file ? req.file.filename : null,
    });

    // Save the support data to the database
    const savedSupport = await supportData.save();

    // Respond with success message and saved document
    res.status(201).json({ message: 'Support form data saved successfully', support: savedSupport });
  } catch (error) {
    // Respond with error message if an error occurs
    res.status(500).json({ error: error.message });
  }
});


router.get("/support-detail", async (req, res) => {
  try {
    console.log("heyyyyyyyyy");
    // Fetch support details
    const supportDetails = await SupportModel.find();
   // console.log(supportDetails);

    // Initialize an array to store updated support details with user details
    const supportDetailsWithUser = [];

    // Loop through each support detail
    for (const support of supportDetails) {
      // Fetch user details for the userId associated with the support detail
      const user = await User.findById(support.userId);
    //  console.log("demooo demooo support",support);
      // If user exists, add user details to the support detail
      if (user) {
        supportDetailsWithUser.push({
          supportDetail: support,
          userDetail: {
            email: user.email,
            name: user.firstName,
            accountType: user.accountType
          }
        });
      }
    }
//console.log("this is support detail",supportDetailsWithUser);
    // Send the updated support details with user details in the response
    return res.status(200).json(supportDetailsWithUser);
  } catch (error) {
    console.error("Error fetching support details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;


