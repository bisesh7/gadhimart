import React, { useState, useEffect, useContext, Fragment } from "react";
import UnAuthNavbar from "../CarSearch/UnAuthNavbar";
import axios from "axios";
import {
  Container,
  Alert,
  Row,
  Col,
  Button,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Media,
} from "reactstrap";
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactImageGallery from "react-image-gallery";
import {
  toCapital,
  promiseCheckAuth,
  clearCarDetailsInSessionStorage,
} from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import { uuid } from "uuidv4";
import classnames from "classnames";
import { useToasts } from "react-toast-notifications";
import { SocketContext } from "../../Contexts/SocketContext";
import socketIOClient from "socket.io-client";
import ReportComponent from "../CarSearch/ReportComponent";
import conditionSVG from "../../icons/car-repair.svg";
import kilometersSVG from "../../icons/speed.svg";
import ccSVG from "../../icons/cylinder.svg";
import fuelTypeSVG from "../../icons/fuel.svg";
import savedSVG from "../../icons/savedStar.svg";
import unSavedSVG from "../../icons/starNoColor.svg";
import Footer from "../Footer";
import { getEndPoint } from "../../config";

let socket;

const MotorcycleDetailView = (props) => {
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

  // Get socket
  const { socketDetail, socketDispatch } = useContext(SocketContext);

  // Connect to socket and back up
  useEffect(() => {
    socket = socketDetail.socket;

    // When client restarts the page, socketcontext get defaulted
    // So reassigning socket here.
    if (socket === null) {
      socket = socketIOClient(getEndPoint());
      // Set the socket in the context
      socketDispatch({
        type: "LOGIN_PASS",
        socket,
      });
    }

    // Turn off socket after unmounting the component
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socketDetail]);

  const [listingId] = useState(props.match.params.listingId);

  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((res) => {
        const ipdata = res.data;
        console.log(ipdata.ip);

        axios
          .post("/api/views/setView", {
            ipAddress: ipdata.ip,
            listingId,
            vehicleType: "Motorcycle",
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
  }, [listingId]);

  const [loading, setLoading] = useState(false);
  const [listerId, setListerId] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [motorcycleDetail, setMotorcycleDetail] = useState(null);
  const [images, setImages] = useState({});
  const [description, setDescription] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [savedPost, setSavedPost] = useState(false);
  const [message, setMessage] = useState("Is this still available?");

  // Notifications: For new notifications
  const { addToast } = useToasts();

  // Motorcycle features tabs
  const [activeTab, setActiveTab] = useState("1");
  const [featuresList, setFeaturesList] = useState([]);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // If the lister and current user is the same we redirect to home
  useEffect(() => {
    if (listerId !== "" && listerId === auth.user.id) {
      props.history.replace("/");
    }
  }, [listerId, auth]);

  useEffect(() => {
    if (typeof listingId === "undefined" || listingId == null) {
      props.location.push("/");
    } else {
      setLoading(true);
      axios
        .post(`/api/motorcycle/getListingByID/${listingId}`, {
          valid: process.env.REACT_APP_API_KEY,
        })
        .then((motorcycleRes) => {
          axios
            .post(`/api/users/get/${motorcycleRes.data.listing.userId}`, {
              valid: process.env.REACT_APP_API_KEY,
            })
            .then((userRes) => {
              const listing = motorcycleRes.data.listing;
              const { userDetail } = userRes.data;

              setListerId(listing.userId);

              setUserDetails(userDetail);

              setMotorcycleDetail(listing.details);

              // Motorcycle pictures
              let newImages = [];
              motorcycleRes.data.listing.details.picturesToBeUploadedMeta.forEach(
                (meta) => {
                  newImages.push({
                    original: meta.fileUrl,
                    thumbnail: meta.fileUrl,
                  });
                }
              );
              console.log(newImages);
              setImages(newImages);

              setDescription(listing.details.adDescription.slice(0, 600));

              {
                let motorcycleFeatures = [];
                if (listing.details.hasElectricStart) {
                  motorcycleFeatures.push("Electric start");
                }
                if (listing.details.hasAlloyWheels) {
                  motorcycleFeatures.push("Alloy wheels");
                }
                if (listing.details.hasTubelessTyres) {
                  motorcycleFeatures.push("Tubeless Tyres");
                }
                if (listing.details.hasDigitalDisplayPanel) {
                  motorcycleFeatures.push("Digital display panel");
                }
                if (listing.details.hasProjectedHeadLight) {
                  motorcycleFeatures.push("Projected head light");
                }
                if (listing.details.hasLedTailLight) {
                  motorcycleFeatures.push("Led tail light");
                }
                if (listing.details.hasFrontDiscBrake) {
                  motorcycleFeatures.push("Front disc brake");
                }
                if (listing.details.hasRearDiscBrake) {
                  motorcycleFeatures.push("Rear disc brake");
                }
                if (listing.details.hasAbs) {
                  motorcycleFeatures.push("Anti-lock braking system (ABS)");
                }
                if (listing.details.hasMonoSuspension) {
                  motorcycleFeatures.push("Mono suspension");
                }
                if (listing.details.hasSplitSeat) {
                  motorcycleFeatures.push("Split seat");
                }
                if (listing.details.hasTripMeter) {
                  motorcycleFeatures.push("Tripmeter");
                }

                let featuresList = motorcycleFeatures.map((carFeature) => {
                  return <li className="heading text-muted">{carFeature}</li>;
                });

                setFeaturesList(featuresList);

                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                var match = listing.details.youtubeLinkInput.match(regExp);

                if (match) {
                  setYoutubeEmbedUrl(
                    "https://www.youtube.com/embed/" + match[2] + "?autoplay=0"
                  );
                }
                setLoading(false);
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
    }
  }, [listingId]);

  // TO check whethe the car listing is saved by the user
  useEffect(() => {
    axios
      .post("/api/savedVehicles/checkSavedVehicle", {
        userId: auth.user.id,
        listingId,
        valid: "VaLId876",
        type: "Motorcycle",
      })
      .then((res) => {
        setSavedPost(res.data.saved);
      })
      .catch((err) => {
        setSavedPost(false);
      });
  }, [auth, listingId]);

  const onDismiss = () => {
    setAlertMessage("");
    setAlertVisible(false);
  };

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertVisible(true);
    // After 3.5 seconds hide the alert
    setTimeout(function () {
      setAlertVisible(false);
    }, 3500);
  };

  return (
    <div>
      <UnAuthNavbar history={props.history} location={props.location} />

      {loading || motorcycleDetail === null || listerId === auth.user.id ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="d-flex justify-content-center">
            <PropagateLoader size={15} color={"#1881d8"} loading={true} />
            <br />
            <br />
          </div>
        </div>
      ) : (
        <Fragment>
          <Container className="mt-5">
            <Alert color="info" isOpen={alertVisible} toggle={onDismiss}>
              {alertMessage}
            </Alert>

            <ReactImageGallery items={images} showBullets={true} />

            {/* Ad tile and price */}
            <div className="text-center mt-4">
              <h3 className="heading">{motorcycleDetail.adTitle}</h3>

              <h3 className="heading" style={{ color: "green" }}>
                {motorcycleDetail.priceType === "notFree"
                  ? "Rs " + motorcycleDetail.priceInput
                  : toCapital(motorcycleDetail.priceType)}
              </h3>
            </div>

            {/* Message, Save motorcycle */}
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
                                  listingId,
                                  type: "Motorcycle",
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
                                  listingId,
                                  type: "Motorcycle",
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
                                    listingId,
                                    vehicleType: "Motorcycle",
                                  })
                                  .then((res) => {
                                    setRedirecting(false);
                                    props.history.push("/inbox");
                                    socket.emit(
                                      "newMessage",
                                      {
                                        from: auth.user.id,
                                        to: listerId,
                                        message,
                                        title: motorcycleDetail.adTitle,
                                        senderName: auth.user.name,
                                        make: motorcycleDetail.make,
                                        model: motorcycleDetail.model,
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

            {/* Motorcycle Infos */}
            <div className="mt-4 preview">
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
                        {toCapital(motorcycleDetail.conditionSelected)}
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
                        {motorcycleDetail.kilometerInput} <br />
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
                        &nbsp;
                        {motorcycleDetail.ccInput} <br />
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
                        {toCapital(motorcycleDetail.fuelTypeSelected)} <br />
                        <small className="text-muted">Fuel type</small>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Motorycle Description */}
            <div className="mt-4">
              <h5 className="heading pb-2">Description</h5>

              <p className="preview heading">
                <div className="text-muted">{description}</div> <br />
                <a
                  href="readMore"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      description ===
                      motorcycleDetail.adDescription.slice(0, 600)
                    ) {
                      setDescription(motorcycleDetail.adDescription);
                    } else {
                      setDescription(
                        motorcycleDetail.adDescription.slice(0, 600)
                      );
                    }
                  }}
                >
                  {description === motorcycleDetail.adDescription.slice(0, 600)
                    ? "Read more"
                    : "Show less"}
                </a>
              </p>
            </div>

            {/* Motorycle features */}
            <div className="mt-4">
              <h5 className="heading pb-2">Motorycle features</h5>
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
                  {motorcycleDetail.youtubeLinkInput !== "" ? (
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
                          Make: {toCapital(motorcycleDetail.make)} <br />
                          Model: {toCapital(motorcycleDetail.model)} <br />
                          Year: {motorcycleDetail.year}
                        </span>
                      </Col>
                      <Col sm="6">
                        <span className="text-muted heading">
                          Body Type:{" "}
                          {toCapital(motorcycleDetail.bodyTypeSelected)} <br />
                          Color: {toCapital(
                            motorcycleDetail.colorSelected
                          )}{" "}
                          <br />
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
                  {motorcycleDetail.youtubeLinkInput !== "" ? (
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

            {/* Lister Information */}
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
                            href={`/listings/motorcycle/${listerId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              props.history.push(
                                `/listings/motorcycle/${listerId}`
                              );
                            }}
                          >
                            View ads
                          </a>
                        </Col>
                      </Row>
                      {motorcycleDetail.phoneNumberInput === ""
                        ? null
                        : `Phone Number: ${motorcycleDetail.phoneNumberInput}`}{" "}
                      <br />
                    </Media>
                  </Col>
                </Row>
              </div>
            </div>

            {/* location */}
            <div className="my-4">
              <div className="preview">
                <span className="text-muted heading">
                  Province: {toCapital(motorcycleDetail.provinceSelected)}{" "}
                  <br />
                  District: {toCapital(motorcycleDetail.districtSelected)}{" "}
                  <br />
                  Street Address:{" "}
                  {toCapital(motorcycleDetail.streetAddressInput)}
                </span>
              </div>
            </div>

            {/* Report ad */}
            <div className="mt-5 mb-4 d-flex justify-content-center">
              <ReportComponent listingId={listingId} vehicleType="Motorcycle" />
            </div>
          </Container>
          <Footer className="mb-4" history={props.history} />
        </Fragment>
      )}
    </div>
  );
};

export default MotorcycleDetailView;
