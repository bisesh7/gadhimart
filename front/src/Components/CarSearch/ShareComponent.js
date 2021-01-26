import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

const ShareComponent = (props) => {
  const url =
    props.vehicle === "Motorcycle"
      ? `https://www.gadhimart.com/motorcycle/${props.listingId}`
      : `https://www.gadhimart.com/car/${props.listingId}`;

  return (
    <div className="d-flex justify-content-center">
      <FacebookShareButton
        url={url}
        quote={props.details.adTitle}
        hashtag="#Gadhimart"
        className="mr-3"
      >
        <FacebookIcon size={36} />
      </FacebookShareButton>
      <EmailShareButton
        subject={props.details.adTitle}
        body={props.details.adDescription + " \n Sent via gadhimart"}
        quote={props.details.adTitle}
        hashtag={"#Gadhimart"}
        className="mr-3"
      >
        <EmailIcon size={36} />
      </EmailShareButton>
    </div>
  );
};

export default ShareComponent;
