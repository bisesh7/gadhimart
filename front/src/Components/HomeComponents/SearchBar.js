import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  CustomInput,
} from "reactstrap";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import LocationModal from "../CarSearch/LocationModal";
import CarSearchSelect from "./CarSearchSelect";
import MotorcycleSearchSelect from "./MotorcycleSearchSelect";
import locationSVG from "../../icons/location_on-24px.svg";
import carSVG from "../../icons/directions_car-24px.svg";
import moneySVG from "../../icons/rupee.svg";
import kilometerSVG from "../../icons/speed-24px.svg";

const SearchBar = (props) => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxKilometer, setMaxKiloMeter] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [vehicle, setVehicle] = useState("car");
  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);

  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  const setMakeAndModel = (make, model) => {
    if (make === "Other") {
      setMake("Other");
      setModel("Other");
    } else {
      setMake(make);
      setModel(model);
    }
  };

  const handleSearch = () => {
    let searchFilters = {
      maxPrice,
      maxKilometer,
      district,
      province,
    };
    let qs = "";

    if (vehicle === "car") {
      if (make === "") {
        qs = "/cars/a/a?";
      } else {
        qs = `/cars/${make}/${model}?`;
      }
    } else {
      if (make === "") {
        qs = "/motorcycle/a/a?";
      } else {
        qs = `/motorcycle/${make}/${model}?`;
      }
    }

    for (const filter in searchFilters) {
      switch (filter) {
        case "maxPrice":
          qs += `mp=${maxPrice}&&`;
          break;
        case "maxKilometer":
          qs += `mk=${maxPrice}&&`;
          break;
        case "province":
          if (searchFilters[filter] !== "") {
            qs += `pr=${province}&&`;
          }
          break;
        case "district":
          if (searchFilters[filter] !== "") {
            qs += `dis=${district}&&`;
          }
          break;
      }
    }

    qs = qs.substring(0, qs.length - 2);
    props.history.push(qs);
  };

  return (
    <div className="search-bg-sm search-bg-md search-bg-lg">
      <Container>
        <div className="search">
          <Row className="top pt-3 px-3">
            <Col lg="4">
              <h5>Find your perfect vehicle</h5>
            </Col>
            <Col lg="5" className="locationChooser">
              <img src={locationSVG} className="pb-1" width="15" alt="" />
              &nbsp;
              <span id="locationText" className="location text-muted pt-1">
                {province === ""
                  ? "All in Nepal"
                  : district === ""
                  ? province
                  : district + ", " + province}
              </span>
              &nbsp;&nbsp;
              <LocationModal
                buttonLabel="Set location"
                className="setLocation"
                searchWithFilters={null}
                provinceSelected={province}
                districtSelected={district}
                setProvinceSelected={setProvince}
                setDistrictSelected={setDistrict}
                ProvinceDistrict={provinceWithDistricts}
                disabled={false}
              />
            </Col>
            <Col lg="2" className="ml-auto">
              <div className="d-flex vehicle-chooser ">
                <small className={vehicle === "car" ? "heading" : "text-muted"}>
                  Car
                </small>
                &nbsp;
                <CustomInput
                  type="switch"
                  id="switch"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVehicle("motorcycle");
                    } else {
                      setVehicle("car");
                    }
                  }}
                  className="ml-1"
                />
                <small
                  className={
                    vehicle === "motorcycle" ? "heading" : "text-muted"
                  }
                >
                  Motorcycle
                </small>
              </div>
            </Col>
          </Row>

          <hr />

          <Form className="bottom pb-3 px-3">
            <Row>
              <Col lg="4" md="12">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <img className="pr-1" src={carSVG} alt="" srcSet="" />
                    </InputGroupText>
                  </InputGroupAddon>
                  {vehicle === "car" ? (
                    <CarSearchSelect
                      c={"brand-select"}
                      history={props.history}
                      setMakeAndModel={setMakeAndModel}
                    />
                  ) : (
                    <MotorcycleSearchSelect
                      c={"brand-select"}
                      history={props.history}
                      setMakeAndModel={setMakeAndModel}
                    />
                  )}
                </InputGroup>
              </Col>
              <Col lg="3" md="4" className="mt-lg-0 mt-3">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <img
                        className="pr-1"
                        src={moneySVG}
                        width="20"
                        alt=""
                        srcSet=""
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                    }}
                    value={maxPrice}
                    placeholder="Max price"
                  />
                </InputGroup>
              </Col>
              <Col lg="3" md="4" className="mt-lg-0 mt-3">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <img
                        className="pr-1"
                        src={kilometerSVG}
                        alt=""
                        srcSet=""
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    onChange={(e) => {
                      setMaxKiloMeter(e.target.value);
                    }}
                    value={maxKilometer}
                    placeholder="Max kilometer"
                  />
                </InputGroup>
              </Col>
              <Col md="4" lg="1" className="mt-lg-0 mt-3">
                <Button
                  type="button"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default SearchBar;
