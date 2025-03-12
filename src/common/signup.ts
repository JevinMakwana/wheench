import bcrypt from "bcrypt"; // Assuming bcrypt is needed for password hashing
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config.js";
import { zodCheck } from "../utils/formatchecker.js";
import { userModel } from "../db.js";


const signup = async (req:any):Promise<any> => {
    // Parse and validate the request body
    const formattedData = await zodCheck(req.body);

    if (!formattedData.success) {
        return {
            statusText: "fail",
            message: JSON.parse(formattedData.error.message)[0].message, // Provide detailed validation error
        };
    }

    try {
        const { email, password, username, full_name, phone, gender } = req.body as any;

        // Check if email already exists
        const isEmailAlreadyExist = await userModel.findOne({ email });
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
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            username,
            full_name,
            phone,
            gender
        });

        const userData = newUser.toObject();
        delete userData.password; // Manually remove password

        const token = jwt.sign({ id: userData._id.toString() }, JWT_USER_SECRET);

        return {
            statusText: "success",
            message: "You have successfully signed up.",
            data: {
                token,
                user: userData
            }
        };
    } catch (error:any) {
        return {
            statusText: "fail",
            message: "Internal server error. Please try again later or contact support.",
            error: error.message || "" // Include error details for debugging in dev environments
        };
    }
};

export { signup };
