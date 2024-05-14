const router = require("express").Router();
const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Route for handling Admin login requests
router.post("/login-detail", async (req, res) => {
   
    console.log("demo demo");
   try {
		const { error } = validate(req.body);
    const { email, password } = req.body;
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await adminModel.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email " });

    if (password !== user.password) {
            return res.status(401).json({ message: "Invalid password" });
          }

    const token = user.generateAuthToken();
    console.log("tokennn",token);
		//Send user id with the token
		res.status(200).send({ data: { token, userId: user._id }, message: "logged in successfully" });
	} catch (error) {
		console.error(error); 
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
		//accountType: Joi.string().valid('student', 'instructor').required().label("Account Type"),
	});
	return schema.validate(data);
};

router.get("/admin/:userId", async (req, res) => {
	try {
	  const userId = req.params.userId;
	  
	  // Fetch user details from the database
	  const user = await adminModel.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
	  return res.status(200).json(user.name);
	} catch (error) {
	  console.error("Error fetching user details:", error);
	  return res.status(500).json({ message: "Internal server error" });
	}
  });
module.exports = router;
