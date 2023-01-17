const express = require("express");
const { register, login, refresh, logout } = require("../controllers/auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

module.exports = router;
