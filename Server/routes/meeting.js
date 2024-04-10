const router = require("express").Router();
const {MeetingModel} = require("../models/meeting");
const { User } = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// Route to schedule a meeting
router.post('/schedule-meeting', async (req, res) => {
    // Extract meeting details from request body
    const { courseId, meetingTitle, date, timing, meetingLink } = req.body;
    try {
      // Find users who have the provided courseId in their enrolledCourses array
      const users = await User.find({ enrolledCourses: courseId });

      // Extract email of each user
      const userEmails = users.map(user => user.email);
      // console.log({ userEmails });
        // Compose email content
        const emailContent = `You have a Meeting scheduled for ${date} at ${timing}. Join using the following link: ${meetingLink}`;

        // Send email to enrolled students
        for (const email of userEmails) {
            await sendEmail(email, 'Meeting Invitation', emailContent);
        }

        res.send('Meeting scheduled successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


// router.post('/meetings', async (req, res) => {
//     console.log("Aproachedddddd")
//     try {
//         // Extract meeting data from the request body
//         const { meetingTitle, meetingDate, meetingTime, courseId } = req.body;

//         // Create a new meeting document in the database
//         const newMeeting = await MeetingModel.create({
//             meetingTitle,
//             meetingDate,
//             meetingTime,
//             courseId
//         });

//         // Respond with the newly created meeting data
//         res.status(201).json(newMeeting);
//     } catch (error) {
//         console.error("Error scheduling meeting:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// router.get("/meetingDetail/:courseId", async (req, res) => {
//     try {
      
//       const courseId = req.params.Id;
//     //   console.log('Received request for cOURSEiD:', courseId);
  
//       MeetingModel.find(courseId).then((data) => {
//       //  console.log("Server Data Sent:", data);
//         res.send({ status: "ok", data: data });
//       });
//     } catch (error) {
//       console.error("Server error:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

module.exports = router;
