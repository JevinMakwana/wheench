const { Router } = require("express");
const { tripModel } = require("../db");
const { userMiddlware } = require("../middleware/userMiddleware");

const hostRouter = Router();

// create a trip
hostRouter.post('/trip', userMiddlware,async (req, res) => {
    const userId = req.userId;
    const { 
        totalseats, 
        source, 
        destination, 
        takeofftime, 
        price, 
        car } = req.body;
    
    const creatTripRes = await tripModel.create({
        totalseats, 
        source, 
        destination, 
        takeofftime, 
        price, 
        car
    });
    const trips = await tripModel.find();
    console.log(trips, '<-----');

    return res.json({
        creatTripRes
    })
})

hostRouter.get('/trip', async (req, res) => {
    const trips = await tripModel.find({});

    return res.json({
        trips
    })
})

module.exports = {
    hostRouter
}