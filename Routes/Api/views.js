const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../../config/auth").ensureAuthenticated;
const config = require("config");

// User model
const Views = require("../../models/Views");

// @route   POST /api/views/setView
// @desc    Register new view
// @access  PUBLIC
router.post("/setView", (req, res) => {
  const { ipAddress, listingId, vehicleType, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof listingId === "undefined" ||
    typeof ipAddress === "undefined" ||
    typeof vehicleType === "undefined" ||
    valid !== config.API_KEY
  ) {
    return res.status(400).json({ success: false });
  }

  Views.findOne({ vehicleId: listingId }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server error" });
    }

    if (document === null) {
      const newLisitingView = new Views({
        ipAddresses: [ipAddress],
        vehicleType,
        vehicleId: listingId,
        views: 1,
      });

      newLisitingView
        .save()
        .then((res) => {
          return res.json({ success: true });
        })
        .catch((err) => {
          return res.status(500).json({ success: true });
        });
    } else {
      if (!document.ipAddresses.includes(ipAddress)) {
        document.ipAddresses.push(ipAddress);
        document.views = document.views + 1;
        document
          .save()
          .then((res) => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({ success: true });
          });
      } else {
        return res.json({ success: true });
      }
    }
  });
});

// @route   POST /api/views/getView
// @desc    get the number of views for a givn listing
// @access  PUBLIC
router.post("/getViews", ensureAuthenticated, (req, res) => {
  const { valid, listingId, vehicleType } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof listingId === "undefined" ||
    typeof vehicleType === "undefined" ||
    valid !== "VAlid239"
  ) {
    return res.status(400).json({ success: false });
  }

  Views.findOne({ vehicleId: listingId, vehicleType }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (document === null) {
      return res.json({ success: true, views: 0 });
    } else {
      return res.json({ success: true, views: document.ipAddresses.length });
    }
  });
});

// @route   POST /api/views/popularAds
// @desc    get the 15 popular ads
// @access  PUBLIC
router.post("/popularAds", (req, res) => {
  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== config.API_KEY) {
    return res.status(400).json({ success: false });
  }

  Views.find({}, (err, documents) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (documents.length <= 15) {
      return res.json({ success: true, popularListings: documents });
    } else {
      return res.json({
        success: true,
        popularListings: documents.slice(0, 16),
      });
    }
  });
});

module.exports = router;
