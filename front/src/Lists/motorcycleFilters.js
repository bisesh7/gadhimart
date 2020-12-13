import axios from "axios";

export const getMotorcycleBodyType = (setMotorcycleBodyType) => {
  axios
    .get("/api/filters/motorcycle/bodyTypes", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleBodyType(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMotorcycleConditions = (setMotorcycleConditions) => {
  axios
    .get("/api/filters/motorcycle/conditions", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleConditions(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMotorcycleFuelTypes = (setMotorcycleFuelTypes) => {
  axios
    .get("/api/filters/motorcycle/fuelTypes", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleFuelTypes(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMotorcycleColors = (setMotorcycleColors) => {
  axios
    .get("/api/filters/motorcycle/colors", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleColors(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMotorcycleFeaturesFrontEnd = (
  setMotorcycleFeaturesFrontEnd
) => {
  axios
    .get("/api/filters/motorcycle/featuresFrontEnd", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleFeaturesFrontEnd(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMotorcycleFeaturesDatabase = (
  setMotorcycleFeaturesDatabase
) => {
  axios
    .get("/api/filters/motorcycle/featuresDatabase", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setMotorcycleFeaturesDatabase(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
