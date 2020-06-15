var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var save = require("summernote-nodejs");
var multer = require("multer");
var moment = require('moment');

// display ebook page
router.get("/", function (req, res, next) {
  var sql = "SELECT COUNT(idview) as `likes_berita` FROM `views` WHERE type_id=?;SELECT COUNT(idview) as `likes_tutorial` FROM `views` WHERE type_id = ?;SELECT COUNT(idview) as `likes_tipstrik` FROM `views` WHERE type_id=?;SELECT COUNT(idview) as `likes_ebook` FROM `views` WHERE type_id=?;SELECT * FROM `views`"
  dbConn.query(sql, [1, 2, 3, 4], function (err, results, fields) {
    if (err) {
      req.flash("error", err);
      // render to views/ebook/index.ejs
      res.render("view", {
        data: "",
      });
    } else {
      // render to views/ebook/index.ejs
      console.log(results);
      res.render("view", {
        data: results,
        moment: moment
      });
    }
  });
});
module.exports = router;