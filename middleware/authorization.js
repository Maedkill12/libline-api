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
  const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.userId = user.userId;
  next();
};

module.exports = authorization;
