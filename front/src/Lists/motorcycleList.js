import axios from "axios";

export const getMotorcycleMakeAndModels = (setMotorcycles) => {
  axios
    .get("/api/motorcycleMakesAndModels/", {
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
      setMotorcycles(makeAndModels);
    })
    .catch((err) => {
      console.log(err);
    });
};
