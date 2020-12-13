import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Container, Row } from "reactstrap";
import { SocialIcon } from "react-social-icons";

const Footer = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const [isGadhimartCollapseOpen, setIsGadhimartCollapseOpen] = useState(false);
  const toggleGadhimartCollapse = () =>
    setIsGadhimartCollapseOpen(!isGadhimartCollapseOpen);

  const [isExploreCollapseOpen, setIsExploreCollapseOpen] = useState(false);
  const toggleExploreCollapse = () =>
    setIsExploreCollapseOpen(!isExploreCollapseOpen);

  const [isInfoCollapseOpen, setIsInfoCollapseOpen] = useState(false);
  const toggleInfoCollapse = () => setIsInfoCollapseOpen(!isInfoCollapseOpen);

  const [isHelpCollapseOpen, setIsHelpCollapseOpen] = useState(false);
  const toggleHelpCollapse = () => setIsHelpCollapseOpen(!isHelpCollapseOpen);

  const GadhimartAnchors = (
    <div>
      <div className="mb-1">
        <a
          href="/help/basics#whatIsGadhimart"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/basics#whatIsGadhimart");
          }}
        >
          <span className="text-muted">About</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/help/basics#postingAdsOnGadhimart"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/basics#postingAdsOnGadhimart");
          }}
        >
          <span className="text-muted">Advertise on Gadhimart</span>
        </a>
      </div>
    </div>
  );

  const ExploreAnchors = (
    <div>
      <div className="mb-1">
        <a
          href="/help/safety"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/safety");
          }}
        >
          <span className="text-muted">Safety</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/help/safety#quickSafetyTips"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/safety#quickSafetyTips");
          }}
        >
          <span className="text-muted">Quick Safety tips</span>
        </a>
      </div>
    </div>
  );

  const InfoAnchors = (
    <div>
      <div className="mb-1">
        <a
          href="/help/policies#termsOfUse"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/policies#termsOfUse");
          }}
        >
          <span className="text-muted">Terms of use</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/help/policies#privacyPolicy"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/policies#privacyPolicy");
          }}
        >
          <span className="text-muted">Privacy policy</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/help/policies#cookiePolicy"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/policies#cookiePolicy");
          }}
        >
          <span className="text-muted">Cookie policy</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/help/policies#postingPolicy"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help/policies#postingPolicy");
          }}
        >
          <span className="text-muted">Posting policy</span>
        </a>
      </div>
    </div>
  );

  const HelpAnchors = (
    <div>
      <div className="mb-1">
        <a
          href="/help"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/help");
          }}
        >
          <span className="text-muted">Help</span>
        </a>
      </div>
      <div className="mb-1">
        <a
          href="/feedback"
          onClick={(e) => {
            e.preventDefault();
            props.history.push("/feedback");
          }}
        >
          <span className="text-muted">Feedback</span>
        </a>
      </div>
    </div>
  );

  const socialIconStyle = { height: 30, width: 30 };

  return (
    <Container className={props.className}>
      {windowWidth < 768 ? (
        <div>
          <Button color="link" block onClick={toggleGadhimartCollapse}>
            <div className="float-left">
              <span className="footerMobileAnchorHeading">
                {isGadhimartCollapseOpen ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )}{" "}
                &nbsp;
              </span>
              <span className="heading footerMobileAnchorHeading">
                GADHIMART
              </span>
            </div>
          </Button>
          <Collapse isOpen={isGadhimartCollapseOpen}>
            <div style={{ paddingLeft: "33px" }}>{GadhimartAnchors}</div>
          </Collapse>
          <hr />
          <Button color="link" block onClick={toggleExploreCollapse}>
            <div className="float-left">
              <span className="footerMobileAnchorHeading">
                {isExploreCollapseOpen ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )}{" "}
                &nbsp;
              </span>
              <span className="heading footerMobileAnchorHeading">EXPLORE</span>
            </div>
          </Button>
          <Collapse isOpen={isExploreCollapseOpen}>
            <div style={{ paddingLeft: "33px" }}>{ExploreAnchors}</div>
          </Collapse>
          <hr />
          <Button color="link" block onClick={toggleInfoCollapse}>
            <div className="float-left">
              {" "}
              <span className="footerMobileAnchorHeading">
                {isInfoCollapseOpen ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )}{" "}
                &nbsp;
              </span>
              <span className="heading footerMobileAnchorHeading">INFO</span>
            </div>
          </Button>
          <Collapse isOpen={isInfoCollapseOpen}>
            <div style={{ paddingLeft: "33px" }}>{InfoAnchors}</div>
          </Collapse>
          <hr />
          <Button color="link" block onClick={toggleHelpCollapse}>
            <div className="float-left">
              <span className="footerMobileAnchorHeading">
                {isHelpCollapseOpen ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )}{" "}
                &nbsp;
              </span>
              <span className="heading footerMobileAnchorHeading">HELP</span>
            </div>
          </Button>
          <Collapse isOpen={isHelpCollapseOpen}>
            <div style={{ paddingLeft: "33px" }}>{HelpAnchors}</div>
          </Collapse>
          <hr />
        </div>
      ) : (
        <div>
          <Row>
            <Col md="3">
              <div className="mb-3">
                <span className="heading">GADHIMART</span>
              </div>
              {GadhimartAnchors}
            </Col>
            <Col md="3">
              <div className="mb-3">
                <span className="heading ">EXPLORE</span>
              </div>
              {ExploreAnchors}
            </Col>
            <Col md="3">
              <div className="mb-3">
                <span className="heading ">INFO</span>
              </div>
              {InfoAnchors}
            </Col>
            <Col md="3">
              <div className="mb-3">
                <span className="heading ">HELP</span>
              </div>
              {HelpAnchors}
            </Col>
          </Row>
          <div className="d-flex justify-content-between">
            <span className="heading text-muted">
              <sup>&copy;</sup> 2020 Gadhimart
            </span>
            <div>
              <SocialIcon
                url="https://www.facebook.com"
                style={socialIconStyle}
                network="facebook"
                className="mr-2"
              />
              <SocialIcon
                url="https://www.instagram.com"
                style={socialIconStyle}
                bgColor="#C13584"
                network="instagram"
                className="mr-2"
              />
              <SocialIcon
                url="https://www.twitter.com"
                style={socialIconStyle}
                network="twitter"
                className="mr-2"
              />
              <SocialIcon url="/advice" style={socialIconStyle} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Footer;
