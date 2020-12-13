import React, { useState, useEffect } from "react";
import Select from "react-select";
import { getCarMakeAndModels } from "../../Lists/carList";

const CarSearchSelect = (props) => {
  const [selectedOption, setSelectOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

  useEffect(() => {
    if (typeof cars !== "undefined" && cars.length) {
      let options = [];
      try {
        cars.forEach((car) => {
          let modelOptions = [];

          // Make is not other then model needs to added
          if (car.make !== "Other") {
            modelOptions.push({
              label: `${car.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
              value: `${car.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
              make: car.make,
              model: "a",
            });
            car.models.forEach((model) => {
              modelOptions.push({
                label: `${car.make} ${model.model}`,
                value: `${car.make} ${model.model}`,
                make: car.make,
                model: model.model,
              });
            });
            modelOptions.push({
              label: `${car.make} Other`,
              value: `${car.make} Other`,
              make: car.make,
              model: "Other",
            });
            options.push({
              label: car.make,
              options: modelOptions,
            });
          } else {
            options.push({
              label: "Other",
              value: "Other",
            });
          }
        });
        setOptions(options);
      } catch (err) {
        console.log(err);
      }
    }
  }, [cars]);

  useEffect(() => {
    if (typeof props.selectedOption !== "undefined") {
      if (
        props.selectedOption &&
        props.selectedOption.make !== "Other" &&
        props.selectedOption.make !== "a" &&
        props.selectedOption.model !== "a"
      ) {
        setSelectOption(props.selectedOption);
      } else if (
        props.selectedOption.make !== "a" &&
        props.selectedOption.model === "a"
      ) {
        setSelectOption({
          label: `${props.selectedOption.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
          value: `${props.selectedOption.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
          make: props.selectedOption,
          model: "a",
        });
      } else if (
        props.selectedOption &&
        props.selectedOption.make === "Other"
      ) {
        setSelectOption({
          label: "Other",
          value: "Other",
        });
      } else if (props.selectedOption && props.selectedOption.make === "a") {
        setSelectOption(null);
      }
    }
  }, [props.selectedOption]);

  const handleChange = (selectedOption) => {
    // If selected option is removed
    if (selectedOption === null && props.c !== "brand-select") {
      props.history.push(`/cars/a/a?mp=${""}&&mk=${""}`);
    }

    if (selectedOption !== null && props.c !== "brand-select") {
      if (
        selectedOption.label === "Other" &&
        selectedOption.value === "Other"
      ) {
        props.history.push(`/cars/Other/Other?mp=${""}&&mk=${""}`);
      } else {
        props.history.push(
          `/cars/${selectedOption.make}/${
            selectedOption.model
          }?mp=${""}&&mk=${""}`
        );
      }
    } else if (props.c === "brand-select" && selectedOption !== null) {
      if (
        selectedOption.label === "Other" &&
        selectedOption.value === "Other"
      ) {
        props.setMakeAndModel("Other", "Other");
      } else {
        props.setMakeAndModel(selectedOption.make, selectedOption.model);
      }
    }

    setSelectOption(selectedOption);
  };

  return (
    <div className={props.c}>
      <Select
        isClearable
        placeholder="Make and model"
        value={selectedOption}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
};

export default CarSearchSelect;
