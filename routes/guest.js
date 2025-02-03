const { Router } = require("express");
const { userMiddlware } = require("../middleware/userMiddleware");
const { tripModel, userModel } = require("../db");
const { default: mongoose } = require("mongoose");

const guestRouter = Router();

// book a seat
guestRouter.post('/book', userMiddlware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        const { tripId } = req.body;
        
        if (!tripId) {
            return res.status(400).json({ success: false, message: "Trip ID is required" });
        }

        // Fetch the trip details
        const trip = await tripModel.findById(tripId);
        
        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        // Check if the trip is still live
        if (!trip.live) {
            return res.status(400).json({ success: false, message: "This trip is no longer available" });
        }

        // Calculate available seats
        const availableSeats = trip.totalseats - trip.guestIds.length;

        if (availableSeats < 1) {
            return res.status(400).json({ success: false, message: "No available seats" });
        }

        // Check if user has already booked this trip
        if (trip.guestIds.includes(userId)) {
            return res.status(400).json({ success: false, message: "User has already booked a seat on this trip" });
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
            success: true,
            message: "Seat booked successfully",
            trip
        });
    } catch (error) {
        console.error("Error booking seat:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = {
    guestRouter
}