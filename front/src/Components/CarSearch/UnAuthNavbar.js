/**
 * This component is used in pages where we may or may not need the search select
 * Also this component exist because we need to show vehicle listing page and detail page
 * when user is logged in and also when user is not logged in.
 */

import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  Container,
  NavItem,
} from "reactstrap";
import AuthLinks from "../AuthLinks";
import NavbarBrandComponent from "../NavbarBrandComponent";
import { AuthContext } from "../../Contexts/AuthContext";
import { NavLink } from "react-router-dom";
import CarSearchSelect from "../HomeComponents/CarSearchSelect";
import axios from "axios";
import notificationNewSVG from "../../icons/notification-new.svg";

const UnAuthNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useContext(AuthContext);

  const toggle = () => setIsOpen(!isOpen);

  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios
        .post("/api/notification/getNotifications", {
          userId: auth.user.id,
          valid: "ValID2334",
        })
        .then((res) => {
          if (res.data.notifications.length >= 1) {
            setHasNotifications(true);
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
    </Fragment>
  );

  return (
    <div>
      <Navbar className="navbar-custom" dark expand="lg">
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
            {props.carListView ? null : (
              <CarSearchSelect c={"auth-nav-select"} history={props.history} />
            )}
            <Nav className="ml-auto mt-2 mt-lg-0" navbar>
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
      </Navbar>
    </div>
  );
};

export default UnAuthNavbar;
