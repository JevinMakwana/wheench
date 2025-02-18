const { Router } = require("express");
const { userMiddlware } = require("../middleware/userMiddleware");
const { userModel, tripModel } = require("../db");

const userRouter = Router();

userRouter.get('/my-info', userMiddlware, async (req, res) => {
    console.log('/my-info got triggered');
    const userId = req.userId;
    try {
        const user = await userModel.findById({ _id: userId }).select('-password').populate('hostingTripId');
        if (!user) {
            return res.status(404).json({ 
                statusText: "fail", 
                message: "User not found" 
            });
        }
        return res.json({
            statusText: "success",
            data: user
        })
    } catch (error) {
        return res.status(500).json({ 
            statusText: "fail", 
            message: "Server error" 
        });
    }
});

module.exports = {
    userRouter
}