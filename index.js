require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { hostRouter } = require('./routes/host');
const { authRouter } = require('./routes/auth');
const { guestRouter } = require('./routes/guest');
const { tripRouter } = require('./routes/trip');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/host", hostRouter);
app.use("/api/v1/guest", guestRouter);
app.use("/api/v1/trips", tripRouter);

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to db successfully.");

    app.listen(5000);
    console.log('server started on port 5000')
}

main();