import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";

const LocationModal = (props) => {
  const {
    buttonLabel,
    className,
    searchWithFilters,
    ProvinceDistrict,
    provinceSelected,
    districtSelected,
    setProvinceSelected,
    setDistrictSelected,
    disabled,
  } = props;

  // Modal
  const [modal, setModal] = useState(false);

  const [lastFeaturesSelected, setLastFeaturesSelected] = useState([]);
  const [count, setCount] = useState(0);

  const toggle = () => {
    setModal(!modal);
  };

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const [province, setProvince] = useState(provinceSelected);
  const [district, setDistrict] = useState(districtSelected);

  useEffect(() => {
    setProvince(provinceSelected);
    setDistrict(districtSelected);

    // Create a list of options of the province
    let provinceOptions = ProvinceDistrict.map((province) => {
      return (
        <option key={province.key}>
          {province.name !== "" ? province.name : province.province}
        </option>
      );
    });

    setProvinceOptions(provinceOptions);

    // Add select option to the province options
    provinceOptions.splice(
      0,
      0,
      <option key="1000" value="">
        Select
      </option>
    );

    let districtOptions = [];

    // Create the list of districts
    if (
      ProvinceDistrict.length &&
      provinceSelected !== "" &&
      provinceSelected !== "Select"
    ) {
      let proviceObject = ProvinceDistrict.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      try {
        districtOptions = proviceObject.districts.map((district) => {
          return <option key={district.key}>{district.district}</option>;
        });
      } catch (err) {
        if (err) {
        }
      }

      districtOptions.splice(
        0,
        0,
        <option key="1001" value="">
          Select
        </option>
      );
    } else {
      districtOptions.push(
        <option key="1002" value="">
          Select
        </option>
      );
    }

    setDistrictOptions(districtOptions);
  }, [provinceSelected, districtSelected, ProvinceDistrict]);

  const onToggle = () => {
    setCount(0);
    toggle();
  };

  return (
    <Fragment>
      <a
        href="change"
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        className={className}
        disabled={disabled}
      >
        {buttonLabel}
      </a>
      <Modal isOpen={modal} toggle={onToggle} className="modal-dialog-centered">
        <ModalHeader toggle={onToggle}>Select {buttonLabel}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label>Province</Label>
                <Input
                  type="select"
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setProvinceSelected(e.target.value);
                    setDistrict("");
                    setDistrictSelected("");
                    setCount(count + 1);
                  }}
                  value={province}
                >
                  {provinceOptions}
                </Input>
                <FormFeedback>Please choose a valid province.</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>District</Label>
                <Input
                  type="select"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setDistrictSelected(e.target.value);
                    setCount(count + 1);
                  }}
                  disabled={province === "" || province === "Select"}
                >
                  {districtOptions}
                </Input>
                <FormFeedback>Please choose a valid district.</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (searchWithFilters !== null) {
                searchWithFilters(buttonLabel);
                setCount(0);
                toggle();
              } else {
                toggle();
              }
            }}
          >
            {searchWithFilters === null ? "Set" : "Search"}
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default LocationModal;
