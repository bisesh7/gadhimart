const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const config = require("config");
const mongoose = require("mongoose");
const SavedSearch = require("../../models/SavedSearch");
const CarMakesAndModels = require("../../models/CarMakesAndModels");
const {
  transmission,
  bodyType,
  condition,
  fuelType,
  driveTrain,
  color,
  seat,
  featuresDatabase,
} = require("../../config/filters");
const provinceWithDistricts = require("../../config/provinceWithDistricts");

// Checks the number of keys in a object
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Filter the listings
const removeUnmatchedListings = (listings, listingEmpty, savedFilters) => {
  // Check for number of keys in the savedFilter to check in db
  const numberOfFilters = Object.size(savedFilters);

  console.log("Searched Filters", savedFilters);

  // Checks if the listing is empty, if empty set newListing to true
  // if the filters were saved in the database it would have same number of filters as
  // the new filters to be saved
  const checkIfListingIsEmpty = () => {
    if (listings.length === 0) {
      listingEmpty = true;
    }
  };

  // Initial check
  checkIfListingIsEmpty();

  // If the number of filters is not same remove the listing
  if (!listingEmpty) {
    listings.forEach((listing, i) => {
      if (Object.size(listing.filters) !== numberOfFilters) {
        listings.splice(i, 1);
      }
    });
    console.log(1, listings);
    checkIfListingIsEmpty();
  }

  // If the keys is not same in db remove the listing
  if (!listingEmpty) {
    for (const key in savedFilters) {
      for (let i = 0; i < listings.length; i++) {
        if (!(key in listings[i].filters)) {
          listings.splice(i, 1);
          continue;
        }
      }
    }
    console.log(2, listings);

    checkIfListingIsEmpty();
  }

  // If the value of the keys is not same in db remove the listing
  if (!listingEmpty) {
    listings.forEach((listing, i) => {
      for (const key in listing.filters) {
        if (listing.filters[key] !== savedFilters[key]) {
          listings.splice(i, 1);
          break;
        }
      }
    });
    console.log(3, listings);
    checkIfListingIsEmpty();
  }

  return { listings, listingEmpty };
};

