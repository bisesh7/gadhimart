import React, { useContext } from "react";
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
import avatarSVG from "../../icons/avatar.svg";

const ProfileSideBar = (props) => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <Card>
        <CardImg
          className="profile-picture mx-auto"
          top
          src={auth.user.profilePicturePath}
          alt="Profile picture"
        />
        <CardBody>
          <CardTitle className="text-center">
            <h4>{isEmpty(auth.user) ? "Random" : auth.user.name}</h4>
          </CardTitle>

          <CardSubtitle className="text-center">
            <img src={avatarSVG} width="20" alt="" srcset="" />{" "}
            <Link to="/profile/edit">Edit profile</Link>
          </CardSubtitle>
        </CardBody>
      </Card>
      <Nav vertical pills className="pt-4">
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/profile/listings/car">
            Car Listings
          </NavLink>
          <NavLink className="nav-link" exact to="/profile/listings/motorcycle">
            Motorcycle Listings
          </NavLink>
        </li>
      </Nav>
    </div>
  );
};

export default ProfileSideBar;
