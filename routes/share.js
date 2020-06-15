var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var save = require("summernote-nodejs");
var multer = require("multer");
var moment = require('moment');

// display ebook page
router.get("/", function (req, res, next) {
  var sql = "SELECT COUNT(idshare) as `likes_berita` FROM `share` WHERE type_id=?;SELECT COUNT(idshare) as `likes_tutorial` FROM `share` WHERE type_id = ?;SELECT COUNT(idshare) as `likes_tipstrik` FROM `share` WHERE type_id=?;SELECT COUNT(idshare) as `likes_ebook` FROM `share` WHERE type_id=?;SELECT * FROM `share`"
  dbConn.query(sql, [1, 2, 3, 4], function (err, results, fields) {
    if (err) {
      req.flash("error", err);
      // render to views/ebook/index.ejs
      res.render("share", {
        data: "",
      });
    } else {
      // render to views/ebook/index.ejs
      console.log(results);
      res.render("share", {
        data: results,
        moment: moment
      });
    }
  });
});
module.exports = router;