// @route   POST /api/savedSearch/new
// @desc    new saved search of users
// @access  Private
router.post("/new", ensureAuthenticated, (req, res) => {
  const { filters, vehicleType, valid } = req.body;
  const { make, model } = filters;

  if (
    typeof vehicleType !== "string" ||
    typeof filters !== "object" ||
    typeof valid === "undefined" ||
    valid !== "VaLId289"
  ) {
    return res.status(400).json({ success: false, message: "Error occurred!" });
  }

  const queryStringValidation = () => {
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

    if (vehicleType === "Car") {
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
          case "make":
          case "model":
            break;
          default:
            respondError();
        }
      }

      CarMakesAndModels.find({}, (err, carList) => {
        if (err) {
          return res.status(500).json({ success: false, msg: "Server Error!" });
        }
        if (
          !makeSelectedIsWithinTheCarList(carList) ||
          !modelSelectedIsWithinTheCarList(carList)
        ) {
          respondError();
        }
      });
    }
  };

  try {
    queryStringValidation();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "Invalid filters", success: false });
  }

  const respond = (err, listings, savedFilters) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: "Server Error!" });
    }

    console.log(listings);

    // If listings length is zero then new listing is true
    let newListing = false;

    listings = removeUnmatchedListings(listings, newListing, savedFilters)
      .listings;
    newListing = removeUnmatchedListings(listings, newListing, savedFilters)
      .listingEmpty;

    // if not new listing
    // After every validation there should always be 1 lisitng in listings
    if (!newListing) {
      if (listings[0].userIds.includes(req.user.id)) {
        return res.status(400).json({ success: false });
      }
    }

    console.log("final checking", listings);

    if (newListing) {
      // If new lisitng then create new saved search and save it
      const newSaveSearch = new SavedSearch({
        userIds: [req.user.id],
        vehicleType,
        filters: savedFilters,
        totalSaved: 1,
      });

      newSaveSearch
        .save()
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          return res.status(500).json({ success: false });
        });
    } else if (!newListing) {
      // If not new listing then push the user if into the userId of in db
      listings[0].userIds.push(req.user.id);
      listings[0].totalSaved = listings[0].totalSaved + 1;
      listings[0].save().then(() => {
        return res.json({ success: true });
      });
    }
  };

  switch (vehicleType) {
    case "Car":
      // Create the filters list to save to the database
      let savedCarFilters = {};

      for (const filter in filters) {
        if (filter === "") {
          continue;
        }

        switch (filter) {
          case "t":
            savedCarFilters.carTransmissionSelected = filters[filter];
            break;
          case "bt":
            savedCarFilters.carBodyTypeSelected = filters[filter];
            break;
          case "c":
            savedCarFilters.carConditionSelected = filters[filter];
            break;
          case "ft":
            savedCarFilters.carFuelTypeSelected = filters[filter];
            break;
          case "d":
            savedCarFilters.carDrivetrainSelected = filters[filter];
            break;
          case "cr":
            savedCarFilters.carColorSelected = filters[filter];
            break;
          case "s":
            savedCarFilters.carSeatsSelected = filters[filter];
            break;
          case "tr":
            savedCarFilters.carTrimInput = filters[filter];
            break;
          case "mp":
            if (filters[filter] === "") {
              savedCarFilters.carMaxPrice = "a";
            } else {
              savedCarFilters.carMaxPrice = parseFloat(filters[filter]);
            }
            break;
          case "mnp":
            if (filters[filter] === "") {
              savedCarFilters.carMinPrice = "a";
            } else {
              savedCarFilters.carMinPrice = parseFloat(filters[filter]);
            }
            break;
          case "mk":
            if (filters[filter] === "") {
              savedCarFilters.carMaxKilometer = "a";
            } else {
              savedCarFilters.carMaxKilometer = parseFloat(filters[filter]);
            }
            break;
          case "mnk":
            if (filters[filter] === "") {
              savedCarFilters.carMinKilometer = "a";
            } else {
              savedCarFilters.carMinKilometer = parseFloat(filters[filter]);
            }
            break;
          case "my":
            if (filters[filter] === "") {
              savedCarFilters.carMaxYear = "a";
            } else {
              savedCarFilters.carMaxYear = parseFloat(filters[filter]);
            }
            break;
          case "mny":
            if (filters[filter] === "") {
              savedCarFilters.carMinYear = "a";
            } else {
              savedCarFilters.carMinYear = parseFloat(filters[filter]);
            }
            break;
          case "pr":
            savedCarFilters.provinceSelected = filters[filter];
            break;
          case "dis":
            savedCarFilters.districtSelected = filters[filter];
            break;
          case "feature[]":
            if (typeof filters[filter] === "string") {
              savedCarFilters[filters[filter]] = true;
            } else if (typeof filters[filter] === "object") {
              filters[filter].forEach((f) => {
                savedCarFilters[f] = true;
              });
            }
            break;
        }
      }

      // Since make and model are not in parseQuery we add it here
      savedCarFilters.carMakeSelected = make.toUpperCase();
      savedCarFilters.carModelSelected = model.toUpperCase();

      SavedSearch.find(
        {
          vehicleType: "Car",
          "filters.carMakeSelected": make.toUpperCase(),
          "filters.carModelSelected": model.toUpperCase(),
        },
        (err, listings) => {
          return respond(err, listings, savedCarFilters);
        }
      );

      break;

    case "Motorcycle":
      // Create the filters list to save to the database
      let savedMotorcycleFilters = {};

      for (const filter in filters) {
        if (filter === "") {
          continue;
        }

        switch (filter) {
          case "bt":
            savedMotorcycleFilters.bodyTypeSelected = filters[filter];
            break;
          case "c":
            savedMotorcycleFilters.conditionSelected = filters[filter];
            break;
          case "ft":
            savedMotorcycleFilters.fuelTypeSelected = filters[filter];
            break;
          case "cr":
            savedMotorcycleFilters.colorSelected = filters[filter];
            break;
          case "mp":
            if (filters[filter] === "") {
              savedMotorcycleFilters.maxPrice = "a";
            } else {
              savedMotorcycleFilters.maxPrice = parseFloat(filters[filter]);
            }
            break;
          case "mnp":
            if (filters[filter] === "") {
              savedMotorcycleFilters.minPrice = "a";
            } else {
              savedMotorcycleFilters.minPrice = parseFloat(filters[filter]);
            }
            break;
          case "mk":
            if (filters[filter] === "") {
              savedMotorcycleFilters.maxKilometer = "a";
            } else {
              savedMotorcycleFilters.maxKilometer = parseFloat(filters[filter]);
            }
            break;
          case "mnk":
            if (filters[filter] === "") {
              savedMotorcycleFilters.minKilometer = "a";
            } else {
              savedMotorcycleFilters.minKilometer = parseFloat(filters[filter]);
            }
            break;
          case "my":
            if (filters[filter] === "") {
              savedMotorcycleFilters.maxYear = "a";
            } else {
              savedMotorcycleFilters.maxYear = parseFloat(filters[filter]);
            }
            break;
          case "mny":
            if (filters[filter] === "") {
              savedMotorcycleFilters.minYear = "a";
            } else {
              savedMotorcycleFilters.minYear = parseFloat(filters[filter]);
            }
            break;
          case "mc":
            if (filters[filter] === "") {
              savedMotorcycleFilters.maxCCInput = "a";
            } else {
              savedMotorcycleFilters.maxCCInput = parseFloat(filters[filter]);
            }
            break;
          case "mnc":
            if (filters[filter] === "") {
              savedMotorcycleFilters.minCCInput = "a";
            } else {
              savedMotorcycleFilters.minCCInput = parseFloat(filters[filter]);
            }
            break;
          case "pr":
            savedMotorcycleFilters.provinceSelected = filters[filter];
            break;
          case "dis":
            savedMotorcycleFilters.districtSelected = filters[filter];
            break;
          case "feature[]":
            if (typeof filters[filter] === "string") {
              savedMotorcycleFilters[filters[filter]] = true;
            } else if (typeof filters[filter] === "object") {
              filters[filter].forEach((f) => {
                savedMotorcycleFilters[f] = true;
              });
            }
            break;
        }
      }

      // Since make and model are not in parseQuery we add it here
      savedMotorcycleFilters.make = make.toUpperCase();
      savedMotorcycleFilters.model = model.toUpperCase();

      // Select all the listings with matching make and model and then filter it in respond
      SavedSearch.find(
        {
          vehicleType: "Motorcycle",
          "filters.make": make.toUpperCase(),
          "filters.model": model.toUpperCase(),
        },
        (err, listings) => {
          return respond(err, listings, savedMotorcycleFilters);
        }
      );
      break;

    default:
      return res.status(400).json({ success: false, msg: "Error Occurred" });
  }
});

