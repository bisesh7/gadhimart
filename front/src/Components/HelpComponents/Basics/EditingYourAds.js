import React from "react";

const EditingYourAds = () => {
  return (
    <div>
      <div>
        <h2>Editing Your Ads</h2>
      </div>
      <div className="mt-3">
        <span className="heading">To edit an ad:</span>
        <ul>
          <li>Sign in to Gadhimart.</li>
          <li>
            Click the dropdown menu in the top of the homepage an select{" "}
            <b>Profile</b>.
          </li>
          <li>Click the edit icon in the ad you want to edit.</li>
          <li>You will be rediirected to the edit page.</li>
          <li>Edit the information as needed.</li>
          <li>
            When you're done, click <b>Finish Editing</b> at the bottom of the
            screen.
          </li>
        </ul>
        <p>
          <b>Note:</b> You cannot remove all of your pictures. At least 2
          pictures is mandatory for the ads to be displayed in Gadhimart.
        </p>
      </div>
    </div>
  );
};

export default EditingYourAds;
