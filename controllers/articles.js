const { StatusCodes } = require("http-status-codes");
const NotFoundItemError = require("../erros/NotFoundItemError");
const Article = require("../models/Article");
const User = require("../models/User");

const getAllArticles = async (req, res) => {
  const { username, limit, page } = req.query;

  const filter = username ? username : { $exists: true };
  let result = Article.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user_docs",
      },
    },
    {
      $match: { "user_docs.username": filter },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$user_docs", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $project: {
        user_docs: 0,
        email: 0,
        password: 0,
        photoURL: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);
  if (limit) {
    const skip = (page ? page : 1 - 1) * limit;
    result = result.skip(skip).limit(limit);
  }
  const articles = await result;
  res.status(StatusCodes.OK).json({ success: true, data: articles });
};
const getArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findOne({ _id: id }).populate({
    path: "author",
    select: "username",
  });
  if (!article) {
    throw new NotFoundItemError(`Not found article with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: article });
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
