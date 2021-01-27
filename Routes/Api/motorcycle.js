const express = require("express");
const { ensureAuthenticated } = require("../../config/auth");
const router = express.Router();
const {
  bodyTypes,
  conditions,
  colors,
  fuelTypes,
  featuresDB,
} = require("../../config/motorcycleFilters");
const { isUuid } = require("uuidv4");
const path = require("path");
const fs = require("fs");
const remove = require("remove");
const config = require("config");
const MotorcycleMakesAndModels = require("../../models/MotorcycleMakesAndModels");
const ProvinceWithDistricts = require("../../models/ProvinceWithDistricts");
// Motorcycle model
const Motorcycle = require("../../models/Motorcycle");
const TempFolders = require("../../models/TempFolders");
const Views = require("../../models/Views");
const mongoose = require("mongoose");

const validateDetails = (details, motorcycles, provinceWithDistricts) => {
  const error = (possibleErrors) => {
    if (!possibleErrors) {
      return false;
    } else {
      return possibleErrors;
    }
  };

  if (!details || typeof details === "undefined") {
    console.log("details is undefined");
    return error(false);
  }

  const {
    make,
    model,
    year,
    ccInput,
    bodyTypeSelected,
    conditionSelected,
    kilometerInput,
    colorSelected,
    fuelTypeSelected,
    hasElectricStart,
    hasAlloyWheels,
    hasTubelessTyres,
    hasDigitalDisplayPanel,
    hasProjectedHeadLight,
    hasLedTailLight,
    hasFrontDiscBrake,
    hasRearDiscBrake,
    hasAbs,
    hasMonoSuspension,
    hasSplitSeat,
    hasTripMeter,
    adTitle,
    adDescription,
    youtubeLinkInput,
    provinceSelected,
    districtSelected,
    streetAddressInput,
    priceType,
    priceInput,
    phoneNumberInput,
    picturesToBeUploadedMeta,
    uniqueId,
    email,
  } = details;

  if (!isUuid(uniqueId)) {
    return error(false);
  }

  //  this methods checks the errors and returns the errors in the form
  const formulateErrors = () => {
    // All the possible errors
    let possibleErrors = {
      noYearError: true,
      noMakeError: true,
      noModelError: true,
      noBodyTypeError: true,
      noConditionError: true,
      noKilometersError: true,
      noColorError: true,
      noFuelTypeError: true,
      noCCError: true,
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
    we do not want year to be empty string and also not greater than the current year
    when year input is empty string it is equal to 1 and same case when it is greater than current year
    0 === 0 is true which means noYearError is true
    */
    if (
      year.toString() === "" ||
      year > thisYear ||
      year.toString().length !== 4
    ) {
      possibleErrors.noYearError = false;
    } else {
      possibleErrors.noYearError = true;
    }

    // Check whether the make selected is within the list.
    const makeSelectedIsWithinTheMakeList = () => {
      return motorcycles.some((motorcycle) => motorcycle.make === make);
    };

    // make
    possibleErrors.noMakeError = makeSelectedIsWithinTheMakeList();

    // Check whether the model selected is within the  list.
    const modelSelectedIsWithinTheModelList = () => {
      if (make.toLowerCase() === "other") {
        return true;
      }

      let motorcycleMake = motorcycles.find(
        (motorcycle) => motorcycle.make === make
      );

      if (model.toLowerCase() === "other") {
        return true;
      }

      return motorcycleMake.models.some(
        (motorcycleModel) => motorcycleModel.model === model
      );
    };

    // If  make is not selected, there will  make error.
    // There should be no  make error should before checking model error.
    if (possibleErrors.noMakeError) {
      possibleErrors.noModelError = modelSelectedIsWithinTheModelList();
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

    // Check if the given item in within the given list
    const checkIfTheItemIsWithinTheGivenList = (list, item) => {
      return list.some(
        (listItem) => listItem.toLowerCase() === item.toLowerCase()
      );
    };

    // Check body is empty
    possibleErrors.noBodyTypeError = checkIfTheItemIsWithinTheGivenList(
      bodyTypes,
      bodyTypeSelected
    );

    // Check condition is empty
    possibleErrors.noConditionError = checkIfTheItemIsWithinTheGivenList(
      conditions,
      conditionSelected
    );

    // Check kilometer is empty
    // params: kilometer input and maximum length
    possibleErrors.noKilometersError = checkInputError(
      kilometerInput.toString(),
      20
    );

    // Check CC is empty
    // params: CC input and maximum length
    possibleErrors.noCCError = checkInputError(ccInput.toString(), 4);

    // Color
    possibleErrors.noColorError = checkIfTheItemIsWithinTheGivenList(
      colors,
      colorSelected
    );

    // // Fuel Type
    possibleErrors.noFuelTypeError = checkIfTheItemIsWithinTheGivenList(
      fuelTypes,
      fuelTypeSelected
    );

    // // List of all the checkbox button values
    const booleanCheckList = [
      hasElectricStart,
      hasAlloyWheels,
      hasTubelessTyres,
      hasDigitalDisplayPanel,
      hasProjectedHeadLight,
      hasLedTailLight,
      hasFrontDiscBrake,
      hasRearDiscBrake,
      hasAbs,
      hasMonoSuspension,
      hasSplitSeat,
      hasTripMeter,
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

    if (
      picturesToBeUploadedMeta.length > 10 ||
      picturesToBeUploadedMeta.length < 2
    ) {
      possibleErrors.noPicturesError = false;
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

      let found = false;

      found = provinceWithDistricts.find(
        (province) =>
          (province.province.toLowerCase() === provinceSelected.toLowerCase()) |
          (province.name.toLowerCase() === provinceSelected.toLowerCase())
      );

      // If the province in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }

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

      let found = false;

      found = provinceObject.districts.find(
        (district) =>
          district.district.toLowerCase() === districtSelected.toLowerCase()
      );

      // If the district in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }

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
      priceInput !== ""
    ) {
      possibleErrors.noPriceInputError = checkInputError(
        priceInput.toString(),
        10
      );
    } else if (possibleErrors.noPriceTypeError && priceType !== "notFree") {
      possibleErrors.noPriceInputError = true;
    } else {
      possibleErrors.noPriceInputError = false;
    }

    // Checks the phone number input
    // Phone number should be 10 digits and landline number should be 7 digits or empty
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

    if (phoneNumberInput !== "" && phoneNumberInput !== null) {
      possibleErrors.noPhoneNumberError = phoneNumberIsValid(phoneNumberInput);
    } else {
      if (phoneNumberInput === null) {
        setPhoneNumberInput("");
      }
      possibleErrors.noPhoneNumberError = true;
    }

    const emailIsValid = (mail) => {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(String(mail).toLowerCase());
    };

    possibleErrors.noEmailError = emailIsValid(email);

    return possibleErrors;
  };

  // checks if any of the keys in object is false, returns true if so
  hasErrors = (obj) => {
    for (var o in obj) if (!obj[o]) return true;
    return false;
  };

  const possibleErrors = formulateErrors();

  if (hasErrors(possibleErrors)) {
    return error(possibleErrors);
  } else {
    return true;
  }
};

// @route   POST /api/motorcycle
// @desc    Save new motorcycle ad
// @access  Private
router.post("/", ensureAuthenticated, (req, res) => {
  const { details, valid } = req.body;

  if (typeof valid === "undefined" || valid !== "VaLID8973") {
    return res.status(500).json({ success: false });
  }

  const userEmail = req.user.email;
  const userId = req.user._id;

  if (details.email !== userEmail || details.userId != userId) {
    console.log("email or id is not same");
    return res.status(500).json({ success: false });
  }

  MotorcycleMakesAndModels.find({}, (err, motorcycles) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server error" });
    }

    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }

      const noError = validateDetails(
        details,
        motorcycles,
        provinceWithDistricts
      );

      if (typeof noError === "boolean" && noError) {
        // Path of the temporary directory that contains uploaded motorcycle images
        const tempDir = `${
          path.join(__dirname, "../../") +
          "assets/uploads/temp/" +
          details.uniqueId
        }`;

        // Path of the permanent directory
        const permDir = `${
          path.join(__dirname, "../../") +
          "assets/uploads/motorcycleImages/" +
          details.uniqueId
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

              details.picturesToBeUploadedMeta.forEach((meta) => {
                meta.fileUrl =
                  "/assets/uploads/motorcycleImages/" +
                  details.uniqueId +
                  "/" +
                  meta.serverFileName;
              });

              const userEmail = req.user.email;
              const userId = req.user._id;

              const newMotorcycleAd = new Motorcycle({
                userEmail,
                userId,
                details,
              });

              newMotorcycleAd
                .save()
                .then(() => {
                  // Delete tempfolder saved in the database
                  TempFolders.find(
                    {
                      uniqueId: details.uniqueId,
                    },
                    (err, listings) => {
                      if (err) {
                        console.log(err);
                        return res.status(500).json({
                          success: false,
                          msg: "Error while finding the tempfolder",
                        });
                      }
                      // If the listing is empty there is error as there should obviously be one
                      if (listings.length === 0) {
                        return res.status(500).json({
                          success: false,
                          msg: "Temp folder is not available",
                        });
                      } else {
                        // Since listings can containg other folders used by the user
                        listings.forEach((listing) => {
                          if (listing.uniqueId.length >= 2) {
                            listing.uniqueId.splice(
                              listing.uniqueId.indexOf(details.uniqueId),
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
                    }
                  );
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
          return res
            .status(412)
            .json({ success: false, possibleErrors: noError });
        }
      }
    });
  });
});

// @route   POST /api/motorcycle/getListing/userID
// @desc    get motorcycle listings of the given user id
// @access  Private
router.post("/getListing/:userId", (req, res) => {
  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== config.API_KEY) {
    return res.status(500).json({ success: false });
  }

  if (req.params.userId === "") {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }

  Motorcycle.find({ userId: req.params.userId }, (err, listings) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server Error!" });
    }
    return res.json(listings);
  });
});

// @route   POST /api/motorcycle/:listingId
// @desc    delete motorcycle listing
// @access  Private
router.post("/remove/:listingId", ensureAuthenticated, (req, res) => {
  const listingId = req.params.listingId;

  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== "VaLID8973") {
    return res.status(500).json({ success: false });
  }

  if (listingId === "") {
    console.log("No listing id");
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }

  Motorcycle.findById(listingId)
    .then((listing) => {
      if (listing.userId != req.user._id) {
        return res
          .status(401)
          .json({ msg: "Unauthorized Request!", success: false });
      }

      const pictureDirectory = `${
        path.join(__dirname, "../../") +
        "assets/uploads/motorcycleImages/" +
        listing.details.uniqueId
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

      Views.findOne(
        { vehicleId: listingId, vehicleType: "Motorcycle" },
        (err, view) => {
          if (err) {
            throw err;
          }
          if (view) {
            promises.push(view.remove());
          }
        }
      );

      Promise.all(promises)
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ success: false, msg: "Server Error" });
        });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }
    });

  // For check purpose only
  // return res.json({ msg: "Unauthorized Request!", success: true });
});

