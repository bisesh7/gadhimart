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
import ccSVG from "../../icons/cylinder.svg";
import districtSVG from "../../icons/location.svg";
import viewsSVG from "../../icons/visibility.svg";
import updateSVG from "../../icons/register.svg";
import deleteSVG from "../../icons/cross.svg";
import kilometerSVG from "../../icons/speed.svg";
import motorcycleSVG from "../../icons/motorbiking.svg";

const ENDPOINT = "http://localhost:5000/";
let socket;

const MotorcycleListings = (props) => {
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
      socket = socketIOClient(ENDPOINT);
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
      .post(`/api/motorcycle/getListing/${auth.user.id}`, {
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
                vehicleType: "Motorcycle",
              })
              .then((res) => {
                views.push(res.data.views);
              })
              .catch((err) => {
                console.log(err);
              })
          );
        }

        Promise.all(promises).then(() => {
          setTotalItemsCount(listings.length);
          let listingListGroupItems = [];

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
                          listings[i].details.mainPicture !== ""
                            ? listings[i].details.mainPicture
                            : listings[i].details.picturesToBeUploadedMeta[0]
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
                            {listings[i].details.make === "Other"
                              ? listings[i].details.adTitle.length > 79
                                ? listings[i].details.adTitle.substring(0, 79) +
                                  " ..."
                                : listings[i].details.adTitle
                              : listings[i].details.make}{" "}
                            {listings[i].details.model === "Other"
                              ? null
                              : listings[i].details.model}
                          </ListGroupItemHeading>
                        </Col>
                        <Col xs="4">
                          <ListGroupItemHeading className="float-right heading text-success">
                            Rs {listings[i].details.priceInput}
                          </ListGroupItemHeading>
                        </Col>
                      </Row>

                      <ListGroupItemText className="mt-2">
                        <Row>
                          <Col xs="9">
                            <div>
                              <img alt="" src={kilometerSVG} width="20" />{" "}
                              <span>
                                {listings[i].details.kilometerInput} km
                              </span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={ccSVG} width="20" />{" "}
                              <span>{listings[i].details.ccInput} cc</span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={districtSVG} width="20" />{" "}
                              <span>
                                {listings[i].details.districtSelected}
                              </span>
                            </div>
                            <div className="mt-1">
                              <img alt="" src={viewsSVG} width="20" />{" "}
                              <span>{views[i]}</span>
                            </div>
                          </Col>
                          <Col
                            xs="3"
                            className="listingsButtonsBike listingsButtonsBike-sm"
                          >
                            <a
                              href={`/sell/motorcycle?continueEditing=2&&id=${listings[i]._id}`}
                              onClick={(e) => {
                                e.preventDefault();

                                // Set the details to the session storage and the redirect to preview page
                                sessionStorage.setItem(
                                  "previewMotorcycleDetails",
                                  JSON.stringify(listings[i].details)
                                );
                                props.props.history.push(
                                  "/sell/motorcycle?continueEditing=2&&id=" +
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
                              href="/motorcycle/delete"
                              onClick={(e) => {
                                e.preventDefault();

                                // Confirm the delete first
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
                                    url:
                                      "/api/motorcycle/remove/" +
                                      listings[i]._id,
                                    data: {
                                      valid: "VaLID8973",
                                    },
                                  })
                                    .then((res) => {
                                      console.log(res.data);
                                      if (res.data.success) {
                                        updateListingCards();
                                        // create new notification about deletion
                                        const make = listings[i].details.make;
                                        const model = listings[i].details.model;
                                        axios
                                          .post("/api/notification/new", {
                                            kind: "listedMotorcycleDeleted",
                                            data: {
                                              motorcycleListingId:
                                                listings[i]._id,
                                              adTitle:
                                                listings[i].details.adTitle,
                                              motorcycleLister: auth.user.id,
                                              make,
                                              model,
                                              motorcycleListerName:
                                                auth.user.name,
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
                                                    vehicleType: "Motorcycle",
                                                  }
                                                )
                                                .then(() => {
                                                  socket.emit(
                                                    "listingDeleted",
                                                    {
                                                      to: users,
                                                      make,
                                                      model,
                                                      situation:
                                                        "onlyChatSession",
                                                      vehicleType: "motorcycle",
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
                                              console.log(
                                                "Saved vehicles but no message"
                                              );
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
                                                      make,
                                                      model,
                                                      situation: "onlySavedCar",
                                                      vehicleType: "motorcycle",
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
                                                        vehicleType:
                                                          "Motorcycle",
                                                      }
                                                    )
                                                    .then(() => {
                                                      socket.emit(
                                                        "listingDeleted",
                                                        {
                                                          to: users,
                                                          make,
                                                          model,
                                                          situation: "both",
                                                          vehicleType:
                                                            "motorcycle",
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
        <img src={motorcycleSVG} width="100" alt="" />
        <h1 className="display-4">No motorcycle ads has been listed yet!</h1>
        <p className="lead">
          Create your motorcycle ad listing to start selling your vehicle. All
          your ad listings will appear here.
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

export default MotorcycleListings;
