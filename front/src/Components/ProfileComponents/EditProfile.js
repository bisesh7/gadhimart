import React, {
  Component,
  useState,
  useContext,
  useEffect,
  Fragment,
} from "react";
import { Row, Col, Container } from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import { AuthContext } from "../../Contexts/AuthContext";
import EditProfileForm from "./EditProfileForm";
import { clearCarDetailsInSessionStorage, setAuthStatus } from "../../methods";
import ProfilePictureComponent from "./ProfilePictureComponent";
import { Link } from "react-router-dom";

const EditProfile = (props) => {
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
          <AuthNavbar />
          <Container className="pt-5">
            <Link
              to="/profile/listings/car"
              className="heading lightenOnHover"
              style={{ textDecoration: "none" }}
            >
              &#5130; Back
            </Link>
            <Row className="mt-3">
              <Col md="9" className="edit-profile-form">
                <EditProfileForm />
              </Col>

              <Col md="3">
                <ProfilePictureComponent />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default EditProfile;
