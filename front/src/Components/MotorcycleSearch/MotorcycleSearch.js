import React, { useEffect, useState, useContext } from "react";
import {
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../../methods";
import UnAuthNavbar from "../CarSearch/UnAuthNavbar";
import { AuthContext } from "../../Contexts/AuthContext";
import { getMotorcycleMakeAndModels } from "../../Lists/motorcycleList";
import queryString from "query-string";
import MotorcycleInformation from "./MotorcycleInformation";
import MotorcycleFiltersAndSearchResults from "./MotorcyleFiltersAndSearchResults";
import Footer from "../Footer";

const MotorcycleSearch = (props) => {
  const [make, setMake] = useState(props.match.params.make);
  const [model, setModel] = useState(props.match.params.model);
  const [maxPrice, setMaxPrice] = useState();
  const [maxKilometers, setMaxKilometers] = useState();
  const { auth, dispatch } = useContext(AuthContext);
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
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
  const makeSelectedIsWithinTheList = () => {
    console.log(make);
    if (make === "a") {
      return true;
    }
    return motorcycles.some(
      (motorcycle) => motorcycle.make.toUpperCase() === make.toUpperCase()
    );
  };

  // Check whether the model selected is within the car list.
  const modelSelectedIsWithinTheList = () => {
    if (model === "other" || model === "a") {
      return true;
    }

    let makes = motorcycles.find(
      (motorcycle) => motorcycle.make.toUpperCase() === make.toUpperCase()
    );

    if (typeof makes === "undefined") {
      return false;
    }

    if (model.toLowerCase() === "other") {
      return true;
    }

    return makes.models.some(
      (motorcycleModel) =>
        motorcycleModel.model.toUpperCase() === model.toUpperCase()
    );
  };

  const error = () => {
    props.history.push("/");
  };

  // Validate make and model
  useEffect(() => {
    if (
      typeof motorcycles !== "undefined" &&
      motorcycles.length &&
      (!makeSelectedIsWithinTheList() || !modelSelectedIsWithinTheList())
    ) {
      error();
    }
  }, [make, model]);

  // Validate and Set max price and max kilometer
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
          throw "Required querystrings missing";
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
        location={props.location}
        history={props.history}
      />
      <MotorcycleInformation
        make={make}
        model={model}
        location={props.location}
        history={props.history}
      />
      <MotorcycleFiltersAndSearchResults
        location={props.location}
        history={props.history}
        make={make}
        model={model}
        maxPrice={maxPrice}
        maxKilometers={maxKilometers}
      />
      <Footer className="mb-4" history={props.history} />
    </div>
  );
};

export default MotorcycleSearch;
