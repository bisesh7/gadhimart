import React, { useState } from "react";
import { Collapse } from "reactstrap";

const FilterCollapseComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      (+ {props.numberOfFilters} filters) &nbsp;
      <a
        href="showMore"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        style={{ textDecoration: "none" }}
      >
        {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
      </a>
      <Collapse className="mt-1" isOpen={isOpen}>
        {props.filterContent}
      </Collapse>
    </div>
  );
};

export default FilterCollapseComponent;
