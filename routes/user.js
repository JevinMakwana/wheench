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
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(user, '<-----my-info');
        return res.json({
            user
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = {
    userRouter
}