import React from "react";
import { Link } from "react-router-dom";

const HowToRegister = () => {
  return (
    <div>
      <div>
        <h2>How To Sign In</h2>
      </div>
      <div className="mt-3">
        <p className="heading">
          To sign in to your account in Gadhimart follow the follwing steps.
        </p>
      </div>
      <div>
        <ol>
          <li>
            Click <b>Sign In</b> at the top of the Gadhimart homepage.
          </li>
          <li>Enter the email and the password you used to register.</li>
          <li>
            Click <b>Sign In</b> at the bottom of the form.
            <br />
            <small>
              If requested follow the instructions in the reCAPTCHA test and hit
              Verify
            </small>
          </li>
        </ol>
      </div>
      <div>
        <p>
          To sign out click on dropdown menu at the top of page and then select{" "}
          <b>Sign Out</b> from the menu.
        </p>
      </div>
      <div>
        <p>
          <b>Note:</b> If you're unable to login following the steps
          above,&nbsp;
          <Link to="/help/technicalIssues#browserIssues">
            check for the browser issues
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default HowToRegister;
