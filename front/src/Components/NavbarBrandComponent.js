import React from "react";
import { Link } from "react-router-dom";
import { profileDropdownStyle } from "../methods";

const NavbarBrandComponent = () => {
  return (
    <Link
      className="nav-brand bright-logo"
      style={{ ...profileDropdownStyle, color: "white" }}
      to="/"
    >
      Gadhi<span className="mart">Mart</span>
    </Link>
  );
};

export default NavbarBrandComponent;
