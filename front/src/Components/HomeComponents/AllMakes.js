import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { getCarMakeAndModels } from "../../Lists/carList";
import { getMotorcycleMakeAndModels } from "../../Lists/motorcycleList";

const AllMakes = (props) => {
  const [allMakesCars, setAllMakesCars] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
  }, []);

  useEffect(() => {
    if (windowWidth > 992) {
      setWindowSize("large");
    } else if (windowWidth < 992 && windowWidth >= 768) {
      setWindowSize("medium");
    } else if (windowWidth < 768 && windowWidth >= 600) {
      setWindowSize("small");
    } else if (windowWidth < 600) {
      setWindowSize("extraSmall");
    }
  }, [windowWidth]);

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof cars !== "undefined" && cars.length) {
      const allMakesCars = cars.map((car) => car.make);
      setAllMakesCars(allMakesCars);
    }
  }, [cars]);

  // Old method (will be numberOfColsnged in future)
  const [allMakesMotorcycles, setAllMakesMotorcycles] = useState([]);
  useEffect(() => {
    const allMakesMotorcycles = motorcycles.map(
      (motorcycle) => motorcycle.make
    );
    setAllMakesMotorcycles(allMakesMotorcycles);
  }, [motorcycles]);

  // {Making the anchors of cars}
  const [carAnchors, setCarAnchors] = useState([]);

  useEffect(() => {
    const createCarMakeAnchors = (carMakes) => {
      let carAnchors = [];

      carMakes.forEach((make) => {
        carAnchors.push(
          <a
            href={`/cars/${make}/`}
            onClick={(e) => {
              e.preventDefault();
              props.history.push(`/cars/${make}/a?mp=&&mk=`);
            }}
            className="allMakesAnchor"
          >
            {make}
          </a>
        );
      });

      setCarAnchors(carAnchors);
    };

    createCarMakeAnchors(allMakesCars);
  }, [allMakesCars]);

  const [motorcycleAnchors, setMotorcycleAnchors] = useState([]);

  useEffect(() => {
    const createMotorcycleMakeAnchors = (makes) => {
      let motorcycleAnchors = [];

      makes.forEach((make) => {
        motorcycleAnchors.push(
          <a
            href={`/motorcycle/${make}/`}
            onClick={(e) => {
              e.preventDefault();
              props.history.push(`/motorcycle/${make}/a?mp=&&mk=`);
            }}
            className="allMakesAnchor"
          >
            {make}
          </a>
        );
      });

      setMotorcycleAnchors(motorcycleAnchors);
    };

    createMotorcycleMakeAnchors(allMakesMotorcycles);
  }, [allMakesMotorcycles]);

  const getAnchors = (anchors, windowSize) => {
    const totalAnchors = anchors.length;

    let numberOfCols = null;
    switch (windowSize) {
      case "large":
      case "medium":
        numberOfCols = 4;
        break;
      case "small":
        numberOfCols = 3;
        break;
      case "extraSmall":
        numberOfCols = 2;
        break;
      default:
        numberOfCols = 4;
    }

    const numberOfRows = Math.ceil(totalAnchors / numberOfCols);

    let anchorRowsAndCols = [];

    // For each columns we need a 4 rows
    for (var x = 0; x < numberOfRows; x++) {
      let cols = [];
      // for each row we need a different index of anchors
      for (var y = x * numberOfCols; y < x * numberOfCols + numberOfCols; y++) {
        if (typeof anchors[y] === "undefined") {
          break;
        }

        cols.push(
          <Col xs="6" sm="4" md="3">
            {anchors[y]}
          </Col>
        );
      }
      anchorRowsAndCols.push(<Row className="mt-2">{cols}</Row>);
    }

    return anchorRowsAndCols;
  };

  const [carMakesAnchorList, setCarMakeAnchorList] = useState(null);
  const [motorcycleMakesAnchorList, setMotorcycleMakesAnchorList] = useState(
    null
  );

  useEffect(() => {
    if (carAnchors !== null) {
      setCarMakeAnchorList(getAnchors(carAnchors, windowSize));
    }
  }, [carAnchors, windowSize]);

  useEffect(() => {
    if (motorcycleAnchors !== null) {
      setMotorcycleMakesAnchorList(getAnchors(motorcycleAnchors, windowSize));
    }
  }, [motorcycleAnchors, windowSize]);

  return (
    <Container>
      <h5 className="my-4 heading all-makes-cars">All Makes | Cars</h5>
      {carMakesAnchorList}
      <div className="mb-5">
        <h5 className="my-4 heading all-makes-motorcycles">
          All Makes | Motorcycles
        </h5>
        {motorcycleMakesAnchorList}
      </div>
    </Container>
  );
};

export default AllMakes;
