import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import LocationModal from "../CarSearch/LocationModal";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import { AuthContext } from "../../Contexts/AuthContext";
import queryString from "query-string";
import PropagateLoader from "react-spinners/PropagateLoader";
import { toCapital } from "../../methods";
import axios from "axios";
import districtSVG from "../../icons/location.svg";
import bookmarkRightSVG from "../../icons/bookmarkRight.svg";
import bookmarkPlusSVG from "../../icons/bookmarkPlus.svg";

const MotorcycleInformation = (props) => {
  const { auth } = useContext(AuthContext);

  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [savedSearch, setSavedSearch] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [saving, setSaving] = useState(false);

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);

  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  useEffect(() => {
    setMake(props.make);
    setModel(props.model);
  }, [props.make, props.model]);

  const searchWithLocation = () => {
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);

      const search = (qs) => {
        // Create new qs and push it to history
        if (province === "" || province === null) {
          props.history.push(`${qs}`);
        } else if (district === "" || district === null) {
          props.history.push(`${qs}&&pr=${province}`);
        } else {
          props.history.push(`${qs}&&pr=${province}&&dis=${district}`);
        }
      };

      const modifyQsAndSearch = () => {
        let qs = `${props.location.pathname}${props.location.search}`;

        // Remove from query string the given query
        const removeFromQS = (qs, removeFrom) => {
          let newQS = "";

          // Check if && exist before the query
          if (qs.charAt(removeFrom - 2) === "&") {
            //Create a temp substring of qs starting from remove from (after the &&) ]
            // to know the index of next query

            const temp = qs.substring(removeFrom);
            let removeUpto = null;

            // If the temp includes && then it has many queries in querystring after pr or dis
            if (temp.includes("&&")) {
              // First && in the temp is the character upto which we remove
              // We need to add removeFrom because temp.search provides in respect to temp only
              // We need in respect to qs
              removeUpto = temp.search("&&") + removeFrom;
            } else {
              // If the temp doesnot includes && then it is the last query so we delete everything in temp
              // Here we take length of temp because length of the querystring is the last index
              // last index of qs = temp.length + removeFrom
              removeUpto = temp.length + removeFrom;
            }

            // We remove from the starting from &&
            removeFrom = removeFrom - 2;

            // Remove qs
            newQS = qs.substring(0, removeFrom) + qs.substring(removeUpto);
          } else if (qs.charAt(removeFrom - 1) === "?") {
            // If ? exists before the querystring then this is the firest query in the query string
            // We find the first && since we delete including the &&
            const removeUpto = qs.search("&&");
            // remove
            newQS = qs.substring(0, removeFrom) + qs.substring(removeUpto + 2);
          }
          return newQS;
        };

        // Check and remove province
        qs = removeFromQS(qs, qs.search("pr"));

        if (typeof parsedQueryStrings.dis !== "undefined") {
          // Check and remove district
          qs = removeFromQS(qs, qs.search("dis"));
        }

        search(qs);
      };

      // If province is set but district is not set
      if (
        typeof parsedQueryStrings.pr !== "undefined" &&
        typeof parsedQueryStrings.dis === "undefined"
      ) {
        modifyQsAndSearch();
      }

      // If province is set and district is also set
      if (
        typeof parsedQueryStrings.pr !== "undefined" &&
        typeof parsedQueryStrings.dis !== "undefined"
      ) {
        modifyQsAndSearch();
      }

      // If province and district both are not set
      if (
        typeof parsedQueryStrings.pr === "undefined" &&
        typeof parsedQueryStrings.dis === "undefined"
      ) {
        props.history.push(
          `${props.location.pathname}${props.location.search}&&pr=${province}&&dis=${district}`
        );
        search(`${props.location.pathname}${props.location.search}`);
      }
    }
  };

  const handleSaveSearch = () => {
    if (props.location.search) {
      setSaving(true);

      const parsedQueryStrings = queryString.parse(props.location.search);

      parsedQueryStrings.make = make;
      parsedQueryStrings.model = model;

      axios
        .post("/api/savedSearch/new", {
          filters: parsedQueryStrings,
          vehicleType: "Motorcycle",
          valid: "VaLId289",
        })
        .then((res) => {
          if (res.data.success) {
            setSavedSearch(true);
            setSaving(false);
          }
        })
        .catch((err) => {
          setSavedSearch(false);
          setSaving(false);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    console.log("called");
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      const filters = {};

      for (const filter in parsedQueryStrings) {
        if (filter === "") {
          continue;
        }

        switch (filter) {
          case "bt":
            filters.bodyTypeSelected = parsedQueryStrings[filter];
            break;
          case "c":
            filters.conditionSelected = parsedQueryStrings[filter];
            break;
          case "ft":
            filters.fuelTypeSelected = parsedQueryStrings[filter];
            break;
          case "cr":
            filters.colorSelected = parsedQueryStrings[filter];
            break;
          case "mp":
            if (parsedQueryStrings[filter] === "") {
              filters.maxPrice = "a";
            } else {
              filters.maxPrice = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "mnp":
            if (parsedQueryStrings[filter] === "") {
              filters.minPrice = "a";
            } else {
              filters.minPrice = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "mk":
            if (parsedQueryStrings[filter] === "") {
              filters.maxKilometer = "a";
            } else {
              filters.maxKilometer = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "mnk":
            if (parsedQueryStrings[filter] === "") {
              filters.minKilometer = "a";
            } else {
              filters.minKilometer = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "my":
            if (parsedQueryStrings[filter] === "") {
              filters.maxYear = "a";
            } else {
              filters.maxYear = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "mny":
            if (parsedQueryStrings[filter] === "") {
              filters.minYear = "a";
            } else {
              filters.minYear = parseFloat(parsedQueryStrings[filter]);
            }
            break;
          case "mc":
            if (filters[filter] === "") {
              filters.maxCCInput = "a";
            } else {
              filters.maxCCInput = parseFloat(filters[filter]);
            }
            break;
          case "mnc":
            if (filters[filter] === "") {
              filters.minCCInput = "a";
            } else {
              filters.minCCInput = parseFloat(filters[filter]);
            }
            break;
          case "pr":
            setProvince(parsedQueryStrings[filter]);
            filters.provinceSelected = parsedQueryStrings[filter];
            break;
          case "dis":
            setDistrict(parsedQueryStrings[filter]);
            filters.districtSelected = parsedQueryStrings[filter];
            break;
          case "feature[]":
            if (typeof parsedQueryStrings[filter] === "string") {
              filters[parsedQueryStrings[filter]] = true;
            } else if (typeof parsedQueryStrings[filter] === "object") {
              parsedQueryStrings[filter].forEach((f) => {
                filters[f] = true;
              });
            }
            break;
        }
      }

      filters.make = make;
      filters.model = model;

      axios
        .post("/api/savedSearch/checkSavedSearch", {
          filters,
          vehicleType: "Motorcycle",
          valid: "VaLId289",
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            if (res.data.savedSearch) {
              setSavedSearch(true);
            } else {
              setSavedSearch(false);
            }
          }
        })
        .catch((err) => {
          if (typeof err.response !== "undefined") {
            if (err.response.status === 500) {
              setSavedSearch(false);
              alert(err.response.data.msg);
            }
          } else {
            console.log("Not signed in");
          }
        });
    }
  }, [props.location.search, make, model]);

  return (
    <div>
      <Container className="mt-5">
        {saving ? (
          <div className="d-flex justify-content-center">
            <PropagateLoader size={15} color={"#1881d8"} loading={true} />
            <br />
            <br />
          </div>
        ) : null}
        <h5 className="display-5 heading">
          {make === "Other" || make === "a"
            ? "Motorcycles for sale"
            : model === "Other" || model === "a"
            ? `${toCapital(make)} for sale`
            : `${toCapital(make)} ${toCapital(model)} for sale`}
        </h5>
        <Link className="heading" to={`/motorcycle/info/${make}/${model}`}>
          {make === "Other" || make === "a"
            ? null
            : model === "Other" || model === "a"
            ? null
            : `Full ${toCapital(make)} ${toCapital(model)} overview`}
        </Link>
        <hr className="my-2" />
        <Row>
          <Col md="9">
            <img alt="" src={districtSVG} width="22" className="mb-1" />
            &nbsp;{" "}
            {province === ""
              ? "All in Nepal"
              : district === ""
              ? province
              : district + ", " + province}{" "}
            <LocationModal
              buttonLabel="Set location"
              className=""
              searchWithFilters={searchWithLocation}
              provinceSelected={province}
              districtSelected={district}
              setProvinceSelected={setProvince}
              setDistrictSelected={setDistrict}
              ProvinceDistrict={provinceWithDistricts}
              disabled={saving}
            />
          </Col>
          <Col md="3" className="mt-2 mt-md-0">
            <a
              disabled={!auth.isAuthenticated || saving}
              onClick={(e) => {
                e.preventDefault();
                if (auth.isAuthenticated && !saving && !savedSearch) {
                  handleSaveSearch();
                }
              }}
              style={{ textDecoration: "none", cursor: "pointer" }}
              className={
                savedSearch
                  ? "md-float-right noPointer"
                  : "md-float-right lightenOnHover"
              }
            >
              <img
                alt=""
                src={savedSearch ? bookmarkRightSVG : bookmarkPlusSVG}
                width="28"
                className="mb-1 savedSearchBookmark"
              />
              &nbsp;
              <span className="pb-1 heading" style={{ color: "#1881d8" }}>
                {savedSearch ? "Saved Search" : "Save Search"}
              </span>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MotorcycleInformation;
