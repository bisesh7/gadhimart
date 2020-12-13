import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Nav,
} from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import { isEmpty } from "../../methods";
import axios from "axios";

const ProfileSideBar = (props) => {
  const { auth } = useContext(AuthContext);
  const [userId] = useState(props.userId);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    axios
      .post(`/api/users/get/${userId}`, {
        valid: process.env.REACT_APP_API_KEY,
      })
      .then((res) => {
        setUserDetail(res.data.userDetail);
      })
      .catch((err) => {
        console.log(err);
        alert("Error occurred!");
      });
  }, [userId]);

  return (
    <div>
      {userDetail !== null ? (
        <div>
          <Card>
            <CardImg
              className="profile-picture mx-auto"
              top
              src={userDetail.profilePicturePath}
              alt="Profile picture"
            />
            <CardBody>
              <CardTitle className="text-center">
                <h4>{userDetail.name}</h4>
              </CardTitle>
            </CardBody>
          </Card>
          <Nav vertical pills className="pt-4">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                exact
                to={`/listings/car/${userId}`}
              >
                Car Listings
              </NavLink>
              <NavLink
                className="nav-link"
                exact
                to={`/listings/motorcycle/${userId}`}
              >
                Motorcycle Listings
              </NavLink>
            </li>
          </Nav>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileSideBar;
