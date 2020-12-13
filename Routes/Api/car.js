const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../../config/auth").ensureAuthenticated;
const fs = require("fs");
const path = require("path");
const config = require("config");
const mongoose = require("mongoose");
const CarMakesAndModels = require("../../models/CarMakesAndModels");
const ProvinceWithDistricts = require("../../models/ProvinceWithDistricts");
// Car model
const Car = require("../../models/Car");
// TempFolder model
const TempFolders = require("../../models/TempFolders");
// Views model
const Views = require("../../models/Views");

var remove = require("remove");
const {
  transmission,
  bodyType,
  condition,
  fuelType,
  driveTrain,
  color,
  seat,
  featuresDatabase,
  door,
} = require("../../config/filters");
const provinceWithDistricts = require("../../config/provinceWithDistricts");

const validateCarDetails = (carDetails, carList, provinceWithDistricts) => {
  const error = (possibleErrors) => {
    if (!possibleErrors) {
      return false;
    } else {
      return possibleErrors;
    }
  };

  if (!carDetails || typeof carDetails === "undefined") {
    return error(false);
  }

  const {
    carMakeSelected,
    carModelSelected,
    carYearInput,
    carTrimInput,
    carBodyTypeSelected,
    carConditionSelected,
    carKiloMetersInput,
    carTransmissionSelected,
    carDrivetrainSelected,
    carColorSelected,
    carFuelTypeSelected,
    carDoorsSelected,
    carSeatsSelected,
    carHasSunRoof,
    carHasAlloyWheels,
    carHasNavigationSystem,
    carHasBluetooth,
    carHasPushStart,
    carHasParkingAssistant,
    carHasCruiseControl,
    carHasAirConditioning,
    carHasPowerSteering,
    carHasPowerWindow,
    carHasKeylessEntry,
    carHasAbs,
    carHasCarplay,
    carHasAndroidAuto,
    adTitle,
    adDescription,
    youtubeLinkInput,
    provinceSelected,
    districtSelected,
    streetAddressInput,
    priceType,
    carPriceInput,
    phoneNumberInput,
    picturesToBeUploadedMeta,
  } = carDetails;

  //  this methods checks the errors and returns the errors in the form
  formulateErrors = () => {
    // All the possible errors
    let possibleErrors = {
      noYearError: true,
      noMakeError: true,
      noModelError: true,
      noTrimError: true,
      noBodyTypeError: true,
      noConditionError: true,
      noKilometersError: true,
      noTransmissionError: true,
      noDriveTrainError: true,
      noColorError: true,
      noFuelTypeError: true,
      noDoorsError: true,
      noSeatsError: true,
      noCheckBoxError: true,
      noAdTitleError: true,
      noAdDescriptionError: true,
      noPicturesError: true,
      noYoutubeLinkError: true,
      noProvinceError: true,
      noDistrictError: true,
      noStreetAddressError: true,
      noPriceTypeError: true,
      noPriceInputError: true,
      noPhoneNumberError: true,
      noEmailError: true,
    };

    const thisYear = new Date().getFullYear();
    /* 
    or is used here because [0 | 0 = 0]; [0 | 1 = 1]; [1 | 1 = 1] 0 is F and 1 is T
    we do not want carYearInput to be empty string and also not greater than the current year
    when car year input is empty string it is equal to 1 and same case when it is greater than current year
    0 === 0 is true which means noYearError is true 
    */
    possibleErrors.noYearError =
      ((carYearInput === "") | (parseInt(carYearInput) > thisYear)) === 0;

    // Check whether the make selected is within the car list.
    const makeSelectedIsWithinTheCarList = () => {
      return carList.some((car) => car.make === carMakeSelected);
    };

    // Car make
    possibleErrors.noMakeError = makeSelectedIsWithinTheCarList();

    // Check whether the model selected is within the car list.
    const modelSelectedIsWithinTheCarList = () => {
      if (carMakeSelected.toLowerCase() === "other") {
        return true;
      }

      let carMakeObject = carList.find((car) => car.make === carMakeSelected);

      if (carModelSelected.toLowerCase() === "other") {
        return true;
      }

      return carMakeObject.models.some(
        (carModel) => carModel.model === carModelSelected
      );
    };

    // If car make is not selected, there will car make error.
    // There should be no car make error should before checking model error.
    if (possibleErrors.noMakeError) {
      possibleErrors.noModelError = modelSelectedIsWithinTheCarList();
    } else {
      possibleErrors.noModelError = false;
    }

    // Check if the user given input is not empty
    const checkInputError = (input, length) => {
      if (input !== "" && input.length <= length) {
        return true;
      } else {
        return false;
      }
    };

    // Car trim
    if (carTrimInput !== "") {
      possibleErrors.noTrimError = carTrimInput.length > 50 ? false : true;
    } else {
      possibleErrors.noTrimError = true;
    }

    // Check if the given item in within the given list
    const checkIfTheItemIsWithinTheGivenList = (list, item) => {
      return list.some(
        (listItem) => listItem.toLowerCase() === item.toLowerCase()
      );
    };

    // Check whether the body type selected is within the body type list.
    const bodyTypeSelectedIsWithinTheBodyTypeList = () => {
      return checkIfTheItemIsWithinTheGivenList(bodyType, carBodyTypeSelected);
    };

    // Check whether the condition selected is within the condition list.
    const conditonSelectedIsWithinTheConditionList = () => {
      return checkIfTheItemIsWithinTheGivenList(
        condition,
        carConditionSelected
      );
    };

    // Check whether the transmission selected is within the transmission list.
    const transmissionSelectedIsWithinTheTransmissionList = () => {
      return checkIfTheItemIsWithinTheGivenList(
        transmission,
        carTransmissionSelected
      );
    };

    const driveTrainSelectedIsWithinTheDrivetrainList = () => {
      return checkIfTheItemIsWithinTheGivenList(
        driveTrain,
        carDrivetrainSelected
      );
    };

    const colorSelectedIsWithinTheColorList = () => {
      return checkIfTheItemIsWithinTheGivenList(color, carColorSelected);
    };

    const fuelTypeSelectedIsWithinTheFuelTypeList = () => {
      return checkIfTheItemIsWithinTheGivenList(fuelType, carFuelTypeSelected);
    };

    const doorsSelectedIsWithinTheDoorsList = () => {
      return checkIfTheItemIsWithinTheGivenList(door, carDoorsSelected);
    };

    const seatsSelectedIsWithinTheSeatsList = () => {
      return checkIfTheItemIsWithinTheGivenList(seat, carSeatsSelected);
    };

    // Check body is empty
    possibleErrors.noBodyTypeError = bodyTypeSelectedIsWithinTheBodyTypeList();

    // Check condition is empty
    possibleErrors.noConditionError = conditonSelectedIsWithinTheConditionList();

    // Check kilometer is empty
    // params: kilometer input and maximum length
    possibleErrors.noKilometersError = checkInputError(
      carKiloMetersInput.toString(),
      20
    );

    // Transmission
    possibleErrors.noTransmissionError = transmissionSelectedIsWithinTheTransmissionList();

    // Drivetrain
    possibleErrors.noDriveTrainError = driveTrainSelectedIsWithinTheDrivetrainList();

    // Color
    possibleErrors.noColorError = colorSelectedIsWithinTheColorList();

    // Fuel Type
    possibleErrors.noFuelTypeError = fuelTypeSelectedIsWithinTheFuelTypeList();

    // Door
    possibleErrors.noDoorsError = doorsSelectedIsWithinTheDoorsList();

    // Seats
    possibleErrors.noSeatsError = seatsSelectedIsWithinTheSeatsList();

    // List of all the checkbox button values
    const booleanCheckList = [
      carHasSunRoof,
      carHasAlloyWheels,
      carHasNavigationSystem,
      carHasBluetooth,
      carHasPushStart,
      carHasParkingAssistant,
      carHasCruiseControl,
      carHasAirConditioning,
      carHasPowerSteering,
      carHasPowerWindow,
      carHasKeylessEntry,
      carHasAbs,
      carHasCarplay,
      carHasAndroidAuto,
    ];

    // Checking the type of every checkbox value to be boolean
    booleanCheckList.some((check) => {
      if (typeof check !== "boolean") {
        possibleErrors.noCheckBoxError = false;
        return true;
      } else {
        return false;
      }
    });

    // Check ad title is empty
    // params: ad title input and maximum length
    possibleErrors.noAdTitleError = checkInputError(adTitle, 150);

    possibleErrors.noAdDescriptionError = checkInputError(adDescription, 2000);

    if (picturesToBeUploadedMeta.length < 2 || picturesToBeUploadedMeta > 10) {
      possibleErrors.noPicturesError = picturesToBeUploadedMeta.some(
        (meta) => meta.status !== "done"
      );
    } else {
      possibleErrors.noPicturesError = true;
    }

    // Youtube link
    if (youtubeLinkInput !== "") {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = youtubeLinkInput.match(regExp);
      if (match && match[2].length === 11) {
        possibleErrors.noYoutubeLinkError = true;
      } else {
        possibleErrors.noYoutubeLinkError = false;
      }
    } else {
      possibleErrors.noYoutubeLinkError = true;
    }

    // Check whether the province selected is within the province list.
    const provinceSelectedIsWithinTheProvinceList = () => {
      let exists;

      if (provinceSelected === "" || provinceSelected === "Select") {
        return false;
      }

      provinceWithDistricts.some((province) => {
        if (
          province.province.toLowerCase() === provinceSelected.toLowerCase() ||
          province.name.toLowerCase() === provinceSelected.toLowerCase()
        ) {
          exists = true;
          return true;
        } else {
          return false;
        }
      });

      return exists ? true : false;
    };

    // check for province error
    possibleErrors.noProvinceError = provinceSelectedIsWithinTheProvinceList();

    // Check whether the district selected is within the district list.
    const districtSelectedIsWithinTheDistrictList = () => {
      let exists;
      let provinceObject = provinceWithDistricts.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      provinceObject.districts.some((district) => {
        if (
          district.district.toLowerCase() === districtSelected.toLowerCase()
        ) {
          exists = true;
          return true;
        } else {
          return false;
        }
      });

      return exists ? true : false;
    };

    if (possibleErrors.noProvinceError) {
      possibleErrors.noDistrictError = districtSelectedIsWithinTheDistrictList();
    } else {
      possibleErrors.noDistrictError = false;
    }

    // Check for district error only if there is no province error
    if (possibleErrors.noDistrictError && possibleErrors.noProvinceError) {
      possibleErrors.noStreetAddressError = checkInputError(
        streetAddressInput,
        100
      );
    } else {
      possibleErrors.noStreetAddressError = false;
    }

    // Checks if the price type selected is valid
    const priceTypeSelectedIsWithinThePriceTypeList = () => {
      const priceTypeList = ["notFree", "free", "contact"];

      return checkIfTheItemIsWithinTheGivenList(priceTypeList, priceType);
    };

    possibleErrors.noPriceTypeError = priceTypeSelectedIsWithinThePriceTypeList();

    // Check for price input if it is not free and price type is valid
    // If price type is free or contact then price input is valid.
    if (
      possibleErrors.noPriceTypeError &&
      priceType === "notFree" &&
      carPriceInput !== ""
    ) {
      possibleErrors.noPriceInputError = checkInputError(
        carPriceInput.toString(),
        10
      );
    } else if (possibleErrors.noPriceTypeError && priceType !== "notFree") {
      possibleErrors.noPriceInputError = true;
    } else {
      possibleErrors.noPriceInputError = false;
    }

    // Checks the phine number input
    // Phone number should be 10 digits and landline number should be 7 digits
    const phoneNumberIsValid = (phoneNumber) => {
      var mobileNoRegex = /^\d{10}$/;
      var landLineNoRegex = /^\d{7}$/;

      if (
        mobileNoRegex.test(phoneNumber) ||
        landLineNoRegex.test(phoneNumber)
      ) {
        return true;
      } else {
        return false;
      }
    };

    if (phoneNumberInput !== "") {
      possibleErrors.noPhoneNumberError = phoneNumberIsValid(phoneNumberInput);
    } else {
      possibleErrors.noPhoneNumberError = true;
    }

    return possibleErrors;
  };

  // checks if any of the keys in object is false, returns true if so
  hasErrors = (obj) => {
    for (var o in obj) if (!obj[o]) return true;
    return false;
  };

  const possibleErrors = formulateErrors();

  if (hasErrors(possibleErrors)) {
    console.log(possibleErrors);
    return error(possibleErrors);
  } else {
    return true;
  }
};

