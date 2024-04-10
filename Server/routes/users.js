const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const InstructorQuizModel = require('../models/InstructorQuiz');
const ConversationModel = require("../models/conversation");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const { email, accountType } = req.body;

		let user = await User.findOne({ email, accountType });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ data: { token, userId: user._id , accountType: user.accountType}, message: "An Email sent to your account please verify" });

	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// users.js
router.get("/:id/verify/:token/", async (req, res) => {
	try {
	  console.log("Verification Request:", req.params);
  
	  const user = await User.findOne({ _id: req.params.id });
	  console.log("Found User:", user);
  
	  const token = await Token.findOneAndDelete({
		userId: user._id,
		token: req.params.token,
	  });
	  console.log("Found Token:", token);
  
	  await User.updateOne({ _id: user._id }, { verified: true });
  
	  res.status(200).send({data: { userId: user._id , accountType: user.accountType}, message: "Email verified successfully" });
	} catch (error) {
	  console.log("Verification Error:", error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
 

// endpoint to save quiz score
router.post('/submit-quiz-score', async (req, res) => {
  try {
    const { userId, score } = req.body;

    // Create a new instance of the InstructorQuizModel
    const quizScore = new InstructorQuizModel({
      userId,
      score,
      date: new Date(),
    });

    // Save the quiz score to the database
    await quizScore.save();

    res.status(201).json({ message: 'Quiz score saved successfully' });
  } catch (error) {
    console.error('Error saving quiz score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to fetch user's score
router.get('/score/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await InstructorQuizModel.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User score not found' });
        }
        const score = user.score; // Assuming the score is stored in the 'score' field
        res.status(200).json({ score });
    } catch (error) {
        console.error('Error fetching user score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


  router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const userData = await Promise.all(users.map(async (user) => {
            return { user: { email: user.email, firstname: user.firstName, lastName:user.lastName }, userId: user._id }
        }));
        res.status(200).json(userData);
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    
    // Find conversations where the user is a member
    const conversations = await ConversationModel.find({ members: userId });

    // Extract user IDs of the other participants in these conversations
    const otherUserIds = conversations.flatMap(conversation => conversation.members.filter(memberId => memberId.toString() !== userId));

    // Fetch users excluding the specified user
    const users = await User.find({ _id: { $nin: [userId, ...otherUserIds] } });

    // Format user data
    const userData = users.map(user => ({
      user: {
        email: user.email,
        firstname: user.firstName,
        lastName: user.lastName
      },
      userId: user._id
    }));

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;