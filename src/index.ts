import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { hostRouter } from "./routes/host";
import { tripRouter } from "./routes/trip";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/host", hostRouter);
app.use("/api/v1/guest", guestRouter);
app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/user", userRouter);

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to db successfully.");

    app.listen(5000, () => {
        console.log("Server started on port 5000");
    });
};

main();