// @route   POST /api/car
// @desc    Save new car ad
// @access  Private
router.post("/", ensureAuthenticated, (req, res) => {
  const { carDetails } = req.body;

  const userEmail = req.user.email;
  const userId = req.user._id;

  if (carDetails.email !== userEmail || carDetails.userId != userId) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter the form correctly" });
  }

  CarMakesAndModels.find({}, (err, carList) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server Error" });
    }

    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }

      const noError = validateCarDetails(
        carDetails,
        carList,
        provinceWithDistricts
      );

      if (typeof noError === "boolean" && noError) {
        // Path of the temporary directory that contains uploaded car images
        const tempDir = `${
          path.join(__dirname, "../../") +
          "assets/uploads/temp/" +
          carDetails.uniqueId
        }`;

        // Path of the permanent directory
        const permDir = `${
          path.join(__dirname, "../../") +
          "assets/uploads/carImages/" +
          carDetails.uniqueId
        }`;

        // Check whether the file path exists
        fs.exists(tempDir, (exists) => {
          if (exists) {
            // Move from temporary directory to permanent directory
            fs.rename(tempDir, permDir, function (err) {
              if (err) {
                return res
                  .status(500)
                  .json({ success: false, msg: "Server Error" });
              }

              carDetails.picturesToBeUploadedMeta.forEach((meta) => {
                meta.fileUrl =
                  "/assets/uploads/carImages/" +
                  carDetails.uniqueId +
                  "/" +
                  meta.serverFileName;
              });

              const userEmail = req.user.email;
              const userId = req.user._id;

              const newCarAd = new Car({
                userEmail,
                userId,
                carDetails,
              });

              newCarAd
                .save()
                .then((carAd) => {
                  // Delete tempfolder saved in the database
                  TempFolders.$where(
                    `this.uniqueId.indexOf('${carDetails.uniqueId}') > '-1'`
                  ).exec((err, listings) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        success: false,
                        msg: "Error while deleting the tempfolder",
                      });
                    }
                    // If the listing is empty there is error as there should obviously be one
                    if (listings.length === 0) {
                      return res.status(500).json({
                        success: false,
                        msg: "Error while deleting the tempfolder",
                      });
                    } else {
                      // Since listings can containg other folders used by the user
                      listings.forEach((listing) => {
                        if (listing.uniqueId.length >= 2) {
                          listing.uniqueId.splice(
                            listing.uniqueId.indexOf(carDetails.uniqueId),
                            1
                          );
                          listing
                            .save()
                            .then(() => {
                              return res.json({ success: true });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.status(500).json({
                                success: false,
                                msg: "Error while deleting the tempfolder",
                              });
                            });
                        } else if (listing.uniqueId.length === 1) {
                          listing
                            .remove()
                            .then(() => {
                              console.log("temp deleted");
                              return res.json({ success: true });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.status(500).json({
                                success: false,
                                msg: "Error while deleting the tempfolder",
                              });
                            });
                        }
                      });
                    }
                  });
                })
                .catch((err) => {
                  return res
                    .status(500)
                    .json({ success: false, msg: "Server Error" });
                });
            });
          } else {
            return res
              .status(500)
              .json({ success: false, msg: "Server Error" });
          }
        });
      } else {
        if (typeof noError === "boolean" && !noError) {
          return res
            .status(400)
            .json({ success: false, msg: "Please fill the form correctly." });
        } else {
          console.log(noError);
          return res
            .status(412)
            .json({ success: false, possibleErrors: noError });
        }
      }
    });
  });
});

