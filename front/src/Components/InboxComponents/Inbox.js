import React, { useEffect, Fragment, useState, useContext } from "react";
import {
  Container,
  Jumbotron,
  Button,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import PropagateLoader from "react-spinners/PropagateLoader";
import InboxPictureCollapse from "../InboxComponents/InboxPictureCollapse";
import MessageBox from "../InboxComponents/MessageBox";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { SocketContext } from "../../Contexts/SocketContext";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import deleteSVG from "../../icons/cross.svg";
import multimediaSVG from "../../icons/multimedia.svg";
import viewsSVG from "../../icons/visibility.svg";

const host = window.location.hostname;
const ENDPOINT = "http://" + host + ":5000";
let socket;
const Inbox = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  const [chatSessionsListGroups, setChatSessionsListGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [chatSession, setChatSession] = useState({});
  const [datas, setDatas] = useState([]);
  const [activeKey, setActiveKey] = useState(null);

  const { socketDetail } = useContext(SocketContext);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [smallWindow, setSmallWindow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const deleteConfirm = (
    currentUser,
    otherUser,
    otherUserName,
    adTitle,
    listingId,
    vehicleType,
    uniqueId,
    key,
    cb
  ) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this chat session?</p>
            <Button color="secondary" onClick={onClose}>
              No
            </Button>
            <Button
              color="danger"
              onClick={() => {
                setDeleting(true);
                axios
                  .post("/api/message/delete", {
                    uniqueId,
                    valid: "ValId256",
                  })
                  .then(() => {
                    // Add new notification for the other user
                    axios
                      .post("/api/notification/new", {
                        kind: "chatSessionDeleted",
                        valid: "VaLid223",
                        data: {
                          deletedBy: auth.user.id,
                          usersInvolved: [
                            {
                              currentUser: true,
                              id: currentUser,
                              name: auth.user.name,
                            },
                            {
                              currentUser: false,
                              id: otherUser,
                              name: otherUserName,
                            },
                          ],
                          adTitle,
                          listingId,
                          vehicleType,
                        },
                      })
                      .then(() => {
                        // If user is active set toast notification for him
                        socket.emit(
                          "chatSessionDeleted",
                          {
                            deletedBy: auth.user.name,
                            to: otherUser,
                          },
                          function (confirmation) {
                            if (confirmation) {
                              cb();
                            }
                          }
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        setDeleting(false);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    setDeleting(false);
                  });
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

  // Initializing the socket
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

  // Here we get all the datas needed for the chat sessions
  useEffect(() => {
    setLoading(true);
    axios
      // First getting all the messages
      .post("/api/message/getAllMessages", { valid: "VaLid@2342" })
      .then((chatSessionRes) => {
        let otherUsers = [];
        let promises = [];
        let datas = [];
        let chatSessions = [];

        const getUsers = (usersInvolved) => {
          const currentUser = auth.user.id;
          const otherUser =
            usersInvolved[0] === currentUser
              ? usersInvolved[1]
              : usersInvolved[0];
          return { currentUser, otherUser };
        };

        /**
         * Since there will be different axios calls to be done for different chatsession
         * We add all the axios calls to promises list.
         * We use the promises list to make all the axios call later
         */

        for (let i = 0; i < chatSessionRes.data.chatSessions.length; i++) {
          const {
            usersInvolved,
            listingId,
            uniqueId,
            vehicleType,
          } = chatSessionRes.data.chatSessions[i];
          const id = chatSessionRes.data.chatSessions[i]._id;
          const otherUser = getUsers(usersInvolved).otherUser;
          if (vehicleType === "Car") {
            promises.push(
              axios
                .post(`/api/car/getListingByID/${listingId}`, {
                  valid: process.env.REACT_APP_API_KEY,
                })
                .then((listingResponse) => {
                  chatSessions.push({
                    vehicle: listingResponse.data.listing.carDetails,
                    vehicleType,
                    listingId: listingResponse.data.listing._id,
                    uniqueId,
                    id,
                    usersInvolved,
                    currentUser: auth.user,
                  });
                })
            );
          } else if (vehicleType === "Motorcycle") {
            promises.push(
              axios
                .post(`/api/motorcycle/getListingByID/${listingId}`, {
                  valid: process.env.REACT_APP_API_KEY,
                })
                .then((listingResponse) => {
                  chatSessions.push({
                    vehicle: listingResponse.data.listing.details,
                    vehicleType,
                    listingId: listingResponse.data.listing._id,
                    uniqueId,
                    id,
                    usersInvolved,
                    currentUser: auth.user,
                  });
                })
            );
          }
          promises.push(
            axios
              .post(`/api/users/get/${otherUser}`, {
                valid: process.env.REACT_APP_API_KEY,
              })
              .then((response) => {
                // do something with response
                otherUsers.push({
                  userDetail: response.data.userDetail,
                  uniqueId,
                });
              })
          );
        }

        // Call all the axios calls in the promises then set the datas
        //  needed for each chat sessions
        Promise.all(promises).then(() => {
          console.log(chatSessions);
          for (let i = 0; i < chatSessions.length; i++) {
            let data = {};

            data.uniqueId = chatSessions[i].uniqueId;
            data.id = chatSessions[i].id;
            const { usersInvolved } = chatSessions[i];
            const { otherUser, currentUser } = getUsers(usersInvolved);

            data.currentUser = currentUser;
            data.currentUserName = chatSessions[i].currentUser.name;
            const otherUserDetail = otherUsers.find(
              (user) => user.uniqueId === chatSessions[i].uniqueId
            );
            data.otherUser = otherUser;
            data.otherUserName = otherUserDetail.userDetail.name;
            data.otherUserProfilePicture =
              otherUserDetail.userDetail.profilePicturePath;
            data.messageReadCanBeSeen =
              otherUserDetail.userDetail.messageReadCanBeSeen;
            data.currentUserProfilePicture =
              chatSessions[i].currentUser.profilePicturePath;

            data.vehicleType = chatSessions[i].vehicleType;
            data.mainPicture = chatSessions[i].vehicle.mainPicture;

            data.model =
              chatSessions[i].vehicleType === "Car"
                ? chatSessions[i].vehicle.carModelSelected
                : chatSessions[i].vehicle.model;
            data.make =
              chatSessions[i].vehicleType === "Car"
                ? chatSessions[i].vehicle.carMakeSelected
                : chatSessions[i].vehicle.make;

            data.adTitle = chatSessions[i].vehicle.adTitle;
            data.backUpMainPicture =
              chatSessions[i].vehicle.picturesToBeUploadedMeta[0].fileUrl;
            data.listingId = chatSessions[i].listingId;

            datas.push(data);
          }
          setDatas(datas);
          setLoading(false);
        });
      });
  }, [auth]);

  // Create tlisti groups of all the chat sessions from the datas
  useEffect(() => {
    const length = datas.length;
    let chatSessionsListGroups = [];

    for (let x = 0; x < length; x++) {
      const key = x;
      try {
        const {
          adTitle,
          backUpMainPicture,
          make,
          model,
          currentUser,
          currentUserProfilePicture,
          currentUserName,
          mainPicture,
          messageReadCanBeSeen,
          otherUser,
          otherUserName,
          otherUserProfilePicture,
          uniqueId,
          listingId,
          vehicleType,
          id,
        } = datas[x];

        const listGroup = (
          <ListGroupItem
            key={key}
            className="preview mb-3"
            active={activeKey === key}
          >
            <Row>
              <Col xs="10">
                <ListGroupItemHeading>
                  {make === "Other" ? adTitle : make}{" "}
                  {model === "Other" ? null : model}
                </ListGroupItemHeading>{" "}
              </Col>
              <Col xs="2">
                <a
                  href="delete"
                  onClick={(e) => {
                    e.preventDefault();

                    deleteConfirm(
                      currentUser,
                      otherUser,
                      otherUserName,
                      adTitle,
                      listingId,
                      vehicleType,
                      uniqueId,
                      key,
                      // send call back which is executed after sever side is complete
                      () => {
                        // set active chat session to none if this current chat session is deleted
                        if (
                          typeof chatSession.uniqueId !== "undefined" &&
                          chatSession.uniqueId === uniqueId
                        ) {
                          setChatSession({});
                        }
                        chatSessionsListGroups = chatSessionsListGroups.filter(
                          (lg) => lg.key !== key
                        );
                        setChatSessionsListGroups(chatSessionsListGroups);
                        setDeleting(false);
                      }
                    );
                  }}
                >
                  <img
                    src={deleteSVG}
                    className="lightenOnHover pb-2"
                    width="16"
                    alt="X"
                  />
                </a>
              </Col>
            </Row>

            <Row>
              <Col xs="10">
                <ListGroupItemText>
                  {" "}
                  <span className="heading">User</span>: {otherUserName}{" "}
                </ListGroupItemText>
              </Col>
              <Col xs="2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    const uniqueChatSession = {
                      uniqueId,
                      messageReadCanBeSeen,
                      currentUser,
                      currentUserName,
                      otherUserProfilePicture,
                      currentUserProfilePicture,
                      otherUser,
                      otherUserName,
                      key,
                      vehicleType,
                      listingId,
                      adTitle,
                      make,
                      model,
                      id,
                    };
                    // chat session is the current chat session displayed by the user
                    setChatSession(uniqueChatSession);
                    // If small screen we dont have space so we display ony one at a time
                    // chat session or list of chat sessions
                    if (smallWindow) {
                      setShowMessage(true);
                    }
                  }}
                >
                  <img
                    src={viewsSVG}
                    className="lightenOnHover pb-2"
                    width="16"
                    alt="X"
                  />
                </a>
              </Col>
            </Row>
            <InboxPictureCollapse
              mainPicture={mainPicture !== "" ? mainPicture : backUpMainPicture}
              style={
                activeKey === key
                  ? { textDecoration: "none", color: "white" }
                  : { textDecoration: "none" }
              }
            />
          </ListGroupItem>
        );

        chatSessionsListGroups.push({ key, lg: listGroup });
      } catch (err) {
        console.log(err);
      }
    }

    setChatSessionsListGroups(chatSessionsListGroups);
  }, [datas, activeKey]);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 768) {
      setSmallWindow(true);
    } else {
      setSmallWindow(false);
    }
  }, [windowWidth]);

  // If there is no conversation of the user so related information.
  const noConversations = (
    <Fragment>
      <Jumbotron>
        <img src={multimediaSVG} width="100" alt="" />
        <h1 className="display-4">Start a conversation!</h1>
        <p className="lead">
          Go to the vehicle's ad page and tap "Message" to contact a seller. All
          your messages will appear here.
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
            Find a vehicle
          </Button>
        </p>
      </Jumbotron>
    </Fragment>
  );

  const conversations = (
    <Fragment>
      <Row>
        <Col md="4" sm="12" hidden={smallWindow && showMessage}>
          <h4 className="mb-3">My Inbox</h4>
          <div className="inboxListGroup ">
            <ListGroup>
              {chatSessionsListGroups.map((chatSessions) => chatSessions.lg)}
            </ListGroup>
          </div>
        </Col>
        <Col md="8" sm="12" hidden={smallWindow && !showMessage}>
          <MessageBox
            chatSession={chatSession}
            setActiveKey={setActiveKey}
            smallWindow={smallWindow}
            setShowMessage={setShowMessage}
          />
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Fragment>
      {/* If the user is not authenticated do not return anything */}
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
            ) : chatSessionsListGroups.length >= 1 ? (
              conversations
            ) : (
              noConversations
            )}
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default Inbox;
