const Booking = require("../models/booking");
const Parking = require("../models/parking");
const mongoose = require("../models/db");

const updateParking = async () => {
    let fifteenMinLess = new Date().getTime() - 15 * 60 * 1000;
    console.log(new Date());

    let findData = {
        arrivalAt: { $gt: fifteenMinLess },
    };

    let allBookings = await Booking.find(findData).populate({
        path: "parkingId",
        match: { isOccupied: false },
    });

    if (allBookings.length) {
        let allIrrelevantBookings = allBookings.filter(
            (el) =>
                el.parkingId.isOccupied == false && el.parkingId.isBooked == true
        );
        let allParkingIdNeedToBeFree = allIrrelevantBookings.map((el) =>
            mongoose.Types.ObjectId(el.parkingId._id)
        );


        await Parking.updateMany(
            { _id: allParkingIdNeedToBeFree },
            {
                $set: { isBooked: false },
            },
            {
                upsert: true,
            }
        );
    }
};
exports.updateParking = updateParking;
