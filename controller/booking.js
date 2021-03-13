const utilities = require("../helpers/utilities");
const Booking = require("../models/booking");
const Parking = require("../models/parking");
const mongoose = require("../models/db");
const bookingHelper = require('../helpers/booking');

const getAll = async (req, res, next) => {
    let filterData = req.params.status;

    if (filterData != "available" && filterData != "occupied") {
        let response = utilities.setResponse(400, "Params not correct");
        let status = response.status;
        return res.status(status).send(response);
    }

    let findDate = {};

    filterData == "available"
        ? (findDate.isBooked = false)
        : (findDate.isBooked = true);

    let a = Parking.find(findDate, { parkingNo: 1 });
    let b = Parking.count(findDate);

    let [result, count] = await Promise.all([a, b]);

    let data = {
        result: result,
        count: count,
    };
    let response = utilities.setResponse(200, "Fetch Result", data);
    let status = response.status;
    return res.status(status).send(response);
};
exports.getAll = getAll;

const bookingRegistration = async (req, res, next) => {
    let { arrivalAt } = req.body;

    if (!arrivalAt) {
        let error = utilities.setResponse(400);
        let status = error.status;
        return res.status(status).send(error);
    }

    let [year, month, day, hour, min, sec] = arrivalAt.split(",");
    arrivalAt = new Date(year, month, day, hour, min, sec);
    let nowDate = new Date();

    //update parking for users occupying greater that 30min
    await bookingHelper.updateParking();


    // arrival time 15-20 min ahead (month - 1)
    console.log(new Date(nowDate).toISOString(), arrivalAt.toISOString());
    if (
        new Date(nowDate).getTime() + 15 * 60 * 1000 > arrivalAt.getTime() ||
        new Date(nowDate).getTime() + 20 * 60 * 1000 < arrivalAt.getTime()
    ) {
        let error = utilities.setResponse(400, "arrivalAt time must be 15-20 min ahead");
        let status = error.status;
        return res.status(status).send(error);
    }


    //1. check for disability

    let user = req.user;
    let isUserDisable = user.isChallenged;

    let findData = {
        isBooked: false,
    };

    if (isUserDisable) {
        findData.forChallenged = { $in: [true, false] };
    } else {
        findData.forChallenged = false;
    }

    // let session = await mongoose.startSession();
    try {
        // session.startTransaction();

        let availableParking = await Parking.findOne(findData);
        if (!availableParking) {
            let response = utilities.setResponse(400, "No available parking left");
            let status = response.status;
            return res.status(status).send(response);
        }

        console.log("user : ", user);

        let insertData = {
            parkingId: mongoose.Types.ObjectId(availableParking.id),
            userId: mongoose.Types.ObjectId(user._id),
            arrivalAt: arrivalAt,
        };

        //2. allot booking if disable (1 - 24) else (25 - 120)

        let createBooking = await Booking.create(insertData);
        availableParking.isBooked = true;
        await availableParking.save();

        let data = {
            bookingId: createBooking.id
        }

        let response = utilities.setResponse(200, "Booking Done", data);
        let status = response.status;

        // await session.commitTransaction();
        return res.status(status).send(response);
    } catch (error) {
        // await session.abortTransaction();
        console.log("Error bookingRegistration : ", error);
        let response = utilities.setResponse(500, "Something went wrong");
        let status = response.status;
        return res.status(status).send(response);
    }
};
exports.bookingRegistration = bookingRegistration;
