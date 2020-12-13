const express = require("express");
const router = express.Router();
const ProvinceWithDistricts = require("../../models/ProvinceWithDistricts");
const config = require("config");

// @route   POST /api/provinceWithDistricts/createLists
// @desc    Create all the provinceWithDistricts
// @access  ADMIN
router.post("/createLists", (req, res) => {
  const { valid } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  ProvinceWithDistricts.find({}).then((documents) => {
    if (documents.length) {
      return res
        .status(400)
        .json({ success: false, msg: "Makes already exists." });
    }

    ProvinceWithDistricts.insertMany([
      {
        province: "Province 1",
        name: "",
        districts: [
          { district: "Taplejung", key: "0" },
          { district: "Sankhuwasabha", key: "1" },
          { district: "Solukhumbu", key: "2" },
          { district: "Okhaldhunga", key: "3" },
          { district: "Khotang", key: "4" },
          { district: "Bhojpur", key: "5" },
          { district: "Dhankuta", key: "6" },
          { district: "Terhathum", key: "7" },
          { district: "Panchthar", key: "8" },
          { district: "Ilam", key: "9" },
          { district: "Jhapa", key: "10" },
          { district: "Morang", key: "11" },
          { district: "Sunsari", key: "12" },
          { district: "Udayapur", key: "13" },
        ],
      },
      {
        province: "Province 2",
        name: "",
        districts: [
          { district: "Saptari", key: "0" },
          { district: "Siraha", key: "1" },
          { district: "Dhanusa", key: "2" },
          { district: "Mahottari", key: "3" },
          { district: "Sarlahi", key: "4" },
          { district: "Rautahat", key: "5" },
          { district: "Bara", key: "6" },
          { district: "Parsa", key: "7" },
        ],
      },
      {
        province: "Province 3",
        name: "Bagmati Pradesh",
        districts: [
          { district: "Dolakha", key: "0" },
          { district: "Sindhupalchok", key: "1" },
          { district: "Rasuwa", key: "2" },
          { district: "Dhading", key: "3" },
          { district: "Nuwakot", key: "4" },
          { district: "Kathmandu", key: "5" },
          { district: "Bhaktapur", key: "6" },
          { district: "Lalitpur", key: "7" },
          { district: "Kavrepalanchok", key: "8" },
          { district: "Ramechhap", key: "9" },
          { district: "Sindhuli", key: "10" },
          { district: "Makawanpur", key: "11" },
          { district: "Chitawan", key: "12" },
        ],
      },
      {
        province: "Province 4",
        name: "Gandaki Pradesh",
        districts: [
          { district: "Gorkha", key: "0" },
          { district: "Manang", key: "1" },
          { district: "Mustang", key: "2" },
          { district: "Myagdi", key: "3" },
          { district: "Kaski", key: "4" },
          { district: "Lamjung", key: "5" },
          { district: "Tanahu", key: "6" },
          { district: "Nawalparasi East", key: "7" },
          { district: "Syangja", key: "8" },
          { district: "Parbat", key: "9" },
          { district: "Baglung", key: "10" },
        ],
      },
      {
        province: "Province 5",
        name: "",
        districts: [
          { district: "Rukum East", key: "0" },
          { district: "Rolpa", key: "1" },
          { district: "Pyuthan", key: "2" },
          { district: "Gulmi", key: "3" },
          { district: "Arghakhanchi", key: "4" },
          { district: "Palpa", key: "5" },
          { district: "Nawalparasi West", key: "6" },
          { district: "Rupandehi", key: "7" },
          { district: "Kapilbastu", key: "8" },
          { district: "Dang", key: "9" },
          { district: "Banke", key: "10" },
          { district: "Bardiya", key: "11" },
        ],
      },
      {
        province: "Province 6",
        name: "Karnali Pradesh",
        districts: [
          { district: "Dolpa", key: "0" },
          { district: "Mugu", key: "1" },
          { district: "Humla", key: "2" },
          { district: "Jumla", key: "3" },
          { district: "Kalikot", key: "4" },
          { district: "Dailekh", key: "5" },
          { district: "Jajarkot", key: "6" },
          { district: "Rukum West", key: "7" },
          { district: "Salyan", key: "8" },
          { district: "Surkhet", key: "9" },
        ],
      },
      {
        province: "Province 7",
        name: "Sudarpashim Pradesh",
        districts: [
          { district: "Bajura", key: "0" },
          { district: "Bajhang", key: "1" },
          { district: "Darchula", key: "2" },
          { district: "Baitadi", key: "3" },
          { district: "Dadeldhura", key: "4" },
          { district: "Doti", key: "5" },
          { district: "Achham", key: "6" },
          { district: "Kailali", key: "7" },
          { district: "Kanchanpur", key: "8" },
        ],
      },
    ])
      .then(function () {
        return res.json({ success: true, msg: "List created." });
      })
      .catch(function (error) {
        console.log(error);
        return res.json({ success: false });
      });
  });
});

