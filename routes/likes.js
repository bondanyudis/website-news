var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var save = require("summernote-nodejs");
var multer = require("multer");
var moment = require('moment');

// display ebook page
router.get("/", function (req, res, next) {
  var sql = "SELECT COUNT(idlikes) as `likes_berita` FROM `like` WHERE type_id=?;SELECT COUNT(idlikes) as `likes_tutorial` FROM `like` WHERE type_id = ?;SELECT COUNT(idlikes) as `likes_tipstrik` FROM `like` WHERE type_id=?;SELECT COUNT(idlikes) as `likes_ebook` FROM `like` WHERE type_id=?;SELECT * FROM `like`"
  dbConn.query(sql, [1, 2, 3, 4], function (err, results, fields) {
    if (err) {
      console.log("aaaaaa");
      req.flash("error", err);
      // render to views/ebook/index.ejs
      res.render("likes", {
        data: "",
      });
    } else {
      // render to views/ebook/index.ejs
      console.log(results);
      res.render("likes", {
        data: results,
        moment: moment
      });
    }
  });
});
module.exports = router;