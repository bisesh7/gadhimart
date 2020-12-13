import React, { useEffect, Fragment, useContext, useState } from "react";
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  Nav,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import VehiclesSidebar from "./VehiclesSidebar";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import savedVehicleSVG from "../../icons/money.svg";
import kilometerSVG from "../../icons/speed.svg";
import drivetrainSVG from "../../icons/drivetrain.svg";
import fuelTypeSVG from "../../icons/fuel.svg";
import districtSVG from "../../icons/location.svg";

const SavedCars = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // if not signed in then do not show this page
  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  const [savedCarsListGroupItems, setSavedCarsListGroupItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .post("/api/savedVehicles/getAllSavedCars", {
        userId: auth.user.id,
        valid: "VaLId876",
      })
      .then((res) => {
        let vehicleIds = [];

        res.data.savedCars.forEach((savedCar) => {
          vehicleIds.push(savedCar.vehicleId);
        });

        if (vehicleIds.length >= 0) {
          axios
            .post("/api/car/getListingByIDs", { vehicleIds, valid: "VaLId876" })
            .then((res) => {
              let savedCarsListGroupItems = [];

              if (res.data.savedCars.length >= 1) {
                res.data.savedCars.forEach((listing, key) => {
                  const carDetails = listing.carDetails;

                  savedCarsListGroupItems.push({
                    key,
                    savedCarsListGroupItem: (
                      <ListGroupItem
                        tag="a"
                        href={`/car/${listing._id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          props.history.push(`/car/${listing._id}`);
                        }}
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
                                  : listing.carDetails
                                      .picturesToBeUploadedMeta[0].fileUrl
                              }
                              alt="Main Picture"
                              className="savedCarSearchImage"
                            />
                          </Col>
                          <Col sm="9" className="mt-lg-0 mt-3">
                            <Row>
                              <Col xs="8">
                                <ListGroupItemHeading className="heading">
                                  {listing.carDetails.carMakeSelected ===
                                  "Other"
                                    ? listing.carDetails.adTitle.length > 79
                                      ? listing.carDetails.adTitle.substring(
                                          0,
                                          79
                                        ) + " ..."
                                      : listing.carDetails.adTitle
                                    : listing.carDetails.carMakeSelected}{" "}
                                  {listing.carDetails.carModelSelected ===
                                  "Other"
                                    ? null
                                    : listing.carDetails.carModelSelected}
                                </ListGroupItemHeading>
                              </Col>
                              <Col xs="4">
                                <ListGroupItemHeading className="float-right heading text-success">
                                  Rs {carDetails.carPriceInput}
                                </ListGroupItemHeading>
                              </Col>
                            </Row>

                            <ListGroupItemText className="mt-5">
                              <Row>
                                <Col>
                                  <Row>
                                    <Col>
                                      <div>
                                        <img
                                          alt=""
                                          src={kilometerSVG}
                                          width="20"
                                          pb="1"
                                        />{" "}
                                        <span>
                                          {carDetails.carKiloMetersInput} km
                                        </span>
                                      </div>
                                      <div className="mt-1">
                                        <img
                                          alt=""
                                          src={drivetrainSVG}
                                          width="20"
                                          pb="1"
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
                                          width="20"
                                        />{" "}
                                        <span>
                                          {carDetails.districtSelected}
                                        </span>
                                      </div>
                                      <div className="mt-1">
                                        <img
                                          alt=""
                                          src={fuelTypeSVG}
                                          width="20"
                                        />{" "}
                                        <span>
                                          {carDetails.carFuelTypeSelected}
                                        </span>
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
              }

              setSavedCarsListGroupItems(savedCarsListGroupItems);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              if (typeof err.response !== "undefined") {
                if (err.response.status === 500) {
                  alert("Server Error!");
                } else {
                  console.log(err);
                }
                setLoading(false);
              }
            });
        }
      })
      .catch((err) => {
        if (typeof err.response !== "undefined") {
          if (err.response.status === 500) {
            alert("Server Error!");
          } else {
            console.log(err);
          }
        }
      });
  }, [auth]);

  const noSavedCars = (
    <Fragment>
      <Container>
        <Jumbotron>
          <img src={savedVehicleSVG} width="100" alt="" />
          <h1 className="display-4">You have no cars saved yet!</h1>
          <p className="lead">
            Start saving cars by taping the star icon on your favourite car.
          </p>
          <hr className="my-2" />
          <p className="lead mt-4">
            <Button
              color="primary"
              type="button"
              onClick={() => {
                props.history.push("/cars/a/a?mp=&&mk=");
              }}
            >
              Find a car
            </Button>
          </p>
        </Jumbotron>
      </Container>
    </Fragment>
  );

  const savedCars = (
    <Fragment>
      <ListGroup>
        {savedCarsListGroupItems.map((item) => item.savedCarsListGroupItem)}
      </ListGroup>
    </Fragment>
  );

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="mt-5">
            <Row>
              <Col md="3">
                <VehiclesSidebar />
              </Col>

              <Col md="9" className="mt-4 mt-md-0">
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center">
                      <PropagateLoader
                        size={15}
                        color={"#1881d8"}
                        loading={true}
                      />
                      <br />
                      <br />
                    </div>
                  </div>
                ) : savedCarsListGroupItems.length >= 1 ? (
                  savedCars
                ) : (
                  noSavedCars
                )}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default SavedCars;
