const mongoose = require('./db');
const { Schema } = mongoose;

const parkingSchema = new Schema({
    parkingNo: { type: Number },
    isOccupied: { type: Boolean, default: false },
    isBooked: { type: Boolean, default: false },
    forChallenged: { type: Boolean, default: false }
});

const parking = mongoose.model("Parking", parkingSchema);
module.exports = parking;