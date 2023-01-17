const express = require("express");
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articles");
const authorization = require("../middleware/authorization");
const router = express.Router();

router
  .route("/")
  .get(authorization, getAllArticles)
  .post(authorization, createArticle);
router
  .route("/:id")
  .get(getArticle)
  .patch(authorization, updateArticle)
  .delete(authorization, deleteArticle);

module.exports = router;
