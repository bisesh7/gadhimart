import React, { useState, Fragment } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  FormText,
  Input,
  Button,
  FormFeedback,
  Alert,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import reportSVG from "../../icons/flag.svg";

const ReportComponent = (props) => {
  const [reportModal, setReportModal] = useState(false);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [reportTypeError, setReportTypeError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [disableReport, setDisableReport] = useState(false);

  const onDismiss = () => setAlertVisible(false);
  const toggleReport = () => setReportModal(!reportModal);

  const handleReport = () => {
    let reportTypeError = false,
      descriptionError = false,
      emailError = false;

    if (reportType === "") {
      setReportTypeError(true);
      reportTypeError = true;
    }

    switch (reportType) {
      case "Scam":
      case "Duplicate":
      case "No longer relevant":
      case "Wrong category":
      case "Other":
        break;
      default:
        setReportTypeError(true);
        reportTypeError = true;
    }

    const checkDescription = () => {
      if (
        description.length < 50 ||
        description.length > 1000 ||
        description === ""
      ) {
        setDescriptionError(true);
        descriptionError = true;
      }
    };

    if (reportType === "Other") {
      checkDescription();
    }

    if (description !== "") {
      checkDescription();
    }

    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email === "" || emailRegex.test(email) === false) {
      setEmailError(true);
      emailError = true;
    }

    if (!reportTypeError && !descriptionError && !emailError) {
      axios
        .post("/api/reportListing/", {
          valid: process.env.REACT_APP_API_KEY,
          reportType,
          description,
          email,
          listingId: props.listingId,
          vehicleType: props.vehicleType,
        })
        .then((res) => {
          setAlertVisible(true);
          setDisableReport(true);
          setTimeout(toggleReport, 2500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Fragment>
      <div className="d-inline-flex">
        <a
          href="a"
          onClick={(e) => {
            e.preventDefault();
            toggleReport();
          }}
          className="heading lightenOnHover"
          style={{ textDecoration: "none" }}
        >
          <img src={reportSVG} width="20" className="pb-2" alt="" />
          &nbsp;Report this listing
        </a>
      </div>

      <Modal
        isOpen={reportModal}
        toggle={toggleReport}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleReport}>Report listing</ModalHeader>
        <ModalBody>
          <Alert color="info" isOpen={alertVisible} toggle={onDismiss}>
            Your report has been saved. Thank you for submiting.
          </Alert>
          <FormGroup tag="fieldset">
            <legend>Why do you want to report this listing?</legend>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="report"
                  onChange={(e) => {
                    setReportType("Scam");
                    if (reportTypeError) {
                      setReportTypeError(false);
                    }
                  }}
                />{" "}
                Scam or a prohibited item
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="report"
                  onChange={(e) => {
                    setReportType("Duplicate");
                    if (reportTypeError) {
                      setReportTypeError(false);
                    }
                  }}
                />{" "}
                Duplicate or spam
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="report"
                  onChange={(e) => {
                    setReportType("No longer relevant");
                    if (reportTypeError) {
                      setReportTypeError(false);
                    }
                  }}
                />{" "}
                No longer relevant
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="report"
                  onChange={(e) => {
                    setReportType("Wrong category");
                    if (reportTypeError) {
                      setReportTypeError(false);
                    }
                  }}
                />{" "}
                Wrong category
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="report"
                  onChange={(e) => {
                    setReportType("Other");
                    if (reportTypeError) {
                      setReportTypeError(false);
                    }
                  }}
                  invalid={reportTypeError}
                />{" "}
                Other
                <FormFeedback>Please choose a valid option.</FormFeedback>
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col>
                <Label>Tell us more</Label>
              </Col>
              <Col className="d-flex justify-content-end">{`${description.length} / 1000`}</Col>
            </Row>
            <Input
              type="textarea"
              onChange={(e) => {
                setDescription(e.target.value);
                if (descriptionError) {
                  setDescriptionError(false);
                }
              }}
              invalid={descriptionError}
            />
            <FormFeedback>Please give a valid description.</FormFeedback>
            <FormText color="muted">
              Word count should be more than 50 and less than 1000
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label>Your email</Label>
            <Input
              type="email"
              placeholder="Your email address"
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) {
                  setEmailError(false);
                }
              }}
              invalid={emailError}
            />
            <FormFeedback>Please give your email</FormFeedback>
          </FormGroup>
          <FormText color="muted">Your report will be confidential.</FormText>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={disableReport}
            onClick={handleReport}
          >
            Report
          </Button>{" "}
          <Button color="secondary" onClick={toggleReport}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ReportComponent;
