import React, { useEffect, useState } from "react";
import Help from "./Help";
import { Button, Col, Collapse, Container, Row } from "reactstrap";
import CovidGadhimartSafety from "./Safety/CovidGadhimartSafety";
import WhatInformationCanBeSeen from "./Safety/WhatInformationCanBeSeen";
import SuspiciousEmails from "./Safety/SuspiciousEmails";
import RecievedEmailAboutAnAdIDidntPost from "./Safety/RecievedEmailAboutAnAdIDidntPost";
import QuickSafetyTips from "./Safety/QuickSafetyTips";
import SafetyAtTheMeetUp from "./Safety/SafetyAtTheMeetUp";
import SafePayments from "./Safety/SafePayments";
import SuspiciousAds from "./Safety/SuspiciousAds";
import HelpFAQ from "../HelpFAQ";

const HelpSafety = (props) => {
  const [hash, setHash] = useState(props.location.hash);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    setHash(props.location.hash);
    switch (props.location.hash) {
      case "":
        break;
      case "#covid19GadhimartSafetyPrecations":
        setBlog(<CovidGadhimartSafety />);
        break;
      case "#whatInformationCanBeSeenWhenIPost":
        setBlog(<WhatInformationCanBeSeen />);
        break;
      case "#suspiciousEmails":
        setBlog(<SuspiciousEmails />);
        break;
      case "#suspiciousAds":
        setBlog(<SuspiciousAds />);
        break;
      case "#recievedEmailAboutAnAdIDidntPost":
        setBlog(<RecievedEmailAboutAnAdIDidntPost />);
        break;
      case "#quickSafetyTips":
        setBlog(<QuickSafetyTips />);
        break;
      case "#safetyAtTheMeetUp":
        setBlog(<SafetyAtTheMeetUp />);
        break;
      case "#safePayments":
        setBlog(<SafePayments />);
        break;
      default:
        // props.history.push("/notFound");
        break;
    }
  }, [props.location.hash]);

  useEffect(() => {
    setHash(props.location.hash);
  }, [props.location.hash]);

  const [
    isKeepingYourInformationSafeOpen,
    setIsKeepingYourInformationSafeOpen,
  ] = useState(false);
  const toggleKeepingYourInformationSafe = () =>
    setIsKeepingYourInformationSafeOpen(!isKeepingYourInformationSafeOpen);

  const [
    isBuyingAndSellingSafelyOpen,
    setIsBuyingAndSellingSafelyOpen,
  ] = useState(false);
  const toggleBuyingAndSellingSafely = () =>
    setIsBuyingAndSellingSafelyOpen(!isBuyingAndSellingSafelyOpen);

  return (
    <div>
      <Help {...props} />
      <Container className="mt-4">
        <Row>
          <Col md="3">
            <h3 style={{ paddingLeft: "10px" }}>Safety</h3>
            <hr />
            <div>
              <Button
                color="link"
                onClick={toggleKeepingYourInformationSafe}
                className="helpLinks mb-2 mt-3"
              >
                <span className="text-muted heading ">
                  Keeping Information Safe{" "}
                  {isKeepingYourInformationSafeOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isKeepingYourInformationSafeOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/safety#covid19GadhimartSafetyPrecations"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/safety#covid19GadhimartSafetyPrecations"
                        );
                      }}
                      className={
                        hash === "#covid19GadhimartSafetyPrecations"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      COVID-19 Gadhimart Safety Precautions
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#whatInformationCanBeSeenWhenIPost"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/safety#whatInformationCanBeSeenWhenIPost"
                        );
                      }}
                      className={
                        hash === "#whatInformationCanBeSeenWhenIPost"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      What Information Can Be Seen When I Post?
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#suspiciousEmails"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/safety#suspiciousEmails");
                      }}
                      className={
                        hash === "#suspiciousEmails"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Suspicious Emails
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#recievedEmailAboutAnAdIDidntPost"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/safety#recievedEmailAboutAnAdIDidntPost"
                        );
                      }}
                      className={
                        hash === "#recievedEmailAboutAnAdIDidntPost"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Recieved Email About An Ad I Didn't Post
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={toggleBuyingAndSellingSafely}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Buying And Selling Safely{" "}
                  {isBuyingAndSellingSafelyOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isBuyingAndSellingSafelyOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/safety#quickSafetyTips"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/safety#quickSafetyTips");
                      }}
                      className={
                        hash === "#quickSafetyTips"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Quick Safety Tips
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#suspiciousAds"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/safety#suspiciousAds");
                      }}
                      className={
                        hash === "#suspiciousAds"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Suspicious Ads
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#safetyAtTheMeetUp"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/safety#safetyAtTheMeetUp");
                      }}
                      className={
                        hash === "#safetyAtTheMeetUp"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Safety At The Meet Up
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/safety#safePayments"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/safety#safePayments");
                      }}
                      className={
                        hash === "#safePayments"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Safe Payments
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

export default HelpSafety;
