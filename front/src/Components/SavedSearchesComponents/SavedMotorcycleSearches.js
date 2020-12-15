import React, { useEffect, useContext, useState, Fragment } from "react";
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  ListGroup,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import {
  clearCarDetailsInSessionStorage,
  setAuthStatus,
  createFilterContent,
  createQSFromFilters,
} from "../../methods";
import SavedSearchesSidebar from "./SavedSearchesSidebar";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import FilterCollapseComponent from "./FilterCollapse";
import PropagateLoader from "react-spinners/PropagateLoader";
import savedVehicleSVG from "../../icons/money.svg";
import deleteSVG from "../../icons/cross.svg";

const SavedMotorcycleSearches = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [
    vehicleSearchesListGroupItems,
    setVehicleSearchesListGroupItems,
  ] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/savedSearch/getSavedMotorcycleSearches", {
        valid: "VaLId289",
      })
      .then((res) => {
        if (res.data.success) {
          let vehicleSearchesListGroupItems = [];
          res.data.listings.forEach((listing, key) => {
            let { filterContent, numberOfFilters } = createFilterContent(
              listing.filters,
              "Motorcycle"
            );

            const listGroupItem = (
              <ListGroupItem className="mb-2 preview">
                <Row>
                  <Col sm="11">
                    <ListGroupItemHeading className="text-muted">
                      <strong>
                        {listing.filters.make === "A"
                          ? `All Makes`
                          : listing.filters.model === "A"
                          ? `${listing.filters.make}`
                          : `${listing.filters.make} ${listing.filters.model}`}
                      </strong>
                    </ListGroupItemHeading>
                  </Col>
                  <Col sm="1">
                    <a
                      href="delete"
                      onClick={(e) => {
                        setDeleting(true);
                        e.preventDefault();
                        axios
                          .post("/api/savedSearch/unsave", {
                            id: listing._id,
                            valid: "VaLId289",
                          })
                          .then((res) => {
                            vehicleSearchesListGroupItems = vehicleSearchesListGroupItems.filter(
                              (item) => item.key != key
                            );
                            setVehicleSearchesListGroupItems(
                              vehicleSearchesListGroupItems
                            );
                            setDeleting(false);
                          })
                          .catch((err) => {
                            console.log(err);
                            setDeleting(false);
                          });
                      }}
                    >
                      <ListGroupItemText>
                        <img
                          src={deleteSVG}
                          className="lightenOnHover"
                          width="16"
                          alt="X"
                        />
                      </ListGroupItemText>
                    </a>
                  </Col>
                </Row>

                {numberOfFilters >= 1 ? (
                  <ListGroupItemText>
                    <div>
                      <FilterCollapseComponent
                        numberOfFilters={numberOfFilters}
                        filterContent={filterContent}
                      />
                    </div>
                  </ListGroupItemText>
                ) : null}

                <ListGroupItemText>
                  <a
                    href="showResults"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowResult(listing);
                    }}
                  >
                    Show results
                  </a>
                </ListGroupItemText>
              </ListGroupItem>
            );

            vehicleSearchesListGroupItems.push({ key, item: listGroupItem });
          });

          setVehicleSearchesListGroupItems(vehicleSearchesListGroupItems);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleShowResult = (listing) => {
    let make = listing.filters["make"];
    let model = listing.filters["model"];
    let qs = createQSFromFilters(listing.filters, "Motorcycle");

    props.history.push(`/motorcycle/${make}/${model}${qs}`);
  };

  const noMotorcycleSearchesSaved = (
    <Jumbotron>
      <img src={savedVehicleSVG} width="100" alt="" />
      <h1 className="display-4">You have no motorcycle searches saved yet!</h1>
      <p className="lead">
        Start saving motorcycle searches by taping the save search icon on your
        favourite vehicle searches.
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
  );

  const motorcycleSearchSaved = (
    <ListGroup>
      {vehicleSearchesListGroupItems.map((cSLGT) => cSLGT.item)}
    </ListGroup>
  );

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="mt-5">
            <Row>
              <Col md="3">
                <SavedSearchesSidebar />
              </Col>

              <Col md="9" className="mt-4 mt-md-0">
                {loading || deleting ? (
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
                ) : vehicleSearchesListGroupItems.length >= 1 ? (
                  motorcycleSearchSaved
                ) : (
                  noMotorcycleSearchesSaved
                )}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default SavedMotorcycleSearches;
