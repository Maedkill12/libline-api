const { StatusCodes } = require("http-status-codes");
const NotFoundItemError = require("../erros/NotFoundItemError");
const User = require("../models/User");

const getAllUser = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ success: true, data: users });
};
const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new NotFoundItemError(`Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: user });
};
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.create({ username, email, password });
  user.password = null;
  res.status(StatusCodes.CREATED).json({ success: true, data: user });
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: id },
    { username, email, password },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) {
    throw new NotFoundItemError(`Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: user });
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndRemove({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundItemError(`Not found user with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: user });
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
