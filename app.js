var http = require("http");
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var auth = require("./routes/auth");
var category = require("./routes/category");
var product = require("./routes/product");
var Color = require("./routes/color");
var size = require("./routes/size");
require("dotenv").config();
var app = express();
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser({}));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"));
var server = http.createServer(app);

app.use("/", indexRouter);
app.use("/auth", auth);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/color", Color);
app.use("/api/size", size);

// error handler
server.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
