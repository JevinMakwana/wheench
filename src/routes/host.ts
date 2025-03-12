import { Response, Router } from "express";
import { AuthRequest, userMiddleware } from "../middleware/userMiddleware";
import { tripModel, userModel } from "../db";

const hostRouter = Router();

// create a trip
hostRouter.post('/trip', userMiddleware, async (req:AuthRequest, res:Response):Promise<any> => {
    const userId = req.userId;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
        return res.status(404).json({ 
            statusText: "fail", 
            message: "User not found" 
        });
    }

    /** Check if the current user has already hosted a trip */
    if (user.hostingTripId) {
        return res.status(400).json({
            statusText: "fail",
            message: "User is already hosting a trip"
        });
    }

    const {
        totalseats,
        source,
        destination,
        takeofftime,
        price,
        car } = req.body;

    const creatTripRes = await tripModel.create({
        hostId: userId,
        totalseats,
        source,
        destination,
        takeofftime,
        price,
        car
    });

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { hostingTripId: creatTripRes._id },
        { new: true }
    ).select('-password');

    return res.json({
        statusText: "success",
        message: "Congrats! Your trip is live now.",
        data:{
            trip: creatTripRes,
            user: updatedUser
        }
    })
});

// complete a trip
hostRouter.post('/trip/complete', userMiddlware, async (req:AuthRequest, res:Response):Promise<any> => {
    const userId = req.userId;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
        return res.status(404).json({ 
            statusText: "fail", 
            message: "User not found" 
        });
    }

    if (!user.hostingTripId) {
        return res.status(400).json({
            statusText: "fail",
            message: "Bad request: there's none trip to be completed."
        })
    };

    await tripModel.findByIdAndUpdate(
        user.hostingTripId,
        { live: false }
    );

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { hostingTripId: null }
    ).select('-password');

    return res.json({
        success: true,
        message: "Congrats on completing the trip!",
        user: updatedUser
    })

});

export {
    hostRouter
};