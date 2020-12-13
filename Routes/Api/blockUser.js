const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../../config/auth").ensureAuthenticated;
const config = require("config");
const mongoose = require("mongoose");
const BlockUser = require("../../models/BlockUser");

// @route   POST /api/blockUser
// @desc    block a given user
// @access  Private
router.post("/", ensureAuthenticated, (req, res) => {
  const { valid, otherUser } = req.body;
  if (
    typeof valid === "undefined" ||
    typeof otherUser === "undefined" ||
    valid !== "ValID531"
  ) {
    console.log(
      "Validation failed",
      typeof valid === "undefined",
      typeof otherUser === "undefined",
      valid !== "ValID531"
    );
    return res.status(400).json({ success: false });
  }

  BlockUser.findOne({ user: req.user.id }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error finding the document" });
    }

    if (document === null) {
      const newBlockUser = new BlockUser({
        user: req.user.id,
        blockedUsers: [otherUser],
        totalBlocked: 1,
      });

      newBlockUser
        .save()
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, msg: "Error saving the document" });
        });
    } else {
      if (!document.blockedUsers.includes(otherUser)) {
        document.blockedUsers.push(otherUser);
        document.totalBlocked = document.totalBlocked + 1;
        document
          .save()
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, msg: "Error saving the document" });
          });
      } else {
        return res.json({ success: true });
      }
    }
  });
});

// @route   POST /api/blockUser/checkOtherUserIsBlocked
// @desc    check other user is blocked
// @access  Private
router.post("/checkOtherUserIsBlocked", ensureAuthenticated, (req, res) => {
  const { otherUser, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof otherUser === "undefined" ||
    valid !== "ValID531"
  ) {
    console.log(
      "Validation failed",
      typeof valid === "undefined",
      typeof otherUser === "undefined",
      valid !== "ValID531"
    );
    return res.status(400).json({ success: false });
  }

  BlockUser.findOne({ user: req.user.id }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error finding the document" });
    }

    if (document === null) {
      return res.json({ success: true, otherUserBlocked: false });
    } else {
      if (document.blockedUsers.includes(otherUser)) {
        return res.json({ success: true, otherUserBlocked: true });
      } else {
        return res.json({ success: true, otherUserBlocked: false });
      }
    }
  });
});

// @route   POST /api/blockUser/checkUserIsBlocked
// @desc    check if the user is blocked by other user
// @access  Private
router.post("/checkUserIsBlocked", ensureAuthenticated, (req, res) => {
  const { otherUser, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof otherUser === "undefined" ||
    valid !== "ValID531"
  ) {
    console.log(
      "Validation failed",
      typeof valid === "undefined",
      typeof otherUser === "undefined",
      valid !== "ValID531"
    );
    return res.status(400).json({ success: false });
  }

  BlockUser.findOne({ user: otherUser }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error finding the document" });
    }

    if (document === null) {
      return res.json({ success: true, userBlocked: false });
    } else {
      if (document.blockedUsers.includes(req.user.id)) {
        return res.json({ success: true, userBlocked: true });
      } else {
        return res.json({ success: true, userBlocked: false });
      }
    }
  });
});

// @route   POST /api/blockUser/unblock
// @desc    Unblock other user
// @access  Private
router.post("/unblock", ensureAuthenticated, (req, res) => {
  const { valid, otherUser } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof otherUser === "undefined" ||
    valid !== "ValID531"
  ) {
    console.log(
      "Validation failed",
      typeof valid === "undefined",
      typeof otherUser === "undefined",
      valid !== "ValID531"
    );
    return res.status(400).json({ success: false });
  }

  BlockUser.findOne({ user: req.user.id }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error finding the document" });
    }

    if (document === null) {
      return res.status(400).json({ success: false });
    } else {
      if (document.blockedUsers.includes(otherUser)) {
        if (document.blockedUsers.length === 1) {
          BlockUser.deleteOne({ user: req.user.id })
            .then(() => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ success: false, msg: "Error unblocking the user" });
            });
        } else {
          document.blockedUsers = document.blockedUsers.filter(
            (user) => user !== otherUser
          );
          document.totalBlocked = document.totalBlocked - 1;
          document
            .save()
            .then(() => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ success: false, msg: "Error unblocking the user" });
            });
        }
      } else {
        return res.status(400).json({ success: false });
      }
    }
  });
});

// @route   GET /api/blockUser/
// @desc    Get all the block user
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

  let firstIndex = null;
  let lastIndex = null;

  if (typeof range !== "undefined") {
    const ranges = JSON.parse(range);
    firstIndex = ranges[0];
    lastIndex = ranges[1];
  }

  // If no sort is given we should pass empty string
  let sortAccordingTo = "";
  let sortDirection = "";

  if (typeof sort !== "undefined") {
    const sortDetail = JSON.parse(sort);
    switch (sortDetail[0]) {
      // If id or profile is used we use _id as id is placed as _id by mongoose
      case "id":
        sortAccordingTo = "_id";
        break;
      default:
        sortAccordingTo = sortDetail[0];
        break;
    }
    sortDirection = sortDetail[1] === "ASC" ? "" : "-";
  }

  const getData = (documents) => {
    let data = [];
    const pushToData = (document) => {
      data.push({
        user: document.user,
        id: document.id,
        blockedUsers: document.blockedUsers,
        totalBlocked: document.totalBlocked,
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
  BlockUser.find(filterDetail)
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

      let data = [];
      let total = null;

      // The indexes will only be given the list view
      // In reference view indexes will not be given so it will be null
      // So we dont splice the document
      if (firstIndex !== null && lastIndex !== null) {
        data = getData(documents);
        total = data.length;
        let splicedDocuments = data.slice(firstIndex, lastIndex + 1);
        data = splicedDocuments;
      } else {
        data = getData(documents);
        total = data.length;
      }

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/blockUser/:id
// @desc    Get a confirm email wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  BlockUser.findById(id)
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
          user: document.user,
          id: document.id,
          blockedUsers: document.blockedUsers,
          totalBlocked: document.totalBlocked,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/blockUser?query
// @desc    Delete confirm emails in query
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

    // Delete all the blocker user with id in id list.
    BlockUser.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the confirm emails.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(document.remove());
        });

        // Deleting the documents
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

module.exports = router;
