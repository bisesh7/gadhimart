import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Container, Row } from "reactstrap";
import Help from "./Help";
import HowToRegister from "./Basics/HowToRegister";
import HowToSignIn from "./Basics/HowToSignIn";
import UsingTheSearchBar from "./Basics/UsingTheSearchBar";
import UsingTheSearchFilters from "./Basics/UsingTheSearchFilters";
import SortingTheSearchResult from "./Basics/SortingSearchResult";
import SavedVehicles from "./Basics/SavedVehicles";
import SavedSearches from "./Basics/SavedSearches";
import SendingAndReceivingMessages from "./Basics/SendingAndRecievingMessage";
import PostingAdsOnGadhimart from "./Basics/PostingAdsOnGadhimart";
import ImportanceOfAddingTrim from "./Basics/ImportanceOfAddingTrim";
import AddingPhotos from "./Basics/AddingPhotos";
import EditingYourAds from "./Basics/EditingYourAds";
import DeletingAds from "./Basics/DeletingAds";
import WhatIsGadhimart from "./Basics/WhatIsGadhimart";
import HelpFAQ from "../HelpFAQ";

const HelpBasics = (props) => {
  const [hash, setHash] = useState(props.location.hash);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    setHash(props.location.hash);

    switch (props.location.hash) {
      case "":
        break;
      case "#howToRegister":
        setBlog(<HowToRegister />);
        break;
      case "#howToSignIn":
        setBlog(<HowToSignIn />);
        break;
      case "#usingTheSearchBar":
        setBlog(<UsingTheSearchBar />);
        break;
      case "#usingTheSearchFilters":
        setBlog(<UsingTheSearchFilters />);
        break;
      case "#sortingSearchResults":
        setBlog(<SortingTheSearchResult />);
        break;
      case "#savedVehicles":
        setBlog(<SavedVehicles />);
        break;
      case "#savedSearches":
        setBlog(<SavedSearches />);
        break;
      case "#sendingAndReceivingMessage":
        setBlog(<SendingAndReceivingMessages />);
        break;
      case "#postingAdsOnGadhimart":
        setBlog(<PostingAdsOnGadhimart />);
        break;
      case "#importanceOfAddingTrim":
        setBlog(<ImportanceOfAddingTrim />);
        break;
      case "#addingPhotos":
        setBlog(<AddingPhotos />);
        break;
      case "#editingYourAds":
        setBlog(<EditingYourAds />);
        break;
      case "#deletingYourAds":
        setBlog(<DeletingAds />);
        break;
      case "#whatIsGadhimart":
        setBlog(<WhatIsGadhimart />);
        break;
      default:
        props.history.push("/notFound");
        break;
    }
  }, [props.location.hash]);

  const [
    isAccountAndPreferencesOpen,
    setIsAccountAndPreferencesOpen,
  ] = useState(false);
  const toggleAccountAndPreferences = () =>
    setIsAccountAndPreferencesOpen(!isAccountAndPreferencesOpen);

  const [isSearchingOpen, setIsSearchingOpen] = useState(false);
  const toggleSearching = () => setIsSearchingOpen(!isSearchingOpen);

  const [isReplyingOpen, setIsReplyingOpen] = useState(false);
  const toggleReplying = () => setIsReplyingOpen(!isReplyingOpen);

  const [isPostingAdsOpen, setIsPostingAdsOpen] = useState(false);
  const togglePostingAds = () => setIsPostingAdsOpen(!isPostingAdsOpen);

  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const toggleAboutUs = () => setIsAboutUsOpen(!isAboutUsOpen);

  return (
    <div>
      <Help {...props} />
      <Container className="mt-4">
        <Row>
          <Col md="3">
            <h3 style={{ paddingLeft: "10px" }}>Basics</h3>
            <hr />
            <div>
              <Button
                color="link"
                onClick={toggleAccountAndPreferences}
                className="helpLinks mb-2 mt-3"
              >
                <span className="text-muted heading ">
                  Account And Preferences{" "}
                  {isAccountAndPreferencesOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isAccountAndPreferencesOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#howToRegister"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#howToRegister");
                      }}
                      className={
                        hash === "#howToRegister"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      How to Register
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/basics#howToSignIn"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#howToSignIn");
                      }}
                      className={
                        hash === "#howToSignIn"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      How to Sign In
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={toggleSearching}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Searching{" "}
                  {isSearchingOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isSearchingOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#usingTheSearchBar"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#usingTheSearchBar");
                      }}
                      className={
                        hash === "#usingTheSearchBar"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Using The Search Bar
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/basics#usingTheSearchFilters"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/basics#usingTheSearchFilters"
                        );
                      }}
                      className={
                        hash === "#usingTheSearchFilters"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Using The Search Filters
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/basics#sortingSearchResults"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#sortingSearchResults");
                      }}
                      className={
                        hash === "#sortingSearchResults"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Sorting Search Results
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/basics#savedVehicles"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#savedVehicles");
                      }}
                      className={
                        hash === "#savedVehicles"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Saved Vehicles
                    </a>
                  </div>
                  <div>
                    <a
                      href="/help/basics#savedSearches"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#savedSearches");
                      }}
                      className={
                        hash === "#savedSearches"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Saved Searches
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={toggleReplying}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Replying{" "}
                  {isReplyingOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isReplyingOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#sendingAndReceivingMessage"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/basics#sendingAndReceivingMessage"
                        );
                      }}
                      className={
                        hash === "#sendingAndReceivingMessage"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Sending And Recieving Message
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={togglePostingAds}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  Posting Ads{" "}
                  {isPostingAdsOpen ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )}{" "}
                </span>
              </Button>
              <Collapse isOpen={isPostingAdsOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#postingAdsOnGadhimart"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/basics#postingAdsOnGadhimart"
                        );
                      }}
                      className={
                        hash === "#postingAdsOnGadhimart"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Posting Ads On Gadhimart
                    </a>
                  </div>
                </div>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#importanceOfAddingTrim"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push(
                          "/help/basics#importanceOfAddingTrim"
                        );
                      }}
                      className={
                        hash === "#importanceOfAddingTrim"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Importance Of Adding Trim
                    </a>
                  </div>
                </div>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#addingPhotos"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#addingPhotos");
                      }}
                      className={
                        hash === "#addingPhotos"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Adding Photos
                    </a>
                  </div>
                </div>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#editingYourAds"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#editingYourAds");
                      }}
                      className={
                        hash === "#editingYourAds"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Editing Your Ads
                    </a>
                  </div>
                </div>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#deletingYourAds"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#deletingYourAds");
                      }}
                      className={
                        hash === "#deletingYourAds"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      Deleting Your Ads
                    </a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>
              <Button
                color="link"
                onClick={toggleAboutUs}
                className="helpLinks mb-2"
              >
                <span className="text-muted heading ">
                  About Us{" "}
                  {isAboutUsOpen ? <span>&#9650;</span> : <span>&#9660;</span>}{" "}
                </span>
              </Button>
              <Collapse isOpen={isAboutUsOpen}>
                <div style={{ paddingLeft: "15px" }}>
                  <div>
                    <a
                      href="/help/basics#whatIsGadhimart"
                      onClick={(e) => {
                        e.preventDefault();
                        props.history.push("/help/basics#whatIsGadhimart");
                      }}
                      className={
                        hash === "#whatIsGadhimart"
                          ? "heading helpLinks activeHelpLink"
                          : "heading helpLinks"
                      }
                    >
                      What Is Gadhimart?
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

export default HelpBasics;
