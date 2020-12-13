import React from "react";

const ChangingMyAccountPassword = () => {
  return (
    <div>
      <div>
        <h2>Changing My Account Password</h2>
      </div>
      <div className="mt-3">
        <p>
          If you want to change your Gadhimart password, you can change it by
          following the steps below:
        </p>
        <ol>
          <li>Login to gadhimart.</li>
          <li>
            Click on the dropdown menu found on the top right hand of the page
            then select profile.
          </li>
          <li>
            Hit <b>Edit profile</b> below the profile image.
          </li>
          <li>
            Scroll down to the change password section. Enter your current
            password and retype the password. Makes sure to follow the
            instruction.
          </li>
          <li>
            Click on <b>Change Password</b> to change your password.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ChangingMyAccountPassword;
