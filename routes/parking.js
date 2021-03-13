const express = require("express");
const parkingController = require("../controller/parking");
const middleware = require("../middleware/auth").jwtMiddleware;
const router = express.Router();

router.get("/v1/onsite/:bookingId", parkingController.onSite);

module.exports = router;