// @route   POST /api/savedSearch/checkSavedSearch
// @desc    chack if the search is saved by user
// @access  Private
router.post("/checkSavedSearch", ensureAuthenticated, (req, res) => {
  const { filters, vehicleType, valid } = req.body;

  if (
    typeof vehicleType !== "string" ||
    typeof filters !== "object" ||
    typeof valid === "undefined" ||
    valid !== "VaLId289"
  ) {
    console.log("error");
    return res.status(400).json({ success: false, message: "Error occurred!" });
  }

  const respond = (err, listings) => {
    if (err) {
      console.log("Error finding listing", err);
      return res.status(500).json({ success: false, msg: "Server Error!" });
    }

    // If listings length is zero then new listing is true
    let listingEmpty = false;

    listingsWithDetail = removeUnmatchedListings(
      listings,
      listingEmpty,
      filters
    );
    listings = listingsWithDetail.listings;
    listingEmpty = listingsWithDetail.listingEmpty;

    // if not new listing
    // After every validation there should always be 1 lisitng in listings
    if (!listingEmpty) {
      console.log("listing is not empty", listings);
      if (listings[0].userIds.includes(req.user.id)) {
        return res.json({ success: true, savedSearch: true });
      }
    } else {
      console.log("listing is empty");
      return res.json({ success: true, savedSearch: false });
    }
  };

  switch (vehicleType) {
    case "Car":
      const { carMakeSelected, carModelSelected } = filters;

      if (
        typeof carMakeSelected === "undefined" ||
        typeof carModelSelected === "undefined"
      ) {
        console.log("error");
        return res
          .status(400)
          .json({ success: false, message: "Error occurred!" });
      }

      SavedSearch.$where(
        `this.vehicleType === 'Car' &&
        this.filters.carMakeSelected.toUpperCase() === '${carMakeSelected.toUpperCase()}' &&
        this.filters.carModelSelected.toUpperCase() === '${carModelSelected.toUpperCase()}'`
      ).exec((err, listings) => {
        return respond(err, listings);
      });

      break;

    case "Motorcycle":
      const { make, model } = filters;

      if (typeof make === "undefined" || typeof model === "undefined") {
        console.log("error");
        return res
          .status(400)
          .json({ success: false, message: "Error occurred!" });
      }

      // Select all the listings with matching make and model and then filter it in respond
      SavedSearch.$where(
        `this.vehicleType === 'Motorcycle' &&
        this.filters.make.toUpperCase() === '${make.toUpperCase()}' &&
        this.filters.model.toUpperCase() === '${model.toUpperCase()}'`
      ).exec((err, listings) => {
        return respond(err, listings);
      });
      break;

    default:
      return res.status(400).json({ success: false, msg: "Error Occurred" });
  }
});

