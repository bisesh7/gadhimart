const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../../config/auth").ensureAuthenticated;
const ReportUser = require("../../models/ReportUser");
const config = require("config");

// @route   POST /api/reportUser
// @desc    report the user
// @access  Private
router.post("/", ensureAuthenticated, (req, res) => {
  const {
    valid,
    listingId,
    vehicleType,
    reportedBy,
    chatSession,
    reportedUser,
    reportType,
    reportDescription,
  } = req.body;

  console.log(req.body);

  if (
    typeof valid === "undefined" ||
    typeof listingId === "undefined" ||
    typeof vehicleType === "undefined" ||
    typeof reportedBy === "undefined" ||
    typeof chatSession === "undefined" ||
    typeof reportedUser === "undefined" ||
    typeof reportType === "undefined" ||
    typeof reportDescription === "undefined" ||
    valid !== "VALId223" ||
    reportedBy !== req.user.id
  ) {
    console.log("Validation Error");
    return res.status(400).json({ success: false });
  }

  switch (reportType) {
    case "Scam":
    case "Bad words":
    case "Other":
      break;
    default:
      console.log("report type Error");
      return res.status(400).json({ success: false });
  }

  const checkDescription = () => {
    if (
      reportDescription.length < 50 ||
      reportDescription.length > 1000 ||
      reportDescription === ""
    ) {
      console.log("description Error");
      return res.status(400).json({ success: false });
    }
  };

  checkDescription();

  ReportUser.findOne({ chatSession }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: "false", msg: "Error saving the report" });
    }

    if (document !== null) {
      return res.json({ success: true });
    } else {
      const newReport = new ReportUser({
        listingId,
        vehicleType,
        reportedBy,
        chatSession,
        reportedUser,
        reportType,
        reportDescription,
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
  });
});

// @route   GET /api/reportUser/getTotal
// @desc    Get total number of the user reports for the given date
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
  ReportUser.find(filterDetail).exec((err, documents) => {
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

// @route   GET /api/reportUser/
// @desc    Get all the user reports
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple users then we send filters to the api
  ReportUser.find({}).exec((err, documents) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Error finding the user reports.",
      });
    }

    if (!documents.length) {
      return res.json({ data: [], success: true });
    }

    return res.json({ data: documents, success: true });
  });
});

module.exports = router;
