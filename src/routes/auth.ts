import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../db";
import { signup } from "../common/signup";
import { JWT_USER_SECRET } from "../config";
import { Types } from "mongoose";

const authRouter = Router();

interface User {
    _id:Types.ObjectId;
    email: string;
    password:string;
    username: string;
    gender: string;
    phone: string;
    hostingTripId: string;
    attendingTripId: string;
}

authRouter.post('/signup', async (req:Request, res:Response):Promise<any> => {
    const signupResponse = await signup(req);
    if (signupResponse.statusText !== 'success') {
        return res.status(403).json({
            statusText: "fail",
            message: signupResponse.message || "Validation failed. Please correct the input data.",
            error: signupResponse.error || ""
        });
    }
    return res.json({
                statusText: "success",
        message: signupResponse.message,
        data: signupResponse.data
    });
});

authRouter.post("/signin", async (req:Request, res:Response):Promise<any> => {
    const { email, password } = req.body;

    const user:User|null = await userModel.findOne({ email });

    if (!user) {
        console.log("User not found.");
        return res.status(404).json({
            statusText: "fail",
            message: "User not found.",
        });
    }

    const passwordCheck = await bcrypt.compare(password, user?.password);

    if (passwordCheck) {
        const token = jwt.sign({ id: user._id.toString() }, JWT_USER_SECRET);

        console.log("Generated Token:", token);
        return res.json({
            statusText: "success",
            data: { token, user },
        });
    } else {
        return res.status(403).json({
            statusText: "fail",
            message: "Incorrect credentials",
        });
    }
});

export { authRouter };
