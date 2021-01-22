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
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ConfirmEmail = (props) => {
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

  const [changing, setChanging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setChanging(true);
    if (emailValid && codeValid) {
      axios
        .post("/api/users/confirmEmail", {
          valid: process.env.REACT_APP_API_KEY,
          email,
          code,
        })
        .then((res) => {
          console.log(res.data);
          setAlertMessage("You have successfully confirmed your email.");
          setAlertVisible(true);
          setCode("");
          setEmail("");
          setCodeValid(true);
          setEmailValid(true);
          setChanging(false);
        })
        .catch((err) => {
          setChanging(false);
          if (typeof err.response !== "undefined") {
            const data = err.response.data;
            if (err.response.status === 400) {
              setAlertMessage(data.msg);
              setAlertVisible(true);
              switch (data.msg) {
                case "Validation Error":
                  setCode("");
                  setEmail("");
                  break;
                case "Please provide a valid email.":
                case "User doesn't exist. Please register.":
                  setEmail("");
                  break;
                case "Please provide a valid code.":
                case "Code has expired. Please click below to get a new code.":
                  setCode("");
                  break;
                case "User has confirmed email":
                  props.history.push("/signin");
                default:
                  break;
              }
            } else if (err.response.status === 500) {
              setAlertMessage("Server Error");
              setAlertVisible(true);
              setCode("");
              setEmail("");
            }
          } else {
            console.log(err);
          }
        });
    }
  };

  const resendEmail = () => {
    setChanging(true);
    if (emailValid) {
      axios
        .post("/api/users/resendConfirmationEmail", {
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
    <Container id="confirmEmail" className="register-signin">
      <Link
        to="/signin"
        className="heading lightenOnHover"
        style={{ textDecoration: "none" }}
      >
        &#5130; Sign In
      </Link>
      <Row className="mt-3">
        <Col md="6">
          <h3>Confirm Email</h3>
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
            If you haven't got your email,{" "}
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
              <Button
                type="button"
                color="primary"
                onClick={handleSubmit}
                disabled={changing || !emailValid || !codeValid}
              >
                Confirm
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

export default ConfirmEmail;
