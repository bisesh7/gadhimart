import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import shareIcon from "../../icons/share.svg";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ShareComponent from "../CarSearch/ShareComponent";

const ShareModal = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <img
        data-tip="Share"
        alt="Share"
        src={shareIcon}
        width="20"
        className="shareButton lightenOnHover"
        onClick={(e) => {
          toggle();
        }}
      />{" "}
      <ReactTooltip type="info">
        <span>Share</span>
      </ReactTooltip>
      <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered">
        <ModalHeader toggle={toggle}>Share this listing</ModalHeader>
        <ModalBody>
          <ShareComponent
            details={props.details}
            listingId={props.listingId}
            vehicle={props.vehicle}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ShareModal;
