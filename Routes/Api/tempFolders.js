const express = require("express");
const { ensureAuthenticated } = require("../../config/auth");
const router = express.Router();
const rimraf = require("rimraf");
const path = require("path");
const config = require("config");
const mongoose = require("mongoose");
const TempFolders = require("../../models/TempFolders");
const { listeners } = require("process");
const fs = require("fs");

// @route   POST /api/tempFolders/deleteTempFolders
// @desc    finds and deletes if any tempfolder is there used by the user
// @access  PUBLIC
router.post("/deleteTempFolders", ensureAuthenticated, (req, res) => {
  const { valid } = req.body;

  if (typeof "valid" === undefined || valid !== "VAlID2435") {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }

  TempFolders.findOne({ user: req.user.id }, (err, tempFolder) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Server error while finding the temp folder",
      });
    }
    if (tempFolder !== null) {
      tempFolder.uniqueId.forEach((uniqueId, index) => {
        // Path of the temporary directory that contains uploaded car images
        const dir = `${
          path.join(__dirname, "../../") + "assets/uploads/temp/" + uniqueId
        }`;
        console.log(uniqueId);
        // Remove the temp folder with unique id
        fs.exists(dir, (exists) => {
          if (exists) {
            rimraf(dir, (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  msg: "Server error while delting the temp folder",
                });
              }
              //   If last index return response
              if (index === tempFolder.uniqueId.length - 1) {
                tempFolder
                  .remove()
                  .then(() => {
                    return res.json({ success: true });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
          } else {
            return res.json({ success: true });
          }
        });
      });
    } else {
      return res.json({ success: true });
    }
  });
});

// @route   GET /api/tempFolders/getTotal
// @desc    Get total number of the temp folders for the given date
// @access  ADMIN
router.post("/getTotal", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter } = req.query;

  const filterDetail = JSON.parse(filter);

  let date = null;
  if (typeof filterDetail.date !== "undefined") {
    date = filterDetail.date;
    delete filterDetail.date;
  }

  const getData = (documents) => {
    let total = 0;
    const incrementTotal = () => {
      total++;
    };

    // If date filter is given we need to check the date here
    // since its easier to check here
    if (date !== null) {
      let dateToCheck = new Date(date);
      documents.forEach((document) => {
        let documentDate = new Date(document.date);

        if (
          dateToCheck.getFullYear() === documentDate.getFullYear() &&
          dateToCheck.getDate() === documentDate.getDate() &&
          dateToCheck.getMonth() === documentDate.getMonth()
        ) {
          incrementTotal();
        }
      });
    }

    return total;
  };

  // When admin needs multiple users then we send filters to the api
  TempFolders.find(filterDetail).exec((err, documents) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Error finding the document.",
      });
    }

    if (!documents.length) {
      return res.json({ data: [], success: true, total: documents.length });
    }

    // Getting the REST friendly datas
    let total = getData(documents);

    return res.json({ success: true, total });
  });
});

