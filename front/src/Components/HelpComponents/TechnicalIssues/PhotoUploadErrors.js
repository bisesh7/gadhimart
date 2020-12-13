import React from "react";

const PhotoUploadErrors = () => {
  return (
    <div>
      <div>
        <h2>Photo Upload Errors</h2>
      </div>
      <div className="mt-3">
        <span>
          If you experience any problems uploading pictures, please try the
          following:
        </span>
        <ol>
          <li>Enable JavaScript in your web browser</li>
          <li>Reduce the size of the pictures to less than or 2 MB each</li>
        </ol>
      </div>
    </div>
  );
};

export default PhotoUploadErrors;
