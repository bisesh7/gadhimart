import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import MotorcycleSearchSelect from "../HomeComponents/MotorcycleSearchSelect";
import MinMaxFilterModal from "../CarSearch/MinMaxFilterModal";
import {
  getMotorcycleBodyType,
  getMotorcycleConditions,
  getMotorcycleColors,
  getMotorcycleFuelTypes,
  getMotorcycleFeaturesFrontEnd,
} from "../../Lists/motorcycleFilters";
import OptionsFilterModal from "../CarSearch/OptionsFilterModal";
import FeaturesFilterModal from "../CarSearch/FeaturesFilterModal";

const MotorcycleFilters = (props) => {
  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [searchFilters, setSearchFilters] = useState({ ...props.filters });
  const [features, setFeatures] = useState({
    hasElectricStart: false,
    hasAlloyWheels: false,
    hasTubelessTyres: false,
    hasDigitalDisplayPanel: false,
    hasProjectedHeadLight: false,
    hasLedTailLight: false,
    hasFrontDiscBrake: false,
    hasRearDiscBrake: false,
    hasAbs: false,
    hasMonoSuspension: false,
    hasSplitSeat: false,
    hasTripMeter: false,
  });

  // Motorcycle details lists
  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getMotorcycleBodyType(setBodyTypes);
  }, []);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getMotorcycleConditions(setConditions);
  }, []);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getMotorcycleColors(setColors);
  }, []);

  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getMotorcycleFuelTypes(setFuelTypes);
  }, []);

  const [motorcycleFeatures, setMotorcycleFeatures] = useState([]);
  useEffect(() => {
    getMotorcycleFeaturesFrontEnd(setMotorcycleFeatures);
  }, []);

  const toggleFeature = (feature, value) => {
    switch (feature) {
      case "Electric start":
        setFeatures({ ...features, hasElectricStart: value });
        break;
      case "Alloy wheels":
        setFeatures({ ...features, hasAlloyWheels: value });
        break;
      case "Tubeless tyres":
        setFeatures({ ...features, hasTubelessTyres: value });
        break;
      case "Digital display panel":
        setFeatures({ ...features, hasDigitalDisplayPanel: value });
        break;
      case "Projected headlight":
        setFeatures({ ...features, hasProjectedHeadLight: value });
        break;
      case "Led tail light":
        setFeatures({ ...features, hasLedTailLight: value });
        break;
      case "Front disc brake":
        setFeatures({ ...features, hasFrontDiscBrake: value });
        break;
      case "Rear disc brake":
        setFeatures({ ...features, hasRearDiscBrake: value });
        break;
      case "Anti-lock braking system (ABS)":
        setFeatures({ ...features, hasAbs: value });
        break;
      case "Mono suspension":
        setFeatures({ ...features, hasMonoSuspension: value });
        break;
      case "Split seat":
        setFeatures({ ...features, hasSplitSeat: value });
        break;
      case "Tripmeter":
        setFeatures({ ...features, hasTripMeter: value });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setMake(props.make);
    setModel(props.model);
    setSearchFilters(props.filters);
  }, [props.make, props.model, props.filters]);

  useEffect(() => {
    let featuresFilter = {
      hasElectricStart: false,
      hasAlloyWheels: false,
      hasTubelessTyres: false,
      hasDigitalDisplayPanel: false,
      hasProjectedHeadLight: false,
      hasLedTailLight: false,
      hasFrontDiscBrake: false,
      hasRearDiscBrake: false,
      hasAbs: false,
      hasMonoSuspension: false,
      hasSplitSeat: false,
      hasTripMeter: false,
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
  const replaceAWith0 = (filter) => {
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

  const getFeaturesList = () => {
    const featuresListDB = getFeaturesListDB();
    let featuresList = [];
    featuresListDB.forEach((featureDB) => {
      switch (featureDB) {
        case "hasElectricStart":
          featuresList.push("Electric start");
          break;
        case "hasAlloyWheels":
          featuresList.push("Alloy wheels");
          break;
        case "hasTubelessTyres":
          featuresList.push("Tubeless tyres");
          break;
        case "hasDigitalDisplayPanel":
          featuresList.push("Digital display panel");
          break;
        case "hasProjectedHeadLight":
          featuresList.push("Projected headlight");
          break;
        case "hasLedTailLight":
          featuresList.push("Led tail light");
          break;
        case "hasFrontDiscBrake":
          featuresList.push("Front disc brake");
          break;
        case "hasRearDiscBrake":
          featuresList.push("Rear disc brake");
          break;
        case "hasAbs":
          featuresList.push("Anti-lock braking system (ABS)");
          break;
        case "hasMonoSuspension":
          featuresList.push("Mono suspension");
          break;
        case "hasSplitSeat":
          featuresList.push("Split seat");
          break;
        case "hasTripMeter":
          featuresList.push("Tripmeter");
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
    let qs = "?";
    for (let key in searchFilters) {
      // when using the querystrings library there will be key "" which we need to discard
      if (
        key === "" ||
        searchFilters[key] === "any" ||
        searchFilters[key] === false ||
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

  const searchWithFilters = (filter) => {
    let qs = createQueryString();

    if (filter === "Features") {
      if (qs.includes("feature[]")) {
        // Remove already existing features first
        let removeFrom = qs.search("feature");
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
    props.history.push(`/motorcycle/${make}/${model}${qs}`);
  };

  const setOptionsFilter = (filter, value) => {
    switch (filter) {
      case "Body type":
        setSearchFilters({ ...searchFilters, bt: value });
        break;
      case "Condition":
        setSearchFilters({ ...searchFilters, c: value });
        break;
      case "Fuel type":
        setSearchFilters({ ...searchFilters, ft: value });
        break;
      case "Color":
        setSearchFilters({ ...searchFilters, cr: value });
        break;
    }
  };

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
      case "CC":
        setSearchFilters({ ...searchFilters, mc: maxValue, mnc: minValue });
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
      <MotorcycleSearchSelect
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
        min={"mnp" in searchFilters ? replaceAWith0(searchFilters.mnp) : null}
        max={"mp" in searchFilters ? replaceAWith0(searchFilters.mp) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* Kilometers Modal */}
      <MinMaxFilterModal
        buttonLabel="Kilometers"
        min={"mnk" in searchFilters ? searchFilters.mnk : null}
        max={"mk" in searchFilters ? replaceAWith0(searchFilters.mk) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* Year Modal */}
      <MinMaxFilterModal
        buttonLabel="Year"
        min={"mny" in searchFilters ? replaceAWith0(searchFilters.mny) : null}
        max={"my" in searchFilters ? replaceAWith0(searchFilters.my) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
      />
      {/* cc Modal */}
      <MinMaxFilterModal
        buttonLabel="CC"
        min={"mnc" in searchFilters ? replaceAWith0(searchFilters.mnc) : null}
        max={"mc" in searchFilters ? replaceAWith0(searchFilters.mc) : null}
        searchWithFilters={searchWithFilters}
        className="mt-2"
        setFilter={setMinMaxFilter}
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
        options={[...fuelTypes]}
        setFilter={setOptionsFilter}
        selected={
          typeof searchFilters["ft"] !== "undefined"
            ? searchFilters["ft"]
            : null
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
      {/* Features */}
      <FeaturesFilterModal
        buttonLabel="Features"
        searchWithFilters={searchWithFilters}
        className="mt-2"
        options={[...motorcycleFeatures]}
        toggleFeature={toggleFeature}
        getFeaturesList={getFeaturesList}
      />
    </div>
  );
};

export default MotorcycleFilters;
