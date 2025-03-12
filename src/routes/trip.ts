import { Request, Response, Router } from "express";
import { tripModel } from "../db.js";

const tripRouter = Router();

// Get all live trips with host details
tripRouter.get("/", async (req:Request, res:Response):Promise<any> => {
    try {
        // Fetch all live trips and populate host details
        const trips = await tripModel.find({
            live: true,
            $expr: { $gt: ["$totalseats", { $size: "$guestIds" }] }
        })
            .populate("hostInfo", "username full_name -_id") // Populate only necessary fields
            .lean(); // Converts result into plain JSON (faster)

        return res.status(200).json({
            statusText: "success",
            data: trips,
        });
    } catch (error:any) {
        console.error("Error fetching trips:", error.message);
        return res.status(500).json({
            statusText: "fail",
            message: "Internal Server Error",
        });
    }
});

tripRouter.get("/:tripId", async (req:Request, res:Response):Promise<any> => {
    const { tripId } = req.params;

    try {
        const trip = await tripModel
            .findById(tripId)
            .populate("hostInfo", "username full_name -_id")
            .populate("guestIds", "username full_name")
            .lean();

        if (!trip) {
            return res.status(404).json({
                statusText: "fail",
                message: "Trip not found.",
            });
        }

        return res.json({
            statusText: "success",
            data: trip,
        });
    } catch (error) {
        return res.status(500).json({
            statusText: "fail",
            message: "Invalid trip ID or server error.",
        });
    }
});

export { tripRouter };
