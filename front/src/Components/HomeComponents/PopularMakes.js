import React from "react";
import { Container, CardDeck, CardImg, CardBody, CardTitle } from "reactstrap";
import Carousel from "@brainhubeu/react-carousel";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";

const PopularMakes = (props) => {
  const firstDeckPopularMakes = [
    <a
      href={`/cars/Hyundai/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Hyundai/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/hyundai.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Hyundai</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/Toyota/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Toyota/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/toyota.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Toyota</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/Tata/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Tata/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/tata.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Tata</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/Suzuki/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Suzuki/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/suzuki.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Suzuki</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/Ford/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Ford/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/ford.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Ford</small>
      </CardBody>
    </a>,
  ];

  const secondDeckPopularMakes = [
    <a
      href={`/cars/Mahindra/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Mahindra/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/mahindra.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Mahindra</small>
      </CardBody>
    </a>,
    <a
      href={`/cars/Volkswagen/`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/cars/Volkswagen/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/volkswagen.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Volkswagen</small>
      </CardBody>
    </a>,
    <a
      href={`/motorcycle/bajaj`}
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/motorcycle/Bajaj/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/bajaj.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Bajaj</small>
      </CardBody>
    </a>,
    <a
      href="/motorycycle/royalEnfield"
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/motorcycle/Royal%20Enfield/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/royal-enfield.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Royal Enfield</small>
      </CardBody>
    </a>,
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        props.history.push("/motorcycle/Honda/a?mp=&&mk=");
      }}
      className="card custom-card"
    >
      <CardImg
        top
        width="100%"
        src="/assets/images/popular-make/honda-bikes.png"
        alt="Card image cap"
      />
      <CardBody>
        <small className="heading">Honda</small>
      </CardBody>
    </a>,
  ];

  return (
    <Container className="popular-makes mt-4">
      <h5 className="mb-4 heading">Popular Makes</h5>
      <div className="showOnlyFromAndAbove-md">
        <CardDeck className="text-center">{firstDeckPopularMakes}</CardDeck>

        <CardDeck className="mt-4 text-center">
          {secondDeckPopularMakes}
        </CardDeck>
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
          {[...firstDeckPopularMakes, ...secondDeckPopularMakes]}
        </Carousel>
      </div>
    </Container>
  );
};

export default PopularMakes;
