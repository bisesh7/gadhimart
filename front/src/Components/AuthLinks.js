import React, { useContext, Fragment, useEffect, useState } from "react";
import {
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
} from "reactstrap";
import {
  handleSignOut,
  isEmpty,
  profileDropdownStyle,
  createNewMessageNotification,
} from "../methods";
import { Link } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import socketIOClient from "socket.io-client";
import { useToasts } from "react-toast-notifications";
import { SocketContext } from "../Contexts/SocketContext";
import newNotificationSVG from "../icons/notification-new.svg";
import profileSVG from "../icons/account.svg";
import inboxSVG from "../icons/email.svg";
import notificationSVG from "../icons/bell.svg";
import savedCarSVG from "../icons/directions_car-24px.svg";
import savedSearchesSVG from "../icons/bestSearches.svg";
import sellSVG from "../icons/sell.svg";
import logoutSVG from "../icons/logout.svg";
import { getEndPoint } from "../config";

const AuthLinks = (props) => {
  // getting the auth from the AuthContext
  const { auth, dispatch } = useContext(AuthContext);

  const { socketDetail } = useContext(SocketContext);

  // Notifications: For new notifications
  const { addToast } = useToasts();

  const [hasNotifications, setHasNotifications] = useState(
    props.hasNotifications
  );

  useEffect(() => {
    setHasNotifications(props.hasNotifications);
  }, [props.hasNotifications]);

  useEffect(() => {
    let socket = socketDetail.socket;

    // If user refreshes the page socket will be
    if (socket === null) {
      socket = socketIOClient(getEndPoint());
    }

    if (auth.isAuthenticated) {
      createNewMessageNotification(
        auth.user.id,
        socket,
        props,
        addToast,
        setHasNotifications
      );
    }

    // When component unmount socket will be off Important
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [auth]);

  return (
    <Fragment>
      <UncontrolledDropdown className="profile-dropdown" nav inNavbar>
        <DropdownToggle nav>
          {hasNotifications ? (
            <span className="notification-circle">
              <img
                className="pb-1"
                src={newNotificationSVG}
                width="20"
                alt=""
              />
            </span>
          ) : (
            <span className="i-circle">
              {isEmpty(auth.user) ? "R" : auth.user.name[0].toUpperCase()}
            </span>
          )}
          &nbsp; &#9660;
        </DropdownToggle>
        <DropdownMenu right>
          <Link style={profileDropdownStyle} to="/profile/listings/car">
            <DropdownItem>
              <img className="mr-2" src={profileSVG} width="20" alt="" />{" "}
              Profile
            </DropdownItem>
          </Link>
          <Link style={profileDropdownStyle} to="/inbox">
            <DropdownItem>
              <img className="mr-2" src={inboxSVG} width="20" alt="" /> Inbox
            </DropdownItem>
          </Link>
          <Link style={profileDropdownStyle} to="/notifications">
            <DropdownItem>
              <img className="mr-2" src={notificationSVG} width="20" alt="" />{" "}
              Notifications
            </DropdownItem>
          </Link>
          <Link style={profileDropdownStyle} to="/savedvehicles/cars">
            <DropdownItem>
              <img className="mr-2" src={savedCarSVG} alt="" />
              Saved vehicles
            </DropdownItem>
          </Link>
          <Link style={profileDropdownStyle} to="/savedsearches/cars">
            <DropdownItem>
              <img className="mr-2" src={savedSearchesSVG} width="20" alt="" />{" "}
              Saved Searches
            </DropdownItem>
          </Link>
          <Link style={profileDropdownStyle} to="/sell">
            <DropdownItem>
              <img className="mr-2" src={sellSVG} width="20" alt="" /> Sell my
              vehicle
            </DropdownItem>
          </Link>
          <DropdownItem divider />
          <a
            style={profileDropdownStyle}
            href="notAHref"
            onClick={(e) => {
              e.preventDefault();
              handleSignOut(e, dispatch);
            }}
          >
            <DropdownItem>
              <img className="mr-2" src={logoutSVG} width="20" alt="" /> Sign
              out
            </DropdownItem>
          </a>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Fragment>
  );
};

export default AuthLinks;
