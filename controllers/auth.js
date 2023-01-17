const { StatusCodes } = require("http-status-codes");
const AuthenticationError = require("../erros/AuthenticationError");
const BadRequestError = require("../erros/BadRequestError");
const ForbiddenError = require("../erros/ForbiddenError");
const NotFoundItemError = require("../erros/NotFoundItemError");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  await User.create({ username, email, password });
  res.status(StatusCodes.CREATED).json({ success: true });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError("Username and Password must be provided");
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new NotFoundItemError(`Not found user ${username}`);
  }
  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    throw new AuthenticationError(`Password is not correct`);
  }
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({ success: true, accessToken });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ForbiddenError("Invalid refresh token");
  }
  const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findOne({ _id: data.userId });
  if (!user) {
    throw new NotFoundItemError(`Not found user with id : ${userId}`);
  }
  const accessToken = user.createAccessToken();
  res.status(StatusCodes.OK).json({ success: true, accessToken });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(StatusCodes.NO_CONTENT).json({ success: true });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
