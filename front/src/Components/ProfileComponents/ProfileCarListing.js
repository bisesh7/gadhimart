import React, { useEffect, useContext, Fragment, useState } from "react";
import { Row, Col, Container } from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import ProfileSideBar from "./ProfileSidebar";
import CarListings from "./CarListings";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";

const ProfileCarListing = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, []);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="mt-5">
            <Row>
              <Col md="3">
                <ProfileSideBar />
              </Col>
              <Col md="9" className="mt-4 mt-md-0">
                <CarListings props={props} />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default ProfileCarListing;
