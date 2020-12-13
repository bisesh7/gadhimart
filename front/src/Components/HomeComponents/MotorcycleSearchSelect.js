import React, { useState, useEffect } from "react";
import Select from "react-select";
import { getMotorcycleMakeAndModels } from "../../Lists/motorcycleList";

const MotorcycleSearchSelect = (props) => {
  const [selectedOption, setSelectOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
  }, []);

  // Load options
  useEffect(() => {
    let options = [];
    motorcycles.forEach((motorcycle) => {
      let modelOptions = [];

      // Make is not other then model needs to added
      if (motorcycle.make !== "Other") {
        modelOptions.push({
          label: `${motorcycle.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
          value: `${motorcycle.make} ⁻ ᴬⁿʸ ᵐᵒᵈᵉˡ`,
          make: motorcycle.make,
          model: "a",
        });
        motorcycle.models.forEach((model) => {
          modelOptions.push({
            label: `${motorcycle.make} ${model.model}`,
            value: `${motorcycle.make} ${model.model}`,
            make: motorcycle.make,
            model: model.model,
          });
        });
        modelOptions.push({
          label: `${motorcycle.make} Other`,
          value: `${motorcycle.make} Other`,
          make: motorcycle.make,
          model: "Other",
        });
        options.push({
          label: motorcycle.make,
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
  }, [motorcycles]);

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
      props.history.push(`/motorcycle/a/a?mp=${""}&&mk=${""}`);
    }

    if (selectedOption !== null && props.c !== "brand-select") {
      if (
        selectedOption.label === "Other" &&
        selectedOption.value === "Other"
      ) {
        props.history.push(`/motorcycle/Other/Other?mp=${""}&&mk=${""}`);
      } else {
        props.history.push(
          `/motorcycle/${selectedOption.make}/${
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

export default MotorcycleSearchSelect;
