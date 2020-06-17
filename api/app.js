var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cookierParser = require("cookie-parser");
var cors = require("cors");

var appRouter = require("./routes/app");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");
var getListsRouter = require("./routes/getLists");
var addItemRouter = require("./routes/addListItem");
var deleteItemRouter = require("./routes/deleteListItem");
var setItemCompleted = require("./routes/setItemCompleted");
var setItemDescription = require("./routes/setItemDescription");
var setItemDueDate = require("./routes/setItemDueDate");
var setItemPriority = require("./routes/setItemPriority");
var setItemTitle = require("./routes/setItemTitle");
var verifyLoginRouter = require("./routes/verifyLogin.js");
var createAccountRouter = require("./routes/createAccount");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookierParser("abcdef-12345"));

app.use("/verifyLogin", verifyLoginRouter);
app.use("/createAccount", createAccountRouter);
app.use("/app", appRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/getLists", getListsRouter);
app.use("/addListItem", addItemRouter);
app.use("/deleteListItem", deleteItemRouter);
app.use("/setItemCompleted", setItemCompleted);
app.use("/setItemDescription", setItemDescription);
app.use("/setItemDueDate", setItemDueDate);
app.use("/setItemPriority", setItemPriority);
app.use("/setItemTitle", setItemTitle);
app;

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
