import React, { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext";
import {
  Button,
  Jumbotron,
  ListGroupItem,
  Row,
  Col,
  ListGroupItemHeading,
  ListGroupItemText,
  ListGroup,
} from "reactstrap";
import PropagateLoader from "react-spinners/PropagateLoader";
import { SocketContext } from "../../Contexts/SocketContext";
import socketIOClient from "socket.io-client";
import Pagination from "react-js-pagination";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import viewsSVG from "../../icons/visibility.svg";
import updateSVG from "../../icons/register.svg";
import deleteSVG from "../../icons/cross.svg";
import kilometerSVG from "../../icons/speed.svg";
import drivetrainSVG from "../../icons/drivetrain.svg";
import fuelTypeSVG from "../../icons/fuel.svg";
import carSVG from "../../icons/suv-car.svg";
import { getEndPoint } from "../../config";
import ShareModal from "./ShareModal";

let socket;

const CarListings = (props) => {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [listingListGroupItems, setUpListingListGroupItems] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const { socketDetail } = useContext(SocketContext);

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [listingsPerPage] = useState(15);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const [currentListings, setCurrentListings] = useState([]);

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

  const deleteConfirm = (cb) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this listing?</p>
            <Button color="secondary" onClick={onClose}>
              No
            </Button>
            <Button
              color="danger"
              onClick={() => {
                cb();
                onClose();
              }}
              className="ml-5"
            >
              Yes, Delete it!
            </Button>
          </div>
        );
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/car/getListing/${auth.user.id}`, {
        valid: process.env.REACT_APP_API_KEY,
      })
      .then((res) => {
        let promises = [];
        let views = [];
        const listings = res.data;

        for (let i = 0; i < listings.length; i++) {
          promises.push(
            axios
              .post("/api/views/getViews", {
                valid: "VAlid239",
                listingId: listings[i]._id,
                vehicleType: "Car",
              })
              .then((res) => {
                console.log(res.data);
                views.push(res.data.views);
              })
              .catch((err) => {
                console.log(err);
              })
          );
        }

        Promise.all(promises).then(() => {
          let listingListGroupItems = [];
          setTotalItemsCount(listings.length);
          for (let i = 0; i < listings.length; i++) {
            listingListGroupItems.push({
              key: i,
              listGroupItem: (
                <ListGroupItem className="mb-3 searchResult">
                  <Row>
                    <Col
                      sm="3"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img
                        src={
                          listings[i].carDetails.mainPicture !== ""
                            ? listings[i].carDetails.mainPicture
                            : listings[i].carDetails.picturesToBeUploadedMeta[0]
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
                            {listings[i].carDetails.carMakeSelected === "Other"
                              ? listings[i].carDetails.adTitle.length > 79
                                ? listings[i].carDetails.adTitle.substring(
                                    0,
                                    79
                                  ) + " ..."
                                : listings[i].carDetails.adTitle
                              : listings[i].carDetails.carMakeSelected}{" "}
                            {listings[i].carDetails.carModelSelected === "Other"
                              ? null
                              : listings[i].carDetails.carModelSelected}
                          </ListGroupItemHeading>
                        </Col>
                        <Col xs="4">
                          <ListGroupItemHeading className="float-right heading text-success">
                            Rs {listings[i].carDetails.carPriceInput}
                          </ListGroupItemHeading>
                        </Col>
                      </Row>

                      <ListGroupItemText className="mt-2">
                        <Row>
                          <Col xs="9">
                            <div>
                              <img alt="" src={kilometerSVG} width="20" />{" "}
                              <span>
                                {listings[i].carDetails.carKiloMetersInput} km
                              </span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={drivetrainSVG} width="20" />{" "}
                              <span>
                                {listings[i].carDetails.carDrivetrainSelected}
                              </span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={viewsSVG} width="20" />{" "}
                              <span>{views[i]}</span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={fuelTypeSVG} width="20" />{" "}
                              <span>
                                {listings[i].carDetails.carFuelTypeSelected}
                              </span>
                            </div>
                            <div className="mt-2">
                              <ShareModal
                                details={listings[i].carDetails}
                                listingId={listings[i]._id}
                                vehicle="Car"
                              />
                            </div>
                          </Col>
                          <Col
                            xs="3"
                            className="listingsButtons listingsButtons-sm"
                          >
                            <a
                              href={`/sell/car?continueEditing=2&&id=${listings[i]._id}`}
                              onClick={(e) => {
                                e.preventDefault();

                                // Set the car details to the session storage and the redirect to preview page
                                sessionStorage.setItem(
                                  "previewCarDetails",
                                  JSON.stringify(listings[i].carDetails)
                                );
                                props.props.history.push(
                                  "/sell/car?continueEditing=2&&id=" +
                                    listings[i]._id
                                );
                              }}
                            >
                              <img
                                src={updateSVG}
                                className="lightenOnHover pb-2"
                                width="22"
                                alt="X"
                              />
                            </a>
                            &emsp;&emsp;
                            <a
                              href="/car/delete"
                              onClick={(e) => {
                                e.preventDefault();

                                deleteConfirm(() => {
                                  setDeleting(true);

                                  listingListGroupItems = listingListGroupItems.filter(
                                    (lc) => lc.key !== i
                                  );

                                  const updateListingCards = () => {
                                    setUpListingListGroupItems(
                                      listingListGroupItems
                                    );
                                    setDeleting(false);
                                  };

                                  // Remove car
                                  axios({
                                    method: "post",
                                    url: "/api/car/remove/" + listings[i]._id,
                                    data: {
                                      valid: "VaLiD123",
                                    },
                                  })
                                    .then((res) => {
                                      console.log(res.data);
                                      if (res.data.success) {
                                        // create new notification about deletion
                                        const carMake =
                                          listings[i].carDetails
                                            .carMakeSelected;
                                        const carModel =
                                          listings[i].carDetails
                                            .carModelSelected;
                                        axios
                                          .post("/api/notification/new", {
                                            kind: "listedCarDeleted",
                                            data: {
                                              vehicleId: listings[i]._id,
                                              carTitle:
                                                listings[i].carDetails.adTitle,
                                              lister: auth.user.id,
                                              carMake,
                                              carModel,
                                              listerName: auth.user.name,
                                              vehicleType: "Car",
                                            },
                                            valid: "VaLid223",
                                          })
                                          .then((res) => {
                                            console.log(res.data);
                                            // API give information if the message was sent and
                                            // vehicle was saved
                                            const {
                                              savedVehicleId,
                                              noMessages,
                                              users,
                                            } = res.data;
                                            // If no vehicle was saved and also no message was sent
                                            if (!savedVehicleId && noMessages) {
                                              updateListingCards();
                                            } else if (
                                              !savedVehicleId &&
                                              !noMessages
                                            ) {
                                              // If no vehicle was saved but message was sent
                                              // delete the message
                                              axios
                                                .post(
                                                  "/api/message/deleteMessages",
                                                  {
                                                    listingId: listings[i]._id,
                                                    valid: "ValId256",
                                                    vehicleType: "Car",
                                                  }
                                                )
                                                .then(() => {
                                                  socket.emit(
                                                    "listingDeleted",
                                                    {
                                                      to: users,
                                                      make: carMake,
                                                      model: carModel,
                                                      situation:
                                                        "onlyChatSession",
                                                      vehicleType: "car",
                                                    },
                                                    function (confirmation) {
                                                      if (confirmation) {
                                                        updateListingCards();
                                                      }
                                                    }
                                                  );
                                                })
                                                .catch((err) => {
                                                  throw err;
                                                });
                                            } else if (
                                              savedVehicleId &&
                                              noMessages
                                            ) {
                                              // If vehicle was saved but message was not sent
                                              // delete the saved vehicle
                                              axios
                                                .post(
                                                  "/api/savedVehicles/delete",
                                                  {
                                                    savedVehicleId:
                                                      res.data.savedVehicleId,
                                                    valid: "VaLId876",
                                                  }
                                                )
                                                .then(() => {
                                                  socket.emit(
                                                    "listingDeleted",
                                                    {
                                                      to: users,
                                                      make: carMake,
                                                      model: carModel,
                                                      situation: "onlySavedCar",
                                                      vehicleType: "car",
                                                    },
                                                    function (confirmation) {
                                                      if (confirmation) {
                                                        updateListingCards();
                                                      }
                                                    }
                                                  );
                                                })
                                                .catch((err) => {
                                                  throw err;
                                                });
                                            } else if (
                                              savedVehicleId &&
                                              !noMessages
                                            ) {
                                              // If vehicle was saved and also message was sent
                                              // delete the saved vehicle and then delete the messages
                                              axios
                                                .post(
                                                  "/api/savedVehicles/delete",
                                                  {
                                                    savedVehicleId:
                                                      res.data.savedVehicleId,
                                                    valid: "VaLId876",
                                                  }
                                                )
                                                .then(() => {
                                                  axios
                                                    .post(
                                                      "/api/message/deleteMessages",
                                                      {
                                                        listingId:
                                                          listings[i]._id,
                                                        valid: "ValId256",
                                                        vehicleType: "Car",
                                                      }
                                                    )
                                                    .then(() => {
                                                      socket.emit(
                                                        "listingDeleted",
                                                        {
                                                          to: users,
                                                          make: carMake,
                                                          model: carModel,
                                                          situation: "both",
                                                          vehicleType: "car",
                                                        },
                                                        function (
                                                          confirmation
                                                        ) {
                                                          if (confirmation) {
                                                            updateListingCards();
                                                          }
                                                        }
                                                      );
                                                    })
                                                    .catch((err) => {
                                                      throw err;
                                                    });
                                                })
                                                .catch((err) => {
                                                  throw err;
                                                });
                                            }
                                          })
                                          .catch((err) => {
                                            throw err;
                                          });
                                      }
                                    })
                                    .catch((err) => {
                                      setDeleting(false);
                                      if (typeof err.response !== "undefined") {
                                        if (err.response.status === 500) {
                                          alert("Server Error!");
                                        } else if (
                                          err.response.status === 400
                                        ) {
                                          alert("Error Occurred!");
                                        }
                                      } else {
                                        alert("Something is wrong!");
                                        console.log(err);
                                      }
                                    });
                                });
                              }}
                            >
                              <img
                                src={deleteSVG}
                                className="lightenOnHover pb-2"
                                width="22"
                                alt="X"
                              />
                            </a>
                          </Col>
                        </Row>
                      </ListGroupItemText>
                    </Col>
                  </Row>
                </ListGroupItem>
              ),
            });
          }
          setUpListingListGroupItems(listingListGroupItems);
          setLoading(false);
        });
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response !== "undefined") {
          if (err.response.status === 500) {
            alert("Server Error!");
          } else if (err.response.status === 400) {
            alert("Error Occurred!");
          }
        } else {
          console.log(err);
        }
      });
  }, [auth]);

  // Get the 15 current listing based on the active page number
  useEffect(() => {
    // Get current posts
    const indexOfLastListing = activePage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = listingListGroupItems.slice(
      indexOfFirstListing,
      indexOfLastListing
    );
    setCurrentListings(currentListings);
  }, [listingListGroupItems, activePage, listingsPerPage]);

  const noAds = (
    <Fragment>
      <Jumbotron>
        <img src={carSVG} width="100" alt="" />
        <h1 className="display-4">No car ads has been listed yet!</h1>
        <p className="lead">
          Create your car ad listing to start selling your vehicle. All your ad
          listings will appear here.
        </p>
        <hr className="my-2" />
        <p className="lead mt-4">
          <Button
            color="primary"
            type="button"
            onClick={() => {
              props.props.history.push("/sell");
            }}
          >
            Sell my vehicle
          </Button>
        </p>
      </Jumbotron>
    </Fragment>
  );

  return (
    <div>
      {loading || deleting ? (
        <div className="d-flex justify-content-center">
          <PropagateLoader size={15} color={"#1881d8"} loading={true} />
          <br />
          <br />
        </div>
      ) : listingListGroupItems.length >= 1 ? (
        <Fragment>
          <ListGroup>{currentListings.map((lc) => lc.listGroupItem)}</ListGroup>

          <Pagination
            activePage={activePage}
            itemsCountPerPage={listingsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            itemClass="page-item mb-5"
            linkClass="page-link"
            onChange={handlePageChange}
          />
        </Fragment>
      ) : (
        noAds
      )}
    </div>
  );
};

export default CarListings;
