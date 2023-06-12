const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    gender: String,
    password: String,
    age: String,
    city: String,
    is_married: String,
  },
  { versionKey: false }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = { UserModel };
