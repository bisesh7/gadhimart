import React, { Fragment, useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import AuthNavbar from "../AuthNavbar";
import queryString from "query-string";
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
import ImageGallery from "react-image-gallery";
import { setAuthStatus } from "../../methods";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { SocketContext } from "../../Contexts/SocketContext";
import conditionSVG from "../../icons/car-repair.svg";
import kilometersSVG from "../../icons/speed.svg";
import ccSVG from "../../icons/cylinder.svg";
import fuelTypeSVG from "../../icons/fuel.svg";

const host = window.location.hostname;
const ENDPOINT = "http://" + host + ":5000";
let socket;

const PreviewMotorcycleAd = (props) => {
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
  const [motorcycleDetails] = useState(
    JSON.parse(sessionStorage.getItem("previewMotorcycleDetails"))
  );
  const [motorcycleFeatures, setMotorcycleFeatures] = useState([]);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");

  // Car features tabs
  const [activeTab, setActiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [description, setDescription] = useState(
    typeof motorcycleDetails !== "undefined" && motorcycleDetails !== null
      ? motorcycleDetails.adDescription.slice(0, 600)
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
    if (
      typeof motorcycleDetails !== "undefined" &&
      motorcycleDetails !== null
    ) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = motorcycleDetails.youtubeLinkInput.match(regExp);

      if (match) {
        setYoutubeEmbedUrl(
          "https://www.youtube.com/embed/" + match[2] + "?autoplay=0"
        );
      }

      let picturesMeta = [];

      motorcycleDetails.picturesToBeUploadedMeta.forEach((meta) => {
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
        let motorcycleFeatures = [];
        if (motorcycleDetails.hasElectricStart) {
          motorcycleFeatures.push("Electric start");
        }
        if (motorcycleDetails.hasAlloyWheels) {
          motorcycleFeatures.push("Alloy wheels");
        }
        if (motorcycleDetails.hasTubelessTyres) {
          motorcycleFeatures.push("Tubeless Tyres");
        }
        if (motorcycleDetails.hasDigitalDisplayPanel) {
          motorcycleFeatures.push("Digital display panel");
        }
        if (motorcycleDetails.hasProjectedHeadLight) {
          motorcycleFeatures.push("Projected head light");
        }
        if (motorcycleDetails.hasLedTailLight) {
          motorcycleFeatures.push("Led tail light");
        }
        if (motorcycleDetails.hasFrontDiscBrake) {
          motorcycleFeatures.push("Front disc brake");
        }
        if (motorcycleDetails.hasRearDiscBrake) {
          motorcycleFeatures.push("Rear disc brake");
        }
        if (motorcycleDetails.hasAbs) {
          motorcycleFeatures.push("Anti-lock braking system (ABS)");
        }
        if (motorcycleDetails.hasMonoSuspension) {
          motorcycleFeatures.push("Mono suspension");
        }
        if (motorcycleDetails.hasSplitSeat) {
          motorcycleFeatures.push("Split seat");
        }
        if (motorcycleDetails.hasTripMeter) {
          motorcycleFeatures.push("Tripmeter");
        }

        setMotorcycleFeatures(motorcycleFeatures);
      }
    } else {
      props.history.push("/");
    }
  }, [motorcycleDetails]);

  let featuresList = motorcycleFeatures.map((feature) => {
    return <li className="heading text-muted">{feature}</li>;
  });

  const charAt0ToUpperCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [posting, setPosting] = useState(false);

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="my-5">
            <ImageGallery items={images} showBullets={true} />

            <div className="text-center mt-4">
              <h3 className="heading">{motorcycleDetails.adTitle}</h3>

              <h3 className="heading" style={{ color: "green" }}>
                {motorcycleDetails.priceType === "notFree"
                  ? "Rs " + motorcycleDetails.priceInput
                  : motorcycleDetails.priceType.charAt(0).toUpperCase() +
                    motorcycleDetails.priceType.slice(1)}
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

            <div className="my-4 preview">
              <Row>
                <Col xs="6">
                  <Row>
                    <Col xs="1">
                      <img
                        alt=""
                        src={conditionSVG}
                        className="pt-1"
                        width="24"
                      />
                    </Col>
                    <Col>
                      <div className="float-left">
                        &nbsp;{" "}
                        {charAt0ToUpperCase(
                          motorcycleDetails.conditionSelected
                        )}
                        <br />
                        <small className="text-muted">Condition</small>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs="6">
                  <Row>
                    <Col xs="1">
                      <img
                        alt=""
                        src={kilometersSVG}
                        className="pt-1"
                        width="24"
                      />
                    </Col>
                    <Col>
                      <div className="float-left">
                        &nbsp;
                        {motorcycleDetails.kilometerInput} <br />
                        <small className="text-muted">Kilometers</small>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs="6">
                  <Row>
                    <Col xs="1">
                      <img alt="" src={ccSVG} className="pt-1" width="24" />
                    </Col>
                    <Col>
                      <div className="float-left">
                        {motorcycleDetails.ccInput} <br />
                        <small className="text-muted">CC</small>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs="6">
                  <Row>
                    <Col xs="1">
                      <img
                        alt=""
                        src={fuelTypeSVG}
                        className="pt-1"
                        width="24"
                      />
                    </Col>
                    <Col>
                      <div className="float-left">
                        &nbsp;
                        {charAt0ToUpperCase(
                          motorcycleDetails.fuelTypeSelected
                        )}{" "}
                        <br />
                        <small className="text-muted">Fuel type</small>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <div className="mt-4">
              <h5 className="heading pb-2">Description</h5>

              <p className="preview heading">
                <div className="text-muted">{description}</div> <br />
                <a
                  href="notAHref"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      description ===
                      motorcycleDetails.adDescription.slice(0, 600)
                    ) {
                      setDescription(motorcycleDetails.adDescription);
                    } else {
                      setDescription(
                        motorcycleDetails.adDescription.slice(0, 600)
                      );
                    }
                  }}
                >
                  {description === motorcycleDetails.adDescription.slice(0, 600)
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
                  {motorcycleDetails.youtubeLinkInput !== "" ? (
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
                          Make: {charAt0ToUpperCase(motorcycleDetails.make)}{" "}
                          <br />
                          Model: {charAt0ToUpperCase(
                            motorcycleDetails.model
                          )}{" "}
                          <br />
                          Year: {motorcycleDetails.year}
                        </span>
                      </Col>
                      <Col sm="6">
                        <span className="text-muted heading">
                          Body Type:{" "}
                          {charAt0ToUpperCase(
                            motorcycleDetails.bodyTypeSelected
                          )}{" "}
                          <br />
                          Color:{" "}
                          {charAt0ToUpperCase(
                            motorcycleDetails.colorSelected
                          )}{" "}
                        </span>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row className="mt-2">
                      <Col sm="6">
                        <ul>{featuresList.slice(0, 6)}</ul>
                      </Col>
                      <Col sm="6">
                        <ul>{featuresList.slice(6, 12)}</ul>
                      </Col>
                    </Row>
                  </TabPane>
                  {motorcycleDetails.youtubeLinkInput !== "" ? (
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
                  Province:{" "}
                  {charAt0ToUpperCase(motorcycleDetails.provinceSelected)}{" "}
                  <br />
                  District:{" "}
                  {charAt0ToUpperCase(motorcycleDetails.districtSelected)}{" "}
                  <br />
                  Street Address:{" "}
                  {charAt0ToUpperCase(motorcycleDetails.streetAddressInput)}
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
                            "/sell/motorcycle?continueEditing=2&&id=" +
                              listingID
                          )
                        : props.history.push(
                            "/sell/motorcycle?continueEditing=1"
                          );
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
                      onClick={(e) => {
                        e.preventDefault();
                        setPosting(true);
                        if (!posted) {
                          axios({
                            method: "post",
                            url: "/api/motorcycle",
                            data: {
                              details: motorcycleDetails,
                              valid: "VaLID8973",
                            },
                          })
                            .then((res) => {
                              axios
                                .post(
                                  "/api/savedSearch/matchFiltersWithNewMotorcycle",
                                  {
                                    details: motorcycleDetails,
                                    valid: res.data.success,
                                  }
                                )
                                .then((res) => {
                                  console.log(res.data);
                                  const { userIds, matchedFilters } = res.data;
                                  if (userIds.length >= 1) {
                                    axios
                                      .post("/api/notification/new", {
                                        kind: "newMotorcyclesListed",
                                        data: {
                                          userIds,
                                          savedSearches: matchedFilters,
                                        },
                                        valid: "VaLid223",
                                      })
                                      .then(() => {
                                        socket.emit(
                                          "newVehiclePosted",
                                          {
                                            userIds,
                                            vehicleType: "Motorcycle",
                                          },
                                          (confirmation) => {
                                            if (confirmation) {
                                              setPosting(false);
                                              props.history.push(
                                                "/profile/listings/motorcycle"
                                              );
                                            }
                                          }
                                        );
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        throw err;
                                      });
                                  } else {
                                    props.history.push(
                                      "/profile/listings/motorcycle"
                                    );
                                  }
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
                                  "/sell/motorcycle?continueEditing=1"
                                );
                              }
                            });
                        } else {
                          axios({
                            method: "post",
                            url: "/api/motorcycle/update",
                            data: {
                              details: motorcycleDetails,
                              valid: "VaLID8973",
                              editNumber: "2",
                              databaseID: listingID,
                            },
                          })
                            .then((res) => {
                              setPosting(false);
                              props.history.push(
                                "/profile/listings/motorcycle"
                              );
                            })
                            .catch((err) => {
                              setPosting(false);
                              props.history.push(
                                "/sell/motorcycle?continueEditing=2&&id=" +
                                  listingID
                              );
                            });
                        }
                      }}
                      className="float-right"
                      type="button"
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

export default PreviewMotorcycleAd;