// @route   GET /api/provinceWithDistricts/
// @desc    Get all the provinceWithDistricts
// @access  PUBLIC
router.get("/", (req, res) => {
  switch (req.header("authorization")) {
    case config.API_KEY:
    case config.ADMIN_KEY:
      break;

    default:
      return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  let filterDetail = {};
  if (typeof filter !== "undefined") {
    filterDetail = JSON.parse(filter);
  }

  //   Search function in the react-admin
  // If id in filter is not valid send empty list back
  if (typeof filterDetail._id !== "undefined") {
    const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

    if (!isValid) {
      return res.json({ data: [], success: true, total: 0 });
    }
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
        province: document.province,
        id: document.id,
        name: document.name,
        districts: document.districts,
      });
    };

    documents.forEach((document) => {
      pushToData(document);
    });

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  ProvinceWithDistricts.find(filterDetail)
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

// @route   GET /api/provinceWithDistrict/:id
// @desc    Get a province with districts wih given id
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

  ProvinceWithDistricts.findById(id)
    .then((document) => {
      if (!document) {
        return res.json({
          data: {},
          success: false,
          msg: "Could not find such id.",
        });
      }
      return res.json({
        data: {
          province: document.province,
          id: document.id,
          name: document.name,
          districts: document.districts,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/provinceWithDistrict/:id
// @desc    Delete provinceWithDistrict with given id
// @access  ADMIN
router.delete("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const id = req.params.id;

  //   Check the type and secret key
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      msg: "Please provide valid informations.",
    });
  }

  ProvinceWithDistricts.findOne({ _id: id }).then((document) => {
    if (!document) {
      return res.status(400).json({
        success: false,
        err: "noEmailError",
        msg: "No such email exists.",
      });
    }

    document
      .remove()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Server error while deleting the quiz.",
        });
      });
  });
});

// @route   DELETE /api/provinceWithDistrict?query
// @desc    Delete provinceWithDistrict in query
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
    ProvinceWithDistricts.find()
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

// @route   PUT /api/provinceWithDistrict/:id
// @desc    Update a provinceWithDistrict with given id
// @access  ADMIN
router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { id } = req.params;
  const { province, valid, districts, name } = data;

  console.log(data);

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  ProvinceWithDistricts.findOne({ _id: id }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    document.province = province;
    document.districts = districts;
    document.name = name;

    document
      .save()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ success: false });
      });
  });
});

// @route   POST /api/provinceWithDistrict/
// @desc    create province with districts
// @access  ADMIN
router.post("/", (req, res) => {
  const { valid, data } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  const { province, districts, name } = data;

  const newProvinceWithDistricts = new ProvinceWithDistricts({
    province,
    districts,
    name,
  });

  newProvinceWithDistricts
    .save()
    .then(() => {
      return res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ success: false });
    });
});

module.exports = router;
