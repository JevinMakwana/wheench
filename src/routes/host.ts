import { Response, Router } from "express";
import { AuthRequest, userMiddleware } from "../middleware/userMiddleware";
import { tripModel, userModel } from "../db";

const hostRouter = Router();

// create a trip
hostRouter.post('/trip', userMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
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
        data: {
            trip: creatTripRes,
            user: updatedUser
        }
    })
});

// complete a trip
hostRouter.post('/trip/complete', userMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    const hostId = req.userId;
    const host = await userModel.findById(hostId).populate('hostingTripId');
    if (!host) return res.status(404).json({ statusText: "fail", message: "User not found" });
    if (!host.hostingTripId) return res.status(400).json({ statusText: "fail", message: "Bad request: no trip to complete" });

    const trip: any = host.hostingTripId;
    const guestIds = trip?.guestIds || [];

    // Bulk guest update (1 call)
    await userModel.updateMany(
        { _id: { $in: guestIds } },
        { $set: { attendingTripId: null } }
    );

    // Parallel updates (2 concurrent calls)
    await Promise.all([
        tripModel.findByIdAndUpdate(trip._id, { live: false }),
        userModel.findByIdAndUpdate(hostId, { hostingTripId: null })
    ]);

    return res.json({
        success: true,
        message: "Congrats on completing the trip!",
        user: await userModel.findById(hostId).select('-password')
    });
});

export {
    hostRouter
};