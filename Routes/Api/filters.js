const express = require("express");
const router = express.Router();
const Filters = require("../../models/Filters");
const config = require("config");

// @route   POST /api/filters/createLists
// @desc    Create all the filters
// @access  ADMIN
router.post("/createLists", (req, res) => {
  const { valid } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  Filters.find({}).then((documents) => {
    if (documents.length) {
      return res
        .status(400)
        .json({ success: false, msg: "Filters already exists." });
    }
    Filters.insertMany([
      {
        transmissions: ["Automatic", "Manual", "Other"],
        bodyTypes: [
          "Pickup Truck",
          "SUV",
          "Sedan",
          "Van",
          "Coupe",
          "Hatchback",
          "Wagon",
          "Other",
        ],
        conditions: ["Used", "New", "Rental", "Damaged", "For Parts", "Other"],
        fuelTypes: [
          "Petrol / Gasoline",
          "Electric",
          "Diesel",
          "Hybrid-Electric",
          "Other",
        ],
        driveTrains: [
          "4*4",
          "All-wheel drive (AWD)",
          "Front-wheel drive (FWD)",
          "Rear-wheel drive (RWD)",
          "Other",
        ],
        colors: [
          "Biege",
          "Black",
          "Blue",
          "Brown",
          "Burgundy",
          "Gold",
          "Green",
          "Grey",
          "Off-White",
          "Orange",
          "Pink",
          "Purple",
          "Red",
          "Silver",
          "Tan",
          "Teal",
          "White",
          "Yellow",
          "Other",
        ],
        seats: ["2", "3", "4", "5", "6", "7", "Other"],
        doors: ["2", "3", "4", "5", "Other"],
        featuresFrontEnd: [
          "Sunroof",
          "Alloy wheels",
          "Navigation system",
          "Bluetooth",
          "Push start button",
          "Parking assistant",
          "Cruise control",
          "Air conditioning",
          "Power steering",
          "Power window",
          "Key-less remote entry",
          "Anti-lock braking system (ABS)",
          "Apple Carplay",
          "Android Auto",
        ],
        featuresDatabase: [
          "carHasSunRoof",
          "carHasAlloyWheels",
          "carHasNavigationSystem",
          "carHasBluetooth",
          "carHasPushStart",
          "carHasParkingAssistant",
          "carHasCruiseControl",
          "carHasAirConditioning",
          "carHasPowerSteering",
          "carHasPowerWindow",
          "carHasKeylessEntry",
          "carHasAbs",
          "carHasCarplay",
          "carHasAndroidAuto",
        ],
        vehicleType: "Car",
      },
      {
        bodyTypes: [
          "Standard",
          "Cruiser",
          "Sport Bike",
          "Touring",
          "Scooter",
          "Moped",
          "Off-Road",
          "Other",
        ],
        conditions: ["Used", "New", "Rental", "Damaged", "For Parts"],
        fuelTypes: ["Petrol / Gasoline", "Electric", "Other"],
        colors: [
          "Biege",
          "Black",
          "Blue",
          "Brown",
          "Burgundy",
          "Gold",
          "Green",
          "Grey",
          "Off-White",
          "Orange",
          "Pink",
          "Purple",
          "Red",
          "Silver",
          "Tan",
          "Teal",
          "White",
          "Yellow",
          "Other",
        ],
        featuresFrontEnd: [
          "Electric start",
          "Alloy wheels",
          "Tubeless tyres",
          "Digital display panel",
          "Projected headlight",
          "Led tail light",
          "Front disc brake",
          "Rear disc brake",
          "Anti-lock braking system (ABS)",
          "Mono suspension",
          "Split seat",
          "Tripmeter",
        ],
        featuresDatabase: [
          "hasElectricStart",
          "hasAlloyWheels",
          "hasTubelessTyres",
          "hasDigitalDisplayPanel",
          "hasProjectedHeadLight",
          "hasLedTailLight",
          "hasFrontDiscBrake",
          "hasRearDiscBrake",
          "hasAbs",
          "hasMonoSuspension",
          "hasSplitSeat",
          "hasTripMeter",
        ],
        vehicleType: "Motorcycle",
      },
    ])
      .then(() => {
        console.log("lists created");
        return res.json({ success: true, msg: "List created." });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ success: false });
      });
  });
});

