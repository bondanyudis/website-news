var express = require('express');
var router = express.Router();
var dbConn = require("../lib/db");
var moment = require('moment');

/* GET home page. */
router.get("/", function (req, res, next) {
  dbConn.query("SELECT * FROM berita ORDER BY idnews desc", function (err, rows) {
    if (err) {
      req.flash("error", err);
      // render to views/berita/index.ejs
      res.render("index", {
        data: "",
      });
    } else {
      // render to views/berita/index.ejs
      res.render("index", {
        data: rows,
        moment: moment
      });
    }
  });
});

module.exports = router;