// @route   POST /api/car/getListing/userID
// @desc    get car listings of the given user id
// @access  Public
router.post("/getListing/:userId", (req, res) => {
  if (typeof req.body.valid !== "string" || req.body.valid !== config.API_KEY) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid details." });
  }
  if (req.params.userId === "") {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }
  Car.find({ userId: req.params.userId }, (err, carListings) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server Error!" });
    }
    return res.json(carListings);
  });
});

// @route   POST /api/car/update
// @desc    update a car listing
// @access  Private
router.post("/update", ensureAuthenticated, (req, res) => {
  const { carDetails, valid, editNumber, databaseID } = req.body;

  if (
    // This is done to verify that the request is coming from valid source
    valid !== "VaLiD123" ||
    editNumber !== "2" ||
    !databaseID ||
    typeof databaseID === "undefined" ||
    databaseID == null
  ) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter the form correctly" });
  }

  const userEmail = req.user.email;
  const userId = req.user._id;

  if (carDetails.email !== userEmail || carDetails.userId != userId) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter the form correctly" });
  }

  CarMakesAndModels.find({}, (err, carList) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server Error" });
    }

    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }
      const noError = validateCarDetails(
        carDetails,
        carList,
        provinceWithDistricts
      );

      if (typeof noError === "boolean" && !noError) {
        return res
          .status(400)
          .json({ success: false, msg: "Please fill the form correctly." });
      }

      if (typeof noError === "object") {
        return res
          .status(412)
          .json({ success: false, possibleErrors: noError });
      }

      // Check if the updating user is the same user who owns the lisiting
      Car.findById(databaseID)
        .then((listing) => {
          if (listing.userId != req.user._id) {
            return res
              .status(403)
              .json({
                msg: "Please use the website correctly!",
                success: true,
              });
          }

          // Update the car details in the database
          const update = (mainPictureRemoved) => {
            listing.carDetails = carDetails;
            if (mainPictureRemoved) {
              listing.carDetails.mainPicture = "";
            }
            listing
              .save()
              .then((car) => {
                return res.json({ success: true });
              })
              .catch((err) => {
                console.log("error:", err);
                return res.status(500).json({ success: false });
              });
          };

          // Function to compare two arrays of objects and returns the odd one
          function comparer(otherArray) {
            return function (current) {
              return (
                otherArray.filter(function (other) {
                  return other.fileUrl == current.fileUrl;
                }).length == 0
              );
            };
          }

          const deleteTheRemovedPictures = (carDetails) => {
            carDetails.picturesToBeUploadedMeta.forEach((meta) => {
              if (meta.fileUrl.includes("/assets/uploads/temp/")) {
                meta.fileUrl = `${
                  "/assets/uploads/carImages/" +
                  carDetails.uniqueId +
                  "/" +
                  meta.serverFileName
                }`;
              }
            });

            // Get the removed picture
            const removedPictures = listing.carDetails.picturesToBeUploadedMeta.filter(
              comparer(carDetails.picturesToBeUploadedMeta)
            );

            // If the picture was removed, we delete the picture from server
            if (removedPictures.length > 0) {
              let mainPictureRemoved = false;

              removedPictures.forEach((removedPicture) => {
                const dir = `${
                  path.join(__dirname, "../../") + removedPicture.fileUrl
                }`;
                if (fs.existsSync(dir)) {
                  fs.unlinkSync(dir);
                  if (
                    listing.carDetails.mainPicture === removedPicture.fileUrl
                  ) {
                    listing.carDetails.mainPicture = "";
                    mainPictureRemoved = true;
                  }
                } else {
                  console.log("User deleted pictures dir doesnot exists.");
                  return res.status(400).json({
                    msg: "Server error",
                    success: false,
                  });
                }
              });
              return update(mainPictureRemoved);
            } else {
              return update(false);
            }
          };

          // Move the pictures from temp file to permanent folder if pictures are uploaded
          for (let i = 0; i < carDetails.picturesToBeUploadedMeta.length; i++) {
            const meta = carDetails.picturesToBeUploadedMeta[i];

            if (meta.fileUrl.includes("/assets/uploads/temp/")) {
              // Path of the temporary directory that contains uploaded car images
              const tempDir = `${
                path.join(__dirname, "../../") +
                "assets/uploads/temp/" +
                carDetails.uniqueId
              }`;
              // Path of the permanent directory
              const permDir = `${
                path.join(__dirname, "../../") +
                "assets/uploads/carImages/" +
                carDetails.uniqueId
              }`;

              const files = fs.readdirSync(tempDir);

              console.log("Files: ", files);

              for (const file of files) {
                fs.renameSync(tempDir + "/" + file, permDir + "/" + file);
              }

              break;
            }
          }

          // The temporary folder which contained all the uploaded pictures
          tempFolder = `${
            path.join(__dirname, "../../") +
            "assets/uploads/temp/" +
            carDetails.uniqueId
          }`;

          // Asynchronously remove the temp folder
          fs.exists(tempFolder, (exists) => {
            if (exists) {
              // Move from temporary directory to permanent directory
              remove(tempFolder, function (err) {
                if (err) {
                  console.error("Error removing temp folder", err);
                  return res.status(500).json({ success: false });
                }

                // If user has removed previously uploaded pictures then delete them
                return deleteTheRemovedPictures(carDetails);
              });
            } else {
              // If user has removed previously uploaded pictures then delete them
              return deleteTheRemovedPictures(carDetails);
            }
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ success: false });
        });
    });
  });
});

