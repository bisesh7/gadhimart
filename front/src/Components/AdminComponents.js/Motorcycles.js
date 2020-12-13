import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  Edit,
  SimpleForm,
  DateInput,
  Show,
  SimpleShowLayout,
  TextInput,
  BooleanField,
  ArrayField,
  NumberField,
  ImageField,
  BooleanInput,
  RadioButtonGroupInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  NumberInput,
  Filter,
  ReferenceInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";
import {
  getMotorcycleConditions,
  getMotorcycleFuelTypes,
  getMotorcycleColors,
  getMotorcycleBodyType,
} from "../../Lists/motorcycleFilters";
import { getMotorcycleMakeAndModels } from "../../Lists/motorcycleList";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import axios from "axios";

const getSelectOptions = (list) => {
  return list.map((item) => ({
    id: item,
    name: item,
  }));
};

const MotorcycleFilter = (props) => {
  const [makeSelected, setMakeSelected] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getMotorcycleBodyType(setBodyTypes);
  }, []);
  const bodyTypeOptions = getSelectOptions(bodyTypes);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getMotorcycleConditions(setConditions);
  }, []);
  const conditionOptions = getSelectOptions(conditions);

  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getMotorcycleFuelTypes(setFuelTypes);
  }, []);
  const fuelTypeOptions = getSelectOptions(fuelTypes);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getMotorcycleColors(setColors);
  }, []);
  const colorOptions = getSelectOptions(colors);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
  }, []);

  // Make the list of options of motorcycle makes.
  let makeOptions = motorcycles.map((motorcycle) => ({
    id: motorcycle.make,
    name: motorcycle.make,
  }));

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);

  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  // Create a list of options of the province
  let provinceOptions = provinceWithDistricts.map((province) => {
    return {
      id: province.name !== "" ? province.name : province.province,
      name: province.name !== "" ? province.name : province.province,
    };
  });

  useEffect(() => {
    if (
      typeof props.filterValues.details !== "undefined" &&
      typeof props.filterValues.details.make !== "undefined"
    ) {
      setMakeSelected(props.filterValues.details.make);
    }
    if (
      typeof props.filterValues.details !== "undefined" &&
      typeof props.filterValues.details.provinceSelected !== "undefined"
    ) {
      setProvinceSelected(props.filterValues.details.provinceSelected);
    }
  }, []);

  useEffect(() => {
    let modelOptions = [];

    // Create the list of motorcycle models depending on the motorcycle make selected
    if (
      typeof motorcycles !== "undefined" &&
      motorcycles.length &&
      makeSelected !== "Other" &&
      makeSelected !== ""
    ) {
      let makeObject = motorcycles.find(
        (motorcycle) => motorcycle.make === makeSelected
      );
      modelOptions = makeObject.models.map((model) => ({
        id: model.model,
        name: model.model,
      }));

      modelOptions.push({ id: "Other", name: "Other" });
    } else if (makeSelected === "Other") {
      modelOptions.push({ id: "Other", name: "Other" });
    }

    setModelOptions(modelOptions);
  }, [motorcycles, makeSelected]);

  // Generate distict options
  useEffect(() => {
    let districtOptions = [];

    // Create the list of districts
    if (provinceWithDistricts.length && provinceSelected !== "") {
      let proviceObject = provinceWithDistricts.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      districtOptions = proviceObject.districts.map((district) => ({
        id: district.district,
        name: district.district,
      }));
    }

    setDistrictOptions(districtOptions);
  }, [provinceWithDistricts, provinceSelected]);

  return (
    <Filter {...props}>
      <TextInput label="Search Email" source="userEmail" />
      <ReferenceInput label="User" source="userId" reference="users" alwaysOn>
        <SelectInput optionText="email" />
      </ReferenceInput>
      <TextInput source="_id" label="Id" />
      <DateInput source="date" label="Date" />
      <SelectInput
        source="details.make"
        label="Make"
        onChange={(e) => {
          setMakeSelected(e.target.value);
        }}
        choices={makeOptions}
      />
      <SelectInput
        source="details.model"
        label="Model"
        choices={modelOptions}
      />
      <SelectInput
        source="details.conditionSelected"
        label="Condition"
        choices={conditionOptions}
      />
      <SelectInput
        source="details.bodyTypeSelected"
        label="Body Type"
        choices={bodyTypeOptions}
      />
      <SelectInput
        source="details.colorSelected"
        label="Color"
        choices={colorOptions}
      />
      <SelectInput
        source="details.fuelTypeSelected"
        label="Fuel Type"
        choices={fuelTypeOptions}
      />
      <SelectInput
        source="details.provinceSelected"
        label="Province"
        onChange={(e) => {
          setProvinceSelected(e.target.value);
        }}
        choices={provinceOptions}
      />
      <SelectInput
        source="details.districtSelected"
        label="District"
        choices={districtOptions}
      />
      <BooleanInput
        source="details.hasElectricStart"
        label="Has electric start"
      />
      <BooleanInput source="details.hasAlloyWheels" label="Has alloy wheels" />
      <BooleanInput
        source="details.hasTubelessTyres"
        label="Has tubeless tyres"
      />
      <BooleanInput
        source="details.hasDigitalDisplayPanel"
        label="Has digital display panel"
      />
      <BooleanInput
        source="details.hasProjectedHeadLight"
        label="Has projected head light"
      />
      <BooleanInput
        source="details.hasLedTailLight"
        label="Has led tail light"
      />
      <BooleanInput
        source="details.hasFrontDiscBrake"
        label="Has front disc brake"
      />
      <BooleanInput
        source="details.hasRearDiscBrake"
        label="Has rear disc brake"
      />
      <BooleanInput
        source="details.hasAbs"
        label="Has abs (anti-lock braking system)"
      />
      <BooleanInput
        source="details.hasMonoSuspension"
        label="Has mono suspension"
      />
      <BooleanInput source="details.hasSplitSeat" label="Has split seat" />
      <BooleanInput source="details.hasTripMeter" label="Has trip meter" />
      <NumberInput resettable source="details.maxPrice" label="Max Price" />
      <NumberInput resettable source="details.minPrice" label="Min Price" />
      <NumberInput
        resettable
        source="details.maxKilometer"
        label="Max Kilometer"
      />
      <NumberInput
        resettable
        source="details.minKilometer"
        label="Min Kilometer"
      />
      <NumberInput resettable source="details.maxYear" label="Max Year" />
      <NumberInput resettable source="details.minYear" label="Min Year" />
      <NumberInput resettable source="details.maxCC" label="Max CC" />
      <NumberInput resettable source="details.minCC" label="Min CC" />
    </Filter>
  );
};

