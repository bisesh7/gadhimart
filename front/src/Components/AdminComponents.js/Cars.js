import React, { useEffect, useState } from "react";
import {
  List,
  DateField,
  ReferenceField,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  BooleanInput,
  NumberInput,
  RadioButtonGroupInput,
  ImageField,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  BooleanField,
  NumberField,
  ArrayField,
  Datagrid,
  Filter,
  ReferenceInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";
import {
  getCarTransmission,
  getCarBodyType,
  getCarConditions,
  getFuelTypes,
  getDrivetrains,
  getColors,
  getSeats,
  getDoors,
} from "../../Lists/filters";
import { getCarMakeAndModels } from "../../Lists/carList";
import axios from "axios";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";

const getSelectOptions = (list) => {
  return list.map((item) => ({
    id: item,
    name: item,
  }));
};

const CarFilter = (props) => {
  const [carMakeSelected, setCarMakeSelected] = useState("");
  const [carModelOptions, setCarModelOptions] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [cars, setCars] = useState([]);

  // Car Details Lists
  const [transmissions, setTransmssions] = useState([]);
  useEffect(() => {
    getCarTransmission(setTransmssions);
  }, []);
  const transmissionOptions = getSelectOptions(transmissions);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getCarBodyType(setBodyTypes);
  }, []);
  const bodyTypeOptions = getSelectOptions(bodyTypes);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getCarConditions(setConditions);
  }, []);
  const conditionOptions = getSelectOptions(conditions);

  const [fuellTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getFuelTypes(setFuelTypes);
  }, []);
  const fuelTypeOptions = getSelectOptions(fuellTypes);

  const [drivetrains, setDrivetrains] = useState([]);
  useEffect(() => {
    getDrivetrains(setDrivetrains);
  }, []);
  const drivetrainOptions = getSelectOptions(drivetrains);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getColors(setColors);
  }, []);
  const colorOptions = getSelectOptions(colors);

  const [seats, setSeats] = useState([]);
  useEffect(() => {
    getSeats(setSeats);
  }, []);
  const seatsOptions = getSelectOptions(seats);

  const [doors, setDoors] = useState([]);
  useEffect(() => {
    getDoors(setDoors);
  }, []);
  const doorsOptions = getSelectOptions(doors);

  // -----------------------------------------------------------------

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

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

  // Make the list of options of car makes.
  let carMakeOptions = cars.map((car) => ({
    id: car.make,
    name: car.make,
  }));

  useEffect(() => {
    if (
      typeof props.filterValues.carDetails !== "undefined" &&
      typeof props.filterValues.carDetails.carMakeSelected !== "undefined"
    ) {
      setCarMakeSelected(props.filterValues.carDetails.carMakeSelected);
    }
    if (
      typeof props.filterValues.carDetails !== "undefined" &&
      typeof props.filterValues.carDetails.provinceSelected !== "undefined"
    ) {
      setProvinceSelected(props.filterValues.carDetails.provinceSelected);
    }
  }, []);

  useEffect(() => {
    let carModelOptions = [];

    // Create the list of car models depending on the car make selected
    if (
      typeof cars !== "undefined" &&
      cars.length &&
      carMakeSelected !== "Other" &&
      carMakeSelected !== ""
    ) {
      let carMakeObject = cars.find((car) => car.make === carMakeSelected);
      carModelOptions = carMakeObject.models.map((model) => ({
        id: model.model,
        name: model.model,
      }));

      carModelOptions.push({ id: "Other", name: "Other" });
    } else if (carMakeSelected === "Other") {
      carModelOptions.push({ id: "Other", name: "Other" });
    }

    setCarModelOptions(carModelOptions);
  }, [cars, carMakeSelected]);

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
      <TextInput source="_id" label="Id" />
      <DateInput source="date" label="Date" />
      <ReferenceInput label="User" source="userId" reference="users" alwaysOn>
        <SelectInput optionText="email" />
      </ReferenceInput>
      <SelectInput
        source="carDetails.carMakeSelected"
        label="Make"
        onChange={(e) => {
          setCarMakeSelected(e.target.value);
        }}
        choices={carMakeOptions}
      />
      <SelectInput
        source="carDetails.carModelSelected"
        label="Model"
        choices={carModelOptions}
      />
      <SelectInput
        source="carDetails.carConditionSelected"
        label="Condition"
        choices={conditionOptions}
      />
      <SelectInput
        source="carDetails.carBodyTypeSelected"
        label="Body Type"
        choices={bodyTypeOptions}
      />
      <SelectInput
        source="carDetails.carTransmissionSelected"
        label="Transmission"
        choices={transmissionOptions}
      />
      <SelectInput
        source="carDetails.carDrivetrainSelected"
        label="Drivetrain"
        choices={drivetrainOptions}
      />
      <SelectInput
        source="carDetails.carColorSelected"
        label="Color"
        choices={colorOptions}
      />
      <SelectInput
        source="carDetails.carFuelTypeSelected"
        label="Fuel Type"
        choices={fuelTypeOptions}
      />
      <SelectInput
        source="carDetails.carDoorsSelected"
        label="Doors"
        choices={doorsOptions}
      />
      <SelectInput
        source="carDetails.carSeatsSelected"
        label="Seats"
        choices={seatsOptions}
      />
      <SelectInput
        source="carDetails.provinceSelected"
        label="Province"
        onChange={(e) => {
          setProvinceSelected(e.target.value);
        }}
        choices={provinceOptions}
      />
      <SelectInput
        source="carDetails.districtSelected"
        label="District"
        choices={districtOptions}
      />
      <BooleanInput source="carDetails.carHasSunRoof" label="Has sun roof" />
      <BooleanInput
        source="carDetails.carHasAlloyWheels"
        label="Has alloy wheels"
      />
      <BooleanInput
        source="carDetails.carHasNavigationSystem"
        label="Has navigation system"
      />
      <BooleanInput source="carDetails.carHasBluetooth" label="Has bluetooth" />
      <BooleanInput
        source="carDetails.carHasPushStart"
        label="Has push start"
      />
      <BooleanInput
        source="carDetails.carHasParkingAssistant"
        label="Has parking assistant"
      />
      <BooleanInput
        source="carDetails.carHasCruiseControl"
        label="Has cruise control"
      />
      <BooleanInput
        source="carDetails.carHasAirConditioning"
        label="Has air conditioning"
      />
      <BooleanInput
        source="carDetails.carHasPowerSteering"
        label="Has power steering"
      />
      <BooleanInput
        source="carDetails.carHasPowerWindow"
        label="Has power window"
      />
      <BooleanInput
        source="carDetails.carHasKeylessEntry"
        label="Has Keyless entry"
      />
      <BooleanInput
        source="carDetails.carHasAbs"
        label="Has ABS (Anti-lock braking system)"
      />
      <BooleanInput
        source="carDetails.carHasCarplay"
        label="Has apple car play"
      />
      <BooleanInput
        source="carDetails.carHasAndroidAuto"
        label="Has android auto"
      />
      <TextInput resettable source="carDetails.carTrimInput" label="Trim" />
      <NumberInput resettable source="carDetails.maxPrice" label="Max Price" />
      <NumberInput resettable source="carDetails.minPrice" label="Min Price" />
      <NumberInput
        resettable
        source="carDetails.maxKilometer"
        label="Max Kilometer"
      />
      <NumberInput
        resettable
        source="carDetails.minKilometer"
        label="Min Kilometer"
      />
      <NumberInput resettable source="carDetails.maxYear" label="Max Year" />
      <NumberInput resettable source="carDetails.minYear" label="Min Year" />
    </Filter>
  );
};

