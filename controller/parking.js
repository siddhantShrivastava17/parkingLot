const utilities = require("../helpers/utilities");
const Booking = require("../models/booking");
const Parking = require("../models/parking");
const User = require("../models/user");
const mongoose = require("../models/db");

const onSite = async (req, res, next) => {
    const { bookingId } = req.params;

    if (!bookingId) {
        let error = utilities.setResponse(400);
        let status = error.status;
        return res.status(status).send(error);
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        let error = utilities.setResponse(400, "Not a vaild ID");
        let status = error.status;
        return res.status(status).send(error);
    }

    let findData = {
        _id: mongoose.Types.ObjectId(bookingId),
    };

    const booking = await Booking.findOne(findData)
        .populate({ path: "parkingId", select: "parkingNo isOccupied isBooked" })
        .populate({ path: "userId", select: "username fname lname" });

    if (!booking) {
        let resposne = utilities.setResponse(400, "No booking found with this ID");
        let status = resposne.status;
        return res.status(status).send(resposne);
    }

    if (booking.parkingId.isOccupied) {
        let resposne = utilities.setResponse(400, "This bookingID is occupied");
        let status = resposne.status;
        return res.status(status).send(resposne);
    }

    const parking = await Parking.findOne(booking.parkingId._id);

    //update paking isOccupied
    parking.isOccupied = true;
    await parking.save();

    let resposne = utilities.setResponse(200, "Your booking", booking);
    let status = resposne.status;
    return res.status(status).send(resposne);
};
exports.onSite = onSite;
