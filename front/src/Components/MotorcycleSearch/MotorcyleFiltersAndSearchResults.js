import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Col,
  Row,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  ListGroup,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import MotorcycleFilters from "./MotorcycleFilters";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import {
  getMotorcycleBodyType,
  getMotorcycleColors,
  getMotorcycleConditions,
  getMotorcycleFeaturesDatabase,
  getMotorcycleFuelTypes,
} from "../../Lists/motorcycleFilters";
import queryString from "query-string";
import axios from "axios";
import { toCapital } from "../../methods";
import Pagination from "react-js-pagination";
import PropagateLoader from "react-spinners/PropagateLoader";
import ccSVG from "../../icons/cylinder.svg";
import districtSVG from "../../icons/location.svg";
import kilometerSVG from "../../icons/speed.svg";
import sortSVG from "../../icons/sort.svg";

const MotorcycleFiltersAndSearchResults = (props) => {
  // Make, model and filters of the searched lisitng
  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [filters, setFilters] = useState({
    mp: "a",
    mk: "a",
  });
  const [loading, setLoading] = useState(true);

  const [filterSetCount, setFilterSetCount] = useState(0);

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);
  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getMotorcycleBodyType(setBodyTypes);
  }, []);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getMotorcycleConditions(setConditions);
  }, []);

  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getMotorcycleFuelTypes(setFuelTypes);
  }, []);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getMotorcycleColors(setColors);
  }, []);

  const [featuresDB, setFeaturesDB] = useState([]);
  useEffect(() => {
    getMotorcycleFeaturesDatabase(setFeaturesDB);
  }, []);

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [listingsPerPage] = useState(15);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const [listingListGroupItems, setListingListGroupItems] = useState([]);
  // Current page listings
  const [currentListings, setCurrentListings] = useState([]);

  // Sort by
  const [sortBy, setSortBy] = useState("Most recent");

  const sortListGroupItems = (listGroupItems, sortBy) => {
    setSortBy(sortBy);
    // Need to create a new array for useEffect to work
    let sortedCarListGroupItems = [...listGroupItems];
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
    if (filterSetCount >= 2) {
      setLoading(true);

      axios
        .post(`/api/motorcycle/get/${toCapital(make)}/${model}`, {
          valid: process.env.REACT_APP_API_KEY,
          filters,
        })
        .then((res) => {
          const listings = res.data.listings;
          setTotalItemsCount(listings.length);
          let listingListGroupItems = [];
          listings.forEach((listing, index) => {
            listingListGroupItems.push({
              id: listing._id,
              date: new Date(listing.date),
              price: listing.details.priceInput,
              year: listing.details.year,
              kilometer: listing.details.kilometerInput,
              listGroupItem: (
                <ListGroupItem
                  className="mb-3 searchResult"
                  tag="a"
                  key={listing._id}
                  href={`/motorcycle/${listing._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    props.history.push(`/motorcycle/${listing._id}`);
                  }}
                  action
                >
                  <Row>
                    <Col
                      sm="3"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img
                        src={
                          listing.details.mainPicture !== ""
                            ? listing.details.mainPicture
                            : listing.details.picturesToBeUploadedMeta[0]
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
                            {listing.details.adTitle.length > 79
                              ? listing.details.adTitle.substring(0, 79) +
                                " ..."
                              : listing.details.adTitle}
                          </ListGroupItemHeading>
                        </Col>
                        <Col xs="4">
                          <ListGroupItemHeading className="float-right heading text-success">
                            Rs {listing.details.priceInput}
                          </ListGroupItemHeading>
                        </Col>
                      </Row>

                      <ListGroupItemText className="mt-3">
                        <Row>
                          <Col>
                            <div>
                              <img alt="" src={kilometerSVG} width="20" />{" "}
                              <span>{listing.details.kilometerInput} km</span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={ccSVG} width="20" />{" "}
                              <span>{listing.details.ccInput} cc</span>
                            </div>
                          </Col>
                          <Col>
                            <div>
                              <img alt="" src={districtSVG} width="20" />{" "}
                              <span>{listing.details.districtSelected}</span>
                            </div>
                          </Col>
                        </Row>
                      </ListGroupItemText>
                    </Col>
                  </Row>
                </ListGroupItem>
              ),
            });
          });
          setListingListGroupItems(
            sortListGroupItems(listingListGroupItems, sortBy)
          );
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setTotalItemsCount(0);
          if (typeof err.response !== "undefined") {
            alert(err.response.data);
            console.log(err);
          }
        });
    }
  }, [make, model, filterSetCount]);

  useEffect(() => {
    if (listingListGroupItems.length >= 1) {
      // Get current posts
      const indexOfLastListing = activePage * listingsPerPage;
      const indexOfFirstListing = indexOfLastListing - listingsPerPage;
      const currentListings = listingListGroupItems.slice(
        indexOfFirstListing,
        indexOfLastListing
      );
      setCurrentListings(currentListings);
    }
  }, [listingListGroupItems, activePage, listingsPerPage]);

  useEffect(() => {
    setFilterSetCount(filterSetCount + 1);
  }, [filters]);

  useEffect(() => {
    setMake(props.make);
    setModel(props.model);
  }, [props.make, props.model]);

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

  const goHome = () => {
    props.history.push("/");
  };

  const ifNotInListGoHome = (list, value) => {
    if (!list.includes(value)) {
      console.log(list);
      console.log(value);
      goHome();
    }
  };

  // Validation of filters
  useEffect(() => {
    // We get the querystring which contains the filters and store it to filters list
    if (
      props.location.search &&
      typeof provinceWithDistricts !== "undefined" &&
      provinceWithDistricts.length &&
      bodyTypes.length &&
      conditions.length &&
      fuelTypes.length &&
      colors.length &&
      featuresDB.length
    ) {
      const parsedQueryStrings = queryString.parse(props.location.search);

      const queryStringValidation = () => {
        for (let key in parsedQueryStrings) {
          switch (key) {
            case "":
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
            case "cr":
              ifNotInListGoHome(colors, parsedQueryStrings[key]);
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
            case "mc":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mnc"] !== "undefined" &&
                parseFloat(!isNaN(parsedQueryStrings["mnc"])) &&
                parseFloat(parsedQueryStrings[key]) <
                  parseFloat(parsedQueryStrings["mnc"])
              ) {
                goHome();
              }
              break;
            case "mnc":
              if (
                parsedQueryStrings[key] !== "a" &&
                parsedQueryStrings[key] !== "" &&
                isNaN(parseFloat(parsedQueryStrings[key]))
              ) {
                goHome();
              }
              if (
                typeof parsedQueryStrings["mnc"] !== "undefined" &&
                parseFloat(isNaN(parsedQueryStrings["mnc"])) &&
                parseFloat(parsedQueryStrings[key]) >
                  parseFloat(parsedQueryStrings["mnc"])
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
                ifNotInListGoHome(featuresDB, parsedQueryStrings[key]);
              }
              if (typeof parsedQueryStrings[key] === "object") {
                const result = parsedQueryStrings[key].every((val) =>
                  featuresDB.includes(val)
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
    featuresDB,
    provinceWithDistricts,
    bodyTypes,
    conditions,
    fuelTypes,
    colors,
  ]);

  return (
    <div>
      <Container className="mt-3">
        <Row>
          <Col md="3">
            <MotorcycleFilters
              make={make}
              model={model}
              filters={filters}
              setFilters={setFilters}
              history={props.history}
              location={props.location}
            />
          </Col>
          <Col md="9" className="mt-4 mt-md-4">
            {loading ? (
              <div className="d-flex justify-content-center">
                <PropagateLoader size={15} color={"#1881d8"} loading={true} />
                <br />
                <br />
              </div>
            ) : listingListGroupItems.length > 0 ? (
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
                          <InputGroupAddon addonType="append">
                            <div className="mr-2 pt-1">
                              <img src={sortSVG} width="18" alt="Sort By" />
                            </div>
                          </InputGroupAddon>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setListingListGroupItems(
                                sortListGroupItems(
                                  listingListGroupItems,
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
                <ListGroup>
                  {currentListings.map((cl) => cl.listGroupItem)}
                </ListGroup>
              </Fragment>
            ) : (
              <span className="heading text-muted">
                We didn't find any motorcycles that match your search filters.
                Adjust your filters to see results.
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

export default MotorcycleFiltersAndSearchResults;
