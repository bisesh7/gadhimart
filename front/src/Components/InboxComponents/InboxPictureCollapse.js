import React, { useState } from "react";
import { Collapse, Button, CardImg } from "reactstrap";

const InboxPictureCollapse = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <a
        href="showMore"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        style={props.style}
      >
        {isOpen ? <span>Hide &#9650;</span> : <span>Picture &#9660;</span>}
      </a>
      <Collapse isOpen={isOpen} className="mt-2">
        <CardImg
          top
          width="100%"
          src={props.mainPicture}
          alt="Car main picture"
        />
      </Collapse>
    </div>
  );
};

export default InboxPictureCollapse;
