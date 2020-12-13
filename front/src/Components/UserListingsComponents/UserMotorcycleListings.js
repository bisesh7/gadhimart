import React, { Fragment, useState, useEffect, useContext } from "react";
import UnAuthNavbar from "../CarSearch/UnAuthNavbar";
import {
  Row,
  Container,
  Col,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import UserListingSideBar from "./UserListingSideBar";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import Pagination from "react-js-pagination";
import ccSVG from "../../icons/cylinder.svg";
import districtSVG from "../../icons/location.svg";
import kilometerSVG from "../../icons/speed.svg";

const UserMotorcycleListings = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, []);

  const { auth, dispatch } = useContext(AuthContext);

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [listingsPerPage] = useState(15);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const [currentListings, setCurrentListings] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      promiseCheckAuth(dispatch)
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
          }
        })
        .catch((err) => {
          console.log("Not signed in");
        });
    }

    clearCarDetailsInSessionStorage();
  }, [auth]);

  const [loading, setLoading] = useState(false);
  const [listingListGroupItems, setUpListingListGroupItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/motorcycle/getListing/${props.match.params.userId}`, {
        valid: process.env.REACT_APP_API_KEY,
      })
      .then((res) => {
        const listings = res.data;
        setTotalItemsCount(listings.length);
        if (listings.length === 0) {
          return props.history.push("/");
        }
        let listingListGroupItems = [];
        for (let i = 0; i < listings.length; i++) {
          listingListGroupItems.push({
            key: i,
            listGroupItem: (
              <ListGroupItem
                className="mb-3 searchResult"
                tag="a"
                href={`/motorcycle/${listings[i]._id}`}
                onClick={(e) => {
                  e.preventDefault();
                  props.history.push(`/motorcycle/${listings[i]._id}`);
                }}
                action
              >
                <Row>
                  <Col
                    sm="3"
                    className="d-flex align-items-center justify-content-center"
                  >
                    <img
                      src={
                        listings[i].details.mainPicture !== ""
                          ? listings[i].details.mainPicture
                          : listings[i].details.picturesToBeUploadedMeta[0]
                              .fileUrl
                      }
                      alt="Main Picture"
                      className="searchImage"
                    />
                  </Col>
                  <Col sm="9" className="mt-lg-0 mt-3">
                    <Row>
                      <Col xs="8">
                        <ListGroupItemHeading className="heading">
                          {listings[i].details.make === "Other"
                            ? listings[i].details.adTitle.length > 79
                              ? listings[i].details.adTitle.substring(0, 79) +
                                " ..."
                              : listings[i].details.adTitle
                            : listings[i].details.make}{" "}
                          {listings[i].details.model === "Other"
                            ? null
                            : listings[i].details.model}
                        </ListGroupItemHeading>
                      </Col>
                      <Col xs="4">
                        <ListGroupItemHeading className="float-right heading text-success">
                          Rs {listings[i].details.priceInput}
                        </ListGroupItemHeading>
                      </Col>
                    </Row>

                    <ListGroupItemText className="mt-2">
                      <Row>
                        <Col xs="9">
                          <div>
                            <img alt="" src={kilometerSVG} width="20" />{" "}
                            <span>{listings[i].details.kilometerInput} km</span>
                          </div>
                          <div className="mt-1">
                            <img alt="" src={ccSVG} width="20" />{" "}
                            <span>{listings[i].details.ccInput} cc</span>
                          </div>
                          <div className="mt-1">
                            <img alt="" src={districtSVG} width="20" />{" "}
                            <span>{listings[i].details.districtSelected}</span>
                          </div>
                        </Col>
                      </Row>
                    </ListGroupItemText>
                  </Col>
                </Row>
              </ListGroupItem>
            ),
          });
        }
        setUpListingListGroupItems(listingListGroupItems);
        setLoading(false);
      })
      .catch((err) => {
        props.history.push("/");
        console.log(err);
      });
  }, []);

  // Get the 15 current listing based on the active page number
  useEffect(() => {
    // Get current posts
    const indexOfLastListing = activePage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = listingListGroupItems.slice(
      indexOfFirstListing,
      indexOfLastListing
    );
    setCurrentListings(currentListings);
  }, [listingListGroupItems, activePage, listingsPerPage]);

  return (
    <div>
      <Fragment>
        <UnAuthNavbar history={props.history} location={props.location} />
        <Container className="mt-5">
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <PropagateLoader size={15} color={"#1881d8"} loading={true} />
              <br />
              <br />
            </div>
          ) : (
            <Row>
              <Col md="3">
                <UserListingSideBar userId={props.match.params.userId} />
              </Col>
              <Col md="9" className="mt-4 mt-md-0">
                {currentListings.map((lGT) => lGT.listGroupItem)}
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={listingsPerPage}
                  totalItemsCount={totalItemsCount}
                  pageRangeDisplayed={5}
                  itemClass="page-item mb-5"
                  linkClass="page-link"
                  onChange={handlePageChange}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Fragment>
    </div>
  );
};

export default UserMotorcycleListings;
