const express = require("express");
const router = express.Router();
const config = require("config");
const mongoose = require("mongoose");

//Message Model
const ChatSession = require("../../models/ChatSessions");

// @route   GET /api/carChatSessions/
// @desc    Get all the car chat sessions
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  let filterDetail = JSON.parse(filter);

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

  filterDetail.vehicleType = "Car";

  // For reference fields
  if (typeof filterDetail.id !== "undefined") {
    // Since mongoose only accepts _id
    filterDetail = { _id: filterDetail.id };
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
        id: document.id,
        carId: document.listingId,
        uniqueId: document.uniqueId,
        usersInvolved: document.usersInvolved,
        date: document.date,
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
  ChatSession.find(filterDetail)
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

      // The indexes will only be given the list view
      // In reference view indexes will not be given so it will be null
      // So we dont splice the document
      if (firstIndex !== null && lastIndex !== null) {
        // Getting the REST friendly datas
        data = getData(documents);
        //  Getting the total
        total = data.length;
        // Pagination in front end
        let splicedDocuments = data.slice(firstIndex, lastIndex + 1);
        // setting the data to spliced documents
        data = splicedDocuments;
      } else {
        // Getting the REST friendly datas
        data = getData(documents);
        //  Getting the total
        total = data.length;
      }

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/carChatSessions/:id
// @desc    Get a car chat session wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  ChatSession.findById(id)
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
          id: document.id,
          carId: document.listingId,
          uniqueId: document.uniqueId,
          usersInvolved: document.usersInvolved,
          messages: document.messages,
          date: document.date,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/carChatSessions?query
// @desc    Delete car chat sessions in query
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
    ChatSession.find({ vehicleType: "Car" })
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

        // Deleting the users
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the car chat sessions.",
            });
          });
      });
  }
});

module.exports = router;
