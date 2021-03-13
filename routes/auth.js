const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();

router.get("/v1/all/users", authController.getAllUsers);
router.post("/v1/registration", authController.userRegistration);
router.post("/v1/login", authController.userLogin);

module.exports = router;