// @route   GET /api/filters/car/transmissions
// @desc    Get all the car transmissions
// @access  PUBLIC
router.get("/car/transmissions", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.transmissions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/bodyTypes
// @desc    Get all the car body types
// @access  PUBLIC
router.get("/car/bodyTypes", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.bodyTypes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/conditions
// @desc    Get all the car conditions
// @access  PUBLIC
router.get("/car/conditions", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.conditions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/fuelTypes
// @desc    Get all the car fuelTypes
// @access  PUBLIC
router.get("/car/fuelTypes", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.fuelTypes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/driveTrains
// @desc    Get all the car driveTrains
// @access  PUBLIC
router.get("/car/driveTrains", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.driveTrains);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/colors
// @desc    Get all the car colors
// @access  PUBLIC
router.get("/car/colors", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.colors);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/seats
// @desc    Get all the car seats
// @access  PUBLIC
router.get("/car/seats", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.seats);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/doors
// @desc    Get all the car doors
// @access  PUBLIC
router.get("/car/doors", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.doors);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/featuresFrontEnd
// @desc    Get all the car featuresFrontEnd
// @access  PUBLIC
router.get("/car/featuresFrontEnd", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.featuresFrontEnd);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/featuresDatabase
// @desc    Get all the car featuresDatabase
// @access  PUBLIC
router.get("/car/featuresDatabase", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Car" })
    .then((document) => {
      return res.json(document.featuresDatabase);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/motorcycle/bodyTypes
// @desc    Get all the motorcycle body types
// @access  PUBLIC
router.get("/motorcycle/bodyTypes", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.bodyTypes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/motorcycle/conditions
// @desc    Get all the motorcycle conditions
// @access  PUBLIC
router.get("/motorcycle/conditions", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.conditions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/motorcycle/fuelTypes
// @desc    Get all the motorcycle fuelTypes
// @access  PUBLIC
router.get("/motorcycle/fuelTypes", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.fuelTypes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/motorcycle/colors
// @desc    Get all the motorcycle colors
// @access  PUBLIC
router.get("/motorcycle/colors", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.colors);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/car/featuresFrontEnd
// @desc    Get all the motorcycle featuresFrontEnd
// @access  PUBLIC
router.get("/motorcycle/featuresFrontEnd", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.featuresFrontEnd);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/motorcycle/featuresDatabase
// @desc    Get all the motorcycle featuresDatabase
// @access  PUBLIC
router.get("/motorcycle/featuresDatabase", (req, res) => {
  if (req.header("authorization") !== config.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }
  // Function call
  Filters.findOne({ vehicleType: "Motorcycle" })
    .then((document) => {
      return res.json(document.featuresDatabase);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/filters/
// @desc    Get all the filters
// @access  PUBLIC
router.get("/", (req, res) => {
  switch (req.header("authorization")) {
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
        transmissions: document.transmissions,
        id: document.id,
        vehicleType: document.vehicleType,
        bodyTypes: document.bodyTypes,
        conditions: document.conditions,
        fuelTypes: document.fuelTypes,
        driveTrains: document.driveTrains,
        colors: document.colors,
        seats: document.seats,
        doors: document.doors,
        featuresFrontEnd: document.featuresFrontEnd,
        featuresDatabase: document.featuresDatabase,
      });
    };

    documents.forEach((document) => {
      pushToData(document);
    });

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  Filters.find(filterDetail)
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

// @route   GET /api/filters/:id
// @desc    Get a filter wih given id
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

  Filters.findById(id)
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
          transmissions: document.transmissions,
          id: document.id,
          vehicleType: document.vehicleType,
          bodyTypes: document.bodyTypes,
          conditions: document.conditions,
          fuelTypes: document.fuelTypes,
          driveTrains: document.driveTrains,
          colors: document.colors,
          seats: document.seats,
          doors: document.doors,
          featuresFrontEnd: document.featuresFrontEnd,
          featuresDatabase: document.featuresDatabase,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/filters/:id
// @desc    Delete filters with given id
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

  Filters.findOne({ _id: id }).then((document) => {
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

// @route   DELETE /api/filters?query
// @desc    Delete filters in query
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

    // Delete all the filters with id in id list.
    Filters.find()
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

module.exports = router;
