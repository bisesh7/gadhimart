import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Container,
  Row,
  Form,
  FormGroup,
  Col,
  Label,
  Input,
  InputGroup,
  Button,
  InputGroupAddon,
  Alert,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import "../Register.css";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";

const SignIn = (props) => {
  // getting the auth and dispatch from the AuthContext
  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    // For direct request and reloads
    const checkAuth = () => {
      // If the user is logged in then redirect to the homepage
      if (auth.isAuthenticated) {
        setIsAuthenticated(true);
        props.history.push("/");
      } else {
        setCheckingAuth(true);
        axios({
          method: "post",
          url: "/api/auth/checkAuth",
          data: {
            valid: process.env.REACT_APP_API_KEY,
          },
        }).then((res) => {
          console.log(res.data);
          if (res.data.isAuthenticated) {
            setCheckingAuth(false);
            setIsAuthenticated(true);
            props.history.push("/");
          } else {
            setCheckingAuth(false);
            setIsAuthenticated(false);
          }
        });
      }
    };

    // invoke checkAuth to check if the user is currrently logged in to the server
    checkAuth();
  }, [auth]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValidity] = useState(false);
  const [passwordValid, setPasswordValidity] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [alertMessage, setAlertMessage] = useState("");

  // Spinner
  const [signingIn, setSigningIn] = useState(false);

  // Alert
  const [alertVisible, setAlertVisible] = useState(false);

  // Funnction to run when dismissing alert
  const onDismiss = () => {
    setAlertVisible(false);
    setAlertMessage("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValidity(emailRegex.test(e.target.value.toLowerCase()));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    const lowercases = new RegExp("[a-z]");
    const uppercases = new RegExp("[A-Z]");
    const numbers = new RegExp("[0-9]");

    if (
      e.target.value.match(lowercases) &&
      e.target.value.match(uppercases) &&
      e.target.value.match(numbers) &&
      e.target.value.length >= 8
    ) {
      setPasswordValidity(true);
    } else {
      setPasswordValidity(false);
    }
  };

  // Show or hide password
  const showHidePassword = () => {
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const handleSubmit = () => {
    setSigningIn(true);

    axios({
      method: "post",
      url: "/api/auth",
      data: {
        email,
        password,
        valid: process.env.REACT_APP_API_KEY,
      },
    })
      .then((res) => {
        if (res.data.success) {
          // Set is authenticated to true
          dispatch({
            type: "LOGIN_PASS",
            user: res.data.user,
          });
          setSigningIn(false);

          props.history.push("/");
          // console.log(res.data.user);
        }
      })
      .catch((err) => {
        setSigningIn(false);

        if (typeof err.response !== "undefined") {
          if (err.response.status === 400) {
            if (!err.response.data.success) {
              dispatch({
                type: "LOGIN_FAIL",
              });
              setPassword("");
              setAlertMessage(err.response.data.msg);
              setAlertVisible(true);
              setEmailValidity(false);
              setPasswordValidity(false);
            }
          } else if (err.response.status === 500) {
            setAlertMessage("Server Error");
            setAlertVisible(true);
            console.log(err);
          } else if (err.response.status === 401) {
            setPassword("");
            setAlertMessage(err.response.data.msg);
            setAlertVisible(true);
            setEmailValidity(false);
            setPasswordValidity(false);
          } else {
            console.log(err);
          }
        }
      });
  };

  return (
    <Fragment>
      {isAuthenticated || checkingAuth ? null : (
        <Container id="signin" className="register-signin">
          <Row>
            <Col md="6">
              <h3 className="signIn">Sign in</h3>
              <span className="text-muted">Don't have an account?</span>
              <Link
                to="/register"
                onClick={(e) => {
                  if (signingIn) {
                    e.preventDefault();
                  }
                }}
              >
                &nbsp;Register
              </Link>{" "}
              <br />
              <Alert
                color="info"
                className="mt-3"
                isOpen={alertVisible}
                toggle={onDismiss}
              >
                {alertMessage}
              </Alert>
              <Form className="mt-2">
                <FormGroup>
                  <Row>
                    <Col md="6">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        onChange={handleEmailChange}
                        onFocus={handleEmailChange}
                        valid={emailValid}
                        invalid={!emailValid}
                        disabled={signingIn}
                      />
                    </Col>
                    <Col md="6">
                      <div className="d-flex justify-content-between">
                        <Label>Password</Label>
                        <Link
                          to="/forgotPassword"
                          onClick={(e) => {
                            if (signingIn) {
                              e.preventDefault();
                            }
                          }}
                          className="ligtenOnHover"
                          style={{ textDecoration: "none" }}
                        >
                          Forgot?
                        </Link>
                      </div>
                      <InputGroup>
                        <Input
                          type={passwordType}
                          onChange={handlePasswordChange}
                          valid={passwordValid}
                          invalid={!passwordValid}
                          value={password}
                          disabled={signingIn}
                        />
                        <InputGroupAddon className="show" addonType="append">
                          <Button type="button" onClick={showHidePassword}>
                            {passwordType === "text" ? "Hide" : "Show"}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                </FormGroup>

                <FormGroup>
                  <Button
                    type="button"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={signingIn}
                  >
                    Sign in
                  </Button>
                </FormGroup>
                {signingIn ? <Spinner color="primary" /> : null}
              </Form>
            </Col>

            <Col md="6" className="text-center logo-sign-in">
              <div>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (signingIn) {
                      e.preventDefault();
                    }
                  }}
                  className="ligtenOnHover"
                  style={{ textDecoration: "none" }}
                >
                  <h3 className="brand">
                    Gadhi<span className="mart">Mart</span>
                  </h3>
                </Link>
                <h3 className="mt-3">Easily Find Your Next Car</h3>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

export default SignIn;
