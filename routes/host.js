const { Router } = require("express");
const { tripModel, userModel } = require("../db");
const { userMiddlware } = require("../middleware/userMiddleware");

const hostRouter = Router();

// create a trip
hostRouter.post('/trip', userMiddlware, async (req, res) => {
    const userId = req.userId;
    const user = await userModel.findById({ _id: userId });
    console.log(user, "<-----user fond is");
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(user, "<-----user found");

    /** Check if the current user has already hosted a trip */
    if (user.hostingTripId) {
        return res.status(400).json({
            success: false,
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
    // const trips = await tripModel.find();

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { hostingTripId: creatTripRes._id },
        { new: true }
    );

    return res.json({
        success: true,
        trip: creatTripRes,
        user: updatedUser
    })
});


// complete a trip
hostRouter.post('/trip/complete', userMiddlware, async (req, res) => {
    const userId = req.userId;
    const user = await userModel.findById({ _id: userId });
    console.log(user, "<-----user fond is");
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(user, "<-----user found");

    if (!user.hostingTripId) {
        return res.status(400).json({
            errro: "Bad request: there's none trip to be completed"
        })
    };

    const updatedTrip = await tripModel.findByIdAndUpdate(
        user.hostingTripId,
        { live: false }
    );

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { hostingTripId: null }
    );

    return res.json({
        success: true,
        message: "Congrats on completing the trip!",
        user: updatedUser
    })

});

module.exports = {
    hostRouter
};