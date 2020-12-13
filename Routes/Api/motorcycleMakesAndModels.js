const express = require("express");
const router = express.Router();
const MotorcycleMakesAndModels = require("../../models/MotorcycleMakesAndModels");
const config = require("config");

// @route   POST /api/motorcycleMakesAndModels/createLists
// @desc    Create all the motorcycle makes and models
// @access  ADMIN
router.post("/createLists", (req, res) => {
  const { valid } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  MotorcycleMakesAndModels.find({}).then((documents) => {
    if (documents.length) {
      return res
        .status(400)
        .json({ success: false, msg: "Makes already exists." });
    }
    MotorcycleMakesAndModels.insertMany([
      {
        make: "Aprilia",
        models: [
          { model: "SR125", bodyType: "Scooter" },
          { model: "SR150", bodyType: "Scooter" },
          { model: "SR150 Race Edition", bodyType: "Scooter" },
          { model: "Storm", bodyType: "Scooter" },
          { model: "ETX", bodyType: "Sports" },
          { model: "Dorsoduro", bodyType: "Sports" },
          { model: "RX", bodyType: "Dirtbike" },
          { model: "SX", bodyType: "Dirtbike" },
          { model: "STX", bodyType: "Standard" },
          { model: "ETX", bodyType: "Standard" },
          { model: "RS4", bodyType: "Sports" },
          { model: "Shiver", bodyType: "Sports" },
          { model: "RSV4", bodyType: "Sports" },
        ],
      },
      {
        make: "Bajaj",
        models: [
          { model: "Dominar D400", bodyType: "Sports" },
          { model: "Pulsar 200 NS FI ABS", bodyType: "Sports" },
          { model: "Pulsar 220 F", bodyType: "Sports" },
          { model: "Pulsar NS200", bodyType: "Sports" },
          { model: "Pulsar NS 160", bodyType: "Sports" },
          { model: "Pulsar 150", bodyType: "Sports" },
          { model: "Discover", bodyType: "Standard" },
          { model: "Avenger", bodyType: "Cruiser" },
          { model: "Platina", bodyType: "Cruiser" },
          { model: "Wind", bodyType: "Standard" },
          { model: "CT", bodyType: "Standard" },
        ],
      },
      {
        make: "Benelli",
        models: [
          { model: "TNT 135", bodyType: "Sports" },
          { model: "TNT 15", bodyType: "Sports" },
          { model: "TNT 150I", bodyType: "Sports" },
          { model: "BN 251", bodyType: "Sports" },
          { model: "302S", bodyType: "Sports" },
          { model: "TNT 600I", bodyType: "Sports" },
          { model: "302R", bodyType: "Sports" },
          { model: "TNT 600 GT", bodyType: "Touring" },
          { model: "TRX 251", bodyType: "Touring" },
          { model: "TRX 502", bodyType: "Touring" },
          { model: "TRX 502X", bodyType: "Touring" },
          { model: "Leoncino", bodyType: "Sports" },
          { model: "Leoncino Trail", bodyType: "Sports" },
        ],
      },
      {
        make: "BMW",
        models: [
          { model: "G 310 GS", bodyType: "Sports" },
          { model: "G 310 R", bodyType: "Sports" },
          { model: "F 850S", bodyType: "Sports" },
        ],
      },
      {
        make: "CF-Moto",
        models: [
          { model: "ST Papio", bodyType: "Sports" },
          { model: "150 NK", bodyType: "Sports" },
          { model: "250 NK", bodyType: "Sports" },
          { model: "250 SR", bodyType: "Sports" },
          { model: "450 NK", bodyType: "Sports" },
          { model: "450 GT", bodyType: "Sports" },
          { model: "650 NK", bodyType: "Sports" },
          { model: "650 MT", bodyType: "Sports" },
        ],
      },
      {
        make: "Cleveland Cyclewerks",
        models: [
          { model: "Ace Deluxe", bodyType: "Cruiser" },
          { model: "Ace Scrambler", bodyType: "Cruiser" },
          { model: "Misfit", bodyType: "Cruiser" },
          { model: "FXR 125", bodyType: "Cruiser" },
        ],
      },
      {
        make: "CrossX",
        models: [
          { model: "CX250SE Dirt", bodyType: "Dirtbike" },
          { model: "CX250SE Motard", bodyType: "Dirtbike" },
          { model: "CX250R Motard", bodyType: "Dirtbike" },
          { model: "CX250S", bodyType: "Dirtbike" },
        ],
      },
      {
        make: "Crossfire",
        models: [
          { model: "Crossfire HJ 250", bodyType: "Dirtbike" },
          { model: "Crossfire GR7 250", bodyType: "Dirtbike" },
          { model: "Crossfire NC 250", bodyType: "Dirtbike" },
          { model: "Crossfire RM 250 Twin", bodyType: "Dirtbike" },
          { model: "Crossfire XZ 250 RR", bodyType: "Dirtbike" },
          { model: "CF Twin", bodyType: "Dirtbike" },
        ],
      },
      {
        make: "Ducati",
        models: [
          { model: "Scrambler Cafe Racer", bodyType: "Sports" },
          { model: "Desert Sied", bodyType: "Sports" },
          { model: "Monster 797", bodyType: "Sports" },
          { model: "Multistrada 950", bodyType: "Sports" },
          { model: "Supersport", bodyType: "Sports" },
          { model: "959 Panigale", bodyType: "Sports" },
          { model: "Diavel", bodyType: "Sports" },
          { model: "Hypermotard", bodyType: "Sports" },
          { model: "Panigale v4", bodyType: "Sports" },
          { model: "Monster 1200", bodyType: "Sports" },
          { model: "Monster 821", bodyType: "Sports" },
          { model: "Multistrada", bodyType: "Sports" },
          { model: "Scrambler Sixty 2", bodyType: "Sports" },
          { model: "Scrambler", bodyType: "Sports" },
          { model: "Xdiavel", bodyType: "Sports" },
          { model: "Scramble Eleven", bodyType: "Sports" },
        ],
      },
      {
        make: "Harley Davidson",
        models: [
          { model: "Street 750", bodyType: "Cruiser" },
          { model: "Street Rod 750", bodyType: "Cruiser" },
          { model: "Iron 883", bodyType: "Cruiser" },
        ],
      },
      {
        make: "Hartford",
        models: [
          { model: "VR 223 H", bodyType: "Dirtbike" },
          { model: "VR 223", bodyType: "Dirtbike" },
          { model: "VR 150", bodyType: "Dirtbike" },
          { model: "VR", bodyType: "Dirtbike" },
          { model: "Leopard 223", bodyType: "Dirtbike" },
        ],
      },
      {
        make: "Hero",
        models: [
          { model: "Destini", bodyType: "Scooter" },
          { model: "Maestro Edge", bodyType: "Scooter" },
          { model: "Pleasure Plus", bodyType: "Scooter" },
          { model: "Duet", bodyType: "Scooter" },
          { model: "Pleasure", bodyType: "Scooter" },
          { model: "Xpulse 200", bodyType: "Cruiser" },
          { model: "Xpulse 200 T", bodyType: "Cruiser" },
          { model: "Xtreme 200R", bodyType: "Sports" },
          { model: "Xtreme Sports", bodyType: "Sports" },
          { model: "Achiever", bodyType: "Standard" },
          { model: "Glamour", bodyType: "Standard" },
          { model: "Super Splender", bodyType: "Standard" },
          { model: "Splender Ismart 110", bodyType: "Standard" },
          { model: "Splender Plus", bodyType: "Standard" },
          { model: "HF Deluxe", bodyType: "Standard" },
          { model: "Karizma", bodyType: "Sports" },
          { model: "Dash", bodyType: "Scooter" },
          { model: "CBZ", bodyType: "Scooter" },
        ],
      },
      {
        make: "Honda",
        models: [
          { model: "CB Unicorn 150", bodyType: "Standard" },
          { model: "XBlade", bodyType: "Standard" },
          { model: "CB Shine SP", bodyType: "Standard" },
          { model: "CB Hornet 160R", bodyType: "Sports" },
          { model: "CD 110 Dream", bodyType: "Sports" },
          { model: "CB Shine", bodyType: "Standard" },
          { model: "CB Unicorn 160", bodyType: "Standard" },
          { model: "Grazla", bodyType: "Scooter" },
          { model: "Aviator", bodyType: "Scooter" },
          { model: "Activa 125", bodyType: "Scooter" },
          { model: "Dio DLX", bodyType: "Scooter" },
          { model: "Navi", bodyType: "Standard" },
          { model: "XR 190L", bodyType: "Dirtbike" },
          { model: "CBR 600RR", bodyType: "Sports" },
          { model: "CRF Africa Twin", bodyType: "Sports" },
          { model: "CRF 250L Rally", bodyType: "Dirtbike" },
          { model: "CRF 250L", bodyType: "Dirtbike" },
          { model: "CBR 650F", bodyType: "Sports" },
          { model: "CBR 250R", bodyType: "Sports" },
          { model: "XR 150L", bodyType: "Sports" },
          { model: "CM 200", bodyType: "Standard" },
          { model: "XL", bodyType: "Dirtbike" },
          { model: "CB Trigger", bodyType: "Standard" },
          { model: "Stunner", bodyType: "Standard" },
        ],
      },
      {
        make: "Hunter",
        models: [
          { model: "Spyder", bodyType: "Cruiser" },
          { model: "Daytona", bodyType: "Cruiser" },
          { model: "Cruiser", bodyType: "Cruiser" },
          { model: "Cafe Racer", bodyType: "Cruiser" },
          { model: "Sniper TT350X", bodyType: "Cruiser" },
        ],
      },
      {
        make: "KTM",
        models: [
          { model: "Duke 200", bodyType: "Sports" },
          { model: "Duke 125", bodyType: "Sports" },
          { model: "Duke 250", bodyType: "Sports" },
          { model: "Duke 390", bodyType: "Sports" },
          { model: "RC 200", bodyType: "Sports" },
          { model: "RC 390", bodyType: "Sports" },
        ],
      },
      {
        make: "Mahindra",
        models: [
          { model: "Rodeo", bodyType: "Scooter" },
          { model: "Mojo", bodyType: "Sports" },
          { model: "Gusto", bodyType: "Scooter" },
          { model: "Duro", bodyType: "Scooter" },
          { model: "Centuro", bodyType: "Scooter" },
        ],
      },
      {
        make: "Motorhead",
        models: [
          { model: "Tekken 250", bodyType: "Sports" },
          { model: "Scrambler 250", bodyType: "Sports" },
          { model: "X-Torque 250 Standard", bodyType: "Sports" },
          { model: "X-Torque 250 New Engine", bodyType: "Sports" },
          { model: "Tekken Sport 250", bodyType: "Sports" },
          { model: "MH 200", bodyType: "Sports" },
          { model: "MH 150", bodyType: "Sports" },
        ],
      },
      {
        make: "Motorac",
        models: [
          { model: "MX", bodyType: "Sports" },
          { model: "M5", bodyType: "Sports" },
          { model: "M5 EFI", bodyType: "Sports" },
          { model: "M6", bodyType: "Sports" },
          { model: "Mox", bodyType: "Sports" },
          { model: "MX-EFI", bodyType: "Sports" },
          { model: "E-M5", bodyType: "Sports" },
          { model: "E-MX", bodyType: "Sports" },
        ],
      },
      {
        make: "MV Agusta",
        models: [
          { model: "F3 67S", bodyType: "Sport" },
          { model: "Brutale 800 RR", bodyType: "Sport" },
          { model: "Dragster RR", bodyType: "Sport" },
          { model: "F4 Rosso", bodyType: "Sport" },
          { model: "F4 Blanco", bodyType: "Sport" },
          { model: "1090", bodyType: "Sport" },
          { model: "Rivale 800", bodyType: "Sport" },
          { model: "675", bodyType: "Sport" },
        ],
      },
      {
        make: "Niu",
        models: [
          { model: "N-Series", bodyType: "Scooter" },
          { model: "N-GT", bodyType: "Scooter" },
          { model: "U-Series", bodyType: "Scooter" },
          { model: "M-Series", bodyType: "Scooter" },
        ],
      },
      {
        make: "Royal Enfield",
        models: [
          { model: "Classic 350", bodyType: "Cruiser" },
          { model: "Classic 500", bodyType: "Cruiser" },
          { model: "Classic Battle Green", bodyType: "Cruiser" },
          { model: "Classic Chrome", bodyType: "Cruiser" },
          { model: "Continental", bodyType: "Cruiser" },
          { model: "Himalayan", bodyType: "Cruiser" },
          { model: "Classic Desert Storm", bodyType: "Cruiser" },
          { model: "Electra", bodyType: "Cruiser" },
          { model: "Thunderbird 500", bodyType: "Cruiser" },
          { model: "Thunderbird 350", bodyType: "Cruiser" },
          { model: "Interceptor", bodyType: "Cruiser" },
        ],
      },
      {
        make: "Runner",
        models: [
          { model: "Hawk", bodyType: "DirtBike" },
          { model: "Rodeo", bodyType: "DirtBike" },
          { model: "RT", bodyType: "DirtBike" },
          { model: "AD 80S Deluxe", bodyType: "DirtBike" },
          { model: "Cheetah", bodyType: "DirtBike" },
          { model: "Kite Plus", bodyType: "DirtBike" },
          { model: "Royal Plus", bodyType: "DirtBike" },
          { model: "Bullet", bodyType: "DirtBike" },
          { model: "Knight Rider", bodyType: "DirtBike" },
          { model: "Turbo", bodyType: "DirtBike" },
        ],
      },
      {
        make: "Suzuki",
        models: [
          { model: "Access 125", bodyType: "Scooter" },
          { model: "Lets", bodyType: "Scooter" },
          { model: "Burgman Street", bodyType: "Scooter" },
          { model: "Hayate", bodyType: "Standard" },
          { model: "Intruder", bodyType: "Standard" },
          { model: "Gixxer SP ABS", bodyType: "Sports" },
          { model: "Gixxer", bodyType: "Sports" },
          { model: "Gixxer ABS", bodyType: "Sports" },
          { model: "Gixxer SF 250 Moto GP", bodyType: "Sports" },
          { model: "Gixxer SF 150 Moto GP", bodyType: "Sports" },
          { model: "Gixxer 250", bodyType: "Sports" },
          { model: "Gixxer 150", bodyType: "Sports" },
          { model: "Slingshot plus", bodyType: "Sports" },
          { model: "GS150R", bodyType: "Sports" },
          { model: "AN 125", bodyType: "Sports" },
          { model: "Thunder", bodyType: "Sports" },
          { model: "Hayabusa", bodyType: "Sports" },
          { model: "Inazuma", bodyType: "Sports" },
          { model: "B-King", bodyType: "Sports" },
        ],
      },
      {
        make: "TVS",
        models: [
          { model: "Max 125", bodyType: "Standard" },
          { model: "Apache RTR 200 4v ABS", bodyType: "Sports" },
          { model: "Apache RTR 200 4v v2.0", bodyType: "Sports" },
          { model: "Apache RTR 180 2v", bodyType: "Sports" },
          { model: "RR 310", bodyType: "Sports" },
          { model: "Apache RTR 160 4v", bodyType: "Sports" },
          { model: "Apache RTR 160 2v", bodyType: "Sports" },
          { model: "Stryker 125", bodyType: "Sports" },
          { model: "Radeon", bodyType: "Standard" },
          { model: "XL 100", bodyType: "Standard" },
          { model: "Ntorq", bodyType: "Scooter" },
          { model: "Dazz", bodyType: "Standard" },
          { model: "Zest", bodyType: "Standard" },
          { model: "Jupiter Classic", bodyType: "Standard" },
          { model: "Wego", bodyType: "Standard" },
        ],
      },
      {
        make: "Um",
        models: [
          { model: "Renegade Sports 140", bodyType: "Cruiser" },
          { model: "Renegade Commando", bodyType: "Cruiser" },
          { model: "Renegade Sports S 300", bodyType: "Cruiser" },
          { model: "Powermax 125", bodyType: "Scooter" },
          { model: "DSR 200", bodyType: "Scooter" },
          { model: "Hypersport", bodyType: "Scooter" },
          { model: "Nitrox", bodyType: "Scooter" },
          { model: "Renegade Duty", bodyType: "Scooter" },
          { model: "Xtreet R180", bodyType: "Scooter" },
          { model: "Xtreet R200", bodyType: "Scooter" },
          { model: "Xtreet R230", bodyType: "Scooter" },
          { model: "Renegade", bodyType: "Scooter" },
        ],
      },
      {
        make: "Vespa",
        models: [
          { model: "Elegante", bodyType: "Scooter" },
          { model: "VXL", bodyType: "Scooter" },
          { model: "SXL", bodyType: "Scooter" },
          { model: "LX", bodyType: "Scooter" },
        ],
      },
      {
        make: "Yamaha",
        models: [
          { model: "R3", bodyType: "Sports" },
          { model: "R15 V3", bodyType: "Sports" },
          { model: "Fazer-25", bodyType: "Sports" },
          { model: "FZ-25", bodyType: "Sports" },
          { model: "FZS V3", bodyType: "Sports" },
          { model: "FZS V2", bodyType: "Sports" },
          { model: "MT-15", bodyType: "Sports" },
          { model: "FZ V2", bodyType: "Sports" },
          { model: "SZ-RR", bodyType: "Sports" },
          { model: "Saluto", bodyType: "Sports" },
          { model: "XTZ", bodyType: "Sports" },
          { model: "Fascino 125 FI", bodyType: "Scooter" },
          { model: "Ray ZR", bodyType: "Scooter" },
          { model: "Nmax 155", bodyType: "Scooter" },
          { model: "Fascino 113", bodyType: "Scooter" },
          { model: "Ray Z 113", bodyType: "Scooter" },
          { model: "R15", bodyType: "Sports" },
          { model: "R6", bodyType: "Sports" },
          { model: "FZ", bodyType: "Sports" },
          { model: "R1", bodyType: "Sports" },
          { model: "Enticer", bodyType: "Cruiser" },
        ],
      },
    ])
      .then(function () {
        return res.json({ success: true, msg: "List Created" });
      })
      .catch(function (error) {
        return res.json({ success: false });
      });
  });
});

