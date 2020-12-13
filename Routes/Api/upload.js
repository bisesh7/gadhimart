const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createUser = require("../../config/createUser");
const { uuid } = require("uuidv4");

// User model
const User = require("../../models/User");
// Car model
const Car = require("../../models/Car");
// Temp folders model
const TempFolders = require("../../models/TempFolders");

let uniqueID;

// storage for profile picture
// Set storage engine
const storage = multer.diskStorage({
  destination: `${
    path.join(__dirname, "../../") + "assets/uploads/profilePictures"
  }`,
  filename: function (req, file, cb) {
    uniqueID = uuid();
    cb(null, `${uniqueID + path.extname(file.originalname).toLowerCase()}`);
  },
});

// Init upload for profile picture
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(req, file, cb);
  },
}).single("profilePic");

// storage for car Images
const carImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      `${
        path.join(__dirname, "../../") +
        "assets/uploads/temp/" +
        req.get("unique-id")
      }`
    );
  },
  filename: function (req, file, cb) {
    console.log(file);
    uniqueID = uuid();
    cb(null, `${uniqueID + path.extname(file.originalname).toLowerCase()}`);
  },
});

const carImageUpload = multer({
  storage: carImageStorage,
  fileFilter: function (req, file, cb) {
    checkCarImage(req, file, cb);
  },
}).array("carImage", 10);

