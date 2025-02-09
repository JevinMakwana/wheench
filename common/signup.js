const bcrypt = require("bcrypt"); // Assuming bcrypt is needed for password hashing
const { zodCheck } = require("../utils/formatchecker");

const signup = async (req, model) => {
    // Parse and validate the request body
    const formattedData = await zodCheck(req.body);

    if (!formattedData.success) {
        return {
            status: 400, 
            errorMessage: "Validation failed. Please correct the input data.",
            error: JSON.parse(formattedData.error.message)[0].message // Provide detailed validation error
        };
    }

    try {
        const { email, password, username, full_name, phone, gender } = req.body;

        // Check if email already exists
        const isEmailAlreadyExist = await model.findOne({ email });
        if (isEmailAlreadyExist) {
            return {
                status: 409,
                errorMessage: "User already exists. Please use a different email."
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

        console.log(newUser, '<<-------------newUser')

        return {
            status: 201,
            successMessage: "You have successfully signed up.",
            data: {
                id: newUser._id,
                email: newUser.email,
                full_name: newUser.full_name,
            }
        };
    } catch (error) {
        // Handle database or unexpected error
        if (error.code === 11000) { // Handle unique constraint violation for email
            return {
                status: 409,
                errorMessage: "Email is already registered. Please use a different email.",
                error
            };
        }

        return {
            status: 500,
            errorMessage: "Internal server error. Please try again later or contact support.",
            error: error.message // Include error details for debugging in dev environments
        };
    }
};

module.exports = {
    signup
};
