const { StatusCodes } = require("http-status-codes");
const NotFoundItemError = require("../erros/NotFoundItemError");
const Article = require("../models/Article");
const User = require("../models/User");

const getAllArticles = async (req, res) => {
  const articles = await Article.find({});
  res.status(StatusCodes.OK).json({ success: true, data: articles });
};
const getArticle = async (req, res) => {
  res.send("Single article");
};
const createArticle = async (req, res) => {
  const { title, author, year } = req.body;
  const user = await User.findOne({ username: author });
  if (!user) {
    throw new NotFoundItemError(`Not found username ${author}`);
  }
  const article = await Article.create({ title, author: user._id, year });
  res.status(StatusCodes.CREATED).json({ success: true, data: article });
};
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;

  if (author) {
    const user = await User.findById(author);
    if (!user) {
      throw new NotFoundItemError(`Not found username with id : ${author}`);
    }
  }

  const article = await Article.findOneAndUpdate(
    { _id: id, author: req.userId },
    { title, author, year },
    { new: true, runValidators: true }
  );
  if (!article) {
    throw new NotFoundItemError(`Not found article with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: article });
};
const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const author = req.userId;
  const article = await Article.findOneAndRemove({ _id: id, author });
  if (!article) {
    throw new NotFoundItemError(`Not found article with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: article });
};

module.exports = {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
