import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import {
  clearCarDetailsInSessionStorage,
  createFilterContent,
  createQSFromFilters,
  setAuthStatus,
} from "../../methods";
import SavedSearchesSidebar from "./SavedSearchesSidebar";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import FilterCollapseComponent from "./FilterCollapse";
import { AuthContext } from "../../Contexts/AuthContext";
import savedVehicleSVG from "../../icons/money.svg";
import deleteSVG from "../../icons/cross.svg";

const SavedCarSearches = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  const [carSearchesListGroupItems, setCarSearchesListGroupItems] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleShowResult = (listing) => {
    let make = listing.filters["carMakeSelected"];
    let model = listing.filters["carModelSelected"];
    let qs = createQSFromFilters(listing.filters, "Car");

    props.history.push(`/cars/${make}/${model}${qs}`);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/savedSearch/getSavedCarSearches", { valid: "VaLId289" })
      .then((res) => {
        if (res.data.success) {
          let carSearchesListGroupItems = [];
          res.data.listings.forEach((listing, key) => {
            let { filterContent, numberOfFilters } = createFilterContent(
              listing.filters,
              "Car"
            );

            const listGroupItem = (
              <ListGroupItem className="mb-2 preview">
                <Row>
                  <Col sm="11">
                    <ListGroupItemHeading className="text-muted">
                      <strong>
                        {listing.filters.carMakeSelected === "A"
                          ? `All Makes`
                          : listing.filters.carModelSelected === "A"
                          ? `${listing.filters.carMakeSelected}`
                          : `${listing.filters.carMakeSelected} ${listing.filters.carModelSelected}`}
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
                            console.log(res.data);
                            carSearchesListGroupItems = carSearchesListGroupItems.filter(
                              (item) => item.key != key
                            );
                            setCarSearchesListGroupItems(
                              carSearchesListGroupItems
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

            carSearchesListGroupItems.push({ key, item: listGroupItem });
          });

          setCarSearchesListGroupItems(carSearchesListGroupItems);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const noCarsSearchesSaved = (
    <Jumbotron>
      <img src={savedVehicleSVG} width="100" alt="" />
      <h1 className="display-4">You have no car searches saved yet!</h1>
      <p className="lead">
        Start saving car searches by taping the save search icon on your
        favourite vehicle searches.
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
  );

  const carsSearchSaved = (
    <ListGroup>
      {carSearchesListGroupItems.map((cSLGT) => cSLGT.item)}
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
                ) : carSearchesListGroupItems.length >= 1 ? (
                  carsSearchSaved
                ) : (
                  noCarsSearchesSaved
                )}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default SavedCarSearches;
