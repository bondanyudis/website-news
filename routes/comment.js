var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var save = require("summernote-nodejs");
var multer = require("multer");
var moment = require('moment');

// display ebook page
router.get("/", function (req, res, next) {
  var sql = "SELECT COUNT(idcomment) as `likes_berita` FROM `comment` WHERE type_id=?;SELECT COUNT(idcomment) as `likes_tutorial` FROM `comment` WHERE type_id = ?;SELECT COUNT(idcomment) as `likes_tipstrik` FROM `comment` WHERE type_id=?;SELECT COUNT(idcomment) as `likes_ebook` FROM `comment` WHERE type_id=?;SELECT * FROM `comment`"
  dbConn.query(sql, [1, 2, 3, 4], function (err, results, fields) {
    if (err) {
      req.flash("error", err);
      // render to views/ebook/index.ejs
      res.render("comment", {
        data: "",
      });
    } else {
      // render to views/ebook/index.ejs
      console.log(results);
      res.render("comment", {
        data: results,
        moment: moment
      });
    }
  });
});
module.exports = router;