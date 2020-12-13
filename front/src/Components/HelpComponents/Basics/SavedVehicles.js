import React from "react";

const SavedVehicles = () => {
  return (
    <div>
      <div>
        <h2>Saved Vehicles</h2>
      </div>
      <div className="mt-3">
        <p>
          The <b>Saved Vehicles</b> feature allows you to keep your eye on ads
          that interest you.
        </p>
      </div>
      <div>
        <span className="heading">Saving Ads</span>
        <p>
          In the Ad Detail page, click the star icon to the right of the send
          message box. A solid yellow star indicates that it has been saved.
        </p>
      </div>
      <div>
        <span className="heading">Accessing Your Saved Ads</span>
        <p>
          To access saved ads, click the dropdown menu located at the top of the
          homepage, then click <b>Saved Vehicles</b>
        </p>
      </div>
      <div>
        <span className="heading">Removing Saved Ads</span>
        <p>
          In the Ad Detail page, click the yellow star icon to the right of the
          send message box. A solid star with no color indicates that it has
          been unsaved.
        </p>
      </div>
    </div>
  );
};

export default SavedVehicles;
