import axios from "axios";

export const getProvincesWithDistricts = (setDistricts) => {
  axios
    .get("/api/provinceWithDistricts/", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      setDistricts(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
