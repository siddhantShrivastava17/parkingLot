const mongoose = require("./db");
const { Schema } = mongoose;

const userSchema = new Schema({
  fname: { type: String },
  lname: { type: String },
  isChallenged: { type: Boolean, default: false },
  password: { type: String },
  username: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

let users = mongoose.model("User", userSchema);
module.exports = users;
