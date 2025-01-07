const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { userModel } = require("../db");
const { signup } = require("../common/signup");
const { JWT_USER_SECRET } = require("../config");
// const { userMiddlware } = require("../middleware/user");

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const signupResponse = await signup(req, userModel);
    if (signupResponse.status != 201) {
        return res.json({
            message: signupResponse.errorMessage,
            error: signupResponse.error ? signupResponse.error : ""
        })
    }
    return res.json({
        message: signupResponse.successMessage
    })
});

authRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        console.log("User not found.")
        return res.status(403).json({
            message: "User not found.",
        });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (passwordCheck) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_SECRET);

        console.log('generated Token:', token);

        return res.json({
            token
        });

    } else {
        return res.status(403).json({
            message: "Incorrect credentials",
        })
    }
});

module.exports = {
    authRouter
}