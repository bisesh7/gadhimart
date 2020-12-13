const express = require("express");
const router = express.Router();
const Admin = require("../../models/Admin");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route   POST /api/admin/
// @desc    Create  a admin
// @access  ADMIN
router.post("/", (req, res) => {
  const { valid, data } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  const { email, password } = data;

  Admin.findOne({ email: email.toLowerCase() }).then((admin) => {
    if (admin) {
      res.status(400).json({
        msg: "Admin already exists.",
        success: false,
      });
    } else {
      const newAdmin = new Admin({
        email: email.toLowerCase(),
        password,
      });
      // hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, passwordHash) => {
          if (err) {
            return res
              .status(500)
              .json({ msg: "Server error, please try again!" });
          }

          newAdmin.password = passwordHash;
          newAdmin.save().then(() => {
            return res.json({ success: true });
          });
        });
      });
    }
  });
});

// @route   POST /api/admin/login
// @desc    Authnticate the admin and login
// @access  ADMIN
router.post("/login", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { email, password } = req.body;
  console.log(req.body);

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        return res.status(400).json({ msg: "Incorrect Credentials." });
      }

      // Match the password
      bcrypt.compare(password, admin.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          console.log("password match");
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(config.ADMIN_KEY, salt, (err, token) => {
              if (err) {
                return res
                  .status(500)
                  .json({ msg: "Server error 1.0, please try again!" });
              }
              console.log(token);
              return res.json({ token, success: true });
            });
          });
        } else {
          console.log("password doesn't match");
          return res
            .status(400)
            .json({ msg: "Incorrect credentials", success: true });
        }
      });
    })
    .catch((err) => console.log(err));
});

// @route   GET /api/admin/
// @desc    Get all the admins.
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
        email: document.email,
        id: document.id,
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
  Admin.find(filterDetail)
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

// @route   GET /api/admin/:id
// @desc    Get a admin wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  if (id === "undefined") {
    return res.json({
      data: {},
      success: true,
    });
  }

  Admin.findOne({ _id: id })
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
          email: document.email,
          name: document.name,
          id: document.id,
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

// @route   DELETE /api/admin?query
// @desc    Delete admins. in query
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

    // Delete all the admin with id in id list.
    Admin.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the admins..",
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
              msg: "Error deleting the users.",
            });
          });
      });
  }
});

module.exports = router;
