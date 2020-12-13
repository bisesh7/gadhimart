import axios from "axios";

export const getCarMakeAndModels = (setCar) => {
  axios
    .get("/api/carMakesAndModels/", {
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
      },
    })
    .then((res) => {
      const makeAndModels = res.data.data;
      const compare = (a, b) => {
        if (a.make < b.make) {
          return -1;
        }
        if (a.make > b.make) {
          return 1;
        }
        return 0;
      };

      makeAndModels.sort(compare);
      setCar(makeAndModels);
    })
    .catch((err) => {
      console.log(err);
      console.log("Failed to get the car List");
    });
};
