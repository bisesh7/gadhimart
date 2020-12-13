import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import MinMaxFilterModal from "./MinMaxFilterModal";
import OptionsFilterModal from "./OptionsFilterModal";
import FeaturesFilterModal from "./FeaturesFilterModal";
import CarTrimFilterModal from "./CarTrimFilterModal";
import CarSearchSelect from "../HomeComponents/CarSearchSelect";
import {
  getCarTransmission,
  getCarBodyType,
  getCarConditions,
  getFuelTypes,
  getDrivetrains,
  getColors,
  getSeats,
  getFeaturesFrontEnd,
} from "../../Lists/filters";
const CarFilters = (props) => {
  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [searchFilters, setSearchFilters] = useState({ ...props.filters });
  const [features, setFeatures] = useState({
    carHasSunRoof: false,
    carHasAlloyWheels: false,
    carHasNavigationSystem: false,
    carHasBluetooth: false,
    carHasPushStart: false,
    carHasParkingAssistant: false,
    carHasCruiseControl: false,
    carHasAirConditioning: false,
    carHasPowerSteering: false,
    carHasPowerWindow: false,
    carHasKeylessEntry: false,
    carHasAbs: false,
    carHasCarplay: false,
    carHasAndroidAuto: false,
  });
  // Car Details Lists
  const [transmissions, setTransmssions] = useState([]);
  useEffect(() => {
    getCarTransmission(setTransmssions);
  }, []);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getCarBodyType(setBodyTypes);
  }, []);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getCarConditions(setConditions);
  }, []);

  const [fuellTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getFuelTypes(setFuelTypes);
  }, []);

  const [drivetrains, setDrivetrains] = useState([]);
  useEffect(() => {
    getDrivetrains(setDrivetrains);
  }, []);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getColors(setColors);
  }, []);

  const [seats, setSeats] = useState([]);
  useEffect(() => {
    getSeats(setSeats);
  }, []);

  const [featuresFrontEnd, setFeaturesFrontEnd] = useState([]);
  useEffect(() => {
    getFeaturesFrontEnd(setFeaturesFrontEnd);
  }, []);

  // Method to set the features object
  const toggleFeature = (feature, value) => {
    switch (feature) {
      case "Sunroof":
        setFeatures({ ...features, carHasSunRoof: value });
        break;
      case "Alloy wheels":
        setFeatures({ ...features, carHasAlloyWheels: value });
        break;
      case "Navigation system":
        setFeatures({ ...features, carHasNavigationSystem: value });
        break;
      case "Bluetooth":
        setFeatures({ ...features, carHasBluetooth: value });
        break;
      case "Push start button":
        setFeatures({ ...features, carHasPushStart: value });
        break;
      case "Parking assistant":
        setFeatures({ ...features, carHasParkingAssistant: value });
        break;
      case "Cruise control":
        setFeatures({ ...features, carHasCruiseControl: value });
        break;
      case "Air conditioning":
        setFeatures({ ...features, carHasAirConditioning: value });
        break;
      case "Power steering":
        setFeatures({ ...features, carHasPowerSteering: value });
        break;
      case "Power window":
        setFeatures({ ...features, carHasPowerWindow: value });
        break;
      case "Key-less remote entry":
        setFeatures({ ...features, carHasKeylessEntry: value });
        break;
      case "Anti-lock braking system (ABS)":
        setFeatures({ ...features, carHasAbs: value });
        break;
      case "Apple Carplay":
        setFeatures({ ...features, carHasCarplay: value });
        break;
      case "Android Auto":
        setFeatures({ ...features, carHasAndroidAuto: value });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // set the make, model and search filters
    setMake(props.make);
    setModel(props.model);
    setSearchFilters({ ...props.filters });
  }, [props.make, props.model, props.filters]);

  // Whenever searchFilter is updated, we need to update the features list.
  // As this will make the feature selected, when page restarted
  useEffect(() => {
    let featuresFilter = {
      carHasSunRoof: false,
      carHasAlloyWheels: false,
      carHasNavigationSystem: false,
      carHasBluetooth: false,
      carHasPushStart: false,
      carHasParkingAssistant: false,
      carHasCruiseControl: false,
      carHasAirConditioning: false,
      carHasPowerSteering: false,
      carHasPowerWindow: false,
      carHasKeylessEntry: false,
      carHasAbs: false,
      carHasCarplay: false,
      carHasAndroidAuto: false,
    };

    // Since feature can be array as well as a string
    try {
      searchFilters["feature[]"].forEach((feature) => {
        featuresFilter[feature] = true;
        setFeatures(featuresFilter);
      });
    } catch (err) {
      if (typeof searchFilters["feature[]"] !== "undefined") {
        const feature = searchFilters["feature[]"];
        featuresFilter[feature] = true;
        setFeatures(featuresFilter);
      }
    }
  }, [searchFilters]);

  // If the filter value is "a" we send 0 to the modal
  const getFilterValue = (filter) => {
    return filter !== "a" ? filter : 0;
  };

  // Creates and returns a list of features that has been selected in the filter
  // (Strings is based on the strings used in db)
  const getFeaturesListDB = () => {
    let featuresList = [];
    for (let feature in features) {
      if (features[feature] === true) {
        featuresList.push(feature);
      }
    }
    return featuresList;
  };

  // Create and returns a list of features
  // (Strings based in the modal)
  const getFeaturesList = () => {
    const featuresListDB = getFeaturesListDB();
    let featuresList = [];
    featuresListDB.forEach((featureDB) => {
      switch (featureDB) {
        case "carHasSunRoof":
          featuresList.push("Sunroof");
          break;
        case "carHasAlloyWheels":
          featuresList.push("Alloy wheels");
          break;
        case "carHasNavigationSystem":
          featuresList.push("Navigation system");
          break;
        case "carHasBluetooth":
          featuresList.push("Bluetooth");
          break;
        case "carHasPushStart":
          featuresList.push("Push start button");
          break;
        case "carHasParkingAssistant":
          featuresList.push("Parking assistant");
          break;
        case "carHasCruiseControl":
          featuresList.push("Cruise control");
          break;
        case "carHasAirConditioning":
          featuresList.push("Air conditioning");
          break;
        case "carHasPowerSteering":
          featuresList.push("Power steering");
          break;
        case "carHasPowerWindow":
          featuresList.push("Power window");
          break;
        case "carHasKeylessEntry":
          featuresList.push("Key-less remote entry");
          break;
        case "carHasAbs":
          featuresList.push("Anti-lock braking system (ABS)");
          break;
        case "carHasCarplay":
          featuresList.push("Apple Carplay");
          break;
        case "carHasAndroidAuto":
          featuresList.push("Android Auto");
          break;
      }
    });
    return featuresList;
  };

  const getFeaturesQueryString = (key, arr) => {
    arr = arr.map(encodeURIComponent);
    return key + "[]=" + arr.join("&" + key + "[]=");
  };

  // Create query string including given features
  const createQueryString = () => {
    console.log(searchFilters);
    let qs = "?";
    for (let key in searchFilters) {
      console.log(key);
      // when using the querystrings library there will be key "" which we need to discard
      if (
        key === "" ||
        searchFilters[key] === "any" ||
        searchFilters[key] === false ||
        (key === "tr" && searchFilters[key] === "") ||
        (key !== "mk" &&
          key !== "mp" &&
          (searchFilters[key] === "" || searchFilters[key] === "a"))
      ) {
        continue;
      } else if (key === "feature[]") {
        // console.log(getFeaturesQueryString("feature", searchFilters[key]));
        qs += `${
          getFeaturesListDB().length < 1
            ? ""
            : getFeaturesQueryString("feature", getFeaturesListDB())
        }&&`;
      } else {
        // Add all the filters to the query string, if filter is equal to "a" we use empty string
        qs =
          qs +
          `${key}=${searchFilters[key] === "a" ? "" : searchFilters[key]}&&`;
      }
    }
    return qs;
  };

  // we create a querystrings containg all the filters and use those to search in the database
  const searchWithFilters = (filter) => {
    let qs = createQueryString();

    if (filter === "Features") {
      if (qs.includes("feature[]")) {
        // Remove already existing features first
        const removeFrom = qs.search("feature");
        const removeFromString = qs.substring(removeFrom);

        let removeUpto = null;

        if (removeFromString.includes("&&")) {
          const positionOfAndAnd = removeFromString.search("&&");
          removeUpto = removeFrom + positionOfAndAnd;
          qs = qs.substring(0, removeFrom) + qs.substring(removeUpto + 2);
        } else {
          qs = qs.substring(0, removeFrom);
        }
      }

      if (getFeaturesListDB().length !== 0) {
        qs += getFeaturesQueryString("feature", getFeaturesListDB());
      } else {
        qs = qs.substring(0, qs.length - 2);
      }

      // There is no unwanted && in getFeaturesQueryString so we dont need to discard it
    } else {
      // We dont need the && in the last so discard it.
      qs = qs.substring(0, qs.length - 2);
    }

    console.log(qs);
    // We push the querystring to the history and search
    props.history.push(`/cars/${make}/${model}${qs}`);
  };

  // Method to set the filter. This is options filter setter
  const setOptionsFilter = (filter, value) => {
    switch (filter) {
      case "Transmission":
        setSearchFilters({ ...searchFilters, t: value });
        break;
      case "Body type":
        setSearchFilters({ ...searchFilters, bt: value });
        break;
      case "Condition":
        setSearchFilters({ ...searchFilters, c: value });
        break;
      case "Fuel type":
        setSearchFilters({ ...searchFilters, ft: value });
        break;
      case "Drivetrain":
        setSearchFilters({ ...searchFilters, d: value });
        break;
      case "Color":
        setSearchFilters({ ...searchFilters, cr: value });
        break;
      case "Seat":
        setSearchFilters({ ...searchFilters, s: value });
        break;
      case "Trim":
        setSearchFilters({
          ...searchFilters,
          tr: value,
        });
        break;
    }
  };

  // Method to set the filter. This is min max filter setter
  const setMinMaxFilter = (filter, minValue, maxValue) => {
    if (minValue === null || minValue === 0) {
      minValue = "a";
    }
    if (maxValue === null || maxValue === 0) {
      maxValue = "a";
    }

    switch (filter) {
      case "Price":
        setSearchFilters({ ...searchFilters, mp: maxValue, mnp: minValue });
        break;
      case "Kilometers":
        setSearchFilters({ ...searchFilters, mk: maxValue, mnk: minValue });
        break;
      case "Year":
        setSearchFilters({ ...searchFilters, my: maxValue, mny: minValue });
        break;
    }
  };

  return (
    <div className="mb-5 sticky-top">
      <div className="mb-3"></div> <br />
      <Row className="mb-2">
        <Col xs="6">
          <span className="heading">Filters</span>
        </Col>
        <Col xs="6">
          <a
            onClick={(e) => {
              e.preventDefault();
              props.history.push(props.location.pathname + "?mp=&&mk=");
            }}
            style={{ textDecoration: "none" }}
            href="/reset"
          >
            <span className="heading float-right">Reset</span>
          </a>
        </Col>
      </Row>
      <CarSearchSelect
        selectedOption={{
          label: `${make} ${model}`,
          value: model,
          make: make,
          model: model,
        }}
        c={"filter-select"}
        history={props.history}
      />
      {/* Since this is the min max modal we will send the min, max value and other dependent methods */}
      {/* Price Modal */}
      <MinMaxFilterModal
        buttonLabel="Price"
        min={"mnp" in searchFilters ? getFilterValue(searchFilters.mnp) : null}
        max={"mp" in searchFilters ? getFilterValue(searchFilters.mp) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* Kilometers Modal */}
      <MinMaxFilterModal
        buttonLabel="Kilometers"
        min={"mnk" in searchFilters ? searchFilters.mnk : null}
        max={"mk" in searchFilters ? getFilterValue(searchFilters.mk) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* Year Modal */}
      <MinMaxFilterModal
        buttonLabel="Year"
        min={"mny" in searchFilters ? getFilterValue(searchFilters.mny) : null}
        max={"my" in searchFilters ? getFilterValue(searchFilters.my) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* Transmission Modal */}
      <OptionsFilterModal
        buttonLabel="Transmission"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...transmissions]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["t"] !== "undefined" ? searchFilters["t"] : null
        }
      />
      {/* Body Type Modal */}
      <OptionsFilterModal
        buttonLabel="Body type"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...bodyTypes]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["bt"] !== "undefined"
            ? searchFilters["bt"]
            : null
        }
      />
      {/* Condition */}
      <OptionsFilterModal
        buttonLabel="Condition"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...conditions]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["c"] !== "undefined" ? searchFilters["c"] : null
        }
      />
      {/* Fuel Type */}
      <OptionsFilterModal
        buttonLabel="Fuel type"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...fuellTypes]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["ft"] !== "undefined"
            ? searchFilters["ft"]
            : null
        }
      />
      {/* Drivetrain */}
      <OptionsFilterModal
        buttonLabel="Drivetrain"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...drivetrains]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["d"] !== "undefined" ? searchFilters["d"] : null
        }
      />
      {/* Color */}
      <OptionsFilterModal
        buttonLabel="Color"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...colors]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["cr"] !== "undefined"
            ? searchFilters["cr"]
            : null
        }
      />
      {/* Seat */}
      <OptionsFilterModal
        buttonLabel="Seat"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...seats]}
        selected={
          typeof searchFilters["s"] !== "undefined" ? searchFilters["s"] : null
        }
        setFilter={setOptionsFilter}
      />
      {/* Features */}
      <FeaturesFilterModal
        buttonLabel="Features"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...featuresFrontEnd]}
        toggleFeature={toggleFeature}
        getFeaturesList={getFeaturesList}
      />
      {/* Car Trim */}
      <CarTrimFilterModal
        buttonLabel="Trim"
        className="mt-2"
        searchWithFilters={searchWithFilters}
        trimSelected={
          typeof searchFilters["tr"] !== "undefined"
            ? searchFilters["tr"]
            : null
        }
        disabled={
          make === "a"
            ? true
            : model.toLowerCase() === "a" || model.toLowerCase() === "other"
            ? true
            : false
        }
        setFilter={setOptionsFilter}
      />
    </div>
  );
};

export default CarFilters;
