import React, { useContext, useEffect } from "react";
import {
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { AuthContext } from "../../Contexts/AuthContext";
import {
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../../methods";
import NavbarComponent from "../HomeComponents/Navbar";

const Help = (props) => {
  const { auth, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      promiseCheckAuth()
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    clearCarDetailsInSessionStorage();
  }, []);

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div>
      <NavbarComponent history={props.history} location={props.location} />
      <Container className="mt-5">
        <InputGroup style={{ width: "50%" }}>
          <InputGroupAddon addonType="prepend">🔍</InputGroupAddon>
          <Input
            type="text"
            placeholder="Ask a question or search by keyword"
          />
          <InputGroupAddon addonType="append">🔍</InputGroupAddon>
        </InputGroup>
        <Nav className="mt-5" tabs>
          <NavItem>
            <NavLink
              href="/help/basics"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/help/basics");
              }}
              active={
                props.location.pathname === "/help" ||
                props.location.pathname === "/help/basics"
              }
            >
              <span className="heading">Basics</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="/help/technicalIssues"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/help/technicalIssues");
              }}
              active={props.location.pathname === "/help/technicalIssues"}
            >
              <span className="heading">Technical Issues</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="/help/policies"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/help/policies");
              }}
              active={props.location.pathname === "/help/policies"}
            >
              <span className="heading">Policies</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="/help/safety"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/help/safety");
              }}
              active={props.location.pathname === "/help/safety"}
            >
              <span className="heading">Safety</span>{" "}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="/help/contactUs"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/help/contactUs");
              }}
              active={props.location.pathname === "/help/contactUs"}
            >
              <span className="heading">Contact Us</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </div>
  );
};

export default Help;
