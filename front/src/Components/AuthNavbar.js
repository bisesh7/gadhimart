import React, { useState, useContext, useEffect } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, Container } from "reactstrap";
import AuthLinks from "./AuthLinks";
import NavbarBrandComponent from "./NavbarBrandComponent";
import { AuthContext } from "../Contexts/AuthContext";
import CarSearchSelect from "./HomeComponents/CarSearchSelect";
import axios from "axios";
import notificationNewSVG from "../icons/notification-new.svg";

const AuthNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, dispatch } = useContext(AuthContext);

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
          console.log(res);
          if (res.data.notifications.length >= 1) {
            setHasNotifications(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [auth]);

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
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <CarSearchSelect c={"auth-nav-select"} history={props.history} />
            <Nav className="ml-auto mt-2 mt-lg-0" navbar>
              <AuthLinks
                history={props.history}
                location={props.location}
                hasNotifications={hasNotifications}
                setHasNotifications={setHasNotifications}
              />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AuthNavbar;