const checkCarImage = (req, file, cb) => {
  const fileExtName = path.extname(file.originalname);

  const isCorrectFileExt =
    fileExtName === ".jpg" || fileExtName === ".jpeg" || fileExtName === ".png"
      ? true
      : false;

  const isCorrectFileMimeType =
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype === "image/png"
      ? true
      : false;

  if (isCorrectFileExt && isCorrectFileMimeType) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Check file type for profile picture
function checkFileType(req, file, cb) {
  try {
    let userProfilePicturePath;

    User.findById(req.user._id)
      .then((user) => {
        userProfilePicturePath = user.profilePicturePath;

        // Check if the user has uploaded profile picture or not
        /**
         * If the user has uploaded the profile picture then
         * we delete the picture
         */
        if (userProfilePicturePath !== "/assets/images/default-profile.png") {
          fs.exists(
            `${path.join(__dirname, "../../") + userProfilePicturePath}`,
            function (exists) {
              if (exists) {
                fs.unlink(
                  `${path.join(__dirname, "../../") + userProfilePicturePath}`,
                  (err) => {
                    if (err) {
                      throw new Error("Server error");
                    }

                    console.log("Deleted");
                    checkMimeTypeAndFileExt();
                  }
                );
                console.log("File exists!");
              } else {
                console.log("File doesn't exist!");
                checkMimeTypeAndFileExt();
              }
            }
          );
        } else {
          checkMimeTypeAndFileExt();
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    if (err instanceof TypeError) {
      cb(null, false);
      return cb(new Error("Please login!"));
    } else {
      cb(null, false);
      return cb(new Error("Server Error!"));
    }
  }

  const checkMimeTypeAndFileExt = () => {
    const fileExtName = path.extname(file.originalname);

    const isCorrectFileExt =
      fileExtName === ".jpg" ||
      fileExtName === ".jpeg" ||
      fileExtName === ".png"
        ? true
        : false;

    const isCorrectFileMimeType =
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype === "image/png"
        ? true
        : false;

    if (isCorrectFileExt && isCorrectFileMimeType) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  };
}

// @route   POST /api/upload/profilePicture
// @desc    Upload the profile picture of user
// @access  PRIVATE
router.post("/profilePicture", ensureAuthenticated, (req, res) => {
  upload(req, res, (err) => {
    if (typeof req.file === "undefined") {
      return res
        .status(400)
        .json({ msg: "No file was uploaded. Make sure you are logged in." });
    }
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: err });
    } else {
      // Update the path of profile picture in database
      User.findByIdAndUpdate(
        req.user._id,
        {
          profilePicturePath: `/assets/uploads/profilePictures/${
            uniqueID + path.extname(req.file.originalname).toLowerCase()
          }`,
        },
        function (err) {
          //handle it
          if (err) {
            return res.status(500).json({ msg: "server error" });
          }
        }
      );
      // Create a user object with new profile picture path and send it as response
      const user = createUser(
        req,
        `/assets/uploads/profilePictures/${
          uniqueID + path.extname(req.file.originalname).toLowerCase()
        }`
      );

      return res.json({ success: true, user });
    }
  });
});

// @route   GET /api/upload/removeProfilePicture
// @desc    Remove the profile picture of the user
// @access  PRIVATE
router.get("/removeProfilePicture", ensureAuthenticated, (req, res) => {
  User.findById(req.user._id).then((user) => {
    try {
      let userProfilePicturePath = user.profilePicturePath;

      const profilePictureWholePath = `${
        path.join(__dirname, "../../") + userProfilePicturePath
      }`;

      fs.exists(profilePictureWholePath, function (exists) {
        if (exists) {
          console.log("File exists!");

          fs.unlink(profilePictureWholePath, (err) => {
            if (err) {
              throw err;
            }

            console.log("Deleted");
            user.profilePicturePath = "/assets/images/default-profile.png";
            user.save();

            const userConfig = createUser(
              req,
              "/assets/images/default-profile.png"
            );

            return res.json({ success: true, user: userConfig });
          });
        } else {
          console.log("File doesn't exist!");
          return res
            .status(400)
            .json({ msg: "File doesn't exist", success: false });
        }
      });
    } catch (err) {
      if (err instanceof TypeError) {
        console.log(err);
        return res.status(400).json({ msg: "Please login", success: false });
      } else {
        console.log(err);
        return res.status(500).json({ msg: "Server Error", success: false });
      }
    }
  });
});

// @route   POST /api/upload/carImage
// @desc    Upload the car ad image
// @access  PRIVATE
router.post("/carImage", ensureAuthenticated, (req, res) => {
  // react dropzone uploader will need respond headers to know if
  // the file is uploaded but, it will not send the unique id in it's request header.
  // This way we know if the request sent is from the react-dropzone-uploader
  if (typeof req.get("unique-id") === "undefined") {
    console.log(req.body);
    return res.json({
      success: false,
    });
  }

  // Path of the temporary directory that contains uploaded car images
  const dir = `${
    path.join(__dirname, "../../") +
    "assets/uploads/temp/" +
    req.get("unique-id")
  }`;

  // If the path doesn't exist we create a path
  fs.exists(dir, (exists) => {
    if (exists) {
      carImageUpload(req, res, carUploadCallBack);
    } else {
      fs.mkdir(dir, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: "Server error",
            success: false,
          });
        } else {
          carImageUpload(req, res, carUploadCallBack);
        }
      });
    }
  });

  let carUploadCallBack = (err) => {
    if (typeof req.files === "undefined") {
      return res.status(400).json({
        msg: "No file was uploaded. Make sure you are logged in.",
        success: false,
      });
    }
    if (err) {
      console.log(err);

      return res.status(500).json({ msg: "Server error", success: false });
    }

    // Saving the temp folder to he database, to delete this later if user doesnt save the carAd
    // But upload the pictures
    const uniqueId = req.get("unique-id");

    TempFolders.findOne({ user: req.user.id }, (err, tempFolder) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Server error while saving the temp folder",
        });
      }
      if (tempFolder === null) {
        const newTempFolder = new TempFolders({
          uniqueId: [uniqueId],
          user: req.user.id,
        });
        newTempFolder
          .save()
          .then(() => {
            return res.json({ success: true, files: req.files });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              success: false,
              msg: "Server error while saving the temp folder",
            });
          });
      } else {
        tempFolder.uniqueId.push(uniqueId);
        tempFolder
          .save()
          .then(() => {
            return res.json({ success: true, files: req.files });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              success: false,
              msg: "Server error while saving the temp folder",
            });
          });
      }
    });
  };
});

// @route   POST /api/upload/removeCarImage
// @desc    delete a car ad image
// @access  PRIVATE
router.post("/removeCarImage", ensureAuthenticated, (req, res) => {
  const { fileUrl, sentFrom, editNumber } = req.body;
  console.log(req.body);
  // sentFrom is used to check if the request is coming from a valid page
  if (sentFrom && sentFrom === "thisIsValid") {
    if (editNumber == 2) {
      return res.json({ success: true });
    }

    const dir = `${path.join(__dirname, "../../") + fileUrl}`;
    fs.exists(dir, (exists) => {
      if (exists) {
        fs.unlink(dir, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ msg: "Server error.", success: false });
          }
          return res.json({ success: true });
        });
      } else {
        return res
          .status(400)
          .json({ msg: "File doesn't exist.", success: false });
      }
    });
  } else {
    return res
      .status(400)
      .json({ msg: "Please use the form correctly!", success: false });
  }
});

module.exports = router;
