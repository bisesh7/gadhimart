import React, { useState, Fragment, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import AuthLinks from "../AuthLinks";
import NavbarBrandComponent from "../NavbarBrandComponent";
import axios from "axios";
import notificationNewSVG from "../../icons/notification-new.svg";
import customerSupportSVG from "../../icons/contact_support-24px.svg";
import safetyTipSVG from "../../icons/security-24px.svg";
import adviceSVG from "../../icons/idea.svg";
import moment from "moment";

const NavbarComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // getting the auth from the AuthContext
  const { auth } = useContext(AuthContext);

  Navbar.propTypes = {
    light: PropTypes.bool,
    dark: PropTypes.bool,
    fixed: PropTypes.string,
    color: PropTypes.string,
    role: PropTypes.string,
    expand: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    // pass in custom element to use
  };

  NavbarBrand.propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    // pass in custom element to use
  };

  const [hasNotifications, setHasNotifications] = useState(false);
  // Alert old notification notificationAlertModal
  const [notificationAlertModal, setModal] = useState(false);
  const notificationAlertToggle = () => setModal(!notificationAlertModal);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios
        .post("/api/notification/getNotifications", {
          userId: auth.user.id,
          valid: "ValID2334",
        })
        .then((res) => {
          if (res.data.notifications.length) {
            setHasNotifications(true);
            // Show alert to the user about notification not being cleared for 15 day if exists
            for (let i = 0; i < res.data.notifications.length; i++) {
              const date = new Date(res.data.notifications[i].date);
              const today = new Date(Date.now());

              let dateMoment = moment([
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ]);
              let todayMoment = moment([
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              ]);
              const numberOfDays = todayMoment.diff(dateMoment, "days");
              if (numberOfDays >= 15) {
                notificationAlertToggle();
                break;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [auth]);

  const guestLinks = (
    <Fragment>
      <NavItem>
        <NavLink className="nav-link" to="/signIn">
          Sign In
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink className="nav-link" to="/register">
          Register now
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink className="nav-link" to="/sell">
          Sell my vehicle
        </NavLink>
      </NavItem>
    </Fragment>
  );

  return (
    <div>
      <Navbar dark color="faded" className="navbar-custom" expand="md">
        <Container>
          <NavbarBrandComponent />

          {hasNotifications ? (
            <img
              className="pb-1 d-md-none d-lg-none d-xl-none ml-auto mr-3"
              src={notificationNewSVG}
              width="20"
              alt=""
            />
          ) : null}
          <NavbarToggler onClick={toggle} className="mr-2" />
          <Collapse isOpen={isOpen} navbar>
            <Nav
              className="ml-auto navbar-nav"
              style={{ color: "white" }}
              navbar
            >
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>Menu</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    onClick={() => {
                      props.history.push("/help");
                    }}
                  >
                    {" "}
                    <img src={customerSupportSVG} alt="" width="20" /> Help
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      props.history.push("/help/safety#quickSafetyTips");
                    }}
                  >
                    {" "}
                    <img
                      src={adviceSVG}
                      className="pb-2"
                      width="20"
                      alt=""
                    />{" "}
                    Advice
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {auth.isAuthenticated ? (
                <AuthLinks
                  history={props.history}
                  location={props.location}
                  hasNotifications={hasNotifications}
                  setHasNotifications={setHasNotifications}
                />
              ) : (
                guestLinks
              )}
            </Nav>
          </Collapse>
        </Container>
        <Modal isOpen={notificationAlertModal} toggle={notificationAlertToggle}>
          <ModalHeader toggle={notificationAlertToggle}>
            Please check your notifications.
          </ModalHeader>
          <ModalBody>
            Notifications older than 15 days is not cleared in your
            notifcations. Notifcations older than 25 days will be automatically
            cleared.
          </ModalBody>
        </Modal>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