// @route   POST /api/savedSearch/getSavedCarSearches
// @desc    get saved car search of users
// @access  Private
router.post("/getSavedCarSearches", ensureAuthenticated, (req, res) => {
  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== "VaLId289") {
    return res.status(400).json({ success: false, message: "Error occurred!" });
  }

  SavedSearch.$where(
    `this.vehicleType === 'Car' && 
    this.userIds.indexOf('${req.user._id}') > -1
    `
  ).exec((err, listings) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: "Server error" });
    }

    return res.json({ success: true, listings });
  });
});

// @route   POST /api/savedSearch/getSavedMotorcycleSearches
// @desc    get saved car search of users
// @access  Private
router.post("/getSavedMotorcycleSearches", ensureAuthenticated, (req, res) => {
  const { valid } = req.body;

  if (typeof valid === "undefined" || valid !== "VaLId289") {
    return res.status(400).json({ success: false, message: "Error occurred!" });
  }

  SavedSearch.$where(
    `this.vehicleType === 'Motorcycle' && 
    this.userIds.indexOf('${req.user._id}') > -1
    `
  ).exec((err, listings) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: "Server error" });
    }

    return res.json({ success: true, listings });
  });
});

// @route   POST /api/savedSearch/unsave
// @desc    unsave the saved car search of users
// @access  Private
router.post("/unsave", ensureAuthenticated, (req, res) => {
  const { id, valid } = req.body;

  if (typeof valid === "undefined" || valid !== "VaLId289") {
    console.log("invalid id");
    return res.status(400).json({ success: false, message: "Error occurred!" });
  }

  SavedSearch.findOne({ _id: id }, (err, savedSearch) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Server error!" });
    } else if (savedSearch === null) {
      console.log(err);
      return res.status(400).json({ success: false, message: "invalid id!" });
    }

    if (savedSearch.userIds.includes(req.user.id)) {
      if (savedSearch.userIds.length >= 2) {
        savedSearch.userIds = savedSearch.userIds.filter(
          (id) => id != req.user.id
        );
        savedSearch.totalSaved = savedSearch.totalSaved - 1;
        savedSearch.save();
        return res.json({ success: true });
      } else if (savedSearch.userIds.length === 1) {
        SavedSearch.deleteOne({ _id: id }, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, message: "Server error!" });
          }
          return res.json({ success: true });
        });
      }
    } else {
      // userIds donot contain user's id
      return res.status(400).json({ success: false, message: "invalid id!" });
    }
  });
});

