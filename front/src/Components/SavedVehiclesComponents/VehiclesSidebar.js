import React, { Fragment } from "react";
import { Nav } from "reactstrap";
import { NavLink } from "react-router-dom";

const VehiclesSidebar = (props) => {
  return (
    <Fragment>
      <Nav vertical pills>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/savedVehicles/cars">
            Cars
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/savedVehicles/motorcycles">
            Motorcycles
          </NavLink>
        </li>
      </Nav>
    </Fragment>
  );
};

export default VehiclesSidebar;
