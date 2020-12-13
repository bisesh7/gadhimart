import React from "react";

const AddingPhotos = () => {
  return (
    <div>
      <div>
        <h2>Adding Photos</h2>
      </div>
      <div className="mt-3">
        <p>
          Adding photos of your vehicle gets your ad noticed. You can add up to
          10 images at a time. For each photo you add, you reduce the number of
          questions that buyers need to ask about condition, colour, and more.
        </p>
        <span className="heading">To add images:</span>
        <ol>
          <li>
            Click on the photos drop box or drag and drop the photos in to the
            box when the media section appears after details section in the ad
            creation or editing process.
          </li>
          <li>
            When you’re happy with your photos, click Submit to upload the
            photos to the server.
          </li>
        </ol>
        <p>
          You can remove the photos you dont like by clicking the remvove icon
          below the photo.
        </p>
      </div>
    </div>
  );
};

export default AddingPhotos;