// @route   POST /api/car/remove/:listingId
// @desc    delete car listing
// @access  Private
router.post("/remove/:listingId", ensureAuthenticated, (req, res) => {
  const listingId = req.params.listingId;

  const { valid } = req.body;

  if (valid !== "VaLiD123") {
    console.log("Invalid");
    return res.status(401).json({ success: false, msg: "Invalid Request" });
  }

  if (listingId === "") {
    console.log("No listing id");
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }

  Car.findById(listingId)
    .then((listing) => {
      if (listing.userId != req.user._id) {
        return res
          .status(401)
          .json({ msg: "Unauthorized Request!", success: false });
      }

      const pictureDirectory = `${
        path.join(__dirname, "../../") +
        "assets/uploads/carImages/" +
        listing.carDetails.uniqueId
      }`;

      const promises = [];

      promises.push(
        listing.remove().then(() => {
          // Asynchronously check if the picture directory exists
          fs.exists(pictureDirectory, (exists) => {
            if (exists) {
              // Delete the picure directory
              remove(pictureDirectory, function (err) {
                if (err) {
                  console.error(err);
                  throw err;
                }
              });
            }
          });
        })
      );

      Views.findOne(
        { vehicleId: listingId, vehicleType: "Car" },
        (err, view) => {
          if (err) {
            throw err;
          }
          if (view) {
            promises.push(view.remove());
          }

          Promise.all(promises)
            .then(() => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ success: false, msg: "Server Error" });
            });
        }
      );
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }
    });

  // For check purpose only
  // return res.json({ msg: "Unauthorized Request!", success: true });
});