// @route   GET /api/tempFolders/
// @desc    Get all the confirm emails
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  const filterDetail = JSON.parse(filter);

  // If id in filter is not valid send empty list back
  if (typeof filterDetail._id !== "undefined") {
    const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

    if (!isValid) {
      return res.json({ data: [], success: true, total: 0 });
    }
  }

  let date = null;
  if (typeof filterDetail.date !== "undefined") {
    date = filterDetail.date;
    delete filterDetail.date;
  }

  const ranges = JSON.parse(range);
  const firstIndex = ranges[0];
  const lastIndex = ranges[1];

  const sortDetail = JSON.parse(sort);
  let sortAccordingTo = "";
  switch (sortDetail[0]) {
    // If id or profile is used we use _id as id is placed as _id by mongoose
    case "id":
      sortAccordingTo = "_id";
      break;
    default:
      sortAccordingTo = sortDetail[0];
      break;
  }

  const sortDirection = sortDetail[1] === "ASC" ? "" : "-";

  const getData = (documents) => {
    let data = [];
    const pushToData = (document) => {
      data.push({
        uniqueId: document.uniqueId,
        id: document.id,
        date: document.date,
        user: document.user,
      });
    };

    // If date filter is given we need to check the date here
    // since its easier to check here
    if (date !== null) {
      let dateToCheck = new Date(date);
      documents.forEach((document) => {
        let documentDate = new Date(document.date);

        if (
          dateToCheck.getFullYear() === documentDate.getFullYear() &&
          dateToCheck.getDate() === documentDate.getDate() &&
          dateToCheck.getMonth() === documentDate.getMonth()
        ) {
          pushToData(document);
        }
      });
    } else {
      documents.forEach((document) => {
        pushToData(document);
      });
    }

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  TempFolders.find(filterDetail)
    .sort(`${sortDirection}${sortAccordingTo}`)
    .exec((err, documents) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Error finding the document.",
        });
      }

      if (!documents.length) {
        return res.json({ data: [], success: true, total: documents.length });
      }

      // Getting the REST friendly datas
      let data = getData(documents);
      //  Getting the total
      let total = data.length;
      // Pagination in front end
      let splicedDocuments = data.slice(firstIndex, lastIndex + 1);
      // setting the data to spliced documents
      data = splicedDocuments;

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/tempFolders/:id
// @desc    Get a tempFolders wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  TempFolders.findById(id)
    .then((document) => {
      if (!document) {
        return res.json({
          data: {},
          success: false,
          err: "noUserError",
          msg: "Could not find such id.",
        });
      }
      return res.json({
        data: {
          uniqueId: document.uniqueId,
          id: document.id,
          date: document.date,
          user: document.user,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/tempFolders?query
// @desc    Delete tempfolder in query in the databse and in the server
// @access  ADMIN
router.delete("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple users then we send filters to the body
  if (typeof req.query.filter !== "undefined") {
    const { filter } = req.query;
    const filterJSON = JSON.parse(filter);
    const { id } = filterJSON;

    // Delete all the confirm email with id in id list.
    TempFolders.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the user.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          document.uniqueId.forEach((uniqueId, index) => {
            // Path of the temporary directory that contains uploaded car images
            const dir = `${
              path.join(__dirname, "../../") + "assets/uploads/temp/" + uniqueId
            }`;
            console.log(uniqueId);
            fs.exists(dir, (exists) => {
              if (exists) {
                // Remove the temp folder with unique id
                rimraf(dir, (err) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      msg: "Server error while delting the temp folder",
                    });
                  }
                  //   If last index return response
                  if (index === document.uniqueId.length - 1) {
                    promises.push(document.remove());
                  }
                });
              }
            });
          });
        });

        // Deleting the users
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the users.",
            });
          });
      });
  }
});

router.delete("/deleteBeforeToday", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // Delete all the confirm email with id in id list.
  TempFolders.find({}).exec((err, documents) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Error finding the user.",
      });
    }

    let beforeTodayFolders = [];

    documents.forEach((document) => {
      let date = new Date(document.date);
      let dd = String(date.getDate()).padStart(2, "0");
      let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = date.getFullYear();

      date = yyyy + "-" + mm + "-" + dd;

      let today = new Date();
      dd = String(today.getDate()).padStart(2, "0");
      mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      yyyy = today.getFullYear();

      today = yyyy + "-" + mm + "-" + dd;

      today = new Date(today);
      date = new Date(date);

      if (date < today) {
        beforeTodayFolders.push(document);
      }
    });

    if (!beforeTodayFolders.length) {
      return res.json({
        success: true,
        msg: "No temp folder before today exists.",
      });
    }

    let promises = [];

    // Adding all the promise to delete
    beforeTodayFolders.forEach((document) => {
      document.uniqueId.forEach((uniqueId, index) => {
        // Path of the temporary directory that contains uploaded car images
        const dir = `${
          path.join(__dirname, "../../") + "assets/uploads/temp/" + uniqueId
        }`;
        console.log(uniqueId);
        fs.exists(dir, (exists) => {
          if (exists) {
            // Remove the temp folder with unique id
            rimraf(dir, (err) => {
              if (err) {
                throw err;
              }
              //   If last index return response
              if (index === document.uniqueId.length - 1) {
                promises.push(document.remove());
              }
            });
          }
        });
      });
    });

    // Deleting the users
    Promise.all(promises)
      .then(() => {
        return res.json({
          success: true,
          msg: "Temp folder created before today has been deleted.",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Error deleting the users.",
        });
      });
  });
});

module.exports = router;
