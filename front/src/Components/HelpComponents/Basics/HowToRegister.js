import React from "react";

const HowToRegister = () => {
  return (
    <div>
      <div>
        <h2>How To Register</h2>
      </div>
      <div className="mt-3">
        <p className="heading">
          To register your account in Gadhimart follow the follwing steps.
        </p>
      </div>
      <div>
        <ol>
          <li>
            Click <b>Register now</b> at the top of the Gadhimart homepage.
          </li>
          <li>
            Enter the name, email and the password you'd like others to see when
            you message them on Gadhimart.
          </li>
          <li>
            When done, click <b>Create new account</b> at the bottom of the
            form.
          </li>
          <li>
            You'll receive a welcome email to the address you entered in the
            form. To finalize your account, open the email and click{" "}
            <b>Activate Your Account</b>.
          </li>
        </ol>
      </div>
      <div>
        <p>
          You're all set. You should now be able to sign in and begin your
          journey to that perfect new ride!
        </p>
      </div>
      <div>
        <p>
          <b>Note:</b> If you haven't recieved your welcome email, please check
          your email's junk ad spam folders. Make sure to add{" "}
          <b>gadhimart@gmail.com</b> to your email's safe list as well.
        </p>
      </div>
    </div>
  );
};

export default HowToRegister;
