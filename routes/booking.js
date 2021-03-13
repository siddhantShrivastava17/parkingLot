const express = require("express");
const bookingController = require("../controller/booking");
const middleware = require("../middleware/auth").jwtMiddleware;
const router = express.Router();

router.get("/v1/get/all/:status", middleware, bookingController.getAll);
router.post("/v1/register", middleware, bookingController.bookingRegistration);

module.exports = router;
