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

const CarTrimFilterModal = (props) => {
  const {
    buttonLabel,
    className,
    searchWithFilters,
    trimSelected,
    setFilter,
    disabled,
  } = props;

  // Modal
  const [modal, setModal] = useState(false);

  const [trim, setTrim] = useState("");
  const [lastValue, setLastValue] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTrim(trimSelected);
    setLastValue([...lastValue, trimSelected]);
  }, [trimSelected]);

  const toggle = () => {
    setModal(!modal);
  };

  const onToggle = () => {
    setTrim(lastValue[lastValue.length - (count + 1)]);
    setFilter(
      buttonLabel,
      lastValue[lastValue.length - (count + 1)] !== null
        ? lastValue[lastValue.length - (count + 1)]
        : ""
    );
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
        <ModalBody>
          <Input
            type="text"
            value={trim}
            onChange={(e) => {
              setTrim(e.target.value);
              setFilter(buttonLabel, e.target.value);
              setCount(count + 1);
            }}
            placeholder="Trim"
            disabled={disabled}
          />
        </ModalBody>
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

export default CarTrimFilterModal;
