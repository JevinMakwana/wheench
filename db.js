const mongoose = require("mongoose");
const { boolean } = require("zod");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const userSchema = new Schema({
    email: { type: String, unique: false, match: /.+\@.+\..+/ },
    password: String,
    username: { type: String, unique: true, required: true },
    full_name: String,
    gender: {
        type: String,
        enum: [ "male", "female", "other"],
        required: true,
    },
    phone: { type: String, unique: true, required: true },
    hostingTripId: {
        type: Schema.Types.ObjectId, // Reference type
        ref: 'Trip',                // Reference to the Trip model
        required: false,
    },
    attendingTripId: {
        type: Schema.Types.ObjectId, // Reference type
        ref: 'Trip',                // Reference to the Trip model
        required: false,
    },
}, { timestamps: true });

const tripSchema = new Schema({
    live: {
        type: Boolean,
        required: false,
        default: true
    },
    hostId: {
        type: Schema.Types.ObjectId, // Reference type
        ref: 'User',                // Reference to the User model
        required: true,
    },
    guestIds: [{
        type: Schema.Types.ObjectId, // Reference type
        ref: 'User',                // Reference to the User model
        required: false,
    }],
    totalseats: Number,
    source: {
        type: String,
        require: true
    },
    destination: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: false
    },
    takofftime: {
        type: Date,
        required: false
    },
    car: {
        type: String,
        required: false
    },
    describtion: {
        type: String,
        required: false
    }
}, { timestamps: true });


const userModel = mongoose.model("User", userSchema);
const tripModel = mongoose.model("Trip", tripSchema);

module.exports = {
    userModel,
    tripModel
}