import { Request, Response, Router } from "express";
import { AuthRequest, userMiddleware } from "../middleware/userMiddleware";
import { tripModel, userModel } from "../db";

const userRouter = Router();

// interface AuthRequest extends Request {
//     userId?: string;
// }

userRouter.get('/my-info', userMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    console.log('/my-info got triggered');
    const userId = req.userId;

    try {
        const user = await userModel
            .findById(userId)
            .select('-password')
            .populate('hostingTripId');

        if (!user) {
            return res.status(404).json({
                statusText: "fail",
                message: "User not found"
            });
        }

        return res.json({
            statusText: "success",
            data: user
        });

    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({
            statusText: "fail",
            message: "Server error"
        });
    }
});

export { userRouter };