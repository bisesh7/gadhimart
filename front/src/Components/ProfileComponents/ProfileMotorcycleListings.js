import React, { useEffect, useContext, Fragment, useState } from "react";
import { Row, Col, Container } from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import ProfileSideBar from "./ProfileSidebar";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import MotorcycleListings from "./MotorcycleListings";

const ProfileMotorcycleListing = (props) => {
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
          <Container className="pt-5">
            <Row>
              <Col md="3">
                <ProfileSideBar />
              </Col>
              <Col md="9" className="mt-4 mt-md-0">
                <MotorcycleListings props={props} />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default ProfileMotorcycleListing;
