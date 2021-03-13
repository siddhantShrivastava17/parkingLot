const commonVariables = {
    mongoConnectStr: "mongodb://localhost/parkingLot",
    bcryptSaltRound: 10,
    JWT_SECRET: '9201920928392uewiwjdjsndjanmdsnd::sadsa',
    JWT_EXP_TIME: '1h'
};

Object.keys(commonVariables).forEach((key) => {
    process.env[key] = commonVariables[key];
});
