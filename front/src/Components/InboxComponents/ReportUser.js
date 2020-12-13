import React, { useState } from "react";
import {
  Alert,
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";

const ReportUser = (props) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const onDismiss = () => setAlertVisible(false);
  const [reportType, setReportType] = useState("");
  const [reportTypeError, setReportTypeError] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [disableReport, setDisableReport] = useState(false);

  const handleReport = () => {
    console.log(props);

    let reportTypeError = false,
      descriptionError = false;

    if (reportType === "") {
      setReportTypeError(true);
      reportTypeError = true;
    }

    switch (reportType) {
      case "Scam":
      case "Bad words":
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

    checkDescription();

    if (!reportTypeError && !descriptionError) {
      axios
        .post("/api/reportUser", {
          valid: "VALId223",
          listingId: props.listingId,
          vehicleType: props.vehicleType,
          reportedBy: props.reportedBy,
          chatSession: props.chatSession,
          reportedUser: props.reportedUser,
          reportType,
          reportDescription: description,
        })
        .then((res) => {
          setAlertVisible(true);
          setDisableReport(true);
          setTimeout(props.toggleReportBlockModal, 2500);
        });
    }
  };

  return (
    <div>
      <a
        href="back"
        onClick={(e) => {
          e.preventDefault();
          props.setReportUserActive(false);
        }}
        className="mb-4"
      >
        &#5130; Back
      </a>
      <Alert
        color="info"
        className="my-2"
        isOpen={alertVisible}
        toggle={onDismiss}
      >
        Your report has been saved. Thank you for submiting.
      </Alert>
      <FormGroup tag="fieldset">
        <legend>Why do you want to report this user?</legend>
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
            Scam
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              name="report"
              onChange={(e) => {
                setReportType("Bad words");
                if (reportTypeError) {
                  setReportTypeError(false);
                }
              }}
            />{" "}
            Bad words
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
        <Button
          color="primary"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleReport();
          }}
          disabled={disableReport}
        >
          Report
        </Button>
      </FormGroup>
    </div>
  );
};

export default ReportUser;
