import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
  InputGroupAddon,
  InputGroup,
  FormFeedback,
  FormGroup,
} from "reactstrap";

const MinMaxFilterModal = (props) => {
  const {
    buttonLabel,
    className,
    max,
    min,
    searchWithFilters,
    setFilter,
  } = props;

  const [maxValue, setMaxValue] = useState(max);
  const [minValue, setMinValue] = useState(min);
  const [lastValue, setLastValue] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // console.log(minValue, maxValue);
    setMaxValue(max);
    setMinValue(min);

    setLastValue([...lastValue, { minValue: min, maxValue: max }]);
  }, [max, min]);

  const [minValid, setMinValid] = useState(true);
  const [maxValid, setMaxValid] = useState(true);

  useEffect(() => {
    setMinValid(
      maxValue === "" || maxValue === null
        ? true
        : parseFloat(minValue) < parseFloat(maxValue) ||
            minValue === "" ||
            minValue === null
    );

    setMaxValid(
      minValue === "" || minValue === null
        ? true
        : parseFloat(minValue) < parseFloat(maxValue) ||
            maxValue === "" ||
            maxValue === null
    );
  }, [minValue, maxValue]);

  // Modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const onToggle = () => {
    if (count > 0) {
      setFilter(
        buttonLabel,
        lastValue[lastValue.length - count - 1].minValue,
        lastValue[lastValue.length - count - 1].maxValue
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
        <ModalBody>
          <Row>
            <Col sm="6">
              <FormGroup>
                <InputGroup>
                  <Input
                    placeholder="From"
                    type="number"
                    onChange={(e) => {
                      setMinValue(e.target.value);
                      setFilter(buttonLabel, e.target.value, maxValue);
                      setCount(count + 1);
                    }}
                    value={minValue}
                    valid={minValid}
                    invalid={!minValid}
                  />

                  <InputGroupAddon addonType="append">
                    <Button
                      type="button"
                      onClick={(e) => {
                        setMinValue("");
                        setFilter(buttonLabel, "a", maxValue);
                        setCount(count + 1);
                      }}
                    >
                      x
                    </Button>
                  </InputGroupAddon>

                  <FormFeedback>
                    Min value should be less than {maxValue}
                  </FormFeedback>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm="6">
              <InputGroup>
                <Input
                  placeholder="To"
                  type="number"
                  onChange={(e) => {
                    setMaxValue(e.target.value);
                    setFilter(buttonLabel, minValue, e.target.value);
                    setCount(count + 1);
                  }}
                  value={maxValue}
                  valid={maxValid}
                  invalid={!maxValid}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    type="button"
                    onClick={(e) => {
                      setMaxValue("");
                      setFilter(buttonLabel, minValue, "a");
                      setCount(count + 1);
                    }}
                  >
                    x
                  </Button>
                </InputGroupAddon>

                <FormFeedback>
                  Max value should be more than {minValue}
                </FormFeedback>
              </InputGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => {
              onToggle();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="button"
            onClick={() => {
              if (minValid && maxValid) {
                searchWithFilters(buttonLabel);
                setCount(0);
                toggle();
              }
            }}
          >
            Search
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default MinMaxFilterModal;
