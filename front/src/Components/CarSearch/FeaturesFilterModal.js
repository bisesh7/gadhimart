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
} from "reactstrap";

const FeaturesFilterModal = (props) => {
  const {
    buttonLabel,
    className,
    searchWithFilters,
    options,
    toggleFeature,
    getFeaturesList,
  } = props;

  // Modal
  const [modal, setModal] = useState(false);

  const [lastFeaturesSelected, setLastFeaturesSelected] = useState([]);
  const [count, setCount] = useState(0);

  const toggle = () => {
    setModal(!modal);
  };

  const [optionCheckBoxes, setOptionCheckBoxes] = useState([]);

  useEffect(() => {
    setLastFeaturesSelected([...lastFeaturesSelected, getFeaturesList()]);
  }, [getFeaturesList]);

  useEffect(() => {
    let optionCheckBoxes = [];

    options.forEach((option) => {
      optionCheckBoxes.push(
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              onChange={(e) => {
                toggleFeature(option, e.target.checked);
                setCount(count + 1);
              }}
              defaultChecked={getFeaturesList().includes(option)}
            />{" "}
            {option}
          </Label>
        </FormGroup>
      );
    });

    setOptionCheckBoxes(optionCheckBoxes);
  }, [options]);

  const onToggle = () => {
    if (count > 0) {
      options.forEach((option) => {
        toggleFeature(option, false);
      });

      lastFeaturesSelected[lastFeaturesSelected.length - (count + 1)].forEach(
        (lastFeature) => {
          toggleFeature(lastFeature, true);
        }
      );
    }
    setCount(0);
    toggle();
  };

  return (
    <Fragment>
      <Button
        outline
        block
        color="secondary"
        onClick={toggle}
        className={className}
      >
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={onToggle} className="modal-dialog-centered">
        <ModalHeader toggle={onToggle}>Select {buttonLabel}</ModalHeader>
        <ModalBody>{optionCheckBoxes}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onToggle}>
            Cancel
          </Button>
          <Button
            color="primary"
            type="button"
            onClick={() => {
              searchWithFilters(buttonLabel);
              setCount(0);
              toggle();
            }}
          >
            Search
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default FeaturesFilterModal;
