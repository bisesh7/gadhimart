import React, { useEffect, useState } from "react";
import Help from "./Help";
import { Button, Col, Collapse, Container, Row } from "reactstrap";
import IForgotMyPassword from "./TechnicalIssues/IForgotMyPassword";
import TroubleWithRecaptcha from "./TechnicalIssues/TroubleWithRecaptcha";
import ChangingMyAccountPassword from "./TechnicalIssues/ChangingMyAccountPassword";
import WhyCantIPostOnGadhimart from "./TechnicalIssues/WhyCan'tIPostOnGadhimart";
import PhotoUploadErrors from "./TechnicalIssues/PhotoUploadErrors";
import WhyAmINotReceivingReplies from "./TechnicalIssues/WhyAmINotRecievingReplies";
import BrowserIssues from "./TechnicalIssues/BrowserIssues";
import HelpFAQ from "../HelpFAQ";

const HelpTechnicalIssues = (props) => {
  const [hash, setHash] = useState(props.location.hash);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    setHash(props.location.hash);
    switch (props.location.hash) {
      case "":
        break;
      case "#iForgotMyPassword":
        setBlog(<IForgotMyPassword />);
        break;
      case "#troubleWithCaptcha":
        setBlog(<TroubleWithRecaptcha />);
        break;
      case "#changingMyAccountPassword":
        setBlog(<ChangingMyAccountPassword />);
        break;
      case "#whyCantIPostOnGadhimmart":
        setBlog(<WhyCantIPostOnGadhimart />);
        break;
      case "#photoUploadErrors":
        setBlog(<PhotoUploadErrors />);
        break;
      case "#whyAmINotReceivingReplies":
        setBlog(<WhyAmINotReceivingReplies />);
        break;
      case "#browserIssues":
        setBlog(<BrowserIssues />);
        break;
      default:
        // props.history.push("/notFound");
        break;
    }
  }, [props.location.hash]);

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const toggleAccount = () => setIsAccountOpen(!isAccountOpen);

  const [isAdsOpen, setIsAdsOpen] = useState(false);
  const toggleAds = () => setIsAdsOpen(!isAdsOpen);

  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const toggleReplies = () => setIsRepliesOpen(!isRepliesOpen);

  const [isErrorsOpen, setIsErrorsOpen] = useState(false);
  const toggleErrors = () => setIsErrorsOpen(!isErrorsOpen);

  return (
    <div>
      <Help {...props} />
      <Container className="mt-4">
        <Row>
          <Col md="3">
            <h3 style={{ paddingLeft: "10px" }}>Technical Issues</h3> <hr />
            <div>
              <Button
                color="link"
                onClick={toggleAccount}
                className="helpLinks mb-2 mt-3"
              >
                <span className="text-muted heading ">
                  Account{" "}
                  {isAccountOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isAccountOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/technicalIssues#iForgotMyPassword"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#iForgotMyPassword"
                        );
                      }}
                      className={
                        hash === "#iForgotMyPassword"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      I Forgot My Password
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/technicalIssues#troubleWithCaptcha"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#troubleWithCaptcha"
                        );
                      }}
                      className={
                        hash === "#troubleWithCaptcha"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Trouble With Captcha
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/technicalIssues#changingMyAccountPassword"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#changingMyAccountPassword"
                        );
                      }}
                      className={
                        hash === "#changingMyAccountPassword"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Changing My Account Password
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>
            <div>
              <Button
                color="link"
                onClick={toggleAds}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Ads {isAdsOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isAdsOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/technicalIssues#whyCantIPostOnGadhimmart"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#whyCantIPostOnGadhimmart"
                        );
                      }}
                      className={
                        hash === "#whyCantIPostOnGadhimmart"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Why Can't I Post On Gadhimart?
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/technicalIssues#photoUploadErrors"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#photoUploadErrors"
                        );
                      }}
                      className={
                        hash === "#photoUploadErrors"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Photo Upload Errors
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>
            <div>
              <Button
                color="link"
                onClick={toggleReplies}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Replies{" "}
                  {isRepliesOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isRepliesOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/technicalIssues#whyAmINotReceivingReplies"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#whyAmINotReceivingReplies"
                        );
                      }}
                      className={
                        hash === "#whyAmINotReceivingReplies"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Why Am I Not Receiving Replies?
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>
            <div>
              <Button
                color="link"
                onClick={toggleErrors}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Errors{" "}
                  {isErrorsOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isErrorsOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/technicalIssues#browserIssues"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/technicalIssues#browserIssues"
                        );
                      }}
                      className={
                        hash === "#browserIssues"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Browser Issues
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>
          </Col>
          <Col md="9">{blog}</Col>
        </Row>
        <HelpFAQ className="mt-4 mb-5" {...props} />
      </Container>
    </div>
  );
};

export default HelpTechnicalIssues;
