const bcrypt = require("bcrypt"); // Assuming bcrypt is needed for password hashing
const { zodCheck } = require("../utils/formatchecker");
const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require("../config");

const signup = async (req, model) => {
    // Parse and validate the request body
    const formattedData = await zodCheck(req.body);

    if (!formattedData.success) {
        return {
            statusText: "fail",
            message: JSON.parse(formattedData.error.message)[0].message, // Provide detailed validation error
        };
    }

    try {
        const { email, password, username, full_name, phone, gender } = req.body;

        // Check if email already exists
        const isEmailAlreadyExist = await model.findOne({ email });
        if (isEmailAlreadyExist) {
            return {
                status: 409,
                statusText: "fail",
                message: "User already exists. Please use a different email."
            };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user in the database
        const newUser = await model.create({
            email,
            password: hashedPassword,
            username,
            full_name,
            phone,
            gender
        });
        const userData = newUser.toObject();
        delete userData.password; // Manually remove password

        const token = jwt.sign({
            id: userData._id.toString()
        }, JWT_USER_SECRET);

        return {
            statusText: "success",
            message: "You have successfully signed up.",
            data: {
                token,
                user: userData
            }
        };
    } catch (error) {
        return {
            statusText: "fail",
            message: "Internal server error. Please try again later or contact support.",
            error: error.message ?? "" // Include error details for debugging in dev environments
        };
    }
};

module.exports = {
    signup
};
