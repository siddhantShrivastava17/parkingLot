const mongoose = require('./db');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    parkingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Parking'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    arrivalAt: { type: Date },
    bookingCreatedAt: { type: Date, default: Date.now }
});

const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;