// @route   POST /api/car/get/make/model
// @desc    get the cars with given make and model and selected filters
// @access  Public
router.post("/get/:make/:model", (req, res) => {
  const { valid, filters } = req.body;

  if (typeof valid !== "string" || valid !== config.API_KEY) {
    return res.status(400).json({
      msg: "Please provide the valid details",
      success: false,
    });
  }

  const { make, model } = req.params;

  const queryStringValidation = (provinceWithDistricts) => {
    const respondError = () => {
      throw "Error in qs";
    };

    const ifNotInListGoHome = (list, value) => {
      if (!list.includes(value)) {
        respondError();
      }
    };

    // Check whether the province selected is within the province list.
    const provinceSelectedIsWithinTheProvinceList = (provinceSelected) => {
      let exists = false;

      if (provinceSelected === "" || provinceSelected === "Select") {
        return false;
      }

      provinceWithDistricts.some((province) => {
        if (
          province.province.toLowerCase() === provinceSelected.toLowerCase() ||
          province.name.toLowerCase() === provinceSelected.toLowerCase()
        ) {
          exists = true;
          return true;
        } else {
          return false;
        }
      });

      return exists ? true : false;
    };

    const districtSelectedIsWithinTheDistrictList = (
      provinceSelected,
      districtSelected
    ) => {
      let exists = false;
      let provinceObject = provinceWithDistricts.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      provinceObject.districts.some((district) => {
        if (
          district.district.toLowerCase() === districtSelected.toLowerCase()
        ) {
          exists = true;
          return true;
        } else {
          exists = false;
          return false;
        }
      });
      return exists ? true : false;
    };

    for (let key in filters) {
      switch (key) {
        case "":
          break;
        case "t":
          ifNotInListGoHome(transmission, filters[key]);
          break;
        case "bt":
          ifNotInListGoHome(bodyType, filters[key]);
          break;
        case "c":
          ifNotInListGoHome(condition, filters[key]);
          break;
        case "ft":
          ifNotInListGoHome(fuelType, filters[key]);
          break;
        case "d":
          ifNotInListGoHome(driveTrain, filters[key]);
          break;
        case "cr":
          ifNotInListGoHome(color, filters[key]);
          break;
        case "s":
          ifNotInListGoHome(seat, filters[key]);
          break;
        case "tr":
          break;
        case "mp":
          if (
            filters[key] !== "a" &&
            filters[key] !== "" &&
            isNaN(parseFloat(filters[key]))
          ) {
            respondError();
          }
          if (
            typeof filters["mnp"] !== "undefined" &&
            parseFloat(!isNaN(filters["mnp"])) &&
            parseFloat(filters[key]) < parseFloat(filters["mnp"])
          ) {
            respondError();
          }
          break;
        case "mk":
          if (
            filters[key] !== "a" &&
            filters[key] !== "" &&
            isNaN(parseFloat(filters[key]))
          ) {
            respondError();
          }
          if (
            typeof filters["mnk"] !== "undefined" &&
            parseFloat(!isNaN(filters["mnk"])) &&
            parseFloat(filters[key]) < parseFloat(filters["mnk"])
          ) {
            respondError();
          }
          break;
        case "my":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["mny"] !== "undefined" &&
            parseFloat(!isNaN(filters["mny"])) &&
            parseFloat(filters[key]) < parseFloat(filters["mny"])
          ) {
            respondError();
          }
          break;
        case "mny":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["my"] !== "undefined" &&
            parseFloat(isNaN(filters["my"])) &&
            parseFloat(filters[key]) > parseFloat(filters["my"])
          ) {
            respondError();
          }
          break;
        case "mnp":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["mp"] !== "undefined" &&
            parseFloat(isNaN(filters["mp"])) &&
            parseFloat(filters[key]) > parseFloat(filters["mp"])
          ) {
            respondError();
          }
          break;
        case "mnk":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["mk"] !== "undefined" &&
            parseFloat(!isNaN(filters["mk"])) &&
            parseFloat(filters[key]) > parseFloat(filters["mk"])
          ) {
            respondError();
          }
          break;
        case "pr":
          if (!provinceSelectedIsWithinTheProvinceList(filters[key])) {
            respondError();
          }
          break;
        case "dis":
          if (
            typeof filters["pr"] === "undefined" ||
            !districtSelectedIsWithinTheDistrictList(
              filters["pr"],
              filters[key]
            )
          ) {
            respondError();
          }
          break;
        case "feature[]":
          if (typeof filters[key] === "string") {
            ifNotInListGoHome(featuresDatabase, filters[key]);
          }
          if (typeof filters[key] === "object") {
            const result = filters[key].every((val) =>
              featuresDatabase.includes(val)
            );
            if (!result) {
              respondError();
            }
          }
          break;
        default:
          respondError();
      }
    }
  };

  // Validate make and model selected
  // Check whether the make selected is within the car list.
  const makeSelectedIsWithinTheCarList = (carList) => {
    if (make.toLowerCase() === "a") {
      return true;
    }
    return carList.some((car) => car.make === make);
  };

  // Check whether the model selected is within the car list.
  const modelSelectedIsWithinTheCarList = (carList) => {
    if (model === "other" || model.toLowerCase() === "a") {
      return true;
    }

    let carMakeObject = carList.find((car) => car.make === make);

    if (typeof carMakeObject === "undefined") {
      return false;
    }

    if (model.toLowerCase() === "other") {
      return true;
    }

    return carMakeObject.models.some((carModel) => carModel.model === model);
  };

  CarMakesAndModels.find({}, (err, carList) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server Error" });
    }
    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ msg: "Server Error", success: false });
      }
      try {
        queryStringValidation(provinceWithDistricts);
      } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Invalid filters", success: false });
      }
      if (
        !makeSelectedIsWithinTheCarList(carList) ||
        !modelSelectedIsWithinTheCarList(carList)
      ) {
        return res
          .status(400)
          .json({ success: false, msg: "Please provide valid requirements!" });
      }

      let filterDetail = {};

      if (make.toLowerCase() !== "a") {
        filterDetail[`carDetails.carMakeSelected`] = make;
        if (model.toLowerCase() !== "a") {
          filterDetail[`carDetails.carModelSelected`] = model;
        }
      }

      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          const value = filters[key];
          switch (key) {
            case "mnk":
              // If the min price is already been set then carPriceInput will be replaced
              // with max so add to it so wee need to check whether it has already been
              //  before
              if (
                typeof filterDetail["carDetails.carKiloMetersInput"] !==
                "undefined"
              ) {
                filterDetail["carDetails.carKiloMetersInput"].$gte = parseFloat(
                  value
                );
              } else {
                filterDetail[`carDetails.carKiloMetersInput`] = {
                  $gte: parseFloat(value),
                };
              }

              break;
            case "mk":
              if (value !== "") {
                if (
                  typeof filterDetail["carDetails.carKiloMetersInput"] !==
                  "undefined"
                ) {
                  filterDetail[
                    "carDetails.carKiloMetersInput"
                  ].$lte = parseFloat(value);
                } else {
                  filterDetail[`carDetails.carKiloMetersInput`] = {
                    $lte: parseFloat(value),
                  };
                }
              }

              break;
            case "mnp":
              if (
                typeof filterDetail["carDetails.carPriceInput"] !== "undefined"
              ) {
                filterDetail["carDetails.carPriceInput"].$gte = parseFloat(
                  value
                );
              } else {
                filterDetail[`carDetails.carPriceInput`] = {
                  $gte: parseFloat(value),
                };
              }
              break;
            case "mp":
              if (value !== "") {
                if (
                  typeof filterDetail["carDetails.carPriceInput"] !==
                  "undefined"
                ) {
                  filterDetail["carDetails.carPriceInput"].$lte = parseFloat(
                    value
                  );
                } else {
                  filterDetail[`carDetails.carPriceInput`] = {
                    $lte: parseFloat(value),
                  };
                }
              }

              break;
            case "mny":
              if (
                typeof filterDetail["carDetails.carYearInput"] !== "undefined"
              ) {
                filterDetail["carDetails.carYearInput"].$gte = parseFloat(
                  value
                );
              } else {
                filterDetail[`carDetails.carYearInput`] = {
                  $gte: parseFloat(value),
                };
              }
              break;
            case "my":
              if (
                typeof filterDetail["carDetails.carYearInput"] !== "undefined"
              ) {
                filterDetail["carDetails.carYearInput"].$lte = parseFloat(
                  value
                );
              } else {
                filterDetail[`carDetails.carYearInput`] = {
                  $lte: parseFloat(value),
                };
              }
              break;
            case "t":
              filterDetail[`carDetails.carTransmissionSelected`] = value;
              break;
            case "bt":
              filterDetail[`carDetails.carBodyTypeSelected`] = value;
              break;
            case "c":
              filterDetail[`carDetails.carConditionSelected`] = value;
              break;
            case "ft":
              filterDetail[`carDetails.carFuelTypeSelected`] = value;
              break;
            case "d":
              filterDetail[`carDetails.carDrivetrainSelected`] = value;
              break;
            case "cr":
              filterDetail[`carDetails.carColorSelected`] = value;
              break;
            case "s":
              filterDetail[`carDetails.carSeatsSelected`] = value;
              break;
            case "tr":
              filterDetail[`carDetails.carTrimInput`] = value;
              break;
            case "dis":
              filterDetail[`carDetails.districtSelected`] = value;
              break;
            case "pr":
              filterDetail[`carDetails.provinceSelected`] = value;
              break;
            case "feature[]":
              if (typeof value === "string") {
                filterDetail[`carDetails.${value}`] = true;
              } else if (typeof value === "object") {
                value.forEach((feature) => {
                  filterDetail[`carDetails.${feature}`] = true;
                });
              }
              break;
            default:
              break;
          }
        }
      }

      if (req.isAuthenticated()) {
        filterDetail[`userId`] = {
          $ne: req.user.id,
        };
      }

      Car.find(filterDetail, (err, documents) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the document.",
          });
        }

        if (!documents.length) {
          return res.json({ listings: [], success: true });
        }

        return res.json({ listings: documents, success: true });
      });
    });
  });
});

