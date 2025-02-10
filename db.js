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
        required: true
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

// Define a virtual field for `hostInfo`
tripSchema.virtual('hostInfo', {
    ref: 'User', // The model to populate from
    localField: 'hostId', // The field in •tripschema*
    foreignField: '_id', // The matching field in model
    justOne: true // Ensures it returns a single object, not an array
});
tripSchema.index({ source: 1, destination: 1, takeofftime: 1 });

// Ensure virtuals are included in JSON output
tripSchema.set('toObject', { virtuals: true });
tripSchema.set('toJSON', { virtuals: true });

const userModel = mongoose.model("User", userSchema);
const tripModel = mongoose.model("Trip", tripSchema);

module.exports = {
    userModel,
    tripModel
}