// @route   POST /api/motorcycle/update
// @desc    update a motorcycle listing
// @access  Private
router.post("/update", ensureAuthenticated, (req, res) => {
  const { details, valid, editNumber, databaseID } = req.body;

  if (
    // This is done to verify that the request is coming from valid source
    typeof databaseID === "undefined" ||
    typeof valid === "undefined" ||
    typeof editNumber === "undefined" ||
    valid !== "VaLID8973" ||
    editNumber !== "2" ||
    !databaseID ||
    databaseID == null
  ) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter the form correctly" });
  }

  const userEmail = req.user.email;
  const userId = req.user._id;

  if (details.email !== userEmail || details.userId != userId) {
    console.log("email or id is not same");
    return res.status(500).json({ success: false });
  }

  MotorcycleMakesAndModels.find({}, (err, motorcycles) => {
    if (err) {
      return res.status(500).json({ success: false, msg: "Server error" });
    }

    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }

      const noError = validateDetails(
        details,
        motorcycles,
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
      Motorcycle.findById(databaseID)
        .then((listing) => {
          if (listing.userId != req.user._id) {
            return res.status(403).json({
              msg: "Please use the website correctly!",
              success: true,
            });
          }

          // Update the motorcycle details in the database
          const update = (mainPictureRemoved) => {
            listing.details = details;
            if (mainPictureRemoved) {
              listing.details.mainPicture = "";
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

          const deleteTheRemovedPictures = (details) => {
            details.picturesToBeUploadedMeta.forEach((meta) => {
              if (meta.fileUrl.includes("/assets/uploads/temp/")) {
                meta.fileUrl = `${
                  "/assets/uploads/motorcycleImages/" +
                  details.uniqueId +
                  "/" +
                  meta.serverFileName
                }`;
              }
            });

            // Get the removed picture
            const removedPictures = listing.details.picturesToBeUploadedMeta.filter(
              comparer(details.picturesToBeUploadedMeta)
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
                  if (listing.details.mainPicture === removedPicture.fileUrl) {
                    listing.details.mainPicture = "";
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
          for (let i = 0; i < details.picturesToBeUploadedMeta.length; i++) {
            const meta = details.picturesToBeUploadedMeta[i];

            if (meta.fileUrl.includes("/assets/uploads/temp/")) {
              // Path of the temporary directory that contains uploaded motorcycle images
              const tempDir = `${
                path.join(__dirname, "../../") +
                "assets/uploads/temp/" +
                details.uniqueId
              }`;
              // Path of the permanent directory
              const permDir = `${
                path.join(__dirname, "../../") +
                "assets/uploads/motorcycleImages/" +
                details.uniqueId
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
            details.uniqueId
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
                return deleteTheRemovedPictures(details);
              });
            } else {
              // If user has removed previously uploaded pictures then delete them
              return deleteTheRemovedPictures(details);
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

// @route   POST /api/motorcycle/get/make/model
// @desc    get the motorcycles with given make and model and selected filters
// @access  Public
router.post("/get/:make/:model", (req, res) => {
  const { make, model } = req.params;

  const { valid, filters } = req.body;

  if (typeof valid === "undefined" || valid !== config.API_KEY) {
    return res.status(500).json({ success: false });
  }

  const queryStringValidation = (provinceWithDistricts) => {
    // Check whether the province selected is within the province list.
    const provinceSelectedIsWithinTheProvinceList = (provinceSelected) => {
      let exists = false;

      if (provinceSelected === "" || provinceSelected === "Select") {
        return false;
      }

      let found = false;

      found = provinceWithDistricts.find(
        (province) =>
          (province.province.toLowerCase() === provinceSelected.toLowerCase()) |
          (province.name.toLowerCase() === provinceSelected.toLowerCase())
      );

      // If the province in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }

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

      let found = false;

      found = provinceObject.districts.find(
        (district) =>
          district.district.toLowerCase() === districtSelected.toLowerCase()
      );

      // If the district in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }
      return exists ? true : false;
    };

    const respondError = () => {
      throw "Error in qs";
    };

    const ifNotInListGoHome = (list, value) => {
      if (!list.includes(value)) {
        respondError();
      }
    };

    for (let key in filters) {
      switch (key) {
        case "":
          break;
        case "bt":
          ifNotInListGoHome(bodyTypes, filters[key]);
          break;
        case "c":
          ifNotInListGoHome(conditions, filters[key]);
          break;
        case "ft":
          ifNotInListGoHome(fuelTypes, filters[key]);
          break;
        case "cr":
          ifNotInListGoHome(colors, filters[key]);
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
            !isNaN(parseFloat(filters["mnp"])) &&
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
            !isNaN(parseFloat(filters["mnk"])) &&
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
            !isNaN(parseFloat(filters["mny"])) &&
            parseFloat(filters[key]) < parseFloat(filters["mny"])
          ) {
            respondError();
          }
          break;
        case "mc":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["mnc"] !== "undefined" &&
            !isNaN(parseFloat(filters["mnc"])) &&
            parseFloat(filters[key]) < parseFloat(filters["mnc"])
          ) {
            respondError();
          }
          break;
        case "mnc":
          if (isNaN(parseFloat(filters[key]))) {
            respondError();
          }
          if (
            typeof filters["mc"] !== "undefined" &&
            !isNaN(parseFloat(filters["mc"])) &&
            parseFloat(filters[key]) > parseFloat(filters["mc"])
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
            !isNaN(parseFloat(filters["my"])) &&
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
            !isNaN(parseFloat(filters["mp"])) &&
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
            !isNaN(parseFloat(filters["mk"])) &&
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
            ifNotInListGoHome(featuresDB, filters[key]);
          }
          if (typeof filters[key] === "object") {
            const result = filters[key].every((val) =>
              featuresDB.includes(val)
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

  MotorcycleMakesAndModels.find({}, (err, motorcycleList) => {
    // VValidate query strings/filters
    ProvinceWithDistricts.find({}, (err, provinceWithDistricts) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }
      try {
        queryStringValidation(provinceWithDistricts);
      } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Invalid filters", success: false });
      }

      // Validate make and model selected
      // Check whether the make selected is within the motorcycle list.
      const makeSelectedIsWithinTheMotorcycleList = () => {
        if (make.toLowerCase() === "a") {
          return true;
        }
        return motorcycleList.some((motorcycle) => motorcycle.make === make);
      };

      // Check whether the model selected is within the motorcycle list.
      const modelSelectedIsWithinTheMotorcycleList = () => {
        if (model === "other" || model.toLowerCase() === "a") {
          return true;
        }

        let motorcycleMake = motorcycleList.find(
          (motorcycle) => motorcycle.make === make
        );

        if (typeof motorcycleMake === "undefined") {
          return false;
        }

        if (model.toLowerCase() === "other") {
          return true;
        }

        return motorcycleMake.models.some(
          (motorcycleModel) => motorcycleModel.model === model
        );
      };

      // Validate make and model
      if (
        !makeSelectedIsWithinTheMotorcycleList() ||
        !modelSelectedIsWithinTheMotorcycleList()
      ) {
        console.log("Make or model error");
        return res
          .status(400)
          .json({ success: false, msg: "Please provide valid requirements!" });
      }

      let filterDetail = {};

      // Convert filters to the mongo db format
      if (make.toLowerCase() !== "a") {
        filterDetail[`details.make`] = make;
        if (model.toLowerCase() !== "a") {
          filterDetail[`details.model`] = model;
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
                typeof filterDetail["details.kilometerInput"] !== "undefined"
              ) {
                filterDetail["details.kilometerInput"].$gte = parseFloat(value);
              } else {
                filterDetail[`details.kilometerInput`] = {
                  $gte: parseFloat(value),
                };
              }

              break;
            case "mk":
              if (value !== "") {
                if (
                  typeof filterDetail["details.kilometerInput"] !== "undefined"
                ) {
                  filterDetail["details.kilometerInput"].$lte = parseFloat(
                    value
                  );
                } else {
                  filterDetail[`details.kilometerInput`] = {
                    $lte: parseFloat(value),
                  };
                }
              }

              break;
            case "mnp":
              if (typeof filterDetail["details.priceInput"] !== "undefined") {
                filterDetail["details.priceInput"].$gte = parseFloat(value);
              } else {
                filterDetail[`details.priceInput`] = {
                  $gte: parseFloat(value),
                };
              }
              break;
            case "mp":
              if (value !== "") {
                if (typeof filterDetail["details.priceInput"] !== "undefined") {
                  filterDetail["details.priceInput"].$lte = parseFloat(value);
                } else {
                  filterDetail[`details.priceInput`] = {
                    $lte: parseFloat(value),
                  };
                }
              }

              break;
            case "mny":
              if (typeof filterDetail["details.year"] !== "undefined") {
                filterDetail["details.year"].$gte = parseFloat(value);
              } else {
                filterDetail[`details.year`] = {
                  $gte: parseFloat(value),
                };
              }
              break;
            case "my":
              if (typeof filterDetail["details.year"] !== "undefined") {
                filterDetail["details.year"].$lte = parseFloat(value);
              } else {
                filterDetail[`details.year`] = {
                  $lte: parseFloat(value),
                };
              }
              break;
            case "mnc":
              if (typeof filterDetail["details.ccInput"] !== "undefined") {
                filterDetail["details.ccInput"].$gte = parseFloat(value);
              } else {
                filterDetail[`details.ccInput`] = {
                  $gte: parseFloat(value),
                };
              }
              break;
            case "mc":
              if (typeof filterDetail["details.ccInput"] !== "undefined") {
                filterDetail["details.ccInput"].$lte = parseFloat(value);
              } else {
                filterDetail[`details.ccInput`] = {
                  $lte: parseFloat(value),
                };
              }
              break;
            case "bt":
              filterDetail[`details.bodyTypeSelected`] = value;
              break;
            case "c":
              filterDetail[`details.conditionSelected`] = value;
              break;
            case "ft":
              filterDetail[`details.fuelTypeSelected`] = value;
              break;
            case "cr":
              filterDetail[`details.colorSelected`] = value;
              break;
            case "dis":
              filterDetail[`details.districtSelected`] = value;
              break;
            case "pr":
              filterDetail[`details.provinceSelected`] = value;
              break;
            case "feature[]":
              if (typeof value === "string") {
                filterDetail[`details.${value}`] = true;
              } else if (typeof value === "object") {
                value.forEach((feature) => {
                  filterDetail[`details.${feature}`] = true;
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

      // When admin needs multiple users then we send filters to the api
      Motorcycle.find(filterDetail).exec((err, documents) => {
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

// @route   POST /api/motorcycle/getListingByID/:id
// @desc    get the motorcycle with given id
// @access  Public
router.post("/getListingByID/:id", (req, res) => {
  const listingId = req.params.id;

  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== config.API_KEY) {
    return res.status(500).json({ success: false });
  }

  if (typeof listingId === "undefined" || listingId === null) {
    console.log("No Motorcyclelisting id given");
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid id." });
  }

  Motorcycle.findById(listingId)
    .then((listing) => {
      return res.json({ success: true, listing });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, msg: "Server error" });
    });
});

// @route   POST /api/motorcycle/getListingByIDs
// @desc    get the motorcycles with given ids.
// @Used    Used in saved motorcycles
// @access  Private
router.post("/getListingByIDs", ensureAuthenticated, (req, res) => {
  const { vehicleIds, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof vehicleIds === "undefined" ||
    valid !== "VaLID8973" ||
    vehicleIds.length === 0
  ) {
    return res.status(400).json({ message: "Error occurred", success: false });
  }

  // Creating a list of object ids
  let objectIds = [];
  vehicleIds.forEach((id) => {
    objectIds.push(mongoose.Types.ObjectId(id));
  });

  Motorcycle.find(
    {
      _id: {
        $in: objectIds,
      },
    },
    (err, documents) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server Error", success: false });
      }

      return res.json({ success: true, savedMotorcycles: documents });
    }
  );
});

// @route   GET /api/motorcycle/
// @desc    Get all the motorcycles
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

      case "details":
        for (const key in filterDetail.details) {
          if (
            key === "maxPrice" ||
            key === "minPrice" ||
            key === "maxKilometer" ||
            key === "minKilometer" ||
            key === "minYear" ||
            key === "maxYear" ||
            key === "minCC" ||
            key === "maxCC"
          ) {
            switch (key) {
              case "maxPrice":
                // If the min price is already been set then motorcyclePriceInput will be replaced
                // with max so add to it so wee need to check whether it has already been
                //  before
                if (typeof filterDetail[`details.priceInput`] !== "undefined") {
                  filterDetail[`details.priceInput`].$lte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.priceInput`] = {
                    $lte: filterDetail.details[key],
                  };
                }
                break;
              case "minPrice":
                if (typeof filterDetail[`details.priceInput`] !== "undefined") {
                  filterDetail[`details.priceInput`].$gte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.priceInput`] = {
                    $gte: filterDetail.details[key],
                  };
                }
                break;
              case "maxKilometer":
                if (
                  typeof filterDetail[`details.kilometerInput`] !== "undefined"
                ) {
                  filterDetail[`details.kilometerInput`].$lte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.kilometerInput`] = {
                    $lte: filterDetail.details[key],
                  };
                }
                break;
              case "minKilometer":
                if (
                  typeof filterDetail[`details.kilometerInput`] !== "undefined"
                ) {
                  filterDetail[`details.kilometerInput`].$gte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.kilometerInput`] = {
                    $gte: filterDetail.details[key],
                  };
                }
                break;
              case "maxYear":
                if (typeof filterDetail[`details.year`] !== "undefined") {
                  filterDetail[`details.year`].$lte = filterDetail.details[key];
                } else {
                  filterDetail[`details.year`] = {
                    $lte: filterDetail.details[key],
                  };
                }
                break;
              case "minYear":
                if (typeof filterDetail[`details.year`] !== "undefined") {
                  filterDetail[`details.year`].$gte = filterDetail.details[key];
                } else {
                  filterDetail[`details.year`] = {
                    $gte: filterDetail.details[key],
                  };
                }
                break;
              case "maxCC":
                if (typeof filterDetail[`details.ccInput`] !== "undefined") {
                  filterDetail[`details.ccInput`].$lte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.ccInput`] = {
                    $lte: filterDetail.details[key],
                  };
                }
                break;
              case "minCC":
                if (typeof filterDetail[`details.ccInput`] !== "undefined") {
                  filterDetail[`details.ccInput`].$gte =
                    filterDetail.details[key];
                } else {
                  filterDetail[`details.ccInput`] = {
                    $gte: filterDetail.details[key],
                  };
                }
                break;

              default:
                break;
            }
            continue;
          }
          filterDetail[`details.${key}`] = filterDetail.details[key];
        }
        delete filterDetail.details;
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
        make: document.details.make,
        model: document.details.model,
        year: document.details.year,
        condition: document.details.conditionSelected,
        province: document.details.provinceSelected,
        district: document.details.districtSelected,
        street: document.details.streetAddressInput,
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
  Motorcycle.find(filterDetail)
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

// @route   GET /api/motorcycle/:id
// @desc    Get a motorcycle wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  Motorcycle.findById(id)
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
          details: document.details,
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

// @route   PUT /api/motorcycle/:id
// @desc    UPdate a motorcycle wih given id
// @access  ADMIN
router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { details, valid } = data;

  if (typeof valid !== "string" || valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false, msg: "Verification failed" });
  }

  const noError = validateDetails(details);

  if (typeof noError === "boolean" && !noError) {
    return res
      .status(400)
      .json({ success: false, msg: "Please fill the form correctly." });
  } else if (typeof noError === "object") {
    return res.status(412).json({ success: false, possibleErrors: noError });
  }

  const oldId = req.params.id;

  // Check if the updating user is the same user who owns the lisiting
  Motorcycle.findById(oldId)
    .then((listing) => {
      // Update the motorcycle details in the database
      const update = (mainPictureRemoved) => {
        listing.details = details;
        if (mainPictureRemoved) {
          listing.details.mainPicture = "";
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

      const deleteTheRemovedPictures = (details) => {
        // Get the removed picture
        const removedPictures = listing.details.picturesToBeUploadedMeta.filter(
          comparer(details.picturesToBeUploadedMeta)
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
              if (listing.details.mainPicture === removedPicture.fileUrl) {
                listing.details.mainPicture = "";
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

// @route   DELETE /api/motorcycle/:id
// @desc    Delete a motorcycle with given id
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

  Motorcycle.findById(id)
    .then((listing) => {
      const pictureDirectory = `${
        path.join(__dirname, "../../") +
        "assets/uploads/motorcycleImages/" +
        listing.details.uniqueId
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

      Views.findOne(
        { vehicleId: id, vehicleType: "Motorcycle" },
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
    Motorcycle.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the motorcycle.",
          });
        }

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(
            document.remove().then(() => {
              const pictureDirectory = `${
                path.join(__dirname, "../../") +
                "assets/uploads/motorcycleImages/" +
                document.details.uniqueId
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

        Views.find({ vehicleType: "Motorcycle" })
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

            // Deleting the motorcycles and views
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
