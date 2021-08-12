const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

//multer diskStorage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// initializing upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("myImage");

// filetype checker
function checkFileType(file, callback) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback("Error: Images Only!");
  }
}

//middlewares
app.use(express.json()); // converts data from req to objects
app.set("view engine", "ejs");
app.use(express.static("./public"));

// rendering index.ejs
app.get("/", (req, res) => {
  res.render("index");
});

// post request
app.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No file Selected!",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

app.listen(port, () => console.log(`app running on ${port}`));
