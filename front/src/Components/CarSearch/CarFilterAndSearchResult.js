import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import Pagination from "react-js-pagination";
import axios from "axios";
import CarFilters from "./CarFilters";
import queryString from "query-string";
import {
  getCarTransmission,
  getCarBodyType,
  getCarConditions,
  getFuelTypes,
  getDrivetrains,
  getColors,
  getSeats,
  getFeaturesDatabase,
} from "../../Lists/filters";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import PropagateLoader from "react-spinners/PropagateLoader";
import kilometerSVG from "../../icons/speed.svg";
import drivetrainSVG from "../../icons/drivetrain.svg";
import fuelTypeSVG from "../../icons/fuel.svg";
import districtSVG from "../../icons/location.svg";
import sortSVG from "../../icons/sort.svg";

const CarFilterAndSearchResult = (props) => {
  // Make, model and filters of the searched lisitng
  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [filters, setFilters] = useState({
    mp: "a",
    mk: "a",
  });

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);
  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

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

  const [fuelTypes, setFuelTypes] = useState([]);
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

  const [featuresDatabase, setFeaturesDatabase] = useState([]);
  useEffect(() => {
    getFeaturesDatabase(setFeaturesDatabase);
  }, []);

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [listingsPerPage] = useState(15);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const [filterSetCount, setFilterSetCount] = useState(0);

  // Filters take another call to set so we need make sure filter is set
  useEffect(() => {
    setFilterSetCount(filterSetCount + 1);
  }, [filters]);

  // Method to change first letter to capital
  const toCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1);
  };

  // Loading is set to true when axios call is being made
  const [loading, setLoading] = useState(true);

  // List containing all the carListing List
  const [carListGroupItems, setCarListGroupItems] = useState([]);
  const [currentListings, setCurrentListings] = useState([]);

  // Sort by
  const [sortBy, setSortBy] = useState("Most recent");

  // Get the 15 current listing based on the active page number
  useEffect(() => {
    // Get current posts
    const indexOfLastListing = activePage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = carListGroupItems.slice(
      indexOfFirstListing,
      indexOfLastListing
    );
    setCurrentListings(currentListings);
  }, [carListGroupItems, activePage, listingsPerPage]);

  const sortListGroupItems = (carListGroupItems, sortBy) => {
    setSortBy(sortBy);
    // Need to create a new array for useEffect to work
    let sortedCarListGroupItems = [...carListGroupItems];
    let compare = null;
    switch (sortBy) {
      case "Low kilometer":
        compare = (a, b) => {
          if (a.kilometer < b.kilometer) {
            return -1;
          }
          if (a.kilometer > b.kilometer) {
            return 1;
          }
          return 0;
        };
        sortedCarListGroupItems.sort(compare);

        break;
      case "Low price":
        compare = (a, b) => {
          if (a.price < b.price) {
            return -1;
          }
          if (a.price > b.price) {
            return 1;
          }
          return 0;
        };
        sortedCarListGroupItems.sort(compare);

        break;
      case "Most recent":
        compare = (a, b) => {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date < b.date) {
            return 1;
          }
          return 0;
        };
        sortedCarListGroupItems.sort(compare);
        break;
      case "Year: new to old":
        compare = (a, b) => {
          if (a.year > b.year) {
            return -1;
          }
          if (a.year < b.year) {
            return 1;
          }
          return 0;
        };
        sortedCarListGroupItems.sort(compare);
        break;
      case "Year: old to new":
        compare = (a, b) => {
          if (a.year < b.year) {
            return -1;
          }
          if (a.year > b.year) {
            return 1;
          }
          return 0;
        };
        sortedCarListGroupItems.sort(compare);
        break;

      default:
        break;
    }
    return sortedCarListGroupItems;
  };

  useEffect(() => {
    setMake(props.make);
    setModel(props.model);
  }, [props.make, props.model]);

  // Validation of filters
  useEffect(() => {
    // We get the querystring which contains the filters and store it to filters list
    if (
      props.location.search &&
      typeof provinceWithDistricts !== "undefined" &&
      provinceWithDistricts.length &&
      transmissions.length &&
      bodyTypes.length &&
      conditions.length &&
      fuelTypes.length &&
      drivetrains.length &&
      colors.length &&
      seats.length &&
      featuresDatabase.length
    ) {
      const parsedQueryStrings = queryString.parse(props.location.search);

      const queryStringValidation = () => {
        const goHome = () => {
          props.history.push("/");
        };

        const ifNotInListGoHome = (list, value) => {
          if (!list.includes(value)) {
            goHome();
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
              province.province.toLowerCase() ===
                provinceSelected.toLowerCase() ||
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

        for (let key in parsedQueryStrings) {
          switch (key) {
            case "":
              break;
            case "t":
              ifNotInListGoHome(transmissions, parsedQueryStrings[key]);
              break;
            case "bt":
              ifNotInListGoHome(bodyTypes, parsedQueryStrings[key]);
              break;
            case "c":
              ifNotInListGoHome(conditions, parsedQueryStrings[key]);
              break;
            case "ft":
              ifNotInListGoHome(fuelTypes, parsedQueryStrings[key]);
              break;
            case "d":
              ifNotInListGoHome(drivetrains, parsedQueryStrings[key]);
              break;
            case "cr":
              ifNotInListGoHome(colors, parsedQueryStrings[key]);
              break;
            case "s":
              ifNotInListGoHome(seats, parsedQueryStrings[key]);
              break;
            case "tr":
              break;
            case "mp":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mnp"] !== "undefined" &&
                parseFloat(!isNaN(parsedQueryStrings["mnp"])) &&
                parseFloat(parsedQueryStrings[key]) <
                  parseFloat(parsedQueryStrings["mnp"])
              ) {
                goHome();
              }
              break;
            case "mk":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mnk"] !== "undefined" &&
                parseFloat(!isNaN(parsedQueryStrings["mnk"])) &&
                parseFloat(parsedQueryStrings[key]) <
                  parseFloat(parsedQueryStrings["mnk"])
              ) {
                goHome();
              }
              break;
            case "my":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mny"] !== "undefined" &&
                parseFloat(!isNaN(parsedQueryStrings["mny"])) &&
                parseFloat(parsedQueryStrings[key]) <
                  parseFloat(parsedQueryStrings["mny"])
              ) {
                goHome();
              }
              break;
            case "mny":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["my"] !== "undefined" &&
                parseFloat(isNaN(parsedQueryStrings["my"])) &&
                parseFloat(parsedQueryStrings[key]) >
                  parseFloat(parsedQueryStrings["my"])
              ) {
                goHome();
              }
              break;
            case "mnp":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mp"] !== "undefined" &&
                parseFloat(isNaN(parsedQueryStrings["mp"])) &&
                parseFloat(parsedQueryStrings[key]) >
                  parseFloat(parsedQueryStrings["mp"])
              ) {
                goHome();
              }
              break;
            case "mnk":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mk"] !== "undefined" &&
                parseFloat(!isNaN(parsedQueryStrings["mk"])) &&
                parseFloat(parsedQueryStrings[key]) >
                  parseFloat(parsedQueryStrings["mk"])
              ) {
                goHome();
              }
              break;
            case "pr":
              if (
                !provinceSelectedIsWithinTheProvinceList(
                  parsedQueryStrings[key]
                )
              ) {
                goHome();
              }
              break;
            case "dis":
              if (
                typeof parsedQueryStrings["pr"] === "undefined" ||
                !districtSelectedIsWithinTheDistrictList(
                  parsedQueryStrings["pr"],
                  parsedQueryStrings[key]
                )
              ) {
                goHome();
              }
              break;
            case "feature[]":
              if (typeof parsedQueryStrings[key] === "string") {
                ifNotInListGoHome(featuresDatabase, parsedQueryStrings[key]);
              }
              if (typeof parsedQueryStrings[key] === "object") {
                const result = parsedQueryStrings[key].every((val) =>
                  featuresDatabase.includes(val)
                );
                if (!result) {
                  goHome();
                }
              }
              break;
            default:
              goHome();
          }
        }
      };

      queryStringValidation();

      setFilters({
        ...parsedQueryStrings,
      });
    }
  }, [
    props.location.search,
    provinceWithDistricts,
    transmissions,
    bodyTypes,
    conditions,
    fuelTypes,
    drivetrains,
    colors,
    seats,
    featuresDatabase,
  ]);

  // Get the listings from the server, re-retrieve the listing when we change make and model
  useEffect(() => {
    if (filterSetCount >= 2) {
      setLoading(true);
      axios
        .post(`/api/car/get/${toCapital(make)}/${model}`, {
          valid: process.env.REACT_APP_API_KEY,
          filters,
        })
        .then((res) => {
          const listings = res.data.listings;
          console.log(listings);
          setTotalItemsCount(listings.length);

          let carListGroupItems = [];
          listings.forEach((listing) => {
            const carDetails = listing.carDetails;
            carListGroupItems.push({
              id: listing._id,
              date: new Date(listing.date),
              price: carDetails.carPriceInput,
              year: carDetails.carYearInput,
              kilometer: carDetails.carKiloMetersInput,
              listGroupItem: (
                <ListGroupItem
                  tag="a"
                  href={`/car/${listing._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    props.history.push(`/car/${listing._id}`);
                  }}
                  key={listing._id}
                  action
                  className="mb-3 searchResult"
                >
                  <Row>
                    <Col
                      sm="3"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img
                        src={
                          listing.carDetails.mainPicture !== ""
                            ? listing.carDetails.mainPicture
                            : listing.carDetails.picturesToBeUploadedMeta[0]
                                .fileUrl
                        }
                        alt="Main Picture"
                        className="searchImage"
                      />
                    </Col>
                    <Col sm="9" className="mt-lg-0 mt-3">
                      <Row>
                        <Col xs="8">
                          <ListGroupItemHeading className="heading">
                            {carDetails.adTitle.length > 79
                              ? carDetails.adTitle.substring(0, 79) + " ..."
                              : carDetails.adTitle}
                          </ListGroupItemHeading>
                        </Col>
                        <Col xs="4">
                          <ListGroupItemHeading className="float-right heading text-success">
                            Rs {carDetails.carPriceInput}
                          </ListGroupItemHeading>
                        </Col>
                      </Row>

                      <ListGroupItemText className="mt-3">
                        <Row>
                          <Col>
                            <Row>
                              <Col>
                                <div>
                                  <img
                                    alt=""
                                    src={kilometerSVG}
                                    className="pb-1"
                                    width="20"
                                  />{" "}
                                  <span>
                                    {carDetails.carKiloMetersInput} km
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <img
                                    alt=""
                                    src={drivetrainSVG}
                                    className="pb-1"
                                    width="20"
                                  />{" "}
                                  <span>
                                    {carDetails.carDrivetrainSelected}
                                  </span>
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <img
                                    alt=""
                                    src={districtSVG}
                                    className="pb-1"
                                    width="20"
                                  />{" "}
                                  <span>{carDetails.districtSelected}</span>
                                </div>
                                <div className="mt-1">
                                  <img
                                    alt=""
                                    src={fuelTypeSVG}
                                    className="pb-1"
                                    width="20"
                                  />{" "}
                                  <span>{carDetails.carFuelTypeSelected}</span>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </ListGroupItemText>
                    </Col>
                  </Row>
                </ListGroupItem>
              ),
            });
          });
          setLoading(false);
          setCarListGroupItems(sortListGroupItems(carListGroupItems, sortBy));
        })
        .catch((err) => {
          setLoading(false);
          setTotalItemsCount(0);
          console.log(err.response.data);
        });
    }
  }, [make, model, filterSetCount]);

  return (
    <div>
      <Container className="mt-3">
        <Row>
          <Col md="3" className="filter">
            <CarFilters
              make={make}
              model={model}
              filters={filters}
              setFilters={setFilters}
              history={props.history}
              location={props.location}
            />
          </Col>
          <Col md="9" className="mt-3 mt-md-4">
            {loading ? (
              <div className="d-flex justify-content-center">
                <PropagateLoader size={15} color={"#1881d8"} loading={true} />
                <br />
                <br />
              </div>
            ) : carListGroupItems.length > 0 ? (
              <Fragment>
                <Row className="mb-4">
                  <Col md="6">
                    <span className="heading">
                      Total Cars: {totalItemsCount}
                    </span>
                  </Col>
                  <Col md="6" className="mt-md-0 mt-2">
                    <div>
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <div className="mr-2 pt-1">
                              <img src={sortSVG} width="18" alt="Sort By" />
                            </div>
                          </InputGroupAddon>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarListGroupItems(
                                sortListGroupItems(
                                  carListGroupItems,
                                  e.target.value
                                )
                              );
                            }}
                          >
                            <option>Most recent</option>
                            <option>Low kilometer</option>
                            <option>Low price</option>
                            <option>Year: new to old</option>
                            <option>Year: old to new</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Col>
                </Row>
                <ListGroup className="mb-5">
                  {currentListings.map((listings) => listings.listGroupItem)}
                </ListGroup>
              </Fragment>
            ) : (
              <span className="heading text-muted">
                We didn't find any cars that match your search filters. Adjust
                your filters to see results.
              </span>
            )}

            <Pagination
              activePage={activePage}
              itemsCountPerPage={listingsPerPage}
              totalItemsCount={totalItemsCount}
              pageRangeDisplayed={5}
              itemClass="page-item mb-5"
              linkClass="page-link"
              onChange={handlePageChange}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CarFilterAndSearchResult;
