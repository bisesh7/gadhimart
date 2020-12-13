import React from "react";
import { Container, CardImg, CardBody } from "reactstrap";
import Carousel from "@brainhubeu/react-carousel";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";

const BodyType = (props) => {
  const firstDeckBodyTypes = [
    <a
      href={`/cars/a/a?PickupTruck`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Pickup%20Truck");
      }}
      key="pickup"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/1.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Pickup Truck</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/a/a?SUV`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=SUV");
      }}
      className="card custom-card"
      key="suv"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/2.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">SUV / Crossover</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/a/a?Sedan`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Sedan");
      }}
      key="sedan"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/3.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Sedan</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/a/a?Van`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Van");
      }}
      key="van"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/4.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Van</small>
      </CardBody>
    </a>,
  ];

  const secondDeckBodyType = [
    <a
      href={`/cars/a/a?Coupe`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Coupe");
      }}
      key="coupe"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/5.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Coupe</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/a/a?Hatchback`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Hatchback");
      }}
      key="hatchback"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/6.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Hatchback</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/a/a?Wagon`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/a/a?mk=&&mp=&&bt=Wagon");
      }}
      key="wagon"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/7.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Wagon</small>
      </CardBody>
    </a>,
    <a
      href={`/motorcycle/a/a?mp=&&mk=`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/motorcycle/a/a?mp=&&mk=");
      }}
      key="motorcycle"
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/car-body-types/motorcycle.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Motorcycle</small>
      </CardBody>
    </a>,
  ];

  return (
    <Container className="body-type mt-4">
      <h5 className="mb-4 heading">Browse by body</h5>
      <div className="showOnlyFromAndAbove-md">
        <div className="card-deck text-center">{firstDeckBodyTypes}</div>
        <div className="card-deck text-center mt-4">{secondDeckBodyType}</div>
      </div>

      <div className="showOnlyFromAndBelow-sm">
        <Carousel
          arrowLeft={
            <img
              className="slider-arrow"
              src={backButtonSVG}
              width="20"
              alt=""
            />
          }
          arrowRight={
            <img
              className="slider-arrow"
              src={nextButtonSVG}
              width="20"
              alt=""
            />
          }
          slidesPerPage={2}
          arrows
          dots
          addArrowClickHandler
        >
          {[...firstDeckBodyTypes, ...secondDeckBodyType]}
        </Carousel>
      </div>
    </Container>
  );
};

export default BodyType;
