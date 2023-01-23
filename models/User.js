const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: [true, "Username must be provided"],
      unique: true,
      match: [/^\S+$/, "Username must not contain spaces"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      required: [true, "Email must be provided"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      minlength: 8,
    },
    photoURL: {
      type: String,
      match: [
        /\.(jpe?g|png|gif|bmp|webp)$/i,
        "Please provide a an URL for an image",
      ],
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createAccessToken = function () {
  const accessToken = jwt.sign(
    { userId: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }
  );
  return accessToken;
};

UserSchema.methods.createRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
    }
  );
  return refreshToken;
};

UserSchema.methods.verifyPassword = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

module.exports = mongoose.model("User", UserSchema);
