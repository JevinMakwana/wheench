require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose"); 

const { hostRouter } = require('./routes/host');
const { authRouter } = require('./routes/auth');


const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/host", hostRouter)

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL); 
    console.log("Connected to db successfully.");
    
    app.listen(3000);
    console.log('server started on port 3000')
}

main();