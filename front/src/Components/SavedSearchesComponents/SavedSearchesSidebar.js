import React, { Fragment } from "react";
import { Nav } from "reactstrap";
import { NavLink } from "react-router-dom";

const SavedSearchesSidebar = (props) => {
  return (
    <Fragment>
      <Nav vertical pills>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/savedsearches/cars">
            Cars
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/savedsearches/motorcycles">
            Motorcycles
          </NavLink>
        </li>
      </Nav>
    </Fragment>
  );
};

export default SavedSearchesSidebar;
