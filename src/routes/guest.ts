import { Router } from "express";
import { userMiddleware } from "../middleware/userMiddleware";
import { tripModel, userModel } from "../db";
import mongoose from "mongoose";

const guestRouter = Router();

// book a seat
guestRouter.post('/book', userMiddleware, async (req:any, res:any) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                statusText: "fail", 
                message: "User not found" 
            });
        }
        
        const { tripId } = req.body;
        
        if (!tripId) {
            return res.status(400).json({ 
                statusText: "fail", 
                message: "Trip ID is required" 
            });
        }

        // Fetch the trip details
        const trip:any = await tripModel.findById(tripId);
        
        if (!trip) {
            return res.status(404).json({ 
                statusText: "fail", 
                message: "Trip not found" 
            });
        }

        // Check if the trip is still live
        if (!trip.live) {
            return res.status(400).json({ 
                statusText: "fail", 
                message: "This trip is no longer available" 
            });
        }

        // Calculate available seats
        const availableSeats = trip.totalseats - trip.guestIds.length;

        if (availableSeats < 1) {
            return res.status(400).json({ 
                statusText: "fail", 
                message: "No available seats" 
            });
        }

        // Check if user has already booked this trip
        if (trip.guestIds.includes(userId)) {
            return res.status(400).json({ 
                statusText: "fail", 
                message: "User has already booked a seat on this trip" 
            });
        }

        // Update the status of guest by updating attendingTripId
        await userModel.findByIdAndUpdate(
            userId,
            { attendingTripId:[ new mongoose.Types.ObjectId(tripId) ] }
        )
        // Add the user to the guest list
        trip.guestIds.push(userId);
        await trip.save();

        return res.status(200).json({
            statusText: "success",
            message: "Seat booked successfully",
            data: trip
        });
    } catch (error:any) {
        console.error("Error booking seat:", error);
        return res.status(500).json({
            statusText: "fail",
            message: "Internal server error",
            error: error.message
        });
    }
});

export {
    guestRouter
}