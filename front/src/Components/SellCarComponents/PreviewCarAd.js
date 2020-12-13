import React, { Fragment, useState, useEffect, useContext } from "react";
import AuthNavbar from "../AuthNavbar";
import ImageGallery from "react-image-gallery";
import {
  Container,
  Col,
  Row,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import queryString from "query-string";
import socketIOClient from "socket.io-client";
import { SocketContext } from "../../Contexts/SocketContext";
import { AuthContext } from "../../Contexts/AuthContext";
import conditionSVG from "../../icons/car-repair.svg";
import kilometersSVG from "../..//icons/speed.svg";
import transmissionSVG from "../../icons/transmission.svg";
import trimSVG from "../../icons/transport.svg";
import drivetrainSVG from "../../icons/drivetrain.svg";
import fueltypeSVG from "../../icons/fuel.svg";

const host = window.location.hostname;
const ENDPOINT = "http://" + host + ":5000";
let socket;

const PreviewCarAd = (props) => {
  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // If user is not logged in redirect to home
  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  const { socketDetail } = useContext(SocketContext);

  useEffect(() => {
    socket = socketDetail.socket;

    // When client restarts the page, socketcontext get defaulted
    // So reassigning socket here.
    if (socket === null) {
      socket = socketIOClient(ENDPOINT);
    }

    // Turn off socket after unmounting the component
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socketDetail]);

  const [images, setImages] = useState([]);
  const [carDetails] = useState(
    JSON.parse(sessionStorage.getItem("previewCarDetails"))
  );
  const [carFeatures, setCarFeatures] = useState([]);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");

  // Car features tabs
  const [activeTab, setActiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [description, setDescription] = useState(
    typeof carDetails !== "undefined" && carDetails !== null
      ? carDetails.adDescription.slice(0, 600)
      : null
  );

  const [posted, setPosted] = useState(false);
  const [listingID, setListingID] = useState(null);

  useEffect(() => {
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      if (
        parsedQueryStrings.posted &&
        parsedQueryStrings.lid &&
        parsedQueryStrings.posted !== "1"
      ) {
        props.history.push("/");
      }
      if (parsedQueryStrings.posted && parsedQueryStrings.lid) {
        setPosted(true);
        setListingID(parsedQueryStrings.lid);
      }
    }
  }, [props.location.search]);

  useEffect(() => {
    if (typeof carDetails !== "undefined" && carDetails !== null) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = carDetails.youtubeLinkInput.match(regExp);

      if (match) {
        setYoutubeEmbedUrl(
          "https://www.youtube.com/embed/" + match[2] + "?autoplay=0"
        );
      }

      let picturesMeta = [];

      carDetails.picturesToBeUploadedMeta.forEach((meta) => {
        picturesMeta.push(meta);

        let newImages = [];
        picturesMeta.forEach((meta) => {
          newImages.push({
            original: meta.fileUrl,
            thumbnail: meta.fileUrl,
          });
          console.log(meta.fileUrl);
        });
        setImages(newImages);
      });
      {
        let carFeatures = [];
        if (carDetails.carHasSunRoof) {
          carFeatures.push("Sun roof");
        }
        if (carDetails.carHasAlloyWheels) {
          carFeatures.push("Alloy wheels");
        }
        if (carDetails.carHasNavigationSystem) {
          carFeatures.push("Navigation system");
        }
        if (carDetails.carHasBluetooth) {
          carFeatures.push("Bluetooth");
        }
        if (carDetails.carHasPushStart) {
          carFeatures.push("Push start");
        }
        if (carDetails.carHasParkingAssistant) {
          carFeatures.push("Parking assistant");
        }
        if (carDetails.carHasCruiseControl) {
          carFeatures.push("Cruise control");
        }
        if (carDetails.carHasAirConditioning) {
          carFeatures.push("Air conditioning");
        }
        if (carDetails.carHasPowerSteering) {
          carFeatures.push("Power steering");
        }
        if (carDetails.carHasPowerWindow) {
          carFeatures.push("Power window");
        }
        if (carDetails.carHasKeylessEntry) {
          carFeatures.push("Keyless remote entry");
        }
        if (carDetails.carHasAbs) {
          carFeatures.push("Anti-lock braking system (ABS)");
        }
        if (carDetails.carHasCarplay) {
          carFeatures.push("Apple carplay");
        }
        if (carDetails.carHasAndroidAuto) {
          carFeatures.push("Android auto");
        }
        console.log(carDetails.carHasAndroidAuto);

        setCarFeatures(carFeatures);
      }
    } else {
      props.history.push("/");
    }
  }, [carDetails]);

  let featuresList = carFeatures.map((carFeature) => {
    return <li className="heading text-muted">{carFeature}</li>;
  });

  const charAt0ToUpperCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    if (windowWidth > 992) {
      setWindowSize("large");
    } else if (windowWidth < 992 && windowWidth >= 768) {
      setWindowSize("medium");
    } else if (windowWidth < 768 && windowWidth >= 600) {
      setWindowSize("small");
    } else if (windowWidth < 600) {
      setWindowSize("extraSmall");
    }
  }, [windowWidth]);

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const getAnchors = (features, windowSize) => {
    const totalAnchors = features.length;

    let numberOfCols = null;
    switch (windowSize) {
      case "large":
      case "medium":
      case "small":
        numberOfCols = 3;
        break;
      case "extraSmall":
        numberOfCols = 2;
        break;
      default:
        numberOfCols = 3;
    }

    const numberOfRows = Math.ceil(totalAnchors / numberOfCols);

    let anchorRowsAndCols = [];

    // For each columns we need a 4 rows
    for (var x = 0; x < numberOfRows; x++) {
      let cols = [];
      // for each row we need a different index of features
      for (var y = x * numberOfCols; y < x * numberOfCols + numberOfCols; y++) {
        if (typeof features[y] === "undefined") {
          break;
        }

        cols.push(
          <Col xs="6" sm="4">
            {features[y]}
          </Col>
        );
      }
      anchorRowsAndCols.push(<Row className="mt-2">{cols}</Row>);
    }

    return anchorRowsAndCols;
  };

  const [featuresAreaItems] = useState([
    <Row>
      <Col xs="1">
        <img alt="" src={conditionSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          &nbsp; {charAt0ToUpperCase(carDetails.carConditionSelected)}
          <br />
          <small className="text-muted">Condition</small>
        </div>
      </Col>
    </Row>,
    <Row>
      <Col xs="1">
        <img alt="" src={kilometersSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          &nbsp;
          {carDetails.carKiloMetersInput} <br />
          <small className="text-muted">Kilometers</small>
        </div>
      </Col>
    </Row>,
    <Row>
      <Col xs="1">
        <img alt="" src={transmissionSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          {charAt0ToUpperCase(carDetails.carTransmissionSelected)} <br />
          <small className="text-muted">Transmission</small>
        </div>
      </Col>
    </Row>,
    <Row>
      <Col xs="1">
        <img alt="" src={trimSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          &nbsp;
          {charAt0ToUpperCase(carDetails.carTrimInput)}
          <br />
          <small className="text-muted">Trim</small>
        </div>
      </Col>
    </Row>,
    <Row>
      <Col xs="1">
        <img alt="" src={drivetrainSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          &nbsp;
          {charAt0ToUpperCase(carDetails.carDrivetrainSelected)} <br />
          <small className="text-muted">Drivetrain</small>
        </div>
      </Col>
    </Row>,
    <Row>
      <Col xs="1">
        <img alt="" src={fueltypeSVG} className="pt-1" width="24" />
      </Col>
      <Col>
        <div className="float-left">
          &nbsp;
          {charAt0ToUpperCase(carDetails.carFuelTypeSelected)} <br />
          <small className="text-muted">Fuel type</small>
        </div>
      </Col>
    </Row>,
  ]);

  const [featuresArea, setFeaturesArea] = useState(null);

  useEffect(() => {
    if (featuresAreaItems !== null) {
      setFeaturesArea(getAnchors(featuresAreaItems, windowSize));
    }
  }, [windowSize]);

  const [posting, setPosting] = useState(false);

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="my-5">
            <ImageGallery items={images} showBullets={true} />

            <div className="text-center mt-4">
              <h3 className="heading">{carDetails.adTitle}</h3>

              <h3 className="heading" style={{ color: "green" }}>
                {carDetails.priceType === "notFree"
                  ? "Rs " + carDetails.carPriceInput
                  : carDetails.priceType.charAt(0).toUpperCase() +
                    carDetails.priceType.slice(1)}
              </h3>
            </div>

            <div className="mt-4">
              <h5 className="heading">Send seller a message</h5>

              <div className="my-4 preview">
                <Row>
                  <Col md="10">
                    <Input
                      type="text"
                      defaultValue="Is this still available?"
                    />
                  </Col>

                  <Col md="2" className="mt-3 mt-md-0">
                    <Button color="primary">Send message</Button>
                  </Col>
                </Row>
              </div>

              <small className="text-muted mt-4">
                By sending the message you agree to our Terms of use ans Privacy
                policy
              </small>
            </div>

            <div className="my-4 preview">{featuresArea}</div>

            <div className="mt-4">
              <h5 className="heading pb-2">Description</h5>

              <p className="preview heading">
                <div className="text-muted">{description}</div> <br />
                <a
                  href="notAHref"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      description === carDetails.adDescription.slice(0, 600)
                    ) {
                      setDescription(carDetails.adDescription);
                    } else {
                      setDescription(carDetails.adDescription.slice(0, 600));
                    }
                  }}
                >
                  {description === carDetails.adDescription.slice(0, 600)
                    ? "Read more"
                    : "Show less"}
                </a>
              </p>
            </div>

            <div className="mt-4">
              <h5 className="heading pb-2">Car features</h5>
              <div className="preview">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggle("1");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <b>Overview</b>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <b>Equiptment</b>
                    </NavLink>
                  </NavItem>
                  {carDetails.youtubeLinkInput !== "" ? (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          toggle("3");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <b>Youtube</b>
                      </NavLink>
                    </NavItem>
                  ) : null}
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row className="mt-2 pl-3">
                      <Col sm="6">
                        <span className="text-muted heading">
                          Make: {charAt0ToUpperCase(carDetails.carMakeSelected)}{" "}
                          <br />
                          Model:{" "}
                          {charAt0ToUpperCase(carDetails.carModelSelected)}{" "}
                          <br />
                          Year: {carDetails.carYearInput}
                        </span>
                      </Col>
                      <Col sm="6">
                        <span className="text-muted heading">
                          Body Type:{" "}
                          {charAt0ToUpperCase(carDetails.carBodyTypeSelected)}{" "}
                          <br />
                          Color:{" "}
                          {charAt0ToUpperCase(carDetails.carColorSelected)}{" "}
                          <br />
                          Seats:{" "}
                          {charAt0ToUpperCase(carDetails.carSeatsSelected)}
                        </span>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row className="mt-2">
                      <Col sm="6">
                        <ul>{featuresList.slice(0, 7)}</ul>
                      </Col>
                      <Col sm="6">
                        <ul>{featuresList.slice(7, 14)}</ul>
                      </Col>
                    </Row>
                  </TabPane>
                  {carDetails.youtubeLinkInput !== "" ? (
                    <TabPane tabId="3">
                      <iframe
                        width="560"
                        height="315"
                        src={youtubeEmbedUrl}
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </TabPane>
                  ) : null}
                </TabContent>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="heading">Location</h5>
              <div className="preview">
                <span className="text-muted heading">
                  Province: {charAt0ToUpperCase(carDetails.provinceSelected)}{" "}
                  <br />
                  District: {charAt0ToUpperCase(
                    carDetails.districtSelected
                  )}{" "}
                  <br />
                  Street Address:{" "}
                  {charAt0ToUpperCase(carDetails.streetAddressInput)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <Row>
                <Col xs="6">
                  <Button
                    color="primary"
                    onClick={() => {
                      posted
                        ? props.history.push(
                            "/sell/car?continueEditing=2&&id=" + listingID
                          )
                        : props.history.push("/sell/car?continueEditing=1");
                    }}
                    type="button"
                  >
                    &larr; &nbsp;Continue
                  </Button>
                </Col>
                <Col xs="6">
                  <div className="d-flex justify-content-end">
                    {posting ? (
                      <div className="mr-3">
                        <Spinner type="grow" color="primary" />
                      </div>
                    ) : null}
                    <Button
                      color="success"
                      onClick={() => {
                        {
                          setPosting(true);
                          if (posted) {
                            axios({
                              method: "post",
                              url: "/api/car/update",
                              data: {
                                carDetails,
                                valid: "VaLiD123",
                                editNumber: "2",
                                databaseID: listingID,
                              },
                            })
                              .then((res) => {
                                setPosting(false);
                                clearCarDetailsInSessionStorage();
                                props.history.push("/profile/listings/car");
                              })
                              .catch((err) => {
                                if (err) {
                                  setPosting(false);
                                  props.history.push(
                                    "/sell/car?continueEditing=2&&id=" +
                                      listingID
                                  );
                                }
                              });
                          } else {
                            axios({
                              method: "post",
                              url: "/api/car",
                              data: {
                                carDetails,
                              },
                            })
                              .then((res) => {
                                axios
                                  .post(
                                    "/api/savedSearch/matchFiltersWithNewCar",
                                    {
                                      carDetails,
                                      valid: res.data.success,
                                    }
                                  )
                                  .then((res) => {
                                    const {
                                      userIds,
                                      matchedFilters,
                                    } = res.data;
                                    axios
                                      .post("/api/notification/new", {
                                        kind: "newCarsListed",
                                        data: {
                                          userIds,
                                          matchedFilters,
                                        },
                                        valid: "VaLid223",
                                      })
                                      .then((res) => {
                                        socket.emit(
                                          "newCarAdPosted",
                                          {
                                            userIds,
                                          },
                                          (confirmation) => {
                                            if (confirmation) {
                                              this.props.history.push(
                                                "/profile/listings/car"
                                              );
                                              setPosting(false);
                                            }
                                          }
                                        );
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        throw err;
                                      });
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    throw err;
                                  });
                              })
                              .catch((err) => {
                                if (err) {
                                  setPosting(false);
                                  props.history.push(
                                    "/sell/car?continueEditing=1"
                                  );
                                }
                              });
                          }
                        }
                      }}
                      type="button"
                      className="float-right"
                    >
                      {posted ? "Finish Editing" : "Publish Ad"} &nbsp; &rarr;
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default PreviewCarAd;
