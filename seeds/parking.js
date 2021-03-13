const mongoose = require('../models/db');
const Parking = require('../models/parking');

const seedParking = async () => {

    let count = await Parking.count({});

    if (count) {
        return;
    }

    for (let i = 1; i <= 120; i++) {
        let data = {
            parkingNo: i
        }

        if (i < 25) {
            data.forChallenged = true;
        }

        await Parking.create(data);
    }

    console.log("Seeded Parking Data successfully");
}

seedParking();
