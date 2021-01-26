import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

const ShareComponent = (props) => {
  return (
    <div className="d-flex justify-content-center">
      <FacebookShareButton
        url={`https://www.gadhimart.com/car/${props.listingId}`}
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
