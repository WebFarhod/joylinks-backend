const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes/index");
const swaggerDocs = require("./utils/swagger");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const ErrorMiddleware = require("./middlewares/error.middleware");
const app = express();

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Middleware
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cors());
// app.options("*", cors());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

// app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/src/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/src/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // Routes
app.use("/api", routes);
app.get("/", (req, res) => {
  res.json({ name: "Hello World!" });
});

swaggerDocs(app);

app.use(ErrorMiddleware);

module.exports = app;
