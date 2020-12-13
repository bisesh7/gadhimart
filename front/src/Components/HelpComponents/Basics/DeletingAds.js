import React from "react";

const DeletingAds = () => {
  return (
    <div>
      <div>
        <h2>Deleting Your Ads</h2>
      </div>
      <div className="mt-3">
        <span className="heading">To delete an ad:</span>
        <ul>
          <li>Sign in to Gadhimart.</li>
          <li>
            Click the dropdown menu in the top of the homepage an select{" "}
            <b>Profile</b>.
          </li>
          <li>Click the delete icon in the ad you want to delete.</li>
          <li>You should see an confirmation to delete.</li>
          <li>
            Click <b>Yes, delete it!</b>.
          </li>
        </ul>
        <p>
          That’s it! Your ad will be removed from Gadhimart within a few minutes
          of the deletion.
        </p>
      </div>
    </div>
  );
};

export default DeletingAds;
