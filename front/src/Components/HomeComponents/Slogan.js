import React from "react";
import { Container, Row, Col } from "reactstrap";

const Slogan = () => {
  return (
    <div className="slogan-bg">
      <Container>
        <Row>
          <Col sm="12" md="6">
            <div className="slogan">
              <h1>
                <span className="top">EASILY GET </span>
              </h1>
              <h1 className="bottomSlogan">
                <span className="bottom"> YOUR PERFECT RIDE </span>
              </h1>
            </div>
          </Col>
          <Col
            sm="12"
            md="6"
            className="d-flex justify-content-end mt-4 mt-md-0"
          >
            <img
              src="/assets/images/backgroundCar.png"
              width="400"
              alt="backgroundCar"
              srcSet=""
              className="background-car"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Slogan;