// @route   GET /api/motorcycleMakesAndModels/
// @desc    Get all the motorcycleMakesAndModels
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
        make: document.make,
        id: document.id,
        models: document.models,
      });
    };

    documents.forEach((document) => {
      pushToData(document);
    });

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  MotorcycleMakesAndModels.find(filterDetail)
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

// @route   GET /api/motorcycleMakesAndModels/:id
// @desc    Get a motorcycleMakeAndModels wih given id
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

  MotorcycleMakesAndModels.findById(id)
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
          make: document.make,
          id: document.id,
          models: document.models,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/motorcycleMakesAndModels/:id
// @desc    Delete motorcycleMakesAndModels with given id
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

  MotorcycleMakesAndModels.findOne({ _id: id }).then((document) => {
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

// @route   DELETE /api/motorcycleMakesAndModels?query
// @desc    Delete motorcycleMakesAndModels in query
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
    MotorcycleMakesAndModels.find()
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

// @route   PUT /api/motorcycleMakesAndModels/:id
// @desc    Update a motorcycleMakesAndModels with given id
// @access  ADMIN
router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { id } = req.params;
  const { make, valid, models } = data;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  MotorcycleMakesAndModels.findOne({ _id: id }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    document.make = make;
    document.models = models;

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

// @route   POST /api/motorcycleMakesAndModels/
// @desc    create motorcycle make and models
// @access  ADMIN
router.post("/", (req, res) => {
  const { valid, data } = req.body;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  const { make, models } = data;

  const newMotorcycleMakeAndModels = new MotorcycleMakesAndModels({
    make,
    models,
  });

  newMotorcycleMakeAndModels
    .save()
    .then(() => {
      return res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ success: false });
    });
});

module.exports = router;
