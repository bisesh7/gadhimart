import axios from "axios";
import React from "react";

export const handleSignOut = (e, dispatch) => {
  e.preventDefault();
  axios({
    method: "get",
    url: "/api/auth/signout",
  })
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: "LOGOUT_PASS",
        });
        window.location.replace("/");
      }
    })
    .catch((err) => {
      if (!err.response.data.success) {
        window.location.replace("/");
      } else {
        console.log(err);
      }
    });
};

// Function to check if the object is empty
export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

// css styles for the dropdown links
export const profileDropdownStyle = {
  textDecoration: "none",
  color: "black",
};

// Check if the user is authenticated then send response
export const promiseCheckAuth = () => {
  return new Promise(function (resolve, reject) {
    axios({
      method: "post",
      url: "/api/auth/checkAuth",
      data: {
        valid: process.env.REACT_APP_API_KEY,
      },
    })
      .then((res) => {
        if (res.data.isAuthenticated) {
          resolve(res);
        } else {
          reject("Unauthenticated!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// For direct request and reloads
export const setAuthStatus = (
  auth,
  dispatch,
  props,
  setIsAuthenticated,
  setCheckingAuth
) => {
  // If the user is logged in then redirect to the homepage
  if (auth.isAuthenticated) {
    setIsAuthenticated(true);
  } else {
    setCheckingAuth(true);
    axios({
      method: "post",
      url: "/api/auth/checkAuth",
      data: {
        valid: process.env.REACT_APP_API_KEY,
      },
    }).then((res) => {
      if (res.data.isAuthenticated) {
        dispatch({
          type: "LOGIN_PASS",
          user: res.data.user,
        });
        setCheckingAuth(false);
        setIsAuthenticated(true);
      } else {
        dispatch({
          type: "LOGIN_FAIL",
        });
        setCheckingAuth(false);
        setIsAuthenticated(false);
        props.history.push("/");
      }
    });
  }
};

// Check if the user is authenticated, if so update the context else logout and redirect to home
export const checkAuth = (dispatch, props) => {
  axios({
    method: "post",
    url: "/api/auth/checkAuth",
    data: {
      valid: process.env.REACT_APP_API_KEY,
    },
  })
    .then((res) => {
      if (res.data.isAuthenticated) {
        dispatch({
          type: "LOGIN_PASS",
          user: res.data.user,
        });
      } else {
        dispatch({
          type: "LOGIN_FAIL",
        });
        props.history.push("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// This function clears the session storage of cardetails
// and deletes the temp folder if there is any
export const clearCarDetailsInSessionStorage = () => {
  const clearSessionStorages = () => {
    if (sessionStorage.getItem("previewCarDetails") !== null) {
      sessionStorage.removeItem("previewCarDetails");
    }
  };

  clearSessionStorages();

  axios.post("/api/tempFolders/deleteTempFolders", { valid: "VAlID2435" });
};

// Create new toast notification
export const createNewMessageNotification = (
  id,
  socket,
  props,
  addToast,
  setHasNotifications
) => {
  if (socket !== null) {
    // This is done by the reciever end to display toast notification
    socket.on(id + "newMessage", (message) => {
      if (props.location.pathname !== "/inbox") {
        const content = (
          <div
            onClick={() => {
              props.history.push("/notifications");
            }}
            className="toastNotification"
          >
            <strong>New Message</strong>
            <div className="mt-2">You have a new message</div>
          </div>
        );

        // Create new toast notification
        addToast(content, {
          appearance: "info",
          autoDismiss: true,
        });
        // Navbar front end display for unseen notification
        setHasNotifications(true);
        props.setHasNotifications(true);
      }
    });

    //This is sent to many user but only a certain single user responses
    socket.on(id + "newToastNotification", ({ message }) => {
      let content = (
        <div
          onClick={() => {
            props.history.push("/notifications");
          }}
          className="toastNotification"
        >
          <strong>{message}</strong>
        </div>
      );

      addToast(content, {
        appearance: "info",
        autoDismiss: true,
      });
      setHasNotifications(true);
      props.setHasNotifications(true);
    });

    // This is sent to many user but only responded by certain users included in the list
    socket.on("newToastNotification", ({ message, to }) => {
      if (to.includes(id)) {
        let content = (
          <div
            onClick={() => {
              props.history.push("/notifications");
            }}
            className="toastNotification"
          >
            <strong>{message}</strong>
          </div>
        );

        addToast(content, {
          appearance: "info",
          autoDismiss: true,
        });
      }
      setHasNotifications(true);
      props.setHasNotifications(true);
    });

    // This is done by sender end to save the notification to the database
    socket.on(id + "newMessageNotification", (message) => {
      axios
        .post("/api/notification/newMessage", { message, valid: "VaLid223" })
        .then((res) => {
          console.log("New notification has been saved.");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
};

// Create UI for filters that has been saved by the user
export const createFilterContent = (filters, vehicleType) => {
  let filterContent = [];
  let numberOfFilters = 0;

  const addToFilterContent = (filter, frontEndFilter) => {
    numberOfFilters++;
    filterContent.push(
      <span>
        {`${frontEndFilter}: ${filters[filter]}`} <br />
      </span>
    );
  };

  let features = [];

  switch (vehicleType) {
    case "Car":
      for (const filter in filters) {
        if (filter === "") {
          continue;
        }
        switch (filter) {
          case "carTransmissionSelected":
            addToFilterContent(filter, "Transmission");
            break;
          case "carBodyTypeSelected":
            addToFilterContent(filter, "Body Type");
            break;
          case "carConditionSelected":
            addToFilterContent(filter, "Condition");
            break;
          case "carFuelTypeSelected":
            addToFilterContent(filter, "Fuel Type");
            break;
          case "carDrivetrainSelected":
            addToFilterContent(filter, "Drivetrain");
            break;
          case "carColorSelected":
            addToFilterContent(filter, "Color");
            break;
          case "carSeatsSelected":
            addToFilterContent(filter, "Seats");
            break;
          case "carTrimInput":
            addToFilterContent(filter, "Trim");
            break;
          case "carMaxPrice":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Price");
            }
            break;
          case "carMinPrice":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Price");
            }
            break;
          case "carMaxKilometer":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Kilometers");
            }
            break;
          case "carMinKilometer":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Kilometers");
            }
            break;
          case "carMaxYear":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Year");
            }
            break;
          case "carMinYear":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Year");
            }
            break;
          case "provinceSelected":
            addToFilterContent(filter, "Province");
            break;
          case "districtSelected":
            addToFilterContent(filter, "District");
            break;
          case "carHasSunRoof":
            features.push("Sun roof");
            break;
          case "carHasAlloyWheels":
            features.push("Alloy wheels");
            break;
          case "carHasNavigationSystem":
            features.push("Navigation system");
            break;
          case "carHasBluetooth":
            features.push("Bluetooth");
            break;
          case "carHasPushStart":
            features.push("Push start button");
            break;
          case "carHasParkingAssistant":
            features.push("Parking assistant");
            break;
          case "carHasCruiseControl":
            features.push("Cruise control");
            break;
          case "carHasAirConditioning":
            features.push("Air conditioning");
            break;
          case "carHasPowerSteering":
            features.push("Power steering");
            break;
          case "carHasPowerWindow":
            features.push("Power window");
            break;
          case "carHasKeylessEntry":
            features.push("Keyless entry");
            break;
          case "carHasAbs":
            features.push("Antilock braking system");
            break;
          case "carHasCarplay":
            features.push("Car play");
            break;
          case "carHasAndroidAuto":
            features.push("Android auto");
            break;
        }
      }
      break;

    case "Motorcycle":
      for (const filter in filters) {
        if (filter === "") {
          continue;
        }
        switch (filter) {
          case "bodyTypeSelected":
            addToFilterContent(filter, "Body Type");
            break;
          case "conditionSelected":
            addToFilterContent(filter, "Condition");
            break;
          case "fuelTypeSelected":
            addToFilterContent(filter, "Fuel Type");
            break;
          case "colorSelected":
            addToFilterContent(filter, "Color");
            break;
          case "maxPrice":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Price");
            }
            break;
          case "minPrice":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Price");
            }
            break;
          case "maxKilometer":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Kilometers");
            }
            break;
          case "minKilometer":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Kilometers");
            }
            break;
          case "maxYear":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max Year");
            }
            break;
          case "minYear":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min Year");
            }
            break;
          case "maxCC":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Max CC");
            }
            break;
          case "minCC":
            if (filters[filter] !== "a") {
              addToFilterContent(filter, "Min CC");
            }
            break;
          case "provinceSelected":
            addToFilterContent(filter, "Province");
            break;
          case "districtSelected":
            addToFilterContent(filter, "District");
            break;
          case "hasElectricStart":
            features.push("Electric start");
            break;
          case "hasAlloyWheels":
            features.push("Alloy wheels");
            break;
          case "hasTubelessTyres":
            features.push("Tubeless tyres");
            break;
          case "hasDigitalDisplayPanel":
            features.push("Digital display panel");
            break;
          case "hasProjectedHeadLight":
            features.push("Projected headlight");
            break;
          case "hasLedTailLight":
            features.push("Led tail light");
            break;
          case "hasFrontDiscBrake":
            features.push("Front disc brake");
            break;
          case "hasRearDiscBrake":
            features.push("Rear disc brake");
            break;
          case "hasAbs":
            features.push("Anti-lock braking system (ABS)");
            break;
          case "hasMonoSuspension":
            features.push("Mono suspension");
            break;
          case "hasSplitSeat":
            features.push("Split seat");
            break;
          case "hasTripMeter":
            features.push("Tripmeter");
            break;
        }
      }
      break;

    default:
      break;
  }

  if (features.length >= 1) {
    let li = [];
    features.forEach((feature) => {
      li.push(<li>{feature}</li>);
    });
    let content = (
      <div>
        <span>{`Features: `}</span>
        <ol>{li}</ol>
      </div>
    );
    numberOfFilters++;
    filterContent.push(content);
  }

  return { filterContent, numberOfFilters };
};

// Create querystring from the filters saved to search for vehicles
export const createQSFromFilters = (filters, vehicleType) => {
  let searchFilters = {};
  let featuresList = [];

  const getFeaturesQueryString = (key, arr) => {
    arr = arr.map(encodeURIComponent);
    return key + "[]=" + arr.join("&" + key + "[]=");
  };

  let qs = "";

  const createCarQueryString = (searchFilters) => {
    let qs = "?";
    for (let key in searchFilters) {
      // when using the querystrings library there will be key "" which we need to discard
      if (
        key === "" ||
        searchFilters[key] === "any" ||
        searchFilters[key] === false ||
        (key === "tr" && searchFilters[key] === "") ||
        (key !== "mk" && key !== "mp" && searchFilters[key] === "")
      ) {
        continue;
      } else if (key === "feature[]") {
        // console.log(getFeaturesQueryString("feature", searchFilters[key]));
        qs += `${
          featuresList.length < 1
            ? ""
            : getFeaturesQueryString("feature", featuresList)
        }&&`;
      } else {
        // Add all the filters to the query string, if filter is equal to "a" we use empty string
        qs =
          qs +
          `${key}=${searchFilters[key] === "a" ? "" : searchFilters[key]}&&`;
      }
    }
    return qs;
  };

  const createMotorcycleQueryString = (searchFilters) => {
    let qs = "?";
    for (let key in searchFilters) {
      // when using the querystrings library there will be key "" which we need to discard
      if (
        key === "" ||
        searchFilters[key] === "any" ||
        searchFilters[key] === false ||
        (key !== "mk" &&
          key !== "mp" &&
          (searchFilters[key] === "" || searchFilters[key] === "a"))
      ) {
        continue;
      } else if (key === "feature[]") {
        // console.log(getFeaturesQueryString("feature", searchFilters[key]));
        qs += `${
          featuresList.length < 1
            ? ""
            : getFeaturesQueryString("feature", featuresList)
        }&&`;
      } else {
        // Add all the filters to the query string, if filter is equal to "a" we use empty string
        qs =
          qs +
          `${key}=${searchFilters[key] === "a" ? "" : searchFilters[key]}&&`;
      }
    }
    return qs;
  };

  switch (vehicleType) {
    case "Car":
      for (const filter in filters) {
        switch (filter) {
          case "carTransmissionSelected":
            searchFilters["t"] = filters[filter];
            break;
          case "carBodyTypeSelected":
            searchFilters["bt"] = filters[filter];
            break;
          case "carConditionSelected":
            searchFilters["c"] = filters[filter];
            break;
          case "carFuelTypeSelected":
            searchFilters["ft"] = filters[filter];
            break;
          case "carDrivetrainSelected":
            searchFilters["d"] = filters[filter];
            break;
          case "carColorSelected":
            searchFilters["cr"] = filters[filter];
            break;
          case "carSeatsSelected":
            searchFilters["s"] = filters[filter];
            break;
          case "carTrimInput":
            searchFilters["tr"] = filters[filter];
            break;
          case "carMaxPrice":
            if (filters[filter] === "a") {
              searchFilters["mp"] = "";
            } else {
              searchFilters["mp"] = filters[filter];
            }
            break;
          case "carMinPrice":
            if (filters[filter] === "a") {
              searchFilters["mnp"] = "";
            } else {
              searchFilters["mnp"] = filters[filter];
            }
            break;
          case "carMaxKilometer":
            if (filters[filter] === "a") {
              searchFilters["mk"] = "";
            } else {
              searchFilters["mk"] = filters[filter];
            }
            break;
          case "carMinKilometer":
            if (filters[filter] === "a") {
              searchFilters["mnk"] = "";
            } else {
              searchFilters["mnk"] = filters[filter];
            }
            break;
          case "carMaxYear":
            if (filters[filter] === "a") {
              searchFilters["my"] = "";
            } else {
              searchFilters["my"] = filters[filter];
            }
            break;
          case "carMinYear":
            if (filters[filter] === "a") {
              searchFilters["mny"] = "";
            } else {
              searchFilters["mny"] = filters[filter];
            }
            break;
          case "provinceSelected":
            searchFilters["pr"] = filters[filter];
            break;
          case "districtSelected":
            searchFilters["dis"] = filters[filter];
            break;
          case "carHasSunRoof":
            featuresList.push(filter);
            break;
          case "carHasAlloyWheels":
            featuresList.push(filter);
            break;
          case "carHasNavigationSystem":
            featuresList.push(filter);
            break;
          case "carHasBluetooth":
            featuresList.push(filter);
            break;
          case "carHasPushStart":
            featuresList.push(filter);
            break;
          case "carHasParkingAssistant":
            featuresList.push(filter);
            break;
          case "carHasCruiseControl":
            featuresList.push(filter);
            break;
          case "carHasAirConditioning":
            featuresList.push(filter);
            break;
          case "carHasPowerSteering":
            featuresList.push(filter);
            break;
          case "carHasPowerWindow":
            featuresList.push(filter);
            break;
          case "carHasKeylessEntry":
            featuresList.push(filter);
            break;
          case "carHasAbs":
            featuresList.push(filter);
            break;
          case "carHasCarplay":
            featuresList.push(filter);
            break;
          case "carHasAndroidAuto":
            featuresList.push(filter);
            break;
        }
      }
      if (featuresList.length >= 1) {
        searchFilters["feature[]"] = true;
      }

      qs = createCarQueryString(searchFilters);
      break;

    case "Motorcycle":
      for (const filter in filters) {
        switch (filter) {
          case "bodyTypeSelected":
            searchFilters["bt"] = filters[filter];
            break;
          case "conditionSelected":
            searchFilters["c"] = filters[filter];
            break;
          case "fuelTypeSelected":
            searchFilters["ft"] = filters[filter];
            break;
          case "colorSelected":
            searchFilters["cr"] = filters[filter];
            break;
          case "maxPrice":
            if (filters[filter] === "a") {
              searchFilters["mp"] = "";
            } else {
              searchFilters["mp"] = filters[filter];
            }
            break;
          case "minPrice":
            if (filters[filter] === "a") {
              searchFilters["mnp"] = "";
            } else {
              searchFilters["mnp"] = filters[filter];
            }
            break;
          case "maxKilometer":
            if (filters[filter] === "a") {
              searchFilters["mk"] = "";
            } else {
              searchFilters["mk"] = filters[filter];
            }
            break;
          case "minKilometer":
            if (filters[filter] === "a") {
              searchFilters["mnk"] = "";
            } else {
              searchFilters["mnk"] = filters[filter];
            }
            break;
          case "maxYear":
            if (filters[filter] === "a") {
              searchFilters["my"] = "";
            } else {
              searchFilters["my"] = filters[filter];
            }
            break;
          case "minYear":
            if (filters[filter] === "a") {
              searchFilters["mny"] = "";
            } else {
              searchFilters["mny"] = filters[filter];
            }
            break;
          case "maxCC":
            if (filters[filter] === "a") {
              searchFilters["mc"] = "";
            } else {
              searchFilters["mc"] = filters[filter];
            }
            break;
          case "minCC":
            if (filters[filter] === "a") {
              searchFilters["mnc"] = "";
            } else {
              searchFilters["mnc"] = filters[filter];
            }
            break;
          case "provinceSelected":
            searchFilters["pr"] = filters[filter];
            break;
          case "districtSelected":
            searchFilters["dis"] = filters[filter];
            break;
          case "hasElectricStart":
            featuresList.push(filter);
            break;
          case "hasAlloyWheels":
            featuresList.push(filter);
            break;
          case "hasTubelessTyres":
            featuresList.push(filter);
            break;
          case "hasDigitalDisplayPanel":
            featuresList.push(filter);
            break;
          case "hasProjectedHeadLight":
            featuresList.push(filter);
            break;
          case "hasLedTailLight":
            featuresList.push(filter);
            break;
          case "hasFrontDiscBrake":
            featuresList.push(filter);
            break;
          case "hasRearDiscBrake":
            featuresList.push(filter);
            break;
          case "hasAbs":
            featuresList.push(filter);
            break;
          case "hasMonoSuspension":
            featuresList.push(filter);
            break;
          case "hasSplitSeat":
            featuresList.push(filter);
            break;
          case "hasTripMeter":
            featuresList.push(filter);
            break;
        }
      }
      if (featuresList.length >= 1) {
        searchFilters["feature[]"] = true;
      }

      qs = createMotorcycleQueryString(searchFilters);
      break;
    default:
      break;
  }

  qs = qs.substring(0, qs.length - 2);
  return qs;
};
// Method to change first letter to capital
export const toCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.substring(1);
};
