import React from "react";

const TroubleWithRecaptcha = () => {
  return (
    <div>
      <div>
        <h2>Trouble With Captcha</h2>
      </div>
      <div className="mt-3">
        <p>
          Google’s reCaptcha is a security system designed to prevent bots
          (automated computer programs) from interacting with the site to spread
          spam and other unwanted activity. We integrated this technology to
          keep Gadhimart clean, safe, and secure. To fill out the Captcha,
          follow the steps below:
        </p>
        <ol>
          <li>
            Select all of the images with the item mentioned in the challenge
            description.
          </li>
          <li>
            When there are no more images of that item, including those that
            have reloaded since you selected the first image, click Verify.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TroubleWithRecaptcha;
