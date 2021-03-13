const mongoose = require("mongoose");
const opt = {
  useUnifiedTopology: true,
  useFindAndModify: true,
  useNewUrlParser: true,
};

const connectString = process.env.mongoConnectStr;

const connectWithRetry = () => {
  return mongoose.connect(connectString, opt, (err) => {
    if (err) {
      console.error("Failed to connect to mongo , retry with 5 sec");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("mongo connect");
    }
  });
};

connectWithRetry();

module.exports = mongoose;
