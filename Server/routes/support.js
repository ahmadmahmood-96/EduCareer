const express = require('express');
const router = express.Router();
const SupportModel = require('../models/support');
const path = require('path'); 
const fs = require("fs");
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
router.get("/files/:fileName", (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.resolve( "SupportFiles", fileName); // Use __dirname to get the current directory

   // console.log("fileeeeeeeeee", fileName);
    if (fs.existsSync(filePath)) {
      res.contentType('image/jpeg'); // Set the content type to JPEG, change this according to your file type
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).send("Internal server error");
  }
});



// Route to add support form data
router.post('/support/:userid', upload.single('file'), async (req, res) => {
  try {
    //console.log("hitteddddddd meeeeee");
    // Log the received file
    if (req.file) {
     // console.log("Received File:", req.file);
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

//admin get the user details and all the responses.
router.get("/support-detail", async (req, res) => {
  try {
    const supportDetails = await SupportModel.find();
    const supportDetailsWithUser = [];
    for (const support of supportDetails) {
      const user = await User.findById(support.userId);
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
    return res.status(200).json(supportDetailsWithUser);
  } catch (error) {
    console.error("Error fetching support details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Route to send response back for a support query
router.post('/support/:queryId/response', async (req, res) => {
  try {
    const queryId = req.params.queryId;
    const { response } = req.body;
    
    // Find the support document by query ID
    const supportQuery = await SupportModel.findById(queryId);
    
    // If the support document exists, update the response field
    if (supportQuery) {
      supportQuery.response = response;
      // Save the updated support document
      const updatedQuery = await supportQuery.save();
      return res.status(200).json({ message: 'Response sent successfully', query: updatedQuery });
    } else {
      return res.status(404).json({ message: 'Support query not found' });
    }
  } catch (error) {
    console.error("Error sending response:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get('/support-details/:userToken', async (req, res) => {
  try {
    
    const userToken = req.params.userToken;
  //  console.log("trigered",userToken);
    // Use the user token to query the database for support details
    const supportDetails = await SupportModel.find({ userId: userToken });
    res.json(supportDetails);
   // console.log(supportDetails);
  } catch (error) {
    console.error("Error fetching support details:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