// @route   POST /api/savedSearch/matchFiltersWithNewCar
// @desc    check if the new car matches the filters saved
// @access  Private
router.post("/matchFiltersWithNewCar", ensureAuthenticated, (req, res) => {
  const { carDetails, valid } = req.body;

  if (typeof valid !== "boolean" || !valid) {
    return res.status(400).json({ success: false });
  }

  const make = carDetails.carMakeSelected;
  const model = carDetails.carModelSelected;

  const respond = (err, listings) => {
    console.log("Initial Listings", listings);
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: "Server Error" });
    }

    const removeUnmatchedSavedSearch = (listing) => {
      const filters = listing.filters;
      let length = Object.keys(filters).length;
      for (const filter in filters) {
        length--;
        switch (filter) {
          case "carTransmissionSelected":
          case "carBodyTypeSelected":
          case "carConditionSelected":
          case "carFuelTypeSelected":
          case "carDrivetrainSelected":
          case "carColorSelected":
          case "carSeatsSelected":
          case "carTrimInput":
          case "provinceSelected":
          case "districtSelected":
            if (carDetails[filter] !== filters[filter]) {
              return false;
            }
            break;
          case "carMaxPrice":
            if (carDetails["priceType"] === "notFree") {
              if (filters[filter] !== "a") {
                if (carDetails["carPriceInput"] > filters[filter]) {
                  return false;
                }
              }
            } else if (carDetails["priceType"] !== "free") {
              return false;
            }
            break;
          case "carMinPrice":
            if (carDetails["priceType"] === "notFree") {
              if (carDetails["carPriceInput"] < filters[filter]) {
                return false;
              }
            } else if (carDetails["priceType"] !== "free") {
              return false;
            }
            break;
          case "carMaxKilometer":
            if (filters[filter] !== "a") {
              if (carDetails["carKiloMetersInput"] > filters[filter]) {
                return false;
              }
            }
            break;
          case "carMinKilometer":
            if (carDetails["carKiloMetersInput"] < filters[filter]) {
              return false;
            }
            break;
          case "carMaxYear":
            if (carDetails["carYearInput"] < filters[filter]) {
              return false;
            }
            break;
          case "carMinYear":
            if (carDetails["carYearInput"] > filters[filter]) {
              return false;
            }
            break;
          case "carHasSunRoof":
          case "carHasAlloyWheels":
          case "carHasNavigationSystem":
          case "carHasBluetooth":
          case "carHasPushStart":
          case "carHasParkingAssistant":
          case "carHasCruiseControl":
          case "carHasAirConditioning":
          case "carHasPowerSteering":
          case "carHasPowerWindow":
          case "carHasKeylessEntry":
          case "carHasAbs":
          case "carHasCarplay":
          case "carHasAndroidAuto":
            if (carDetails[filter] === false) {
              return false;
            }
            break;
        }
        if (length === 0) {
          return true;
        }
      }
    };

    let unmatchedListingIds = [];
    listings.forEach((listing) => {
      if (!removeUnmatchedSavedSearch(listing)) {
        unmatchedListingIds.push(listing._id);
      }
    });

    unmatchedListingIds.forEach((id) => {
      listings = listings.filter((listing) => listing._id != id);
    });

    let userIds = [];
    listings.forEach((listing) => {
      userIds = [...userIds, ...listing.userIds];
      userIds = [...new Set(userIds)];
    });

    console.log("Final Listings", listings);
    return res.json({ success: true, userIds, matchedFilters: listings });
  };

  // Select all the lisitings with matching make and model and then filter it in respond
  if (make === "Other") {
    SavedSearch.find(
      {
        vehicleType: "Car",
        "filters.carMakeSelected": {
          $in: [make.toUpperCase(), "A"],
        },
      },
      (err, listings) => {
        if (err) {
          console.log(err);
        }
        console.log(listings);
        return respond(err, listings);
      }
    );
  } else if (
    (make !== "Other" && model === "Other") ||
    (make !== "Other" && model !== "Other")
  ) {
    SavedSearch.find(
      {
        vehicleType: "Car",
        "filter.carMakeSelected": make.toUpperCase(),
        "filter.carModelSelected": model.toUpperCase(),
      },
      (err, listingsWithMakeAndModelFilter) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ success: false, msg: "Server error" });
        }

        SavedSearch.find(
          {
            vehicleType: "Car",
            "filter.carMakeSelected": make.toUpperCase(),
            "filter.carModelSelected": "A",
          },
          (err, listingsWithMakeAndAnyModelFilter) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ success: false, msg: "Server error" });
            }

            SavedSearch.find(
              {
                vehicleType: "Car",
                "filter.carMakeSelected": "A",
              },
              (err, listingsWithAllMakesFilter) => {
                if (err) {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ success: false, msg: "Server error" });
                }

                return respond(err, [
                  ...listingsWithMakeAndModelFilter,
                  ...listingsWithMakeAndAnyModelFilter,
                  ...listingsWithAllMakesFilter,
                ]);
              }
            );
          }
        );
      }
    );
  } else {
    return res.status(400).json({ success: false, msg: "Error occurred." });
  }
});

