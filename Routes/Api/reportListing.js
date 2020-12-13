const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const config = require("config");

const ReportListing = require("../../models/ReportListing");

// @route   POST /api/reportListing
// @desc    Save new car ad
// @access  Private
router.post("/", (req, res) => {
  const {
    valid,
    reportType,
    description,
    email,
    listingId,
    vehicleType,
  } = req.body;

  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (
    typeof valid === "undefined" ||
    typeof reportType !== "string" ||
    typeof description !== "string" ||
    typeof email !== "string" ||
    typeof listingId !== "string" ||
    typeof vehicleType !== "string" ||
    valid !== config.API_KEY ||
    email === "" ||
    emailRegex.test(email) === false ||
    reportType === ""
  ) {
    console.log("Validation failed");
    return res.status(400).json({ success: false });
  }

  const checkDescription = () => {
    if (
      description.length < 50 ||
      description.length > 1000 ||
      description === ""
    ) {
      console.log("Description Error");
      return res.status(400).json({ success: false });
    }
  };

  if (reportType === "Other") {
    checkDescription();
  }

  if (description !== "") {
    checkDescription();
  }

  ReportListing.findOne(
    {
      listingId,
      reportedByEmail: email,
    },
    (err, document) => {
      if (err) {
        return res
          .status(500)
          .json({ success: "false", msg: "Error saving the report" });
      }

      if (document !== null) {
        return res.json({ success: true });
      } else {
        const newReport = new ReportListing({
          listingId,
          vehicleType,
          reportedByEmail: email,
          reportType,
          reportDescription: description,
        });

        newReport
          .save()
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ success: "false", msg: "Error saving the report" });
          });
      }
    }
  );
});

// @route   GET /api/reportListing/getTotal
// @desc    Get total number of the listing reports for the given date
// @access  ADMIN
router.get("/getTotal", (req, res) => {
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
  ReportListing.find(filterDetail).exec((err, documents) => {
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

module.exports = router;
