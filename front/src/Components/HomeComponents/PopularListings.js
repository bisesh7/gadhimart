import React, { useEffect, useState } from "react";
import { Container, CardTitle, CardBody, CardImg } from "reactstrap";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import axios from "axios";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";

const PopularListings = (props) => {
  const [vehicleCards, setVehicleCards] = useState([]);
  const [hideComponent, setHideComponent] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .post("/api/views/popularAds", {
        valid: process.env.REACT_APP_API_KEY,
      })
      .then((res) => {
        if (res.data.popularListings.length) {
          let vehicles = [];
          let promises = [];

          const popularListings = res.data.popularListings;
          // Add all the axios calls to the list and use
          // promise to call them.
          for (let i = 0; i < popularListings.length; i++) {
            if (popularListings[i].vehicleType === "Car") {
              promises.push(
                axios
                  .post(
                    `/api/car/getListingByID/${popularListings[i].vehicleId}`,
                    {
                      valid: process.env.REACT_APP_API_KEY,
                    }
                  )
                  .then((response) => {
                    if (auth.user.id !== response.data.listing.userId) {
                      // if the user is logged in and the popular vehicle is of the user then
                      // we need to discard this popular vehicle
                      vehicles.push({
                        vehicleType: "Car",
                        vehicle: response.data.listing.carDetails,
                        vehicleId: popularListings[i].vehicleId,
                      });
                    }
                  })
              );
            } else if (popularListings[i].vehicleType === "Motorcycle") {
              promises.push(
                axios
                  .post(
                    `/api/motorcycle/getListingByID/${popularListings[i].vehicleId}`,
                    {
                      valid: process.env.REACT_APP_API_KEY,
                    }
                  )
                  .then((response) => {
                    if (auth.user.id !== response.data.listing.userId) {
                      // if the user is logged in and the popular vehicle is of the user then
                      // we need to discard this popular vehicle
                      vehicles.push({
                        vehicleType: "Motorcycle",
                        vehicle: response.data.listing.details,
                        vehicleId: popularListings[i].vehicleId,
                      });
                    }
                  })
              );
            }
          }
          Promise.all(promises).then(() => {
            if (vehicles.length >= 1) {
              let vehicleCards = [];
              for (let i = 0; i < vehicles.length; i++) {
                vehicleCards.push(
                  <a
                    className="custom-card card"
                    href={
                      vehicles[i].vehicleType === "Car"
                        ? `/car/${vehicles[i].vehicleId}`
                        : `/motorcycle/${vehicles[i].vehicleId}`
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (vehicles[i].vehicleType === "Car") {
                        props.history.push(`/car/${vehicles[i].vehicleId}`);
                      } else {
                        props.history.push(
                          `/motorcycle/${vehicles[i].vehicleId}`
                        );
                      }
                    }}
                    style={{ height: "100%" }}
                    key={i}
                  >
                    <CardImg
                      top
                      width="100%"
                      src={
                        vehicles[i].vehicle.mainPicture !== ""
                          ? vehicles[i].vehicle.mainPicture
                          : vehicles[i].vehicle.picturesToBeUploadedMeta[0]
                              .fileUrl
                      }
                      height="110"
                      style={{ objectFit: "cover" }}
                      alt={
                        vehicles[i].vehicle.picturesToBeUploadedMeta[0]
                          .serverFileName
                      }
                    />
                    <CardBody className="text-center">
                      <CardTitle>{vehicles[i].vehicle.atTitle}</CardTitle>
                      <small className="heading">
                        {vehicles[i].vehicleType === "Car"
                          ? vehicles[i].vehicle.carMakeSelected === "Other"
                            ? vehicles[i].vehicle.adTitle.length > 79
                              ? vehicles[i].vehicle.adTitle.substring(0, 79) +
                                " ..."
                              : vehicles[i].vehicle.adTitle
                            : vehicles[i].vehicle.carMakeSelected
                          : vehicles[i].vehicle.make === "Other"
                          ? vehicles[i].vehicle.adTitle.length > 79
                            ? vehicles[i].vehicle.adTitle.substring(0, 79) +
                              " ..."
                            : vehicles[i].vehicle.adTitle
                          : vehicles[i].vehicle.make}{" "}
                        &nbsp;
                        {vehicles[i].vehicleType === "Car"
                          ? vehicles[i].vehicle.carModelSelected === "Other"
                            ? null
                            : vehicles[i].vehicle.carModelSelected
                          : vehicles[i].vehicle.model === "Other"
                          ? null
                          : vehicles[i].vehicle.model}
                      </small>{" "}
                      <br />
                      <small className="text-success heading">
                        Rs &nbsp;
                        {vehicles[i].vehicleType === "Car"
                          ? vehicles[i].vehicle.carPriceInput
                          : vehicles[i].vehicle.priceInput}
                      </small>
                    </CardBody>
                  </a>
                );
              }
              setVehicleCards(vehicleCards);
              setHideComponent(false);
            } else {
              // if popular vehicle does not contain vehicles
              setHideComponent(true);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth]);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
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

  return (
    <div>
      {hideComponent ? (
        <div className="mt-3"></div>
      ) : (
        <Container className="popular-searches mt-5">
          <h5 className="mb-4 heading">Popular Listings</h5>

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
            slidesPerPage={
              windowSize === "large"
                ? 5
                : windowSize === "medium"
                ? 4
                : windowSize === "small"
                ? 3
                : windowSize === "extraSmall"
                ? 2
                : null
            }
            arrows
            dots
            addArrowClickHandler
          >
            {vehicleCards}
          </Carousel>
        </Container>
      )}
    </div>
  );
};

export default PopularListings;
