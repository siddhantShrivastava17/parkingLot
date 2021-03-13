const express = require("express");
const bodyParser = require("body-parser");

require("./config/index");
require('./seeds/parking');

const PORT = process.env.PORT || 3000;

let app = express();
app.use(bodyParser.json());

const auth = require("./routes/auth");
const booking = require("./routes/booking");
const parking = require("./routes/parking");


app.use("/auth", auth);
app.use("/booking", booking);
app.use("/parking", parking);

app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.message = "Not Found";
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log("Error ==> ", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        error: true
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
