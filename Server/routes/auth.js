const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email , accountType: req.body.accountType });
		if (!user)
			return res.status(401).send({ message: "Invalid Email, Password or Account type" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email, Password or Account type" });

//if user is not verified already only then send verification link to his email during login
 //bcz maybe he didnot open the ver. link during signup
 //so we let him verify again if he didnot verify during signup

         if (!user.verified) {
		  let token = await TokenModel.findOne({ userId: user._id });
          console.log(token);
	//maybe that token is expired(deleted) when we first sent him ver. link. So thats why we create new token for this user again
		  if (!token) {
			  token = await new TokenModel({
				  userId: user._id,
				  token: crypto.randomBytes(32).toString("hex"),
			  }).save();

			  const url = `${process.env.BASE_URL}users/${token.userId}/verify/${token.token}`;
			  await sendEmail(user.email, "Verify Email", url);
		  }
		  return res
			  .status(400)
			  .send({ message: "Email sent to your account. Please verify to login" });
	  }

//After a user logs in, you might generate a token containing the user's information, including their user ID.
//token is then sent to the client and included in the headers of subsequent requests.
		const token = user.generateAuthToken();
		//Send user id with the token
		res.status(200).send({ data: { token, userId: user._id , accountType: user.accountType}, message: "logged in successfully" });
		//res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		console.error(error); 
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
		accountType: Joi.string().valid('student', 'instructor').required().label("Account Type"),
	});
	return schema.validate(data);
};

// router.get("/user/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         // Return user-specific data
//         res.status(200).send({ user });
//     } catch (error) {
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });

module.exports = router;