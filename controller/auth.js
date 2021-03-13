const utilities = require("../helpers/utilities");
const auth = require("../helpers/auth");
const User = require("../models/user");

const userRegistration = async (req, res, next) => {
    const {
        fname,
        lname,
        isChallenged,
        password,
        repeatPassword,
        username,
    } = req.body;

    if (!fname || !lname || !password || !repeatPassword || !username) {
        let err = utilities.setResponse(400);
        return next(err);
    }

    if (password != repeatPassword) {
        let err = utilities.setResponse(400, "Password & repeatPassword missmatch");
        return next(err);
    }

    let hashPassword = await auth.generateHash(password, +process.env.bcryptSaltRound);

    let insertData = {
        fname,
        lname,
        isChallenged,
        username,
        password: hashPassword,
    };

    try {
        await User.create(insertData);
        let response = utilities.setResponse(200, "User created successfully");
        let status = response.status;
        res.status(status).send(response);
    } catch (err) {
        let errorMessage;
        if (err.code == "11000") {
            errorMessage = "Duplicate key error";
        } else {
            errorMessage = "Something went wrong";
        }

        let error = new Error(errorMessage);
        error.status = 500;
        return next(error);
    }
};

exports.userRegistration = userRegistration;

const userLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        let response = utilities.setResponse(400);
        let status = response.status;
        return res.status(status).send(response);
    }

    let findData = {
        username: username,
    };

    try {
        const user = await User.findOne(findData);
        if (!user) {
            let response = utilities.setResponse(400, "Username does not exist");
            let status = response.status;
            return res.status(status).send(response);
        }

        let hashedPassword = user.password;
        const checkPassword = await auth.comparePassword(hashedPassword, password);

        if (checkPassword) {
            //loged in
            let { _id, fname, lname, isChallenged, username } = user;

            const jwtToken = auth.generateJwtToken({ _id, fname, lname, isChallenged, username });

            let response = utilities.setResponse(200, "Login successfully", jwtToken);
            let status = response.status;
            res.status(status).send(response);
        } else {
            //password incorrect
            let response = utilities.setResponse(400, "Username or password wrong");
            let status = response.status;
            return res.status(status).send(response);
        }
    } catch (err) {
        let errorMessage;
        errorMessage = "Something went wrong";

        let error = new Error(errorMessage);
        error.status = 500;
        return next(error);
    }
};

exports.userLogin = userLogin;

let getAllUsers = async (req, res, next) => {
    let allUsers = User.find({}, { isChallenged: 1, fname: 1, lname: 1, username: 1 });
    let count = User.count({});

    try {
        [allUsers, count] = await Promise.all([allUsers, count]);
        let data = {
            allUsers,
            count
        };

        let response = utilities.setResponse(200, "Successfully Fetch Data", data);
        let status = response.status;
        return res.status(status).send(response);
    } catch (err) {
        console.log("getAllUsers Error : ", err);
        let error = utilities.setResponse("Something went wrong");
        let status = 500;
        return res.status(status).send(error);

    }

}
exports.getAllUsers = getAllUsers;
