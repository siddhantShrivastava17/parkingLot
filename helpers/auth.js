const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const generateHash = async (password, salt) => {
    let hash = await bcrypt.hash(password, +process.env.bcryptSaltRound);
    return hash;
};

exports.generateHash = generateHash;

const comparePassword = async (hashedPassword, password) => {
    let isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    return isPasswordCorrect;
};

exports.comparePassword = comparePassword;

const generateJwtToken = (data) => {
    return jwt.sign({
        data: data,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP_TIME });
}
exports.generateJwtToken = generateJwtToken;