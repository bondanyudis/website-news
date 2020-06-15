var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var imageEditer = require("../lib/image");
var multer = require("multer");
var moment = require("moment");
var jimp = require("jimp");

router.get("/", function (req, res, next) {
  dbConn.query("SELECT * FROM berita ORDER BY idnews desc", function (
    err,
    rows
  ) {
    if (err) {
      req.flash("error", err);
      // render to views/ebook/index.ejs
      res.render("tampilanweb", {
        data: "",
      });
    } else {
      // render to views/ebook/index.ejs
      console.log(rows[0].foto);
      var foto = "public/images/upload/" + rows[0].foto;
      var filename = rows[0].foto;
      imageEditer.image_setting(foto, filename);
      res.render("tampilanweb", {
        data: rows,
        moment: moment,
      });
    }
  });
});
// async function cropImage(gambar, filename) {
//   const image = await jimp.read(gambar);
//   await image.resize(1000, jimp.AUTO, function (err) {
//     if (err) {
//       console.log(err);
//     }
//   });
//   var w = image.bitmap.width;
//   var h = image.bitmap.height;
//   console.log(w);
//   console.log(h)

//   await image.crop(jimp.HORIZONTAL_ALIGN_CENTER, jimp.VERTICAL_ALIGN_MIDDLE, 800, 460);
//   await image.writeAsync(`public/images/upload800x460/` + filename, function (err) {
//     if (err) {
//       console.log(err)
//     }
//   });
//   await image.crop(jimp.HORIZONTAL_ALIGN_CENTER, jimp.VERTICAL_ALIGN_MIDDLE, 400, 510);
//   await image.writeAsync(`public/images/upload400x600/` + filename, function (err) {
//     if (err) {
//       console.log(err)
//     }
//   });
// }
module.exports = router;