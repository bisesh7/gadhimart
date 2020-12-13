import React, { useEffect, useState } from "react";
import Help from "./Help";
import { Button, Col, Collapse, Container, Row } from "reactstrap";
import TermsOfUse from "./Policy/TermsOfUse";
import PrivacyPolicy from "./Policy/PrivacyPolicy";
import AdReplyCodeOfConduct from "./Policy/AdReplyCodeOfConduct";
import AgeRestrictions from "./Policy/AgeRestrictions";
import PostingPolicies from "./Policy/PostingPolicies";
import HelpFAQ from "../HelpFAQ";

const HelpPolicies = (props) => {
  const [hash, setHash] = useState(props.location.hash);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    setHash(props.location.hash);
    switch (props.location.hash) {
      case "":
        break;
      case "#gadhimartTermsOfUse":
        setBlog(<TermsOfUse />);
        break;
      case "#gadhimartPrivacyPolicy":
        setBlog(<PrivacyPolicy {...props} />);
        break;
      case "#adReplyCodeOfConduct":
        setBlog(<AdReplyCodeOfConduct />);
        break;
      case "#gadhimartAgeRestrictions":
        setBlog(<AgeRestrictions />);
        break;
      case "#postingPolicies":
        setBlog(<PostingPolicies />);
        break;
      default:
        // props.history.push("/notFound");
        break;
    }
  }, [props.location.hash]);

  useEffect(() => {
    setHash(props.location.hash);
  }, [props.location.hash]);

  const [isGeneralPoliciesOpen, setIsGeneralPoliciesOpen] = useState(false);
  const toggleGeneralPolicies = () =>
    setIsGeneralPoliciesOpen(!isGeneralPoliciesOpen);

  const [isPostingPoliciesOpen, setIsPostingPoliciesOpen] = useState(false);
  const togglePostingPolicies = () =>
    setIsPostingPoliciesOpen(!isPostingPoliciesOpen);

  return (
    <div>
      <Help {...props} />
      <Container className="mt-4">
        <Row>
          <Col md="3">
            <h3 style={{ paddingLeft: "10px" }}>General Policies</h3>
            <hr />
            <div>
              <Button
                color="link"
                onClick={toggleGeneralPolicies}
                className="helpLinks mb-2 mt-3"
              >
                <span className="text-muted heading ">
                  Gadhimart Term Of Use{" "}
                  {isGeneralPoliciesOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isGeneralPoliciesOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/policies#gadhimartTermsOfUse"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/policies#gadhimartTermsOfUse"
                        );
                      }}
                      className={
                        hash === "#gadhimartTermsOfUse"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
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
                      className={
                        hash === "#gadhimartPrivacyPolicy"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Gadhimart Privacy Policy
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/policies#adReplyCodeOfConduct"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/policies#adReplyCodeOfConduct"
                        );
                      }}
                      className={
                        hash === "#adReplyCodeOfConduct"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Ad Reply Code Of Conduct
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/policies#gadhimartAgeRestrictions"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/policies#gadhimartAgeRestrictions"
                        );
                      }}
                      className={
                        hash === "#gadhimartAgeRestrictions"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Gadhimart Age Restrictions
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={togglePostingPolicies}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Ads{" "}
                  {isPostingPoliciesOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isPostingPoliciesOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/policies#postingPolicies"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/policies#postingPolicies");
                      }}
                      className={
                        hash === "#postingPolicies"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Posting Policies
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

export default HelpPolicies;