// @route   POST /api/car/getListingByID/:id
// @desc    get the car with given id
// @access  Public
router.post("/getListingByID/:id", (req, res) => {
  const listingId = req.params.id;

  const { valid } = req.body;

  if (valid !== config.API_KEY) {
    return res.status(401).json({ success: false, msg: "Invalid Request" });
  }

  if (listingId === "") {
    console.log("No carlisting id given");
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }

  Car.findById(listingId)
    .then((listing) => {
      return res.json({ success: true, listing });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, msg: "Server error" });
    });
});

// @route   POST /api/car/getListingByIDs
// @desc    get the cars with given ids.
// @Used    Used in saved cars
// @access  Private
router.post("/getListingByIDs", ensureAuthenticated, (req, res) => {
  const { vehicleIds, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    valid !== "VaLId876" ||
    typeof vehicleIds === "undefined" ||
    vehicleIds.length === 0
  ) {
    return res.status(400).json({ message: "Error occurred", success: false });
  }

  // Creating a query dynamically since there is a list of cars that is saved by the user.
  let query = "";
  vehicleIds.forEach((id) => {
    let newQuery = `this._id == '${id}' ||`;
    query += newQuery;
  });

  // The last query will cause error if it contain || so removing it
  query = query.slice(0, -3);

  Car.$where(query).exec((err, documents) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error", success: false });
    }

    return res.json({ success: true, savedCars: documents });
  });
});

