const express = require("express");
const router = express.Router();
const config = require("config");
const mongoose = require("mongoose");
const UserLoginDetail = require("../../models/UserLoginDetail");

// @route   GET /api/userLoginDetails/
// @desc    Get all the user login details
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
        userId: document.userId,
        id: document.id,
        lastLoginDate: document.lastLoginDate,
        lastLogoutDate: document.lastLogoutDate,
        lastLoginTime: new Date(document.lastLoginDate).toTimeString(),
        lastLogoutTime: new Date(document.lastLogoutDate).toTimeString(),
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

  // When admin needs multiple user login details then we send filters to the api
  UserLoginDetail.find(filterDetail)
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

// @route   GET /api/userLoginDetails/:id
// @desc    Get a user login detail wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  UserLoginDetail.findById(id)
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
          userId: document.userId,
          id: document.id,
          lastLoginDate: document.lastLoginDate,
          lastLogoutDate: document.lastLogoutDate,
          lastLoginTime: new Date(document.lastLoginDate).toTimeString(),
          lastLogoutTime: new Date(document.lastLogoutDate).toTimeString(),
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/userLoginDetails?query
// @desc    Delete user login details in query
// @access  ADMIN
router.delete("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple user login details then we send filters to the body
  if (typeof req.query.filter !== "undefined") {
    const { filter } = req.query;
    const filterJSON = JSON.parse(filter);
    const { id } = filterJSON;

    // Delete all the user login detail with id in id list.
    UserLoginDetail.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the user login details.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(document.remove());
        });

        // Deleting the user login details
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the user login details.",
            });
          });
      });
  }
});

module.exports = router;
