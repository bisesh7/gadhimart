import React from "react";
import { Container } from "reactstrap";
import Help from "./Help";

const HelpContactUs = (props) => {
  return (
    <div>
      <Help {...props} />
      <Container className="mt-4">
        <strong> You can contact us through:</strong> <br />
        Phone: 9843776006 (10-5 working days) <br /> Email: gadhimart@gmail.com
      </Container>
    </div>
  );
};

export default HelpContactUs;