export const CarList = (props) => (
  <List filters={<CarFilter />} {...props}>
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

export const CarEdit = (props) => {
  const [carMakeSelected, setCarMakeSelected] = useState("");
  const [carModelOptions, setCarModelOptions] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);

  // Car Details Lists
  const [transmissions, setTransmssions] = useState([]);
  useEffect(() => {
    getCarTransmission(setTransmssions);
  }, []);
  const transmissionOptions = getSelectOptions(transmissions);

  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getCarBodyType(setBodyTypes);
  }, []);
  const bodyTypeOptions = getSelectOptions(bodyTypes);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getCarConditions(setConditions);
  }, []);
  const conditionOptions = getSelectOptions(conditions);

  const [fuellTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getFuelTypes(setFuelTypes);
  }, []);
  const fuelTypeOptions = getSelectOptions(fuellTypes);

  const [drivetrains, setDrivetrains] = useState([]);
  useEffect(() => {
    getDrivetrains(setDrivetrains);
  }, []);
  const drivetrainOptions = getSelectOptions(drivetrains);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getColors(setColors);
  }, []);
  const colorOptions = getSelectOptions(colors);

  const [seats, setSeats] = useState([]);
  useEffect(() => {
    getSeats(setSeats);
  }, []);
  const seatsOptions = getSelectOptions(seats);

  const [doors, setDoors] = useState([]);
  useEffect(() => {
    getDoors(setDoors);
  }, []);
  const doorsOptions = getSelectOptions(doors);
  // -----------------------------------------------------------------

  useEffect(() => {
    axios
      .get(`/api/car/${props.id}`, {
        headers: {
          Authorization: process.env.REACT_APP_ADMIN_KEY,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          setCarMakeSelected(data.data.details.carMakeSelected);
          setProvinceSelected(data.data.details.provinceSelected);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

  // Make the list of options of car makes.
  let carMakeOptions = cars.map((car) => ({
    id: car.make,
    name: car.make,
  }));

  useEffect(() => {
    let carModelOptions = [];

    // Create the list of car models depending on the car make selected
    // Since gretting the cars list might take time we run this after cars has length
    if (
      typeof cars !== "undefined" &&
      cars.length &&
      carMakeSelected !== "Other" &&
      carMakeSelected !== ""
    ) {
      let carMakeObject = cars.find((car) => car.make === carMakeSelected);
      carModelOptions = carMakeObject.models.map((model) => ({
        id: model.model,
        name: model.model,
      }));

      carModelOptions.push({ id: "Other", name: "Other" });
    } else if (carMakeSelected === "Other") {
      carModelOptions.push({ id: "Other", name: "Other" });
    }

    setCarModelOptions(carModelOptions);
  }, [cars, carMakeSelected]);

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

  // Generate distict options
  useEffect(() => {
    let districtOptions = [];

    // Create the list of districts
    if (provinceWithDistricts.length && provinceSelected !== "") {
      console.log(provinceSelected);
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
          source="details.carMakeSelected"
          label="Make"
          onChange={(e) => {
            setCarMakeSelected(e.target.value);
          }}
          choices={carMakeOptions}
        />
        <SelectInput
          source="details.carModelSelected"
          label="Model"
          choices={carModelOptions}
        />
        <TextInput resettable source="details.carYearInput" label="Year" />
        <TextInput resettable source="details.carTrimInput" label="Trim" />
        <SelectInput
          source="details.carBodyTypeSelected"
          label="Body Type"
          choices={bodyTypeOptions}
        />
        <SelectInput
          source="details.carConditionSelected"
          label="Condition"
          choices={conditionOptions}
        />
        <TextInput source="details.carKiloMetersInput" label="Kilometers" />
        <SelectInput
          source="details.carTransmissionSelected"
          label="Transmission"
          choices={transmissionOptions}
        />
        <SelectInput
          source="details.carDrivetrainSelected"
          label="Drivetrain"
          choices={drivetrainOptions}
        />
        <SelectInput
          source="details.carColorSelected"
          label="Color"
          choices={colorOptions}
        />
        <SelectInput
          source="details.carFuelTypeSelected"
          label="Fuel Type"
          choices={fuelTypeOptions}
        />
        <SelectInput
          source="details.carDoorsSelected"
          label="Doors"
          choices={doorsOptions}
        />
        <SelectInput
          source="details.carSeatsSelected"
          label="Seats"
          choices={seatsOptions}
        />
        <BooleanInput source="details.carHasSunRoof" label="Has sun roof" />
        <BooleanInput
          source="details.carHasAlloyWheels"
          label="Has alloy wheels"
        />
        <BooleanInput
          source="details.carHasNavigationSystem"
          label="Has navigation system"
        />
        <BooleanInput source="details.carHasBluetooth" label="Has bluetooth" />
        <BooleanInput source="details.carHasPushStart" label="Has push start" />
        <BooleanInput
          source="details.carHasParkingAssistant"
          label="Has parking assistant"
        />
        <BooleanInput
          source="details.carHasCruiseControl"
          label="Has cruise control"
        />
        <BooleanInput
          source="details.carHasAirConditioning"
          label="Has air conditioning"
        />
        <BooleanInput
          source="details.carHasPowerSteering"
          label="Has power steering"
        />
        <BooleanInput
          source="details.carHasPowerWindow"
          label="Has power window"
        />
        <BooleanInput
          source="details.carHasKeylessEntry"
          label="Has Keyless entry"
        />
        <BooleanInput
          source="details.carHasAbs"
          label="Has ABS (Anti-lock braking system)"
        />
        <BooleanInput
          source="details.carHasCarplay"
          label="Has apple car play"
        />
        <BooleanInput
          source="details.carHasAndroidAuto"
          label="Has android auto"
        />
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
        <NumberInput source="details.carPriceInput" label="Price" />
        <NumberInput source="details.phoneNumberInput" label="Phone Number" />
        <TextInput source="details.mainPicture" label="Main Picture" />
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

export const CarShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="userEmail" />
      <TextField source="id" />
      <DateField source="date" />
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="details.carMakeSelected" label="Make" />
      <TextField source="details.carModelSelected" label="Model" />
      <TextField source="details.carYearInput" label="Year" />
      <TextField source="details.carTrimInput" label="Trim" />
      <TextField source="details.carBodyTypeSelected" label="Body Type" />
      <TextField source="details.carConditionSelected" label="Condition" />
      <TextField source="details.carKiloMetersInput" label="Kilometers" />
      <TextField
        source="details.carTransmissionSelected"
        label="Transmission"
      />
      <TextField source="details.carDrivetrainSelected" label="Drivetrain" />
      <TextField source="details.carColorSelected" label="Color" />
      <TextField source="details.carFuelTypeSelected" label="Fuel Type" />
      <TextField source="details.carDoorsSelected" label="Doors" />
      <TextField source="details.carSeatsSelected" label="Seats" />
      <BooleanField source="details.carHasSunRoof" label="Has sun roof" />
      <BooleanField
        source="details.carHasAlloyWheels"
        label="Has alloy wheels"
      />
      <BooleanField
        source="details.carHasNavigationSystem"
        label="Has navigation system"
      />
      <BooleanField source="details.carHasBluetooth" label="Has bluetooth" />
      <BooleanField source="details.carHasPushStart" label="Has push start" />
      <BooleanField
        source="details.carHasParkingAssistant"
        label="Has parking assistant"
      />
      <BooleanField
        source="details.carHasCruiseControl"
        label="Has cruise control"
      />
      <BooleanField
        source="details.carHasAirConditioning"
        label="Has air conditioning"
      />
      <BooleanField
        source="details.carHasPowerSteering"
        label="Has power steering"
      />
      <BooleanField
        source="details.carHasPowerWindow"
        label="Has power window"
      />
      <BooleanField
        source="details.carHasKeylessEntry"
        label="Has Keyless entry"
      />
      <BooleanField
        source="details.carHasAbs"
        label="Has ABS (Anti-lock braking system)"
      />
      <BooleanField source="details.carHasCarplay" label="Has apple car play" />
      <BooleanField
        source="details.carHasAndroidAuto"
        label="Has android auto"
      />
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
      <NumberField source="details.carPriceInput" label="Price" />
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