export const MotorcycleList = (props) => (
  <List filters={<MotorcycleFilter />} {...props}>
    <CustomizableDatagrid rowClick="edit">
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="userEmail" />
      <TextField source="id" />
      <DateField source="date" />
      <TextField source="details.make" label="Make" />
      <TextField source="details.model" label="Model" />
      <TextField source="details.year" label="Year" />
      <TextField source="details.condition" label="Condition" />
      <TextField source="details.province" label="Province" />
      <TextField source="details.district" label="District" />
      <TextField source="details.street" label="Street" />
    </CustomizableDatagrid>
  </List>
);

export const MotorcycleEdit = (props) => {
  const [makeSelected, setMakeSelected] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getMotorcycleBodyType(setBodyTypes);
  }, []);
  const bodyTypeOptions = getSelectOptions(bodyTypes);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getMotorcycleConditions(setConditions);
  }, []);
  const conditionOptions = getSelectOptions(conditions);

  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getMotorcycleFuelTypes(setFuelTypes);
  }, []);
  const fuelTypeOptions = getSelectOptions(fuelTypes);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getMotorcycleColors(setColors);
  }, []);
  const colorOptions = getSelectOptions(colors);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
  }, []);

  // Make the list of options of motorcycle makes.
  let makeOptions = motorcycles.map((motorcycle) => ({
    id: motorcycle.make,
    name: motorcycle.make,
  }));

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);

  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  // Create a list of options of the province
  let provinceOptions = provinceWithDistricts.map((province) => {
    return {
      id: province.name !== "" ? province.name : province.province,
      name: province.name !== "" ? province.name : province.province,
    };
  });

  useEffect(() => {
    axios
      .get(`/api/motorcycle/${props.id}`, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          setMakeSelected(data.data.details.make);
          setProvinceSelected(data.data.details.provinceSelected);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(makeSelected);
    let modelOptions = [];

    // Create the list of motorcycle models depending on the motorcycle make selected
    if (
      typeof motorcycles !== "undefined" &&
      motorcycles.length &&
      makeSelected !== "Other" &&
      makeSelected !== ""
    ) {
      let makeObject = motorcycles.find(
        (motorcycle) => motorcycle.make === makeSelected
      );
      modelOptions = makeObject.models.map((model) => ({
        id: model.model,
        name: model.model,
      }));

      modelOptions.push({ id: "Other", name: "Other" });
    } else if (makeSelected === "Other") {
      modelOptions.push({ id: "Other", name: "Other" });
    }

    setModelOptions(modelOptions);
  }, [motorcycles, makeSelected]);

  // Generate distict options
  useEffect(() => {
    let districtOptions = [];

    // Create the list of districts
    if (provinceWithDistricts.length && provinceSelected !== "") {
      let proviceObject = provinceWithDistricts.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      districtOptions = proviceObject.districts.map((district) => ({
        id: district.district,
        name: district.district,
      }));
    }

    setDistrictOptions(districtOptions);
  }, [provinceWithDistricts, provinceSelected]);

  return (
    <Edit undoable={false} {...props}>
      <SimpleForm>
        <SelectInput
          source="details.make"
          label="Make"
          onChange={(e) => {
            setMakeSelected(e.target.value);
          }}
          choices={makeOptions}
        />
        <SelectInput
          source="details.model"
          label="Model"
          choices={modelOptions}
        />
        <TextInput resettable source="details.year" label="Year" />
        <SelectInput
          source="details.bodyTypeSelected"
          label="Body type"
          choices={bodyTypeOptions}
        />
        <SelectInput
          source="details.conditionSelected"
          label="Condition"
          choices={conditionOptions}
        />
        <TextInput
          resettable
          source="details.kilometerInput"
          label="Kilometer"
        />
        <SelectInput
          source="details.colorSelected"
          label="Color"
          choices={colorOptions}
        />
        <SelectInput
          source="details.fuelTypeSelected"
          label="Fuel type"
          choices={fuelTypeOptions}
        />
        <TextInput resettable source="details.ccInput" label="CC" />
        <BooleanInput
          source="details.hasElectricStart"
          label="Has electric start"
        />
        <BooleanInput
          source="details.hasAlloyWheels"
          label="Has alloy wheels"
        />
        <BooleanInput
          source="details.hasTubelessTyres"
          label="Has tubeless tyres"
        />
        <BooleanInput
          source="details.hasDigitalDisplayPanel"
          label="Has digital display panel"
        />
        <BooleanInput
          source="details.hasProjectedHeadLight"
          label="Has projected head light"
        />
        <BooleanInput
          source="details.hasLedTailLight"
          label="Has led tail light"
        />
        <BooleanInput
          source="details.hasFrontDiscBrake"
          label="Has front disc brake"
        />
        <BooleanInput
          source="details.hasRearDiscBrake"
          label="Has rear disc brake"
        />
        <BooleanInput
          source="details.hasAbs"
          label="Has abs (anti-lock braking system)"
        />
        <BooleanInput
          source="details.hasMonoSuspension"
          label="Has mono suspension"
        />
        <BooleanInput source="details.hasSplitSeat" label="Has split seat" />
        <BooleanInput source="details.hasTripMeter" label="Has trip meter" />
        <TextInput resettable source="details.adTitle" label="Ad title" />
        <TextInput
          multiline
          resettable
          source="details.adDescription"
          label="Ad description"
        />
        <TextInput
          resettable
          source="details.youtubeLinkInput"
          label="Youtube link"
        />
        <SelectInput
          source="details.provinceSelected"
          label="Province"
          choices={provinceOptions}
        />
        <SelectInput
          source="details.districtSelected"
          label="District"
          choices={districtOptions}
        />
        <TextInput
          resettable
          source="details.streetAddressInput"
          label="Street Address"
        />
        <RadioButtonGroupInput
          source="details.priceType"
          label="Price Type"
          choices={[
            { id: "notFree", name: "Not Free" },
            { id: "free", name: "Free" },
            { id: "contact", name: "Contact" },
          ]}
        />
        <NumberInput source="details.priceInput" label="Price" />
        <TextInput
          resettable
          source="details.phoneNumberInput"
          label="Phone Number"
        />
        <TextInput
          resettable
          source="details.mainPicture"
          label="Main Picture"
        />
        <ArrayInput source="details.picturesToBeUploadedMeta" label="Pictures">
          <SimpleFormIterator>
            <TextInput source="fileUrl" label="Picture URL" />
            <TextInput source="id" label="Picture Id" />
            <DateInput source="lastModifiedDate" label="Uploaded Date" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export const MotorcycleShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="userEmail" label="Email" />
      <TextField source="id" />
      <DateField source="date" />
      <TextField source="details.make" label="Make" />
      <TextField source="details.model" label="Model" />
      <TextField source="details.year" label="Year" />
      <TextField source="details.bodyTypeSelected" label="Body type" />
      <TextField source="details.conditionSelected" label="Condition" />
      <TextField source="details.kilometerInput" label="Kilometer" />
      <TextField source="details.colorSelected" label="Color" />
      <TextField source="details.fuelTypeSelected" label="Fuel type" />
      <TextField source="details.ccInput" label="CC" />
      <BooleanField
        source="details.hasElectricStart"
        label="Has electric start"
      />
      <BooleanField source="details.hasAlloyWheels" label="Has alloy wheels" />
      <BooleanField
        source="details.hasTubelessTyres"
        label="Has tubeless tyres"
      />
      <BooleanField
        source="details.hasDigitalDisplayPanel"
        label="Has digital display panel"
      />
      <BooleanField
        source="details.hasProjectedHeadLight"
        label="Has projected head light"
      />
      <BooleanField
        source="details.hasLedTailLight"
        label="Has led tail light"
      />
      <BooleanField
        source="details.hasFrontDiscBrake"
        label="Has front disc brake"
      />
      <BooleanField
        source="details.hasRearDiscBrake"
        label="Has rear disc brake"
      />
      <BooleanField
        source="details.hasAbs"
        label="Has abs (anti-lock braking system)"
      />
      <BooleanField
        source="details.hasMonoSuspension"
        label="Has mono suspension"
      />
      <BooleanField source="details.hasSplitSeat" label="Has split seat" />
      <BooleanField source="details.hasTripMeter" label="Has trip meter" />
      <TextField source="details.adTitle" label="Ad title" />
      <TextField
        multiline
        source="details.adDescription"
        label="Ad description"
      />
      <TextField source="details.youtubeLinkInput" label="Youtube link" />
      <TextField source="details.provinceSelected" label="Province" />
      <TextField source="details.districtSelected" label="District" />
      <TextField source="details.streetAddressInput" label="Street Address" />
      <TextField source="details.priceType" label="Price Type" />
      <NumberField source="details.priceInput" label="Price" />
      <TextField source="details.phoneNumberInput" label="Phone Number" />
      <TextField source="details.mainPicture" label="Main Picture" />
      <ArrayField source="details.picturesToBeUploadedMeta" label="Pictures">
        <Datagrid>
          <ImageField source="fileUrl" label="Picture" />
          <TextField source="fileUrl" label="Picture URL" />
          <TextField source="id" label="Picture Id" />
          <DateField source="lastModifiedDate" label="Uploaded Date" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
