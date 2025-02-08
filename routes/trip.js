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

tripRouter.get("/:tripId", async (req, res) => {
    const { tripId } = req.params;

    try {
        const trip = await tripModel.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        return res.json(trip);
    } catch (error) {
        return res.status(500).json({ error: "Invalid trip ID or server error" });
    }
});


module.exports = {
    tripRouter
}