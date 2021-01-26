import React, { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";
import UnAuthNavbar from "./UnAuthNavbar";
import ReactImageGallery from "react-image-gallery";
import classnames from "classnames";
import { uuid } from "uuidv4";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Media,
  Alert,
} from "reactstrap";
import { AuthContext } from "../../Contexts/AuthContext";
import { SocketContext } from "../../Contexts/SocketContext";
import socketIOClient from "socket.io-client";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useToasts } from "react-toast-notifications";
import {
  promiseCheckAuth,
  clearCarDetailsInSessionStorage,
} from "../../methods";
import ReportComponent from "./ReportComponent";
import conditionSVG from "../../icons/car-repair.svg";
import kilometersSVG from "../..//icons/speed.svg";
import transmissionSVG from "../../icons/transmission.svg";
import trimSVG from "../../icons/transport.svg";
import drivetrainSVG from "../../icons/drivetrain.svg";
import fueltypeSVG from "../../icons/fuel.svg";
import savedSVG from "../../icons/savedStar.svg";
import unSavedSVG from "../../icons/starNoColor.svg";
import Footer from "../Footer";
import { getEndPoint } from "../../config";
import ShareComponent from "./ShareComponent";
import HelmetMetaData from "../HelmetMetaData";

let socket;

const CarListingView = (props) => {
  const { auth, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      promiseCheckAuth(dispatch)
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
          }
        })
        .catch((err) => {
          console.log("Not signed in");
        });
    }

    clearCarDetailsInSessionStorage();
  }, [auth]);

  const [carListingId] = useState(props.match.params.carListingId);

  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((res) => {
        const ipdata = res.data;
        console.log(ipdata.ip);

        axios
          .post("/api/views/setView", {
            ipAddress: ipdata.ip,
            listingId: carListingId,
            vehicleType: "Car",
            valid: process.env.REACT_APP_API_KEY,
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [carListingId]);

  const [loading, setLoading] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [listerId, setListerId] = useState("");

  const [description, setDescription] = useState("Is this still available?");

  // Car features tabs
  const [activeTab, setActiveTab] = useState("1");
  const [featuresList, setFeaturesList] = useState([]);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");

  // Username, id, profile picture
  const [userDetails, setUserDetails] = useState({});

  const toCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1);
  };

  // Message sent from user to lister
  const [message, setMessage] = useState("Is this still available?");

  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => {
    setAlertMessage("");
    setAlertVisible(false);
  };

  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertVisible(true);
    // After 3.5 seconds hide the alert
    setTimeout(function () {
      setAlertVisible(false);
    }, 3500);
  };

  // Show spinner when sending message and saving the vehicle
  const [redirecting, setRedirecting] = useState(false);

  // If the lister and current user is the same we redirect to home
  useEffect(() => {
    if (listerId !== "" && listerId === auth.user.id) {
      props.history.replace("/");
    }
  }, [listerId, auth]);

  // Getting the car details
  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/car/getListingByID/${carListingId}`, {
        valid: process.env.REACT_APP_API_KEY,
      })
      .then((res) => {
        setLoading(false);
        const carListing = res.data.listing;
        setListerId(carListing.userId);
        axios
          .post(`/api/users/get/${carListing.userId}`, {
            valid: process.env.REACT_APP_API_KEY,
          })
          .then((res) => {
            const { userDetail } = res.data;

            setUserDetails(userDetail);

            setCarDetails(carListing.carDetails);

            // Car pictures
            let newImages = [];
            carListing.carDetails.picturesToBeUploadedMeta.forEach((meta) => {
              newImages.push({
                original: meta.fileUrl,
                thumbnail: meta.fileUrl,
              });
            });
            setImages(newImages);

            setDescription(carListing.carDetails.adDescription.slice(0, 600));

            {
              let carFeatures = [];
              if (carListing.carDetails.carHasSunRoof) {
                carFeatures.push("Sun roof");
              }
              if (carListing.carDetails.carHasAlloyWheels) {
                carFeatures.push("Alloy wheels");
              }
              if (carListing.carDetails.carHasNavigationSystem) {
                carFeatures.push("Navigation system");
              }
              if (carListing.carDetails.carHasBluetooth) {
                carFeatures.push("Bluetooth");
              }
              if (carListing.carDetails.carHasPushStart) {
                carFeatures.push("Push start");
              }
              if (carListing.carDetails.carHasParkingAssistant) {
                carFeatures.push("Parking assistant");
              }
              if (carListing.carDetails.carHasCruiseControl) {
                carFeatures.push("Cruise control");
              }
              if (carListing.carDetails.carHasAirConditioning) {
                carFeatures.push("Air conditioning");
              }
              if (carListing.carDetails.carHasPowerSteering) {
                carFeatures.push("Power steering");
              }
              if (carListing.carDetails.carHasPowerWindow) {
                carFeatures.push("Power window");
              }
              if (carListing.carDetails.carHasKeylessEntry) {
                carFeatures.push("Keyless remote entry");
              }
              if (carListing.carDetails.carHasAbs) {
                carFeatures.push("Anti-lock braking system (ABS)");
              }
              if (carListing.carDetails.carHasCarplay) {
                carFeatures.push("Apple carplay");
              }
              if (carListing.carDetails.carHasAndroidAuto) {
                carFeatures.push("Android auto");
              }

              let featuresList = carFeatures.map((carFeature) => {
                return <li className="heading text-muted">{carFeature}</li>;
              });

              setFeaturesList(featuresList);

              var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
              var match = carListing.carDetails.youtubeLinkInput.match(regExp);

              if (match) {
                setYoutubeEmbedUrl(
                  "https://www.youtube.com/embed/" + match[2] + "?autoplay=0"
                );
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            props.history.push("/");
          });
      })
      .catch((err) => {
        setLoading(false);
        props.history.push("/");
      });
  }, [carListingId]);

  const [savedPost, setSavedPost] = useState(false);

  // TO check whethe the car listing is saved by the user
  useEffect(() => {
    axios
      .post("/api/savedVehicles/checkSavedVehicle", {
        userId: auth.user.id,
        listingId: carListingId,
        valid: "VaLId876",
        type: "Car",
      })
      .then((res) => {
        setSavedPost(res.data.saved);
      })
      .catch((err) => {
        setSavedPost(false);
      });
  }, [auth, carListingId]);

  // Socket detail from the socket context
  const { socketDetail } = useContext(SocketContext);

  // Connect to c=socket and backup
  useEffect(() => {
    socket = socketDetail.socket;

    // When client restarts the page, socketcontext get defaulted
    // So reassigning socket here.
    if (socket === null) {
      socket = socketIOClient(getEndPoint());
    }

    // Turn off socket after unmounting the component
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socketDetail]);

  // Notifications: For new notifications
  const { addToast } = useToasts();

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
    if (typeof features !== "undefined") {
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
        for (
          var y = x * numberOfCols;
          y < x * numberOfCols + numberOfCols;
          y++
        ) {
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
    }
  };

  const [featuresAreaItems, setFeaturesAreaItems] = useState(null);

  useEffect(() => {
    if (carDetails !== null) {
      setFeaturesAreaItems([
        <Row>
          <Col xs="1">
            <img alt="" src={conditionSVG} className="pt-1" width="24" />
          </Col>
          <Col>
            <div className="float-left">
              &nbsp; {toCapital(carDetails.carConditionSelected)}
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
              {toCapital(carDetails.carTransmissionSelected)} <br />
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
              {toCapital(carDetails.carTrimInput)}
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
              {toCapital(carDetails.carDrivetrainSelected)} <br />
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
              {toCapital(carDetails.carFuelTypeSelected)} <br />
              <small className="text-muted">Fuel type</small>
            </div>
          </Col>
        </Row>,
      ]);
    }
  }, [carDetails]);

  const [featuresArea, setFeaturesArea] = useState(null);

  useEffect(() => {
    if (featuresAreaItems !== null && windowSize !== null) {
      setFeaturesArea(getAnchors(featuresAreaItems, windowSize));
    }
  }, [windowSize, featuresAreaItems]);

  return (
    <div>
      <UnAuthNavbar history={props.history} location={props.location} />
      {loading || carDetails === null || listerId === auth.user.id ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="d-flex justify-content-center">
            <PropagateLoader size={15} color={"#1881d8"} loading={true} />
            <br />
            <br />
          </div>
        </div>
      ) : (
        <Fragment>
          <HelmetMetaData
            title={carDetails.adTitle}
            description={carDetails.adDescription}
            image={`https://www.gadhimart.com${carDetails.picturesToBeUploadedMeta[0].fileUrl}`}
          />
          <Container className="mt-5">
            <Alert color="info" isOpen={alertVisible} toggle={onDismiss}>
              {alertMessage}
            </Alert>

            <ReactImageGallery items={images} showBullets={true} />

            {/* Ad tile and price */}
            <div className="text-center mt-4">
              <h3 className="heading">{carDetails.adTitle}</h3>

              <h3 className="heading" style={{ color: "green" }}>
                {carDetails.priceType === "notFree"
                  ? "Rs " + carDetails.carPriceInput
                  : toCapital(carDetails.priceType)}
              </h3>
            </div>

            <ShareComponent
              details={carDetails}
              listingId={carListingId}
              vehicle="Car"
            />

            {/* Message, Save car */}
            <div className="mt-4">
              <div>
                {redirecting ? (
                  <div className="d-flex justify-content-center">
                    <PropagateLoader
                      size={15}
                      color={"#1881d8"}
                      loading={true}
                    />
                    <br />
                    <br />
                  </div>
                ) : null}
                <Row>
                  <Col>
                    <h5 className="heading">Send seller a message</h5>
                  </Col>
                  <Col>
                    {/* Save button */}
                    <div className="float-right">
                      <Button
                        color="link"
                        style={{ textDecoration: "none" }}
                        type="button"
                        disabled={!auth.isAuthenticated || redirecting}
                        onClick={() => {
                          if (!auth.isAuthenticated) {
                            showAlert("Please login to save vehicles!");
                            // Scroll to the alert
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else {
                            if (!savedPost) {
                              setRedirecting(true);

                              axios
                                .post("/api/savedVehicles/newSave", {
                                  listingId: carListingId,
                                  type: "Car",
                                  valid: "VaLId876",
                                  userId: auth.user.id,
                                })
                                .then((res) => {
                                  setRedirecting(false);
                                  setSavedPost(true);
                                  // Create new toast notification
                                  addToast(
                                    <strong>
                                      Added to your saved vehicles
                                    </strong>,
                                    {
                                      appearance: "info",
                                      autoDismiss: true,
                                    }
                                  );
                                })
                                .catch((err) => {
                                  setRedirecting(false);

                                  if (typeof err.response !== "undefined") {
                                    if (err.response.status === 400) {
                                      showAlert("Error Occurred!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    } else if (err.response.status === 500) {
                                      showAlert("Server Error!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    } else {
                                      console.log(err);
                                      showAlert("Error Occurred!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    }
                                  }
                                });
                            } else {
                              setRedirecting(true);
                              axios
                                .post("/api/savedVehicles/unSave", {
                                  listingId: carListingId,
                                  type: "Car",
                                  valid: "VaLId876",
                                  userId: auth.user.id,
                                })
                                .then((res) => {
                                  setRedirecting(false);
                                  setSavedPost(false);
                                  // Create new toast notification
                                  addToast(
                                    <strong>
                                      Removed from your saved vehicles
                                    </strong>,
                                    {
                                      appearance: "info",
                                      autoDismiss: true,
                                    }
                                  );
                                })
                                .catch((err) => {
                                  setRedirecting(false);
                                  if (typeof err.response !== "undefined") {
                                    if (err.response.status === 400) {
                                      showAlert("Error Occurred!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    } else if (err.response.status === 500) {
                                      showAlert("Server Error!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                    } else {
                                      showAlert("Error Occurred!");
                                      // Scroll to the alert
                                      window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                      });
                                      console.log(err);
                                    }
                                  }
                                });
                            }
                          }
                        }}
                      >
                        <b>{savedPost ? "Unsave" : "Save"}</b> &nbsp;
                        <img
                          src={savedPost ? savedSVG : unSavedSVG}
                          alt="Save vehicle"
                          width="28"
                          className="pb-1"
                        />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Message area */}
              <div className="mb-4 preview">
                <Row>
                  <Col md="10">
                    <Input
                      type="text"
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      defaultValue={message}
                      disabled={!auth.isAuthenticated || redirecting}
                    />
                  </Col>

                  <Col md="2" className="mt-3 mt-md-0">
                    <Button
                      type="button"
                      disabled={!auth.isAuthenticated || redirecting}
                      onClick={() => {
                        if (!auth.isAuthenticated) {
                          showAlert("Please login to send message!");
                          // Scroll to the alert
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          setRedirecting(true);

                          axios
                            .post("/api/blockUser/checkUserIsBlocked", {
                              otherUser: listerId,
                              valid: "ValID531",
                            })
                            .then((res) => {
                              if (!res.data.userBlocked) {
                                const uniqueId = uuid();
                                axios
                                  .post("/api/message", {
                                    message,
                                    uniqueId,
                                    from: auth.user.id,
                                    to: listerId,
                                    valid: "VaLid123@4",
                                    listingId: carListingId,
                                    vehicleType: "Car",
                                  })
                                  .then(() => {
                                    setRedirecting(false);
                                    props.history.push("/inbox");

                                    socket.emit(
                                      "newMessage",
                                      {
                                        from: auth.user.id,
                                        to: listerId,
                                        message,
                                        title: carDetails.adTitle,
                                        senderName: auth.user.name,
                                        make: carDetails.carMakeSelected,
                                        model: carDetails.carModelSelected,
                                        uniqueId,
                                      },
                                      function (confirmation) {
                                        if (confirmation) {
                                          props.history.push("/inbox");
                                        }
                                      }
                                    );
                                  })
                                  .catch((err) => {
                                    setRedirecting(false);
                                    if (typeof err.response !== "undefined") {
                                      if (err.response.status === 400) {
                                        showAlert("Error Occurred!");
                                        // Scroll to the alert
                                        window.scrollTo({
                                          top: 0,
                                          behavior: "smooth",
                                        });
                                      } else if (err.response.status === 500) {
                                        showAlert("Server Error!");
                                        // Scroll to the alert
                                        window.scrollTo({
                                          top: 0,
                                          behavior: "smooth",
                                        });
                                      } else {
                                        showAlert("Error Occurred!");
                                        // Scroll to the alert
                                        window.scrollTo({
                                          top: 0,
                                          behavior: "smooth",
                                        });
                                        console.log(err);
                                      }
                                    }
                                  });
                              } else {
                                setRedirecting(false);
                                showAlert(
                                  "The lister have blocked the conversation with you. You will not be able to send messages to each other."
                                );
                                // Scroll to the alert
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            })
                            .catch((err) => {
                              setRedirecting(false);
                              if (typeof err.response !== "undefined") {
                                if (err.response.status === 400) {
                                  showAlert("Error Occurred!");
                                  // Scroll to the alert
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                } else if (err.response.status === 500) {
                                  showAlert("Server Error!");
                                  // Scroll to the alert
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                } else {
                                  showAlert("Error Occurred!");
                                  // Scroll to the alert
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                  console.log(err);
                                }
                              }
                            });
                        }
                      }}
                      color="primary"
                      block
                    >
                      Send message
                    </Button>
                  </Col>
                </Row>
              </div>

              <small className="text-muted mt-4">
                By sending the message you agree to our Terms of use ans Privacy
                policy
              </small>
            </div>

            {/* Car Infos */}
            <div className="mt-4 preview">{featuresArea}</div>

            {/* Car Description */}
            <div className="mt-4">
              <h5 className="heading pb-2">Description</h5>

              <p className="preview heading">
                <div className="text-muted">{description}</div> <br />
                <a
                  href="readMore"
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

            {/* Car features */}
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
                          Make: {toCapital(carDetails.carMakeSelected)} <br />
                          Model: {toCapital(carDetails.carModelSelected)} <br />
                          Year: {carDetails.carYearInput}
                        </span>
                      </Col>
                      <Col sm="6">
                        <span className="text-muted heading">
                          Body Type: {toCapital(carDetails.carBodyTypeSelected)}{" "}
                          <br />
                          Color: {toCapital(carDetails.carColorSelected)} <br />
                          Seats: {toCapital(carDetails.carSeatsSelected)}
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

            {/* Car Lister Information */}
            <div className="mt-4">
              <h5 className="heading">Seller Information</h5>
              <div className="preview">
                <Row>
                  <Col xs="2">
                    <img
                      src={userDetails.profilePicturePath}
                      className="detailListingProfilePicture"
                    />
                  </Col>
                  <Col xs="10">
                    <Media body>
                      <Row>
                        <Col md="10">
                          <Media heading>{userDetails.name}</Media>
                        </Col>
                        <Col md="2">
                          <a
                            href={`/listings/${listerId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              props.history.push(`/listings/car/${listerId}`);
                            }}
                            className="md-float-right"
                          >
                            View ads
                          </a>
                        </Col>
                      </Row>
                      {carDetails.phoneNumberInput === ""
                        ? null
                        : `Phone Number: ${carDetails.phoneNumberInput}`}{" "}
                      <br />
                    </Media>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Car location */}
            <div className="mt-4">
              <div className="preview">
                <span className="text-muted heading">
                  Province: {toCapital(carDetails.provinceSelected)} <br />
                  District: {toCapital(carDetails.districtSelected)} <br />
                  Street Address: {toCapital(carDetails.streetAddressInput)}
                </span>
              </div>
            </div>

            {/* Report ad */}
            <div className="mt-5 mb-4 d-flex justify-content-center">
              <ReportComponent listingId={carListingId} vehicleType="Car" />
            </div>
          </Container>
          <Footer className="mb-4" history={props.history} />
        </Fragment>
      )}
    </div>
  );
};

export default CarListingView;
