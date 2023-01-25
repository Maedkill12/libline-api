require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const connectDB = require("./db/connectDB");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const articleRouter = require("./routes/articles");

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (
        origin === "https://libline.onrender.com" ||
        origin === "https://libline.netlify.app"
      ) {
        callback(null, true);
      }
    },
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/articles", articleRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
