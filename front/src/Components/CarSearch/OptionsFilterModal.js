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

const OptionsFilterModal = (props) => {
  const {
    buttonLabel,
    className,
    searchWithFilters,
    setFilter,
    options,
    selected,
  } = props;

  const [lastOptions, setLastOptions] = useState([]);
  const [count, setCount] = useState(0);

  // Modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [optionRadios, setOptionRadios] = useState([]);

  const onToggle = () => {
    if (count > 0) {
      setFilter(buttonLabel, lastOptions[lastOptions.length - (count + 1)]);
    }
    setCount(0);
    toggle();
  };

  useEffect(() => {
    let optionRadios = [];

    options.forEach((option) => {
      optionRadios.push(
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              name="radio1"
              onChange={() => {
                setFilter(buttonLabel, option);
                setCount(count + 1);
              }}
              defaultChecked={selected !== null ? selected === option : false}
            />{" "}
            {option}
          </Label>
        </FormGroup>
      );
    });

    setOptionRadios(optionRadios);
  }, [options]);

  useEffect(() => {
    setLastOptions([...lastOptions, selected]);
  }, [selected]);

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
      <Modal
        isOpen={modal}
        toggle={() => {
          onToggle();
        }}
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={() => {
            onToggle();
          }}
        >
          Select {buttonLabel}
        </ModalHeader>
        <ModalBody>{optionRadios}</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              if (count > 0) {
                setFilter(
                  buttonLabel,
                  lastOptions[lastOptions.length - (count + 1)]
                );
              }
              setCount(0);
              toggle();
            }}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setFilter(buttonLabel, "any");
              setCount(count + 1);
            }}
          >
            Reset
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

export default OptionsFilterModal;
