import React, { useEffect, useState, useContext } from "react";
import {
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../../methods";
import UnAuthNavbar from "./UnAuthNavbar";
import CarInformation from "./CarInformation";
import CarFilterAndSearchResult from "./CarFilterAndSearchResult";
import { getCarMakeAndModels } from "../../Lists/carList";
import queryString from "query-string";
import { AuthContext } from "../../Contexts/AuthContext";
import Footer from "../Footer";

const CarSearch = (props) => {
  const [make, setMake] = useState(props.match.params.make);
  const [model, setModel] = useState(props.match.params.model);
  const [maxPrice, setMaxPrice] = useState();
  const [maxKilometers, setMaxKilometers] = useState();
  const { auth, dispatch } = useContext(AuthContext);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      promiseCheckAuth(dispatch)
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
          }
        })
        .catch((err) => {
          console.log("Not signed in.");
        });
    }

    clearCarDetailsInSessionStorage();
  }, [auth]);

  useEffect(() => {
    setMake(props.match.params.make);
    setModel(props.match.params.model);
  }, [props.match.params.make, props.match.params.model]);

  // Check whether the make selected is within the car list.
  const makeSelectedIsWithinTheCarList = () => {
    if (make === "a") {
      return true;
    }
    return cars.some((car) => car.make.toUpperCase() === make.toUpperCase());
  };

  // Check whether the model selected is within the car list.
  const modelSelectedIsWithinTheCarList = () => {
    if (model === "other" || model === "a") {
      return true;
    }

    let carMakeObject = cars.find(
      (car) => car.make.toUpperCase() === make.toUpperCase()
    );

    if (typeof carMakeObject === "undefined") {
      return false;
    }

    if (model.toLowerCase() === "other") {
      return true;
    }

    return carMakeObject.models.some(
      (carModel) => carModel.model.toUpperCase() === model.toUpperCase()
    );
  };

  const error = () => {
    console.log("Error occured");
    props.history.push("/");
  };

  // Validate make and model
  useEffect(() => {
    if (
      typeof cars !== "undefined" &&
      cars.length &&
      (!makeSelectedIsWithinTheCarList() || !modelSelectedIsWithinTheCarList())
    ) {
      error();
    }
  }, [cars, make, model]);

  // Vaidate ans set max price and kilometer
  useEffect(() => {
    try {
      if (props.location.search) {
        const parsedQueryStrings = queryString.parse(props.location.search);
        let maxPrice = parsedQueryStrings.mp;
        let maxKilometers = parsedQueryStrings.mk;

        if (
          typeof maxPrice === "undefined" ||
          typeof maxKilometers === "undefined"
        ) {
          throw "Required querystring missing";
        }

        if (maxPrice === "") {
          maxPrice = "a";
        }

        if (maxKilometers === "") {
          maxKilometers = "a";
        }

        setMaxPrice(maxPrice);
        setMaxKilometers(maxKilometers);
      } else {
        throw "No querystrings";
      }
    } catch (err) {
      error();
    }
  }, [props.location.search]);

  return (
    <div>
      <UnAuthNavbar
        carListView={true}
        history={props.history}
        location={props.location}
      />
      <CarInformation
        make={make}
        model={model}
        location={props.location}
        history={props.history}
      />
      <CarFilterAndSearchResult
        make={make}
        model={model}
        maxPrice={maxPrice}
        maxKilometers={maxKilometers}
        history={props.history}
        location={props.location}
      />
      <Footer className="mb-4" history={props.history} />
    </div>
  );
};

export default CarSearch;
