import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import "../Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import incorrectSVG from "../icons/criss-cross.svg";
import correctSVG from "../icons/correct.svg";

const RegisterComponent = (props) => {
  const { auth } = useContext(AuthContext);
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

    checkAuth();
  }, [auth, props.history]);

  const [lowercaseLetter, setlowercaseLetter] = useState(false);
  const [uppercaseLetter, setuppercaseLetter] = useState(false);
  const [number, setNumber] = useState(false);
  const [eightCharacters, setEightCharacters] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValidity] = useState(false);
  const [passwordValid, setPasswordValidity] = useState(false);
  const [nameValid, setNameValidity] = useState(false);
  const [showValidity, setShowValidity] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Spinner
  const [registering, setRegistering] = useState(false);

  // Alert
  const [alertVisible, setAlertVisible] = useState(false);
  // Funnction to run when dismissing alert
  const onDismiss = () => {
    setAlertVisible(false);
    setAlertMessage("");
  };

  // Show or hide password
  const showHidePassword = () => {
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  // Check password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    const lowercases = new RegExp("[a-z]");
    const uppercases = new RegExp("[A-Z]");
    const numbers = new RegExp("[0-9]");

    // Validate lowercase letter
    if (e.target.value.match(lowercases)) {
      setlowercaseLetter(true);
    } else {
      setlowercaseLetter(false);
    }

    // Validate uppercase letter
    if (e.target.value.match(uppercases)) {
      setuppercaseLetter(true);
    } else {
      setuppercaseLetter(false);
    }

    // Validate uppercase letter
    if (e.target.value.match(numbers)) {
      setNumber(true);
    } else {
      setNumber(false);
    }

    // Validate length
    if (e.target.value.length >= 8) {
      setEightCharacters(true);
    } else {
      setEightCharacters(false);
    }

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

  // Check the name
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value !== null && e.target.value !== "") {
      setNameValidity(true);
    } else {
      setNameValidity(false);
    }
  };

  // Check the email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValidity(emailRegex.test(e.target.value.toLowerCase()));
  };

  // Check if the terms is checked or not
  const handleTermsButton = (e) => {
    setTermsChecked(e.target.checked);
  };

  // Handle registration
  const handleRegistrationButton = () => {
    if (
      nameValid === false ||
      emailValid === false ||
      passwordValid === false ||
      termsChecked === false
    ) {
      setShowValidity(true);
    } else {
      setRegistering(true);

      axios({
        method: "post",
        url: "/api/users",
        data: {
          name,
          email,
          password,
          terms: termsChecked,
          valid: process.env.REACT_APP_API_KEY,
        },
      })
        .then((res) => {
          setRegistering(false);
          switch (res.data.success) {
            case true:
              props.history.push(`/confirmEmail?email=${email}`);
              break;
            case false:
              setAlertMessage(res.data.msg);
              break;
            default:
              props.history.push("/home");
              break;
          }
        })
        .catch((err) => {
          if (typeof err.response !== "undefined") {
            if (err.response.status === 400) {
              if (!err.response.data.success) {
                setAlertMessage(err.response.data.msg);
                setAlertVisible(true);
              }
            } else if (err.response.status === 500) {
              setAlertMessage("Server Error");
              setAlertVisible(true);
              console.log(err);
            } else {
              console.log(err);
            }
          }

          setRegistering(false);
          setAlertVisible(true);
        });
    }
  };

  return (
    <Fragment>
      {isAuthenticated || checkingAuth ? null : (
        <Container id="register" className="register-signin">
          <Row>
            <Col md="6">
              <h3>Register</h3>
              <span className="text-muted">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  onClick={(e) => {
                    if (registering) {
                      e.preventDefault();
                    }
                  }}
                >
                  Sign in
                </Link>
              </span>
              <Alert
                color="info"
                className="mt-3"
                isOpen={alertVisible}
                toggle={onDismiss}
              >
                {alertMessage}
              </Alert>
              <Form>
                <FormGroup>
                  <Label>Name</Label>
                  {showValidity === true ? (
                    nameValid === true ? (
                      <Input
                        type="text"
                        onChange={handleNameChange}
                        valid
                        disabled={registering}
                      />
                    ) : (
                      <Input
                        type="text"
                        onChange={handleNameChange}
                        invalid
                        disabled={registering}
                      />
                    )
                  ) : (
                    <Input
                      type="text"
                      onChange={handleNameChange}
                      disabled={registering}
                    />
                  )}
                  <FormFeedback valid>Looks good!</FormFeedback>
                  <FormFeedback>Please provide a valid name.</FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Row>
                    <Col md="6">
                      <Label>Email</Label>
                      {showValidity === true ? (
                        emailValid === true ? (
                          <Input
                            onChange={handleEmailChange}
                            type="email"
                            valid
                            disabled={registering}
                          />
                        ) : (
                          <Input
                            onChange={handleEmailChange}
                            type="email"
                            invalid
                            disabled={registering}
                          />
                        )
                      ) : (
                        <Input
                          onChange={handleEmailChange}
                          type="email"
                          disabled={registering}
                        />
                      )}
                      <FormFeedback valid>Looks good!</FormFeedback>
                      <FormFeedback>Please provide a valid email.</FormFeedback>
                    </Col>
                    <Col md="6">
                      <label>Password</label>
                      <InputGroup>
                        {showValidity === true ? (
                          passwordValid === true ? (
                            <Input
                              onChange={handlePasswordChange}
                              type={passwordType}
                              disabled={registering}
                              valid
                            />
                          ) : (
                            <Input
                              onChange={handlePasswordChange}
                              type={passwordType}
                              disabled={registering}
                              invalid
                            />
                          )
                        ) : (
                          <Input
                            onChange={handlePasswordChange}
                            disabled={registering}
                            type={passwordType}
                          />
                        )}

                        <InputGroupAddon className="show" addonType="append">
                          <Button type="button" onClick={showHidePassword}>
                            {passwordType === "text" ? "Hide" : "Show"}
                          </Button>
                        </InputGroupAddon>
                        <FormFeedback valid>Looks good!</FormFeedback>
                        <FormFeedback>
                          Please provide a valid password.
                        </FormFeedback>
                      </InputGroup>
                    </Col>
                  </Row>
                </FormGroup>

                <FormGroup>
                  <Row>
                    <Col md="6">
                      <FormGroup check>
                        {showValidity === true ? (
                          termsChecked === true ? (
                            <Input
                              type="checkbox"
                              onChange={handleTermsButton}
                              valid
                            />
                          ) : (
                            <Input
                              type="checkbox"
                              onChange={handleTermsButton}
                              invalid
                            />
                          )
                        ) : (
                          <Input
                            type="checkbox"
                            onChange={handleTermsButton}
                            disabled={registering}
                          />
                        )}
                        Agree to terms and conditions
                        <FormFeedback>
                          You must agree before submitting.
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="message">
                        <small className="text-muted">
                          {!lowercaseLetter ? (
                            <img width="18" src={incorrectSVG} alt="" />
                          ) : (
                            <img width="18" src={correctSVG} alt="" />
                          )}{" "}
                          1 <b>lowercase</b> letter{" "}
                        </small>{" "}
                        <br />
                        <small className="text-muted">
                          {!uppercaseLetter ? (
                            <img width="18" src={incorrectSVG} alt="" />
                          ) : (
                            <img width="18" src={correctSVG} alt="" />
                          )}{" "}
                          1 <b>capital (uppercase)</b> letter{" "}
                        </small>{" "}
                        <br />
                        <small className="text-muted">
                          {!number ? (
                            <img width="18" src={incorrectSVG} alt="" />
                          ) : (
                            <img width="18" src={correctSVG} alt="" />
                          )}{" "}
                          1 <b>number </b>{" "}
                        </small>{" "}
                        <br />
                        <small className="text-muted">
                          {!eightCharacters ? (
                            <img width="18" src={incorrectSVG} alt="" />
                          ) : (
                            <img width="18" src={correctSVG} alt="" />
                          )}{" "}
                          Minimum <b>8 characters </b>{" "}
                        </small>{" "}
                        <br />
                      </FormGroup>
                    </Col>
                  </Row>
                </FormGroup>

                <Row>
                  <Col md="6">
                    <Button
                      onClick={handleRegistrationButton}
                      color="primary"
                      type="button"
                      disabled={registering}
                    >
                      Create New Account
                    </Button>
                  </Col>
                  <Col>{registering ? <Spinner color="primary" /> : null}</Col>
                </Row>
              </Form>
            </Col>

            <Col md="6" className="logo-register text-center">
              <div>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (registering) {
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

export default RegisterComponent;
