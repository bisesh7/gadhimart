const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");

const Car = require("../../models/Car");
const Motorcycle = require("../../models/Motorcycle");
const SavedSearch = require("../../models/SavedSearch");
const SavedVehicles = require("../../models/SavedVehicles");

// @route   POST /api/savedVehicles/newSave
// @desc    save a vehicle for a user
// @access  Private
router.post("/newSave", ensureAuthenticated, (req, res) => {
  const { listingId, type, valid, userId } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof type === "undefined" ||
    typeof listingId === "undefined" ||
    valid !== "VaLId876" ||
    userId !== req.user.id ||
    type === "" ||
    listingId === ""
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  switch (type) {
    case "Motorcycle":
    case "Car":
      break;
    default:
      return res
        .status(400)
        .json({ message: "Error Occurred", success: false });
  }

  const save = () => {
    // Checking if the vehicle has been saved by any user or not
    SavedVehicles.findOne(
      { vehicleId: listingId, vehicleType: type },
      (err, document) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Server Error", success: false });
        }

        // If it is not saved by any user then create a new document
        if (document === null) {
          const newSavedVehicle = new SavedVehicles({
            vehicleId: listingId,
            userIds: [userId],
            vehicleType: type,
            totalSavers: 1,
          });
          newSavedVehicle
            .save()
            .then((document) => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Server Error", success: false });
            });
        } else {
          // if it is saved we add the user to the user ids
          document.userIds.push(userId);
          document.totalSavers = document.totalSavers + 1;
          document
            .save()
            .then(() => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Server Error", success: false });
            });
        }
      }
    );
  };

  if (type === "Car") {
    Car.findOne({ _id: listingId }, (err, document) => {
      if (err || document === null || document.userId === userId) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      return save();
    });
  }

  if (type === "Motorcycle") {
    Motorcycle.findOne({ _id: listingId }, (err, document) => {
      if (err || document === null || document.userId === userId) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      return save();
    });
  }
});

// @route   POST /api/savedVehicles/getAllSavedCars
// @desc    get all cars saved by user
// @access  Private
router.post("/getAllSavedCars", ensureAuthenticated, (req, res) => {
  const { userId, valid } = req.body;

  if (
    valid !== "VaLId876" ||
    typeof valid === "undefined" ||
    userId !== req.user.id
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  SavedVehicles.find(
    {
      userIds: req.user.id,
      vehicleType: "Car",
    },
    (err, savedCars) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }

      console.log(savedCars);
      return res.json({ success: true, savedCars });
    }
  );
});

// @route   POST /api/savedVehicles/getAllSavedMotorcycles
// @desc    get all cars saved by user
// @access  Private
router.post("/getAllSavedMotorcycles", ensureAuthenticated, (req, res) => {
  const { userId, valid } = req.body;

  if (
    valid !== "VaLId876" ||
    typeof valid === "undefined" ||
    userId !== req.user.id
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  SavedVehicles.find(
    {
      vehicleType: "Motorcycle",
      userIds: req.user.id,
    },
    (err, savedMotorcycles) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }
      return res.json({ success: true, savedMotorcycles });
    }
  );
});

// @route   POST /api/savedVehicles/unSave
// @desc    unsave a vehicle for a user
// @access  Private
router.post("/unSave", ensureAuthenticated, (req, res) => {
  const { listingId, type, valid, userId } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof type === "undefined" ||
    typeof listingId === "undefined" ||
    valid !== "VaLId876" ||
    userId !== req.user.id ||
    type === "" ||
    listingId === ""
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  switch (type) {
    case "Motorcycle":
    case "Car":
      break;
    default:
      return res
        .status(400)
        .json({ message: "Error Occurred", success: false });
  }

  const unsave = () => {
    SavedVehicles.findOne(
      {
        vehicleId: listingId,
        vehicleType: type,
      },
      (err, document) => {
        if (err || document === null) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Server Error", success: false });
        }

        if (document.userIds.indexOf(req.user.id) > -1) {
          if (document.userIds.length === 1) {
            document.remove().then(() => {
              return res.json({ success: true });
            });
          } else {
            document.userIds = document.userIds.filter(
              (e) => e !== req.user.id
            );
            document.totalSavers = document.totalSavers - 1;
            document
              .save()
              .then(() => {
                return res.json({ success: true });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ message: "Server Error", success: false });
              });
          }
        }
      }
    );
  };

  if (type === "Car") {
    Car.findOne({ _id: listingId }, (err, document) => {
      // check if car exists, lister is different that the saver
      if (err || document === null || document.userId === userId) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      unsave();
    });
  }
  if (type === "Motorcycle") {
    Motorcycle.findOne({ _id: listingId }, (err, document) => {
      // check if car exists, lister is different that the saver
      if (err || document === null || document.userId === userId) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      unsave();
    });
  }
});

// @route   POST /api/savedVehicles/checkSavedVehicle
// @desc    check if a car is saved by user
// @access  Private
router.post("/checkSavedVehicle", ensureAuthenticated, (req, res) => {
  const { listingId, userId, valid, type } = req.body;

  console.log("Checking saved vehicle", req.body);

  if (
    typeof valid === "undefined" ||
    typeof listingId === "undefined" ||
    typeof userId === "undefined" ||
    valid !== "VaLId876" ||
    userId !== req.user.id ||
    listingId === ""
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  //   Here where is use as we need to check inside a list in a document property
  SavedVehicles.find(
    {
      vehicleId: listingId,
      vehicleType: type,
      userIds: userId,
    },
    (err, savedCars) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }
      if (savedCars.length === 0) {
        console.log(savedCars);
        return res.json({ saved: false, success: true });
      } else if (savedCars.length === 1) {
        console.log(savedCars);
        return res.json({ saved: true, success: true });
      }
    }
  );

  // SavedVehicles.$where(
  //   `this.vehicleId === '${listingId}' &&
  //       this.vehicleType === '${type}' &&
  //       this.userIds.indexOf('${req.user.id}') > -1`
  // ).exec((err, savedCars) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).json({ message: "Server error", success: false });
  //   }
  //   if (savedCars.length === 0) {
  //     return res.json({ saved: false, success: true });
  //   } else if (savedCars.length === 1) {
  //     return res.json({ saved: true, success: true });
  //   }
  // });
});

// @route   POST /api/savedVehicles/delete
// @desc    delete a savedvehicle of users
// @access  Private
router.post("/delete", ensureAuthenticated, (req, res) => {
  console.log("Saved vehicel deleted");
  const { savedVehicleId, valid } = req.body;

  if (valid !== "VaLId876" || typeof valid === "undefined") {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  SavedVehicles.findOneAndDelete({ _id: savedVehicleId }, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Server error", success: false });
    } else {
      return res.json({ success: true });
    }
  });
});

module.exports = router;