// @route   POST /api/savedSearch/matchFiltersWithNewMotorcycle
// @desc    check if the new motorcycle matches the filters saved
// @access  Private
router.post(
  "/matchFiltersWithNewMotorcycle",
  ensureAuthenticated,
  (req, res) => {
    const { details, valid } = req.body;

    if (typeof valid !== "boolean" || !valid) {
      return res.status(400).json({ success: false });
    }

    const make = details.make;
    const model = details.model;

    const respond = (err, listings) => {
      console.log(listings);

      if (err) {
        return res.status(500).json({ success: false, msg: "Server Error" });
      }

      const removeUnmatchedSavedSearch = (listing) => {
        const filters = listing.filters;
        let length = Object.keys(filters).length;
        for (const filter in filters) {
          length--;
          switch (filter) {
            case "bodyTypeSelected":
            case "conditionSelected":
            case "fuelTypeSelected":
            case "colorSelected":
            case "provinceSelected":
            case "districtSelected":
              if (details[filter] !== filters[filter]) {
                return false;
              }
              break;
            case "maxPrice":
              if (details["priceType"] === "notFree") {
                if (filters[filter] !== "a") {
                  if (details["priceInput"] > filters[filter]) {
                    return false;
                  }
                }
              } else if (details["priceType"] !== "free") {
                return false;
              }
              break;
            case "minPrice":
              if (details["priceType"] === "notFree") {
                if (details["priceInput"] < filters[filter]) {
                  return false;
                }
              } else if (details["priceType"] !== "free") {
                return false;
              }
              break;
            case "maxKilometer":
              if (filters[filter] !== "a") {
                if (details["kilometerInput"] > filters[filter]) {
                  return false;
                }
              }
              break;
            case "carMinKilometer":
              if (details["kilometerInput"] < filters[filter]) {
                return false;
              }
              break;
            case "maxYear":
              if (details["year"] < filters[filter]) {
                return false;
              }
              break;
            case "minYear":
              if (details["year"] > filters[filter]) {
                return false;
              }
              break;
            case "maxCCInput":
              if (details["ccInput"] < filters[filter]) {
                return false;
              }
              break;
            case "minCCInput":
              if (details["ccInput"] > filters[filter]) {
                return false;
              }
              break;
            case "hasElectricStart":
            case "hasAlloyWheels":
            case "hasTubelessTyres":
            case "hasDigitalDisplayPanel":
            case "hasProjectedHeadLight":
            case "hasLedTailLight":
            case "hasFrontDiscBrake":
            case "hasRearDiscBrake":
            case "hasAbs":
            case "hasMonoSuspension":
            case "hasSplitSeat":
            case "hasTripMeter":
              if (details[filter] === false) {
                return false;
              }
              break;
          }
          if (length === 0) {
            return true;
          }
        }
      };

      let unmatchedListingIds = [];
      listings.forEach((listing) => {
        if (!removeUnmatchedSavedSearch(listing)) {
          unmatchedListingIds.push(listing._id);
        }
      });

      unmatchedListingIds.forEach((id) => {
        listings = listings.filter((listing) => listing._id != id);
      });

      let userIds = [];
      listings.forEach((listing) => {
        userIds = [...userIds, ...listing.userIds];
        userIds = [...new Set(userIds)];
      });

      return res.json({ success: true, userIds, matchedFilters: listings });
    };

    // Select all the lisitings with matching make and model and then filter it in respond
    if (make === "Other") {
      SavedSearch.find(
        {
          vehicleType: "Motorcycle",
          "filters.make": {
            $in: [make.toUpperCase(), "A"],
          },
        },
        (err, listings) => {
          if (err) {
            console.log(err);
          }
          console.log(listings);
          return respond(err, listings);
        }
      );
    } else if (
      (make !== "Other" && model === "Other") ||
      (make !== "Other" && model !== "Other")
    ) {
      SavedSearch.find(
        {
          vehicleType: "Motorcycle",
          "filter.make": make.toUpperCase(),
          "filter.model": model.toUpperCase(),
        },
        (err, listingsWithMakeAndModelFilter) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, msg: "Server error" });
          }

          SavedSearch.find(
            {
              vehicleType: "Motorcycle",
              "filter.make": make.toUpperCase(),
              "filter.model": "A",
            },
            (err, listingsWithMakeAndAnyModelFilter) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ success: false, msg: "Server error" });
              }

              SavedSearch.find(
                {
                  vehicleType: "Motorcycle",
                  "filter.make": "A",
                },
                (err, listingsWithAllMakesFilter) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ success: false, msg: "Server error" });
                  }

                  return respond(err, [
                    ...listingsWithMakeAndModelFilter,
                    ...listingsWithMakeAndAnyModelFilter,
                    ...listingsWithAllMakesFilter,
                  ]);
                }
              );
            }
          );
        }
      );
    } else {
      return res.status(400).json({ success: false, msg: "Error occurred." });
    }
  }
);

