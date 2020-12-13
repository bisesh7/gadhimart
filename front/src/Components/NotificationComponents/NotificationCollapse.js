import React, { useState } from "react";
import { Collapse } from "reactstrap";

const NotificationCollapse = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <a
        href="showMore"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        style={{ textDecoration: "none" }}
      >
        {isOpen ? (
          <span>Show less &nbsp; &#9650;</span>
        ) : (
          <span>Show more &nbsp; &#9660;</span>
        )}
      </a>
      <Collapse className="mt-1" isOpen={isOpen}>
        {props.content}
      </Collapse>
    </div>
  );
};

export default NotificationCollapse;
