import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

const HelpFAQ = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <Fragment>
      {windowWidth > 768 ? (
        <div className={props.className}>
          <Row>
            <Col>
              <span className="text-muted">BASICS</span>
              <div className="mt-3">
                <div>
                  <a
                    href="/help/basics#howToRegister"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/basics#howToRegister");
                    }}
                    className="helpLinks"
                  >
                    How To Register
                  </a>
                </div>
                <div>
                  <a
                    href="/help/basics#postingAdsOnGadhimart"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/basics#postingAdsOnGadhimart");
                    }}
                    className="helpLinks"
                  >
                    Posting On Gadhimart
                  </a>
                </div>
                <div>
                  <a
                    href="/help/basics#usingTheSearchFilters"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/basics#usingTheSearchFilters");
                    }}
                    className="helpLinks"
                  >
                    Using Search Filters
                  </a>
                </div>
                <div>
                  <a
                    href="/help/basics#addingPhotos"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/basics#addingPhotos");
                    }}
                    className="helpLinks"
                  >
                    Adding Photos
                  </a>
                </div>
              </div>
            </Col>
            <Col>
              <span className="text-muted">TECHNICAL ISSUES</span>
              <div className="mt-3">
                <div>
                  <a
                    href="/help/technicalIssues#photoUploadErrors"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push(
                        "/help/technicalIssues#photoUploadErrors"
                      );
                    }}
                    className="helpLinks"
                  >
                    Photo Upload Errors
                  </a>
                </div>
                <div>
                  <a
                    href="/help/technicalIssues#iForgotMyPassword"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push(
                        "/help/technicalIssues#iForgotMyPassword"
                      );
                    }}
                    className="helpLinks"
                  >
                    I Forgot My Passwords
                  </a>
                </div>
                <div>
                  <a
                    href="/help/technicalIssues#browserIssues"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/technicalIssues#browserIssues");
                    }}
                    className="helpLinks"
                  >
                    Browser Issues
                  </a>
                </div>
              </div>
            </Col>
            <Col>
              <span className="text-muted">SAFETY</span>
              <div className="mt-3">
                <div>
                  <a
                    href="/help/safety#covid19GadhimartSafetyPrecations"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push(
                        "/help/safety#covid19GadhimartSafetyPrecations"
                      );
                    }}
                    className="helpLinks"
                  >
                    COVID-19 Gadhimart Safety Precautions
                  </a>
                </div>
                <div>
                  <a
                    href="/help/safety#quickSafetyTips"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/safety#quickSafetyTips");
                    }}
                    className="helpLinks"
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
                    className="helpLinks"
                  >
                    Suspicious Ads
                  </a>
                </div>
                <div>
                  <a
                    href="/help/safety#safePayments"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/safety#safePayments");
                    }}
                    className="helpLinks"
                  >
                    Safe Payments
                  </a>
                </div>
              </div>
            </Col>
            <Col>
              <span className="text-muted">POLICIES</span>
              <div className="mt-3">
                <div>
                  <a
                    href="/help/policies#gadhimartTermsOfUse"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/policies#gadhimartTermsOfUse");
                    }}
                    className="helpLinks"
                  >
                    Gadhimart Terms Of Use
                  </a>
                </div>
                <div>
                  <a
                    href="/help/policies#gadhimartPrivacyPolicy"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push(
                        "/help/policies#gadhimartPrivacyPolicy"
                      );
                    }}
                    className="helpLinks"
                  >
                    Gadhimart Privacy Policy
                  </a>
                </div>
                <div>
                  <a
                    href="/help/policies#postingPolicies"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/policies#postingPolicies");
                    }}
                    className="helpLinks"
                  >
                    Posting Policies
                  </a>
                </div>
                <div>
                  <a
                    href="/help/policies#adReplyCodeOfConduct"
                    onClick={(e) => {
                      e.preventDefault();
                      props.history.push("/help/policies#adReplyCodeOfConduct");
                    }}
                    className="helpLinks"
                  >
                    Ad Reply Code Of Conduct
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
    </Fragment>
  );
};

export default HelpFAQ;