// @route   GET /api/savedSearch/
// @desc    Get all the saved searches
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

  let vehicleFilters = {};
  // If id in filter is not valid send empty list back
  if (typeof filterDetail.filters !== "undefined") {
    try {
      vehicleFilters = JSON.parse(filterDetail.filters);
      delete filterDetail.filters;
      console.log(vehicleFilters);
    } catch (err) {
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
        id: document.id,
        filters: document.filters,
        vehicleType: document.vehicleType,
        userIds: document.userIds,
        totalSaved: document.totalSaved,
      });
    };

    if (Object.keys(vehicleFilters).length) {
      // Check if all the filters searched are inside the document filter
      // If all the filters searched are inside the document filters return true
      // else return false
      const allFiltersIsInTheDocument = (document) => {
        let count = 0;
        for (const key in vehicleFilters) {
          if (vehicleFilters.hasOwnProperty(key)) {
            const value = vehicleFilters[key];
            if (key in document.filters) {
              if (document.filters[key] === value) {
                if (count === Object.keys(vehicleFilters).length - 1) {
                  return true;
                }
                count++;
              }
            } else {
              return false;
            }
          }
        }
      };

      documents.forEach((document) => {
        console.log("new document");
        if (allFiltersIsInTheDocument(document)) {
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
  SavedSearch.find(filterDetail)
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

// @route   GET /api/savedSearch/:id
// @desc    Get a saved search wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  SavedSearch.findById(id)
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
          id: document.id,
          filters: document.filters,
          vehicleType: document.vehicleType,
          userIds: document.userIds,
          totalSaved: document.totalSaved,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/savedSearch?query
// @desc    Delete saved searches in query
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

    // Delete all the saved searches with id in id list.
    SavedSearch.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the saved searches.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(document.remove());
        });

        // Deleting the saved searches
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the saved searches.",
            });
          });
      });
  }
});

module.exports = router;
