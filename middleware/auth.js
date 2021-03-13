const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtMiddleware = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    // console.log("==>", req)

    if (!token) {
        let error = new Error("No Token provided");
        error.status = 400;
        return next(error);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            let error = new Error("Token Invalid");
            error.status = 400;
            return next(error);
        }

        req.user = decodedToken.data;
        let doesUserExist = await User.findOne({ _id: req.user._id });
        if (!doesUserExist) {
            let error = new Error("User does not exist");
            error.status = 400;
            return next(error);
        }
        next();
    } catch (err) {
        let error = new Error("Token Invalid !");
        error.status = 500;
        return next(error);
    }
}

exports.jwtMiddleware = jwtMiddleware;