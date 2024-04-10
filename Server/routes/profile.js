const router = require('express').Router();
const ProfileModel = require('../models/profile');
const { User } = require('../models/user');
const multer = require('multer'); 
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = './profilepictures';
    console.log('Destination Path:', destinationPath);
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + file.originalname;
    console.log('File Path:', filename);
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error('Only images with the following extensions are allowed: jpeg, jpg, png.'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Display user details based on the provided token
router.get(`/user-details/user/:userId/get-details`, async (req, res) => {
  try {
    // Assuming the user ID is stored in req.user.id after authentication middleware
    const userId = req.params.userId; // Corrected variable name
    console.log(userId);

    const user = await User.findById(userId, 'firstName lastName');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// setprofile in db
router.post('/setprofile', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      biography,
    } = req.body;

    // Check if the user already has a profile
    const existingProfile = await ProfileModel.findOne({ userId: user._id });

    if (existingProfile) {
      // If a profile exists, update it
      existingProfile.firstName = firstName;
      existingProfile.lastName = lastName;
      existingProfile.dateOfBirth = dateOfBirth;
      existingProfile.gender = gender;
      existingProfile.contactNumber = contactNumber;
      existingProfile.biography = biography;

      // Check if a new profile picture is provided
      if (req.file) {
        existingProfile.profilePicture = req.file.filename; // Store filename instead of buffer
      }

      await existingProfile.save();

      // Update the user model with the new first and last name
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();

      res.status(200).json({ message: 'Profile and User updated successfully' });
    } else {
      // If no profile exists, create a new one
      const newProfile = new ProfileModel({
        userId: user._id,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        biography,
        profilePicture: req.file ? req.file.filename : null,
      });

      await newProfile.save();

      // Update the user model with the new first and last name
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();

      res.status(201).json({ message: 'Profile and User created successfully' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Fetch user profile details
router.get(`/setprofile/user/:userId`, async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await ProfileModel.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user profile picture
router.get(`/setprofile/user/:userId/profile-picture`, async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await ProfileModel.findOne({ userId });

    if (!profile || !profile.profilePicture) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    const imagePath = `./profilepictures/${profile.profilePicture}`;
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get user details for side bar
router.get(`/user/:userId/user-details`, async (req, res) => {
  try {
    // Assuming the user ID is stored in req.user.id after authentication middleware
    const userId = req.params.userId; // Corrected variable name
    console.log(userId);

    const user = await User.findById(userId, 'firstName lastName email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ firstName: user.firstName, lastName: user.lastName, email:user.email});
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
