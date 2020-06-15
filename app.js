var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

// parse application/json
app.use(bodyParser.json());

var flash = require("express-flash");
var session = require("express-session");
var mysql = require("mysql");
var connection = require("./lib/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var beritaRouter = require("./routes/berita");

var tipstrik = require("./routes/tipstrik");
var tutorial = require("./routes/tutorial");
var ebook = require("./routes/ebook");
var likes = require("./routes/likes");
var view = require("./routes/view");
var share = require("./routes/share");
var comment = require("./routes/comment");
var news = require("./routes/tampilanweb");
//template

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: "true",
    secret: "secret",
  })
);

app.use(flash());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/berita", beritaRouter);
app.use("/tipstrik", tipstrik);
app.use("/tutorial", tutorial);
app.use("/ebook", ebook);
app.use("/news", news);
app.use("/likes", likes);
app.use("/view", view);
app.use("/share", share);
app.use("/comment", comment);


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