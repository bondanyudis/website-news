var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");
var save = require("summernote-nodejs");
var multer = require("multer");
var moment = require('moment');

//
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

var cpUpload = upload.fields([{
    name: "foto",
    maxCount: 1,
  },
  {
    name: "files",
    maxCount: 10,
  },
]);

// display berita page
router.get("/", function (req, res, next) {
  dbConn.query("SELECT * FROM berita ORDER BY idnews desc", function (err, rows) {
    if (err) {
      req.flash("error", err);
      // render to views/berita/index.ejs
      res.render("berita", {
        data: rows
      });
    } else {
      // render to views/berita/index.ejs
      res.render("berita", {
        data: rows,
        moment: moment
      });
    }
  });
});

router.get("/detail/:id", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("SELECT * FROM berita WHERE idnews = " + id, function (
    err,
    rows,
    fields
  ) {
    if (err) throw err;

    // if user not found
    if (rows.length <= 0) {
      req.flash("error", "Book not found with id = " + id);
      res.redirect("/berita");
    }
    // if book found
    else {
      console.log(rows);
      // render to edit.ejs
      res.render("berita/detail", {
        data: rows,
        moment: moment
      });
    }
  });
});

// display add book page
router.get("/add", function (req, res, next) {
  // render to add.ejs
  res.render("berita/add", {
    name: "",
    author: "",
  });
});

// add a new book

router.post("/add", cpUpload, function (req, res, next) {
  let errors = false;
  console.log(req.files.files);

  let title = req.body.title;
  let type_id = "1";
  let author_name = req.body.author_name;
  let editordata = req.body.summernote;
  let fotoheader = req.files.foto[0].filename;
  let tags = req.body.tokenfield;

  if (
    fotoheader.length === 0 ||
    tags.length === 0 ||
    editordata.length === 0 ||
    title.length === 0 ||
    author_name.length === 0
  ) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter name and author");
    // render to add.ejs with flash message
    res.render("berita/add", {
      title: title,
      author_name: author_name,
      contents: editordata,
      foto: fotoheader,
      tags: tags,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      title: title,
      author_name: author_name,
      contents: editordata,
      foto: fotoheader,
      type_id: type_id,
      tags: tags,
    };
    // insert query
    dbConn.query("INSERT INTO berita SET ?", form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash("error", err);

        // render to add.ejs
        res.render("berita/add", {
          title: form_data.title,
          author_name: form_data.author_name,
          contents: form_data.editordata,
          foto: form_data.foto,
          tags: form_data.tags,
        });
      } else {
        req.flash("success", "Book successfully added");
        res.redirect("/berita");
      }
    });
  }
});

// display edit book page
router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("SELECT * FROM berita WHERE idnews = " + id, function (
    err,
    rows,
    fields
  ) {
    if (err) throw err;

    // if user not found
    if (rows.length <= 0) {
      req.flash("error", "Book not found with id = " + id);
      res.redirect("/berita");
    }
    // if book found
    else {
      console.log(rows);
      // render to edit.ejs
      res.render("berita/edit", {
        data: rows
      });
    }
  });
});

// update book data
router.post("/edit/:id", cpUpload, function (req, res, next) {
  let errors = false;
  var fotoheader = "";

  let title = req.body.title;
  let idnews = req.body.idnews;
  let type_id = "1";
  let fotoHeaderNew = req.body.fotoNew;
  if (isEmptyObject(req.files)) {
    fotoheader = fotoHeaderNew;
  } else {
    fotoheader = req.files.foto[0].filename;

  }

  let author_name = req.body.author_name;
  let editordata = req.body.summernote;

  let tags = req.body.tokenfield;

  if (
    fotoheader.length === 0 ||
    tags.length === 0 ||
    editordata.length === 0 ||
    title.length === 0 ||
    author_name.length === 0
  ) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter name and author");
    // render to add.ejs with flash message
    res.render("berita/add", {
      title: title,
      author_name: author_name,
      contents: editordata,
      foto: fotoheader,
      tags: tags,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      title: title,
      author_name: author_name,
      contents: editordata,
      foto: fotoheader,
      type_id: type_id,
      tags: tags,
    };
    // insert query
    dbConn.query("UPDATE berita SET ? WHERE idnews=" + idnews, form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash("error", err);
        // console.log(err);

        // render to add.ejs
        res.render("berita/edit", {
          data: [{
            "title": form_data.title,
            "author_name": form_data.author_name,
            "contents": form_data.contents,
            "foto": form_data.foto,
            "type_id": form_data.type_id,
            "tags": form_data.tags
          }]
        });
      } else {
        req.flash("success", "Book successfully added");
        res.redirect("/berita");
      }
    });
  }
});

// delete book
router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("DELETE FROM berita WHERE idnews = " + id, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash("error", err);
      // redirect to berita page
      res.redirect("/berita");
    } else {
      // set flash message
      req.flash("success", "Book successfully deleted! ID = " + id);
      // redirect to berita page
      res.redirect("/berita");
    }
  });
});

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

module.exports = router;