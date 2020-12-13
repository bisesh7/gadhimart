import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Fragment,
} from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
  Jumbotron,
  ModalHeader,
  ModalBody,
  Modal,
  Alert,
} from "reactstrap";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";
import socketIOClient from "socket.io-client";
import { SocketContext } from "../../Contexts/SocketContext";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import ReportUser from "./ReportUser";
import viewsSVG from "../../icons/visibility.svg";
import multimediaSVG from "../../icons/multimedia.svg";

const host = window.location.hostname;
const ENDPOINT = "http://" + host + ":5000";
let socket;

// CSS for the UI Messages, ScrollToBottom does not support style
// So css is created this way
const ROOT_CSS = css({
  height: "64vh",
});

const UNBLOCK_ROOT_CSS = css({
  height: "54vh",
});

const SMALL_ROOT_CSS = css({
  height: "60vh",
});

const SMALL_UNBLOCK_ROOT_CSS = css({
  height: "50vh",
});

const MessageBox = (props) => {
  const [messageRows, setMessageRows] = useState([]);
  // New message
  const [newMessage, setNewMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Report/block modal
  const [reportBlockModal, setReportBlockModal] = useState(false);
  const [reportUserActive, setReportUserActive] = useState(false);
  const [blockedOtherUser, setBlockedOtherUser] = useState(false);
  const [blockedUser, setBlockedUser] = useState(false);

  const toggleReportBlockModal = () => {
    setReportBlockModal(!reportBlockModal);
    setReportUserActive(false);
  };

  useEffect(() => {
    console.log(props.chatSession);
    if (typeof props.chatSession.key !== "undefined") {
      props.setActiveKey(props.chatSession.key);
    }

    setLoading(true);
    if (typeof props.chatSession.uniqueId !== "undefined") {
     

      axios
        .post("/api/message/getMessage", {
          valid: "VaLid@2342",
          uniqueId: props.chatSession.uniqueId,
        })
        .then((res) => {
          const promises = [];
          promises.push(
            axios
              .post("/api/blockUser/checkOtherUserIsBlocked", {
                valid: "ValID531",
                otherUser: props.chatSession.otherUser,
              })
              .then((res) => {
                if (res.data.success) {
                  setBlockedOtherUser(res.data.otherUserBlocked);
                }
              })
              .catch((err) => {
                throw err;
              })
          );
          promises.push(
            axios
              .post("/api/blockUser/checkUserIsBlocked", {
                valid: "ValID531",
                otherUser: props.chatSession.otherUser,
              })
              .then((res) => {
                if (res.data.success) {
                  setBlockedUser(res.data.userBlocked);
                }
              })
              .catch((err) => {
                throw err;
              })
          );

          Promise.all(promises)
            .then(() => {
              setLoading(false);
              setMessages(res.data.chatSession.messages);
            })
            .catch((err) => {
              console.log(err);
              alert("Error occurred");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.chatSession]);

  const { socketDetail } = useContext(SocketContext);

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

  const createLeftSideMessage = (messageDetail, user) => {
    return (
      <Row className="mb-2">
        <Col xs="1">
          <img
            src={user.profilePicture}
            width="25"
            alt="sender's profile picture"
          />
        </Col>
        <Col xs="11">
          {" "}
          <div className="ml-2 chatMessage">
            <span>&nbsp; {messageDetail.message} &nbsp;</span>
          </div>
        </Col>
      </Row>
    );
  };

  const createRightSideMessage = (messageDetail, user) => {
    return (
      <Row className="mb-4 pr-4">
        <Col xs="10">
          {" "}
          <div className="float-right">
            <span className="ml-auto chatMessage">
              &nbsp; {messageDetail.message} &nbsp;
            </span>{" "}
            <br />
            {props.chatSession.messageReadCanBeSeen && messageDetail.seen ? (
              <span className="float-right">seen</span>
            ) : null}
          </div>
        </Col>
        <Col xs="2">
          <img
            src={user.profilePicture}
            width="25"
            alt="sender's profile picture"
          />
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    const messageRows = [];

    if (Object.keys(props.chatSession).length >= 1) {
      // get the messages where sender is current user
      const currentUserIdSenderMessages = messages.filter(
        (m) =>
          m.sender === props.chatSession.currentUser &&
          m.seenDetail.seen === true
      );

      // latest id of message where sender is current user
      let latestId = null;

      // Only check for latest messsage if there is messages sent by current user
      if (currentUserIdSenderMessages.length >= 1) {
        // Get the latest message where sender is current user
        const latestMessage = currentUserIdSenderMessages.reduce(function (
          r,
          a
        ) {
          return r.date > a.date ? r : a;
        });

        // latest id of message where sender is current user
        latestId = latestMessage.id;
      }

      messages.forEach((message) => {
        if (message.sender === props.chatSession.currentUser) {
          messageRows.push(
            createRightSideMessage(
              {
                message: message.message,
                // Only show seen for the latest current user message
                seen: message.id === latestId ? message.seenDetail.seen : false,
                date: message.date,
              },
              { profilePicture: props.chatSession.currentUserProfilePicture }
            )
          );
        } else {
          messageRows.push(
            createLeftSideMessage(
              {
                message: message.message,
                seen: message.seenDetail.seen,
                date: message.date,
              },
              { profilePicture: props.chatSession.otherUserProfilePicture }
            )
          );
        }
      });
    }

    setMessageRows(messageRows);
  }, [props.chatSession, messages]);

  useEffect(() => {
    // When we get the message server emits uniqueId for the conversation
    // and sneds the message details
    socket.on(props.chatSession.uniqueId, ({ res, success }) => {
      if (success !== false) {
        // If the message was sent by current user, message
        // needs to be displayed in the right side
        if (res.sender === props.chatSession.currentUser) {
          setMessageRows([
            ...messageRows,
            createRightSideMessage(
              {
                message: res.message,
                seen: res.seenDetail.seen,
                date: res.date,
              },
              { profilePicture: props.chatSession.currentUserProfilePicture }
            ),
          ]);
        } else {
          // If the message was sent by other user, message
          // needs to be displayed in the left side
          setMessageRows([
            ...messageRows,
            createLeftSideMessage(
              {
                message: res.message,
                seen: res.seenDetail.seen,
                date: res.date,
              },
              { profilePicture: props.chatSession.otherUserProfilePicture }
            ),
          ]);
        }
      }
    });
  }, [socket, props.chatSession, messageRows]);

  // Function to send the message to the server using the socketio
  const sendMessage = () => {
    if (newMessage !== "") {
      socket.emit("messageFromChat", {
        uniqueId: props.chatSession.uniqueId,
        sender: props.chatSession.currentUser,
        reciever: props.chatSession.otherUser,
        senderName: props.chatSession.currentUserName,
        message: newMessage,
        adTitle: props.chatSession.adTitle,
        make: props.chatSession.make,
        model: props.chatSession.model,
      });
      setNewMessage("");
    }
  };

  const noChatSession = (
    <Fragment>
      <Jumbotron>
        <img src={multimediaSVG} width="100" alt="" />
        <h1 className="display-3">Select a converstation!</h1>
        <p className="lead">
          Click on <img src={viewsSVG} width="16" alt="" /> in the inbox to have
          a converstation.
        </p>
      </Jumbotron>
    </Fragment>
  );

  const handleUnblock = () => {
    axios
      .post("/api/blockUser/unblock", {
        valid: "ValID531",
        otherUser: props.chatSession.otherUser,
      })
      .then((res) => {
        if (res.data.success) {
          setBlockedOtherUser(false);
        }
      });
  };

  // Initial modal body
  const intitalOptionReportBlock = (
    <div>
      {" "}
      <br />
      {blockedOtherUser ? (
        <Button
          color="primary"
          className="mt-3"
          onClick={(e) => {
            e.preventDefault();
            handleUnblock();
          }}
        >
          Unblock User
        </Button>
      ) : (
        <Button
          color="danger"
          onClick={(e) => {
            e.preventDefault();
            axios
              .post("/api/blockUser", {
                valid: "ValID531",
                otherUser: props.chatSession.otherUser,
              })
              .then((res) => {
                setBlockedOtherUser(true);
                toggleReportBlockModal();
              })
              .catch((err) => {
                console.log(err);
                alert("Blocking user failed.");
              });
          }}
        >
          Block User
        </Button>
      )}
      <br />
      <Button
        color="secondary"
        className="mt-3"
        onClick={(e) => {
          e.preventDefault();
          setReportUserActive(true);
        }}
      >
        Report User
      </Button>
    </div>
  );

  const chatSession = (
    <div>
      {props.smallWindow ? (
        <div className="d-flex justify-content-between">
          <a
            href="back"
            onClick={(e) => {
              e.preventDefault();
              props.setShowMessage(false);
            }}
            className="mb-4"
          >
            <small>&#5130; Back</small>
          </a>
          <small className="heading pt-1">
            {typeof props.chatSession.otherUserName !== "undefined"
              ? props.chatSession.otherUserName.length > 12
                ? props.chatSession.otherUserName.substring(0, 12) + "..."
                : props.chatSession.otherUserName
              : null}
          </small>
          <a
            href="action"
            onClick={(e) => {
              e.preventDefault();
              toggleReportBlockModal();
            }}
            className="lightenOnHover heading"
          >
            <h4>&#8230;</h4>
          </a>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <span className="heading pt-1">
            {props.chatSession.otherUserName}
          </span>
          <a
            href="action"
            onClick={(e) => {
              e.preventDefault();
              toggleReportBlockModal();
            }}
            className="lightenOnHover heading"
          >
            <h4>&#8230;</h4>
          </a>
        </div>
      )}
      <Modal
        isOpen={reportBlockModal}
        toggle={toggleReportBlockModal}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleReportBlockModal}>
          <img
            src={props.chatSession.otherUserProfilePicture}
            width="50"
            alt="sender's profile picture"
          />
          &nbsp;
          <small>
            {typeof props.chatSession.otherUserName !== "undefined"
              ? props.chatSession.otherUserName.length > 12
                ? props.chatSession.otherUserName.substring(0, 12) + "..."
                : props.chatSession.otherUserName
              : null}
          </small>
        </ModalHeader>
        <ModalBody>
          {reportUserActive ? (
            <ReportUser
              setReportUserActive={setReportUserActive}
              chatSession={props.chatSession.id}
              reportedUser={props.chatSession.otherUser}
              reportedBy={props.chatSession.currentUser}
              listingId={props.chatSession.listingId}
              vehicleType={props.chatSession.vehicleType}
              toggleReportBlockModal={toggleReportBlockModal}
            />
          ) : (
            intitalOptionReportBlock
          )}
        </ModalBody>
      </Modal>
      <ScrollToBottom
        className={
          props.smallWindow
            ? blockedOtherUser
              ? SMALL_UNBLOCK_ROOT_CSS
              : SMALL_ROOT_CSS
            : blockedOtherUser
            ? UNBLOCK_ROOT_CSS
            : ROOT_CSS
        }
      >
        <div style={{ overflowX: "hidden" }}>{messageRows}</div>
      </ScrollToBottom>

      {blockedOtherUser ? (
        <div className="mb-4">
          <Alert color="info">
            You have blocked the conversation with this user. You will not be
            able to send messages to each other.
          </Alert>
          <Button
            color="primary"
            outline
            block
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleUnblock();
            }}
          >
            Unblock
          </Button>
        </div>
      ) : blockedUser ? (
        <div className="mb-4">
          <Alert color="info">
            This user have blocked the conversation with you. You will not be
            able to send messages to each other.
          </Alert>
        </div>
      ) : (
        <InputGroup className="mt-4 mb-4">
          <Input
            placeholder="Type your message here."
            type="text"
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            value={newMessage}
          />
          <InputGroupAddon addonType="append">
            <Button
              color="primary"
              type="button"
              onClick={() => {
                sendMessage();
              }}
            >
              Send
            </Button>
          </InputGroupAddon>
        </InputGroup>
      )}
    </div>
  );

  return (
    <div>
      {Object.keys(props.chatSession).length === 0 ? (
        noChatSession
      ) : loading ? (
        <div className="d-flex justify-content-center">
          <PropagateLoader size={15} color={"#1881d8"} loading={true} />
          <br />
          <br />
        </div>
      ) : (
        chatSession
      )}
    </div>
  );
};

export default MessageBox;