// @route   GET /api/car/
// @desc    Get all the cars
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  let filterDetail = JSON.parse(filter);

  let date = null;

  for (const key in filterDetail) {
    switch (key) {
      case "_id":
        const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

        if (!isValid) {
          return res.json({ data: [], success: true, total: 0 });
        }
        break;

      case "date":
        date = filterDetail.date;
        delete filterDetail.date;
        break;

      case "carDetails":
        for (const key in filterDetail.carDetails) {
          if (
            key === "maxPrice" ||
            key === "minPrice" ||
            key === "maxKilometer" ||
            key === "minKilometer" ||
            key === "minYear" ||
            key === "maxYear"
          ) {
            switch (key) {
              case "maxPrice":
                // If the min price is already been set then carPriceInput will be replaced
                // with max so add to it so wee need to check whether it has already been
                //  before
                if (
                  typeof filterDetail[`carDetails.carPriceInput`] !==
                  "undefined"
                ) {
                  filterDetail[`carDetails.carPriceInput`].$lte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carPriceInput`] = {
                    $lte: filterDetail.carDetails[key],
                  };
                }
                break;
              case "minPrice":
                if (
                  typeof filterDetail[`carDetails.carPriceInput`] !==
                  "undefined"
                ) {
                  filterDetail[`carDetails.carPriceInput`].$gte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carPriceInput`] = {
                    $gte: filterDetail.carDetails[key],
                  };
                }
                break;
              case "maxKilometer":
                if (
                  typeof filterDetail[`carDetails.carKiloMetersInput`] !==
                  "undefined"
                ) {
                  filterDetail[`carDetails.carKiloMetersInput`].$lte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carKiloMetersInput`] = {
                    $lte: filterDetail.carDetails[key],
                  };
                }
                break;
              case "minKilometer":
                if (
                  typeof filterDetail[`carDetails.carKiloMetersInput`] !==
                  "undefined"
                ) {
                  filterDetail[`carDetails.carKiloMetersInput`].$gte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carKiloMetersInput`] = {
                    $gte: filterDetail.carDetails[key],
                  };
                }
                break;
              case "maxYear":
                if (
                  typeof filterDetail[`carDetails.carYearInput`] !== "undefined"
                ) {
                  filterDetail[`carDetails.carYearInput`].$lte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carYearInput`] = {
                    $lte: filterDetail.carDetails[key],
                  };
                }
                break;
              case "minYear":
                if (
                  typeof filterDetail[`carDetails.carYearInput`] !== "undefined"
                ) {
                  filterDetail[`carDetails.carYearInput`].$gte =
                    filterDetail.carDetails[key];
                } else {
                  filterDetail[`carDetails.carYearInput`] = {
                    $gte: filterDetail.carDetails[key],
                  };
                }
                break;

              default:
                break;
            }
            continue;
          }
          filterDetail[`carDetails.${key}`] = filterDetail.carDetails[key];
        }
        delete filterDetail.carDetails;
        break;

      default:
        break;
    }
  }

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
      let details = {
        make: document.carDetails.carMakeSelected,
        model: document.carDetails.carModelSelected,
        year: document.carDetails.carYearInput,
        condition: document.carDetails.carConditionSelected,
        province: document.carDetails.provinceSelected,
        district: document.carDetails.districtSelected,
        street: document.carDetails.streetAddressInput,
      };

      data.push({
        userEmail: document.userEmail,
        id: document.id,
        details,
        date: document.date,
        userId: document.userId,
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
  Car.find(filterDetail)
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
        data = getData(documents);
        total = data.length;
      }

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/car/:id
// @desc    Get a car wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  Car.findById(id)
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
          userEmail: document.userEmail,
          id: document.id,
          details: document.carDetails,
          date: document.date,
          userId: document.userId,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   PUT /api/car/:id
// @desc    UPdate a car wih given id
// @access  ADMIN
router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { details, valid } = data;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  const noError = validateCarDetails(details);

  if (typeof noError === "boolean" && !noError) {
    return res
      .status(400)
      .json({ success: false, msg: "Please fill the form correctly." });
  } else if (typeof noError === "object") {
    return res.status(412).json({ success: false, possibleErrors: noError });
  }

  const oldId = req.params.id;

  // Check if the updating user is the same user who owns the lisiting
  Car.findById(oldId)
    .then((listing) => {
      // Update the car details in the database
      const update = (mainPictureRemoved) => {
        listing.carDetails = details;
        if (mainPictureRemoved) {
          listing.carDetails.mainPicture = "";
        }
        listing
          .save()
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            console.log("error:", err);
            return res.status(500).json({ success: false });
          });
      };

      // Function to compare two arrays of objects and returns the odd one
      function comparer(otherArray) {
        return function (current) {
          return (
            otherArray.filter(function (other) {
              return other.fileUrl == current.fileUrl;
            }).length == 0
          );
        };
      }

      const deleteTheRemovedPictures = (carDetails) => {
        // Get the removed picture
        const removedPictures = listing.carDetails.picturesToBeUploadedMeta.filter(
          comparer(carDetails.picturesToBeUploadedMeta)
        );

        // If the picture was removed, we delete the picture from server
        if (removedPictures.length > 0) {
          let mainPictureRemoved = false;

          removedPictures.forEach((removedPicture) => {
            const dir = `${
              path.join(__dirname, "../../") + removedPicture.fileUrl
            }`;
            if (fs.existsSync(dir)) {
              fs.unlinkSync(dir);
              if (listing.carDetails.mainPicture === removedPicture.fileUrl) {
                listing.carDetails.mainPicture = "";
                mainPictureRemoved = true;
              }
            } else {
              console.log("User deleted pictures dir doesnot exists.");
              return res.status(400).json({
                msg: "Server error",
                success: false,
              });
            }
          });
          return update(mainPictureRemoved);
        } else {
          return update(false);
        }
      };

      return deleteTheRemovedPictures(details);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/car/:id
// @desc    Delete a car with given id
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

  Car.findById(id)
    .then((listing) => {
      const pictureDirectory = `${
        path.join(__dirname, "../../") +
        "assets/uploads/carImages/" +
        listing.carDetails.uniqueId
      }`;

      const promises = [];

      promises.push(
        listing.remove().then(() => {
          // Asynchronously check if the picture directory exists
          fs.exists(pictureDirectory, (exists) => {
            if (exists) {
              // Delete the picure directory
              remove(pictureDirectory, function (err) {
                if (err) {
                  console.log(err);
                  throw err;
                }
              });
            }
          });
        })
      );

      Views.findOne({ vehicleId: id, vehicleType: "Car" }, (err, view) => {
        if (err) {
          throw err;
        }
        if (view) {
          promises.push(view.remove());
        }
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, msg: "Server Error" });
          });
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }
    });
});

// @route   DELETE /api/confirmEmails?query
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

    let promises = [];

    // Delete all the confirm email with id in id list.
    Car.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the car.",
          });
        }

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(
            document.remove().then(() => {
              const pictureDirectory = `${
                path.join(__dirname, "../../") +
                "assets/uploads/carImages/" +
                document.carDetails.uniqueId
              }`;
              // Asynchronously check if the picture directory exists
              fs.exists(pictureDirectory, (exists) => {
                if (exists) {
                  // Delete the picure directory
                  remove(pictureDirectory, function (err) {
                    if (err) {
                      throw err;
                    }
                  });
                }
              });
            })
          );
        });

        Views.find({ vehicleType: "Car" })
          .where("vehicleId")
          .in(id)
          .exec((err, documents) => {
            if (err) {
              return res.status(500).json({
                success: false,
                err: "serverError",
                msg: "Error finding the view.",
              });
            }
            documents.forEach((document) => {
              promises.push(document.remove());
            });

            // Deleting the cars and views
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
      });
  }
});

module.exports = router;
