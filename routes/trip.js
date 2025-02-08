const { Router } = require("express");
const { tripModel } = require("../db");

const tripRouter = Router();

// get all live-trips
tripRouter.get('', async (req, res) => {
    console.log('got trips request')
    const trips = await tripModel.find({ live: true });
    return res.json({
        trips
    })
});

module.exports = {
    tripRouter
}