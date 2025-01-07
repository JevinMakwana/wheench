const mongoose  = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const userSchema = new Schema({
    email: { type: String, unique: false, match: /.+\@.+\..+/ },
    password: String,
    username: String,
    firstName: String,
    lastName: String,
    phone: String,
    hostingTripId: {
        type: Schema.Types.ObjectId, // Reference type
        ref: 'Trip',                // Reference to the Trip model
        required: false,
    },
    attendingTripId: [{
        type: Schema.Types.ObjectId, // Reference type
        ref: 'Trip',                // Reference to the Trip model
        required: false,
    }],
}, { timestamps: true });

const tripSchema = new Schema({
    hostId: {
        type: Schema.Types.ObjectId, // Reference type
        ref: 'User',                // Reference to the User model
        required: false,
    },
    guestIds: [{
        type: Schema.Types.ObjectId, // Reference type
        ref: 'User',                // Reference to the User model
        required: false,
    }],
    totalseats: Number,
    source: {
        type: String,
        require: false
    },
    destination: {
        type: String,
        require: false
    },
    price:{
        type: Number,
        require: false
    },
    takofftime:{
        type: Date,
        required: false
    },
    car:{
        type: String,
        required: false
    },
    describtion:{
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