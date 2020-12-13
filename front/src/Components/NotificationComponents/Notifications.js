import React, { useEffect, Fragment, useState, useContext } from "react";
import {
  Container,
  Jumbotron,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import {
  clearCarDetailsInSessionStorage,
  createFilterContent,
  createQSFromFilters,
  setAuthStatus,
} from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import NotificationCollapse from "./NotificationCollapse";
import deleteSVG from "../../icons/cross.svg";
import notificationSVG from "../../icons/notification_bell.svg";

const Notifications = (props) => {
  // Delete car details stored in session storage if exists
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  // List group items of all the notifications
  const [notificationListGroupItems, setNotificationListGroupItems] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Getting all th notifications of the current user
    axios
      .post("/api/notification/getNotifications", {
        userId: auth.user.id,
        valid: "ValID2334",
      })
      .then((res) => {
        const { notifications } = res.data;
        let notificationListGroupItems = [];

        notifications.forEach((notification, key) => {
          // Each notification has a kind. Each kind of notification has differnet content and title.
          let title,
            content = null;

          switch (notification.kind) {
            case "newMessage":
              title = "New message";
              content = (
                <div>
                  Ad Title: {notification.data.adTitle} <br />
                  {notification.data.senderName}: {notification.data.message}{" "}
                  <br />
                  Make: {notification.data.make} <br />
                  Model: {notification.data.model}
                  <br />
                  <Button
                    className="mt-3"
                    color="primary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/inbox");
                    }}
                  >
                    Inbox
                  </Button>
                </div>
              );
              break;
            case "listedCarDeleted":
              title = "Saved car was deleted";
              content = (
                <div>
                  Message: {notification.data.message} <br />
                  Listed By: {notification.data.listerName} <br />
                  Car Title: {notification.data.carTitle} <br />
                  Make: {notification.data.carMake} <br />
                  Model: {notification.data.carModel} <br />
                </div>
              );
              break;
            case "chatSessionDeleted":
              title = "Chat session was deleted";
              content = (
                <div>
                  Message: {notification.data.message} <br />
                  Listed By: {notification.data.lister} <br />
                  Deleted By: {notification.data.deletedBy} <br />
                  Car Title: {notification.data.carTitle} <br />
                  Make: {notification.data.carMake} <br />
                  Model: {notification.data.carModel} <br />
                </div>
              );
              break;
            case "newCarsListed":
            case "newMotorcyclesListed":
              title =
                notification.kind === "newCarsListed"
                  ? "New cars has been listed"
                  : "New motorcycle has been listed";
              const filters = notification.data.filters;
              let filterWithNumbers = createFilterContent(filters);
              let { filterContent, numberOfFilters } = filterWithNumbers;
              console.log(filterWithNumbers);
              content = (
                <div>
                  Message: {notification.data.message} <br />
                  Car:{" "}
                  {notification.kind === "newCarsListed"
                    ? filters.carMakeSelected === "a"
                      ? `All Makes`
                      : filters.carModelSelected === "a"
                      ? filters.carMakeSelected
                      : `${filters.carMakeSelected} ${filters.carModelSelected}`
                    : filters.carMakeSelected === "a"
                    ? `All Makes`
                    : filters.model === "a"
                    ? `${filters.make}`
                    : `${filters.make} ${filters.model}`}
                  <br />
                  {numberOfFilters >= 1 ? (
                    <span>
                      Filters: {filterContent}
                      <br />
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    color="primary"
                    onClick={(e) => {
                      if (notification.kind === "newCarsListed") {
                        let make = filters["carMakeSelected"];
                        let model = filters["carModelSelected"];
                        let qs = createQSFromFilters(filters, "Car");

                        props.history.push(`/cars/${make}/${model}${qs}`);
                      } else if (notification.kind === "newMotorcyclesListed") {
                        let make = filters["make"];
                        let model = filters["model"];
                        let qs = createQSFromFilters(filters, "Motorcycle");

                        props.history.push(`/motorcycle/${make}/${model}${qs}`);
                      }
                    }}
                    className="mt-2"
                  >
                    View
                  </Button>
                </div>
              );
              break;
            case "listedMotorcycleDeleted":
              title = "Saved motorcycle was deleted";
              content = (
                <div>
                  Message: {notification.data.message} <br />
                  Listed By: {notification.data.motorcycleListerName} <br />
                  Car Title: {notification.data.adTitle} <br />
                  Make: {notification.data.make} <br />
                  Model: {notification.data.model} <br />
                </div>
              );
              break;
            default:
          }

          const getDate = (d) => {
            let date = new Date(d);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            return `${day}/${month}/${year}`;
          };

          let notificationListGroupItem = (
            <ListGroupItem className="mb-2 preview">
              <ListGroupItemHeading>
                <Row>
                  <Col xs="10">{title}</Col>
                  <Col xs="2">
                    <a
                      href="delete"
                      className="float-right"
                      onClick={(e) => {
                        setDeleting(true);
                        e.preventDefault();

                        axios
                          .post("/api/notification/delete", {
                            id: notification._id,
                            valid: "ValID2334",
                          })
                          .then((res) => {
                            notificationListGroupItems = notificationListGroupItems.filter(
                              (item) => item.key != key
                            );
                            setNotificationListGroupItems(
                              notificationListGroupItems
                            );
                            setDeleting(false);
                          })
                          .catch((err) => {
                            console.log(err);
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
              </ListGroupItemHeading>
              <ListGroupItemText>
                Date: {getDate(notification.date)}
              </ListGroupItemText>
              <ListGroupItemText>
                <NotificationCollapse content={content} />
              </ListGroupItemText>
            </ListGroupItem>
          );

          notificationListGroupItems.push({
            key,
            date: notification.date,
            notificationListGroupItem,
          });
        });

        // Sorting according to the date
        notificationListGroupItems.sort(function (a, b) {
          var c = new Date(a.date);
          var d = new Date(b.date);
          return d - c;
        });
        setNotificationListGroupItems(notificationListGroupItems);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          window.location.replace("/");
        } else if (err.response.status === 500) {
          props.history.push("/");
        }
        setLoading(false);
      });
  }, [auth]);

  // If no notifications exists for the user then show following UI
  const noNotifications = (
    <Fragment>
      <Jumbotron>
        <img src={notificationSVG} width="100" alt="" />
        <h1 className="display-4">You have no notifications yet!</h1>
        <p className="lead">
          Save searches you are interested in to get notified about new
          listings.
        </p>
        <hr className="my-2" />
        <p className="lead mt-4">
          <Button color="primary">Find a vehicle</Button>
        </p>
      </Jumbotron>
    </Fragment>
  );

  const notifications = (
    <Fragment>
      {/* Clearing all the notifications */}
      <div className="mb-3">
        <a
          href="/notifications/clear"
          color="danger"
          onClick={(e) => {
            setDeleting(true);
            e.preventDefault();
            axios
              .post("/api/notification/deleteAll", {
                userId: auth.user.id,
                valid: "ValID2334",
              })
              .then((res) => {
                setNotificationListGroupItems([]);
                setDeleting(false);
              })
              .catch((err) => {
                if (
                  typeof err.response !== "undefined" &&
                  err.response.status === 500
                ) {
                  alert("Server Error");
                } else if (
                  typeof err.response !== "undefined" &&
                  err.response.status === 400 &&
                  typeof err.response.data !== "undefined" &&
                  err.response.data.success === true
                ) {
                  alert(err.response.data.message);
                } else {
                  console.log(err);
                }
              });
          }}
        >
          Clear all notifications
        </a>{" "}
        <br />
        <small className="heading text-muted">
          Notifications older than 25 days will automatically be cleared.
        </small>
      </div>

      <ListGroup>
        {notificationListGroupItems.map(
          (item) => item.notificationListGroupItem
        )}
      </ListGroup>
    </Fragment>
  );

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="mt-5">
            {loading || deleting ? (
              <div className="d-flex justify-content-center">
                <PropagateLoader size={15} color={"#1881d8"} loading={true} />
                <br />
                <br />
              </div>
            ) : notificationListGroupItems.length >= 1 ? (
              notifications
            ) : (
              noNotifications
            )}
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default Notifications;
