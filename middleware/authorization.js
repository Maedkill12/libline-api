const jwt = require("jsonwebtoken");
const AuthenticationError = require("../erros/AuthenticationError");

const authorization = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    throw new AuthenticationError(
      "Invalid token. Token must start with 'Bearer <token>'"
    );
  }
  token = token.split(" ")[1];
  let user;
  try {
    user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new AuthenticationError("Access token has expired");
  }
  req.userId = user.userId;
  next();
};

module.exports = authorization;
