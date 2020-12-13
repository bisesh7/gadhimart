import React, { useState } from "react";
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

const ForgotPassword = (props) => {
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

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(emailRegex.test(e.target.value.toLowerCase()));
  };

  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    if (emailValid) {
      setSending(true);
      axios
        .post("/api/users/forgotPassword", {
          valid: process.env.REACT_APP_API_KEY,
          email,
        })
        .then((res) => {
          setSending(false);
          setEmail("");
          props.history.push(`/resetPassword?email=${email}`);
        })
        .catch((err) => {
          setSending(false);
          setEmail("");

          if (typeof err.response !== "undefined") {
            if (err.response.status === 400) {
              setAlertMessage(err.response.data.msg);
              setAlertVisible(true);
            } else if (err.response.status === 500) {
              setAlertMessage("Server error.");
              setAlertVisible(true);
            }
          } else {
            console.log(err);
          }
        });
      console.log(email);
    } else {
      setAlertMessage("Please provide a valid email.");
      setAlertVisible(true);
    }
  };

  return (
    <Container id="forgotPassword" className="register-signin">
      <Row>
        <Col md="6">
          <Link
            to="/signin"
            className="heading lightenOnHover"
            style={{ textDecoration: "none" }}
          >
            &#5130; Back
          </Link>

          <h3 className="mt-3">Forgot Your Password?</h3>
          <Alert
            color="info"
            className="mt-3"
            isOpen={alertVisible}
            toggle={onDismiss}
          >
            {alertMessage}
          </Alert>
          <span className="text-muted">
            Please enter your email address below and we will send you an email
            to change your password.
          </span>
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
                disabled={sending}
                value={email}
              />
              <FormFeedback>Please provide a valid email.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Button
                type="button"
                color="primary"
                onClick={handleSubmit}
                disabled={sending || !emailValid}
              >
                Send Email
              </Button>
            </FormGroup>
            {sending ? <Spinner color="primary" /> : null}
          </Form>
        </Col>

        <Col md="6" className="text-center logo-sign-in">
          <div>
            <Link
              to="/"
              onClick={(e) => {
                if (sending) {
                  e.preventDefault();
                }
              }}
              className="ligtenOnHover"
              style={{ textDecoration: "none" }}
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

export default ForgotPassword;
