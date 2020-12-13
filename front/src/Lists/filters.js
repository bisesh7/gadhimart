import axios from "axios";

export const getCarTransmission = (setCarTransmissions) => {
  axios
    .get("/api/filters/car/transmissions", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setCarTransmissions(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getCarBodyType = (setCarBodyType) => {
  axios
    .get("/api/filters/car/bodyTypes", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setCarBodyType(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getCarConditions = (setCarConditions) => {
  axios
    .get("/api/filters/car/conditions", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setCarConditions(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getFuelTypes = (setFuelTypes) => {
  axios
    .get("/api/filters/car/fuelTypes", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setFuelTypes(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getDrivetrains = (setDrivetrains) => {
  axios
    .get("/api/filters/car/driveTrains", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setDrivetrains(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getColors = (setColors) => {
  axios
    .get("/api/filters/car/colors", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setColors(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getSeats = (setSeats) => {
  axios
    .get("/api/filters/car/seats", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setSeats(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getDoors = (setDoors) => {
  axios
    .get("/api/filters/car/doors", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setDoors(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getFeaturesFrontEnd = (setFeaturesFrontEnd) => {
  axios
    .get("/api/filters/car/featuresFrontEnd", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setFeaturesFrontEnd(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getFeaturesDatabase = (setFeaturesDatabase) => {
  axios
    .get("/api/filters/car/featuresDatabase", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setFeaturesDatabase(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
