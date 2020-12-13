import React from "react";

const IForgotMyPassword = () => {
  return (
    <div>
      <div>
        <h2>I Forgot My Password</h2>
      </div>
      <div className="mt-3">
        <p>
          If you’ve forgotten your Gadhimart password, you can reset it by
          following the steps below:
        </p>
        <ol>
          <li>Go to gadhimart.</li>
          <li>
            Click on the <b>Sign In</b> link found on the top right hand of the
            page.
          </li>
          <li>
            Hit <b>Forgot</b> above the password field.
          </li>
          <li>
            Enter your email and then clck <b>Send Email</b>. You will be sent
            an email with all the instructions on how to reset your password.
          </li>
          <li>
            The password reset link is valid for a period of 24 hours. Once the
            reset request expires a new password reset must be requested.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default IForgotMyPassword;
