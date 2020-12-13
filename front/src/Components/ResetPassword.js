import React, { useState, useEffect } from "react";
import { isUuid } from "uuidv4";
import {
  Container,
  Row,
  Form,
  FormGroup,
  Col,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import incorrectSVG from "../icons/criss-cross.svg";
import correctSVG from "../icons/correct.svg";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ResetPassword = (props) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Funnction to run when dismissing alert
  const onDismiss = () => {
    setAlertVisible(false);
    setAlertMessage("");
  };

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmail(e.target.value);

    setEmailValid(emailRegex.test(e.target.value.toLowerCase()));
  };

  const [code, setCode] = useState("");
  const [codeValid, setCodeValid] = useState(null);
  const handleCodeChange = (e) => {
    if (isUuid(e.target.value)) {
      setCodeValid(true);
    } else {
      setCodeValid(false);
    }
    setCode(e.target.value);
  };

  const getPasswordValidity = (password) => {
    let lowercaseLetter = false,
      uppercaseLetter = false,
      number = false,
      eightCharacters = false;

    const lowercases = new RegExp("[a-z]");
    const uppercases = new RegExp("[A-Z]");
    const numbers = new RegExp("[0-9]");

    // Validate lowercase letter
    if (password.match(lowercases)) {
      lowercaseLetter = true;
    } else {
      lowercaseLetter = false;
    }

    // Validate uppercase letter
    if (password.match(uppercases)) {
      uppercaseLetter = true;
    } else {
      uppercaseLetter = false;
    }

    // Validate uppercase letter
    if (password.match(numbers)) {
      number = true;
    } else {
      number = false;
    }

    // Validate length
    if (password.length >= 8) {
      eightCharacters = true;
    } else {
      eightCharacters = false;
    }

    return {
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    };
  };

  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordValid, setPasswordValid] = useState(null);
  const [lowercaseLetter, setLowercaseLetter] = useState(false);
  const [uppercaseLetter, setUppercaseletter] = useState(false);
  const [number, setNumber] = useState(false);
  const [eightCharacters, setEightCharacters] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    const {
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    } = getPasswordValidity(e.target.value);

    if (lowercaseLetter && uppercaseLetter && number && eightCharacters) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }

    setLowercaseLetter(lowercaseLetter);
    setUppercaseletter(uppercaseLetter);
    setNumber(number);
    setEightCharacters(eightCharacters);
  };

  const showHidePassword = () => {
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const [changing, setChanging] = useState(false);

  const handleSubmit = () => {
    setChanging(true);
    axios
      .post("/api/users/resetPassword", {
        valid: process.env.REACT_APP_API_KEY,
        code,
        email,
        password,
      })
      .then((res) => {
        setChanging(false);
        setAlertMessage("Your password has been changed.");
        setAlertVisible(true);
        setCode("");
        setPassword("");
        setEmail("");
      })
      .catch((err) => {
        setChanging(false);

        if (typeof err.response !== "undefined") {
          const data = err.response.data;
          if (err.response.status === 400) {
            setAlertMessage(data.msg);
            setAlertVisible(true);
            switch (data.msg) {
              case "Please provide a valid code.":
                setCode("");
                break;
              case "Please provide a different password from the previous one.":
              case "Please provide a valid password":
                setPassword("");
                break;
              case "Please provide a valid email.":
                setEmail("");
                break;
              case "Please reset your password.":
                props.history.push("/forgotPassword");
                break;
              case "Code is invalid. Please click resend to get the new code.":
                setPassword("");
                setCode("");
                break;
              default:
                setCode("");
                setPassword("");
                setEmail("");
                break;
            }
          } else if (err.response.status === 500) {
            setAlertMessage("Server error.");
            setAlertVisible(true);
          }
        } else {
          console.log(err);
        }
      });
  };

  const resendEmail = () => {
    setChanging(true);
    if (emailValid) {
      axios
        .post("/api/users/resendPasswordResetEmail", {
          valid: process.env.REACT_APP_API_KEY,
          email,
        })
        .then((res) => {
          setChanging(false);
          setAlertMessage(`Email has been sent to ${email}`);
          setAlertVisible(true);
        })
        .catch((err) => {
          setChanging(false);
          setEmail("");
          if (typeof err.response !== "undefined") {
            const data = err.response.data;
            if (err.response.status === 400) {
              setAlertMessage(data.msg);
              setAlertVisible(true);
              if (
                data.msg === "Code has not been sent to the email." ||
                data.msg === "Email address doesn't exist."
              ) {
                props.history.push("/forgotPassword");
              }
            } else if (err.response.status === 500) {
              setAlertMessage("Server error.");
              setAlertVisible(true);
            }
          } else {
            console.log(err);
          }
        });
    }
  };

  useEffect(() => {
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      setEmail(parsedQueryStrings.email);
      setEmailValid(emailRegex.test(parsedQueryStrings.email));
      setCode(parsedQueryStrings.code);
      setCodeValid(parsedQueryStrings.code);
    }
  }, [props.location.search]);

  return (
    <Container id="resetPassword" className="register-signin">
      <Link
        to="/signin"
        className="heading lightenOnHover"
        style={{ textDecoration: "none" }}
      >
        &#5130; Sign In
      </Link>
      <Row className="mt-3">
        <Col md="6">
          <h3>Reset password</h3>
          <Alert
            color="info"
            className="mt-3"
            isOpen={alertVisible}
            toggle={onDismiss}
          >
            {alertMessage}
          </Alert>
          <small className="text-muted">
            We sent an code to your email.
            <br />
            If you haven't got your reset email,{" "}
            <a
              href="resendEmail"
              onClick={(e) => {
                e.preventDefault();
                resendEmail();
              }}
            >
              Click here
            </a>
            &nbsp; to resend the email.
          </small>
          <br />
          <Form className="mt-2">
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                onChange={handleEmailChange}
                onFocus={handleEmailChange}
                valid={emailValid}
                invalid={!emailValid}
                disabled={changing}
                value={email}
              />
              <FormFeedback>Please provide a valid email.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label>Code</Label>
              <Input
                type="text"
                onChange={handleCodeChange}
                onFocus={handleCodeChange}
                valid={codeValid}
                invalid={!codeValid}
                disabled={changing}
                value={code}
              />
              <FormFeedback>Please provide a valid code.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <InputGroup>
                <Input
                  type={passwordType}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordChange}
                  valid={passwordValid}
                  invalid={!passwordValid}
                  disabled={!codeValid || changing}
                  value={password}
                />
                <InputGroupAddon className="show" addonType="append">
                  <Button type="button" onClick={showHidePassword}>
                    {passwordType === "text" ? "Hide" : "Show"}
                  </Button>
                </InputGroupAddon>
                <FormFeedback valid>Looks good!</FormFeedback>
                <FormFeedback>Please provide a valid password.</FormFeedback>
              </InputGroup>
            </FormGroup>

            {/* Validity  */}
            <FormGroup className="message mt-3">
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

            <FormGroup>
              <Button
                type="button"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  changing || !emailValid || !codeValid || !passwordValid
                }
              >
                Change Password
              </Button>
            </FormGroup>
            {changing ? <Spinner color="primary" /> : null}
          </Form>
        </Col>

        <Col md="6" className="text-center logo-sign-in">
          <div>
            <Link
              to="/"
              onClick={(e) => {
                if (changing) {
                  e.preventDefault();
                }
              }}
              className="ligtenOnHover"
              style={{ textDecoration: "none" }}
              disabled={changing}
            >
              <h3>GadhiMart</h3>
            </Link>
            <h3 className="mt-3">Easily find</h3>
            <h3 className="mt-3">Your next car</h3>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
