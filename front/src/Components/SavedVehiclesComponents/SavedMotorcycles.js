import React, { useEffect, Fragment, useContext, useState } from "react";
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  Nav,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  ListGroup,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import VehiclesSidebar from "./VehiclesSidebar";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import savedVehicleSVG from "../../icons/money.svg";
import ccSVG from "../../icons/cylinder.svg";
import districtSVG from "../../icons/location.svg";
import kilometerSVG from "../../icons/speed.svg";

const SavedMotorcycles = (props) => {
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

  const [
    savedVehiclesListGroupItems,
    setSavedVehiclesListGroupItems,
  ] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .post("/api/savedVehicles/getAllSavedMotorcycles", {
        userId: auth.user.id,
        valid: "VaLId876",
      })
      .then((res) => {
        let vehicleIds = [];

        res.data.savedMotorcycles.forEach((savedMotorcycle) => {
          vehicleIds.push(savedMotorcycle.vehicleId);
        });

        if (vehicleIds.length >= 0) {
          axios
            .post("/api/motorcycle/getListingByIDs", {
              vehicleIds,
              valid: "VaLID8973",
            })
            .then((res) => {
              let savedVehiclesListGroupItems = [];

              if (res.data.savedMotorcycles.length >= 1) {
                res.data.savedMotorcycles.forEach((listing, key) => {
                  const details = listing.details;

                  savedVehiclesListGroupItems.push({
                    key,
                    listGroupItem: (
                      <ListGroupItem
                        tag="a"
                        href={`/motorcycle/${listing._id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          props.history.push(`/motorcycle/${listing._id}`);
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
                                listing.details.mainPicture !== ""
                                  ? listing.details.mainPicture
                                  : listing.details.picturesToBeUploadedMeta[0]
                                      .fileUrl
                              }
                              alt="Main Picture"
                              className="savedCarSearchImage"
                            />
                          </Col>
                          <Col sm="9" className="mt-lg-0 mt-3">
                            <Row>
                              <Col xs="8">
                                <ListGroupItemHeading className="heading">
                                  {listing.details.make === "Other"
                                    ? listing.details.adTitle.length > 79
                                      ? listing.details.adTitle.substring(
                                          0,
                                          79
                                        ) + " ..."
                                      : listing.details.adTitle
                                    : listing.details.make}{" "}
                                  {listing.details.model === "Other"
                                    ? null
                                    : listing.details.model}
                                </ListGroupItemHeading>
                              </Col>
                              <Col xs="4">
                                <ListGroupItemHeading className="float-right heading text-success">
                                  Rs {details.priceInput}
                                </ListGroupItemHeading>
                              </Col>
                            </Row>

                            <ListGroupItemText className="mt-5">
                              <Row>
                                <Col>
                                  <div>
                                    <img alt="" src={kilometerSVG} width="20" />{" "}
                                    <span>{details.kilometerInput} km</span>
                                  </div>
                                  <div className="mt-1">
                                    <img alt="" src={ccSVG} width="20" />{" "}
                                    <span>{details.ccInput} cc</span>
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <img alt="" src={districtSVG} width="20" />{" "}
                                    <span>{details.districtSelected}</span>
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
              }

              setSavedVehiclesListGroupItems(savedVehiclesListGroupItems);
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

  const noSavedMotorcycles = (
    <Fragment>
      <Container>
        <Jumbotron>
          <img src={savedVehicleSVG} width="100" alt="" />
          <h1 className="display-4">You have no motorcycles saved yet!</h1>
          <p className="lead">
            Start saving motorcycles by taping the star icon on your favourite
            motorcycle.
          </p>
          <hr className="my-2" />
          <p className="lead mt-4">
            <Button
              color="primary"
              type="button"
              onClick={() => {
                props.history.push("/motorcycle/a/a?mp=&&mk=");
              }}
            >
              Find a motorcycle
            </Button>
          </p>
        </Jumbotron>
      </Container>
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
                ) : savedVehiclesListGroupItems.length >= 1 ? (
                  <ListGroup>
                    {savedVehiclesListGroupItems.map(
                      (item) => item.listGroupItem
                    )}
                  </ListGroup>
                ) : (
                  noSavedMotorcycles
                )}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default SavedMotorcycles;
