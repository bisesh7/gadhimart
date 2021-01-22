const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const ensureAuthenticated = require("../../config/auth").ensureAuthenticated;
const nodemailer = require("nodemailer");
const config = require("config");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
// User model
const User = require("../../models/User");
// Forgot Password model
const ForgotPassword = require("../../models/ForgotPassword");
// confirm Email model
const ConfirmEmail = require("../../models/ConfirmEmail");
const { uuid, isUuid } = require("uuidv4");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordIsValid = (password) => {
  let lowercaseLetter = false,
    uppercaseLetter = false,
    number = false,
    eightCharacters = false;

  const lowercases = new RegExp("[a-z]");
  const uppercases = new RegExp("[A-Z]");
  const numbers = new RegExp("[0-9]");

  // Validate lowercase letter
  if (password.match(lowercases)) {
    lowercaseLetter = true;
  } else {
    lowercaseLetter = false;
  }

  // Validate uppercase letter
  if (password.match(uppercases)) {
    uppercaseLetter = true;
  } else {
    uppercaseLetter = false;
  }

  // Validate uppercase letter
  if (password.match(numbers)) {
    number = true;
  } else {
    number = false;
  }

  // Validate length
  if (password.length >= 8) {
    eightCharacters = true;
  } else {
    eightCharacters = false;
  }

  return lowercaseLetter && uppercaseLetter && number && eightCharacters;
};

const is24HrsAgo = (date) => {
  let timeStamp = Math.round(new Date().getTime() / 1000);
  let timeStampYesterday = timeStamp - 24 * 3600;
  let is24 = date >= new Date(timeStampYesterday * 1000).getTime();
  return is24;
};

const gmailId = config.get("gmailId");
const gmailPassword = config.get("gmailPassword");

// @route   POST /api/users
// @desc    Register new users
// @access  PUBLIC / ADMIN
router.post("/", (req, res) => {
  let name = "",
    email = "",
    password = "",
    valid = "",
    confirmed = false;

  if (typeof req.body.data !== "undefined") {
    name = req.body.data.name;
    email = req.body.data.email;
    password = req.body.data.password;
    valid = req.body.valid;
    confirmed = true;
  } else {
    name = req.body.name;
    email = req.body.email;
    password = req.body.password;
    valid = req.body.valid;
  }

  if (typeof valid !== "string") {
    console.log(1);
    return res
      .status(400)
      .json({ msg: "Please provide the valid details", success: false });
  }

  // Check valid
  switch (valid) {
    case config.API_KEY:
    case config.ADMIN_KEY:
      break;

    default:
      console.log(2);
      return res
        .status(400)
        .json({ msg: "Please provide the valid details", success: false });
  }

  //   All the possible errors
  let errors = {
    nameError: false,
    emailError: false,
    passwordError: false,
    termsError: false,
  };

  // Check required fields
  if (!name || name === null || name === "") {
    errors.nameError = true;
  }
  if (!email || email === null || email === "") {
    errors.emailError = true;
  }
  if (!password || password === null || password === "") {
    errors.passwordError = true;
  }
  if (password.length < 8) {
    errors.passwordError = true;
  }
  if (valid === config.API_KEY && typeof req.body.terms === "undefined") {
    errors.termsError = true;
  }

  const lowercase = new RegExp("[a-z]");
  const uppercase = new RegExp("[A-Z]");
  const numbers = new RegExp("[0-9]");
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Validate lowercase letter || Password
  if (!password.match(lowercase)) {
    errors.passwordError = true;
  }
  // Validate Uppercase letter || Password
  if (!password.match(uppercase)) {
    errors.passwordError = true;
  }
  // Validate numbers || Password
  if (!password.match(numbers)) {
    errors.passwordError = true;
  }

  //   Validate email
  if (!emailRegex.test(email)) {
    errors.emailError = true;
  }

  if (
    errors.emailError ||
    errors.nameError ||
    errors.passwordError ||
    errors.termsError
  ) {
    res.status(400).json({ msg: "Please enter all the field correctly!" });
  } else {
    User.findOne({ email: email.toLowerCase() })
      .then((user) => {
        if (user) {
          res.status(400).json({
            msg: "User already exists, please sign in instead!",
            success: false,
          });
        } else {
          const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            confirmed,
          });
          const newConfirmEmail = new ConfirmEmail({
            email: email.toLowerCase(),
          });

          // Confirm email unique id
          const uniqueId = uuid();

          // hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, passwordHash) => {
              if (err) {
                return res
                  .status(500)
                  .json({ msg: "Server error 1.0, please try again!" });
              }

              bcrypt.hash(uniqueId, salt, (err, uniqueIdHash) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ msg: "Server error 1.0, please try again!" });
                }
                //  Set password to hashed
                newUser.password = passwordHash;
                newConfirmEmail.uuid = uniqueIdHash;

                //  Save user
                newUser
                  .save()
                  .then((user) => {
                    if (valid === config.API_KEY) {
                      newConfirmEmail.userId = user.id;

                      newConfirmEmail
                        .save()
                        .then(() => {
                          res.json({
                            success: true,
                            id: user.id,
                          });

                          // If the new user is created by admin donot send confirmation email
                          let transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            requireTLS: true,
                            auth: {
                              user: gmailId,
                              pass: gmailPassword,
                            },
                          });

                          var mailOptions = {
                            from: "gadhimart@gmail.com",
                            to: email.toLowerCase(),
                            subject: "Confirm Your Email Address",
                            html: `
                            <html>
                              <head>
                                <style>
                                  a {
                                    padding: 1em 1.5em;
                                    text-transform: uppercase;
                                    background-color: #008CBA; /* blue */
                                    border: none;
                                    padding: 15px 32px;
                                    text-align: center;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: 16px;
                                    margin: 4px 2px;
                                    cursor: pointer;
                                    color: white;
                                  }
                                  .center {
                                    text-align: center;
                                  }
                            
                                  .text-muted{
                                    color: #999;
                                  }
                                  
                                  ul#menu li {
                                    display:inline;
                                  }
                                </style>
                              </head>
                              <body>
                                <h2>Hello ${user.name},</h2> 
                            
                                <h3><b>Welcome to Gadhimart! In order to get started, you need to confirm your e-mail address.</b></h3> <br/>
                            
                                <span>Your unique code is <b>${uniqueId}</b></span> <br/> <br/>
                            
                                <div class="center">
                                  <a href="#" style="color: white;">Confirm</a>  
                                </div><br/><br/>
                                
                                <small class="text-muted">Activation link is valid for 24 hours.</small> <br/>
                            
                                <span class="text-muted">If you did not initiate this request, please ignore this email.</span> <br/> <br/>
                            
                                <span class="text-muted">Thank you,</span> <br/>
                                <span class="text-muted">The Gadhimart Team</span>
                            
                                <div class="center">
                                  <h3>Gadhimart</h3>
                                  <small>© Gadhimart</small>
                                </div>
                              </body>
                            </html>
                            `,
                          };

                          transporter.sendMail(
                            mailOptions,
                            function (error, info) {
                              if (error) {
                                console.log(error);
                                return res.status(500).json({
                                  success: false,
                                  msg: "Server Error",
                                });
                              }
                            }
                          );
                        })
                        .catch((err) => {
                          res.status(500).json({
                            msg: "Server error 1.1, please try again!",
                          });
                        });
                    } else {
                      res.json({
                        success: true,
                        id: user.id,
                      });
                    }
                  })
                  .catch((err) =>
                    res
                      .status(500)
                      .json({ msg: "Server error 1.1, please try again!" })
                  );
              });
            });
          });
        }
      })
      .catch((err) =>
        res.status(500).json({ msg: "Server error 1.2, please try again!" })
      );
  }
});

// @route   POST /api/users/editProfile
// @desc    Update user profile
// @access  PRIVATE
router.post("/editProfile", ensureAuthenticated, (req, res) => {
  const {
    name,
    password,
    streetAddress,
    phoneNumber,
    messageReadCanBeSeen,
    getNews,
  } = req.body;

  //   All the possible errors
  let errors = {
    nameError: false,
    passwordError: false,
    streetAddressError: false,
    phoneNumberError: false,
    checkBoxError: false,
  };

  if (!password || password === null || password === "") {
    errors.passwordError = true;
  }

  if (password.length < 8) {
    errors.passwordError = true;
  }

  if (errors.passwordError) {
    return res.status(400).json({ msg: "Password is incorrect!" });
  }

  User.findById(req.user._id).then((user) => {
    // Match the password
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        console.log(err);
        res.status(500).json({ msg: "Server error, please try again!" });
      }
      if (isMatch) {
        if (name === "" || name === null || !name) {
          errors.nameError = true;
        }

        if (streetAddress.length > 50) {
          errors.streetAddressError = true;
        }
        let phoneNumberRegex = /^\d{10}$/;

        if (typeof phoneNumber === "string" && phoneNumber !== "") {
          if (!phoneNumberRegex.test(phoneNumber) || isNaN(phoneNumber)) {
            errors.phoneNumberError = true;
          }
        }

        errors.checkBoxError =
          typeof messageReadCanBeSeen === "boolean" &&
          typeof getNews === "boolean"
            ? false
            : true;

        if (
          !errors.nameError &&
          !errors.phoneNumberError &&
          !errors.streetAddressError &&
          !errors.checkBoxError
        ) {
          user.name = name;
          user.phoneNumber = phoneNumber;
          user.streetAddress = streetAddress;
          user.messageReadCanBeSeen = messageReadCanBeSeen;
          user.getNews = getNews;
          user
            .save()
            .then(() => {
              let username = {
                name,
                email: req.user.email,
                profilePicturePath: user.profilePicturePath,
                streetAddress,
                phoneNumber,
                messageReadCanBeSeen,
                getNews,
              };

              return res.json({
                msg: "Your profile has been saved.",
                // Error set user here
                user: username,
              });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ msg: "Server Error", success: false });
            });
        } else {
          res.status(400).json({ msg: "Please input correct credentials!" });
        }
      } else {
        return res.status(400).json({ msg: "Password is incorrect!" });
      }
    });
  });
});

// @route   POST /api/users/changePassword
// @desc    Change user password
// @access  PRIVATE
router.post("/changePassword", ensureAuthenticated, (req, res) => {
  const { valid, currentPassword, newPassword } = req.body;
  if (
    typeof valid !== "string" ||
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    valid !== "ValID32"
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (
    !passwordIsValid(currentPassword) ||
    !passwordIsValid(newPassword) ||
    currentPassword === newPassword
  ) {
    return res.status(400).json({ success: false, msg: "Passwords Error" });
  }

  User.findById(req.user._id).then((user) => {
    // Match the password
    bcrypt.compare(currentPassword, user.password, (error, isMatch) => {
      if (error) {
        return res.status(500).json({ success: false, msg: "Server error" });
      }
      if (isMatch) {
        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, msg: "Server Error" });
          }
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) {
              return res
                .status(500)
                .json({ msg: "Server error 1.0, please try again!" });
            }

            //  Set password to hashed
            user.password = hash;

            //  Save user
            user
              .save()
              .then((user) => {
                res.json({
                  success: true,
                });
              })
              .catch((err) => res.status(500).json({ msg: "Server Error" }));
          });
        });
      } else {
        console.log("Invalid");
        return res.status(400).json({ msg: "Current password is invalid" });
      }
    });
  });
});

// @route   POST /api/users/forgotPassword
// @desc    forgot password
// @access  PUBLIC
router.post("/forgotPassword", (req, res) => {
  const { valid, email } = req.body;

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    valid !== config.API_KEY
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email" });
  }

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ success: "false", msg: "Error finding the email" });
    }

    if (user === null) {
      return res
        .status(400)
        .json({ success: false, msg: "Email address doesn't exist." });
    } else {
      ForgotPassword.findOne(
        { email: email.toLowerCase() },
        (err, document) => {
          if (err) {
            return res
              .status(500)
              .json({ success: "false", msg: "Server error" });
          }
          if (document !== null) {
            return res.status(400).json({
              success: "false",
              msg: "Code has already been sent to your email!",
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                return res
                  .status(500)
                  .json({ success: false, msg: "Server Error" });
              }
              bcrypt.hash(uniqueId, salt, (err, hash) => {
                if (err) {
                  return res.status(500).json({ msg: "Server error" });
                }

                const newForgotPassword = new ForgotPassword({
                  email: email.toLowerCase(),
                  uuid: hash,
                  userId: user.id,
                });

                newForgotPassword
                  .save()
                  .then(() => {
                    return res.json({ success: true });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({ success: false, msg: "Server Error" });
                  });
              });
            });

            const uniqueId = uuid();

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                user: gmailId,
                pass: gmailPassword,
              },
            });

            var mailOptions = {
              from: "gadhimart@gmail.com",
              to: email,
              subject: "Password reset",
              html: `
              <html>
                <head>
                  <style>
                    a {
                      padding: 1em 1.5em;
                      text-transform: uppercase;
                      background-color: #008CBA; /* blue */
                      border: none;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      margin: 4px 2px;
                      cursor: pointer;
                      color: white;
                    }
                    .center {
                      text-align: center;
                    }
              
                    .text-muted{
                      color: #999;
                    }
                    
                    ul#menu li {
                      display:inline;
                    }
                  </style>
                </head>
                <body>
                  <h2>Hello ${user.name},</h2> 
              
                  <h3><b>A request has been recieved to change the 
                  password of your Gadhimart account</b></h3> <br/>
              
                  <span>Your unique code is <b>${uniqueId}</b></span> <br/> <br/>
              
                  <div class="center">
                    <a href="#" style="color: white;">Reset</a>  
                  </div><br/><br/>
              
                  <small class="text-muted">Activation link is valid for 24 hours.</small> <br/>
                  <span class="text-muted">If you did not initiate this request, please login to 
                  your Gadhimart account</span> <br/> <br/>
              
                  <span class="text-muted">Thank you,</span> <br/>
                  <span class="text-muted">The Gadhimart Team</span>
              
                  <div class="center">
                    <h3>Gadhimart</h3>
                    <small>© Gadhimart</small>
                  </div>
                </body>
              </html>
              `,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ success: false, msg: "Server Error" });
              }
            });
          }
        }
      );
    }
  });
});

// @route   POST /api/users/deleteForgotPassword
// @desc    When user sign in, if he has forgot password then delete it
// @access  PRIVATE
router.post("/deleteForgotPassword", ensureAuthenticated, (req, res) => {
  const { email, valid } = req.body;

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    valid !== "ValID32"
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email" });
  }

  ForgotPassword.findOne({ email: email.toLowerCase() }, (err, document) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Server Error while finding." });
    }

    if (document === null) {
      return res.json({
        success: true,
        msg: "No documents found in forgot password.",
      });
    } else {
      document
        .remove()
        .then(() => {
          return res.json({ success: true, msg: "Document deleted." });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ success: false, msg: "Server Error while deleting." });
        });
    }
  });
});

// @route   POST /api/users/resetPassword
// @desc    reset password
// @access  PUBLIC
router.post("/resetPassword", (req, res) => {
  const { valid, code, email, password } = req.body;

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    valid !== config.API_KEY
  ) {
    console.log(valid);
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email." });
  }

  if (!passwordIsValid(password)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid password" });
  }

  if (!isUuid(code)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid code." });
  }

  User.findOne({ email: email.toLowerCase() }).then((user) => {
    ForgotPassword.findOne({ email: email.toLowerCase() }, (err, document) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server error." });
      }

      if (document === null) {
        return res
          .status(400)
          .json({ success: false, msg: "Please reset your password." });
      } else {
        if (is24HrsAgo(document.date)) {
          bcrypt.compare(code, document.uuid, (error, isMatch) => {
            if (error) {
              return res
                .status(500)
                .json({ success: false, msg: "Server error" });
            }
            if (!isMatch) {
              return res.status(400).json({
                success: false,
                msg: "Please provide a valid code.",
              });
            } else {
              // Match the password
              bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                  return res
                    .status(500)
                    .json({ success: false, msg: "Server error" });
                }

                if (isMatch) {
                  return res.status(400).json({
                    success: false,
                    msg:
                      "Please provide a different password from the previous one.",
                  });
                } else {
                  // hash password
                  bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({ success: false, msg: "Server Error" });
                    }
                    bcrypt.hash(password, salt, (err, hash) => {
                      if (err) {
                        return res.status(500).json({ msg: "Server error" });
                      }

                      //  Set password to hashed
                      user.password = hash;

                      //  Save user
                      user
                        .save()
                        .then((user) => {
                          document
                            .remove()
                            .then(() => {
                              res.json({
                                success: true,
                              });

                              let transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 587,
                                secure: false,
                                requireTLS: true,
                                auth: {
                                  user: gmailId,
                                  pass: gmailPassword,
                                },
                              });

                              var mailOptions = {
                                from: "gadhimart@gmail.com",
                                to: email,
                                subject: "Password reset",
                                html: `
                              <html>
                                <head>
                                  <style>
                                    .center {
                                      text-align: center;
                                    }
              
                                    .text-muted{
                                      color: #999;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <h2>Hello ${user.name},</h2> 
              
                                  <h3><b>Your have successfully changed your password for your gadhimart account</b></h3> <br/>
              
                                  <span class="text-muted">If you did not change the password, please change your password of 
                                  your Gadhimart account immediately.</span> <br/> <br/>
              
                                  <span class="text-muted">Thank you,</span> <br/>
                                  <span class="text-muted">The Gadhimart Team</span>
              
                                  <div class="center">
                                    <h3>Gadhimart</h3>
                                    <small>© Gadhimart</small>
                                  </div>
                                </body>
                              </html>
                              
                            `,
                              };

                              transporter.sendMail(
                                mailOptions,
                                function (error, info) {
                                  if (error) {
                                    console.log(error);
                                    return res.status(500).json({
                                      success: false,
                                      msg: "Server Error",
                                    });
                                  }
                                }
                              );
                            })
                            .catch((err) => {
                              res.status(500).json({ msg: "Server Error" });
                            });
                        })
                        .catch((err) =>
                          res.status(500).json({ msg: "Server Error" })
                        );
                    });
                  });
                }
              });
            }
          });
        } else {
          return res.status(400).json({
            success: false,
            msg: "Code is invalid. Please click below to get the new code.",
          });
        }
      }
    });
  });
});

// @route   POST /api/users/confirmEmail
// @desc    confirm email
// @access  PUBLIC
router.post("/confirmEmail", (req, res) => {
  const { valid, code, email } = req.body;

  console.log(req.body);

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    valid !== config.API_KEY
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email." });
  }

  if (!isUuid(code)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid code." });
  }

  ConfirmEmail.findOne({ email: email.toLowerCase() }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (document === null) {
      return res
        .status(400)
        .json({ success: false, msg: "User doesn't exist." });
    } else {
      if (is24HrsAgo(document.date)) {
        bcrypt.compare(code, document.uuid, (error, isMatch) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ success: false, msg: "Server error" });
          }

          if (!isMatch) {
            return res
              .status(400)
              .json({ success: false, msg: "Please provide a valid code." });
          }

          User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
              return res.status(500).json({ success: false, msg: "Error" });
            }

            user.confirmed = true;

            user.save().then(() => {
              document
                .remove()
                .then(() => {
                  res.json({ success: true });
                })
                .catch((err) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ success: false, msg: "Error" });
                  }
                });
            });
          });
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "Code has expired. Please click below to get a new code.",
        });
      }
    }
  });
});

// @route   POST /api/users/resendEmail
// @desc    resend password reset email
// @access  PUBLIC
router.post("/resendPasswordResetEmail", (req, res) => {
  const { valid, email } = req.body;

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    valid !== config.API_KEY
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email" });
  }

  // Find the user woith the email
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ success: "false", msg: "Error finding the email" });
    }

    // If no such use exists then send response with error
    if (user === null) {
      return res
        .status(400)
        .json({ success: false, msg: "Email address doesn't exist." });
    } else {
      // Find a forgot password with given email
      ForgotPassword.findOne(
        { email: email.toLowerCase() },
        (err, document) => {
          if (err) {
            return res
              .status(500)
              .json({ success: "false", msg: "Server error" });
          }
          // If forgot password doesnt exists then user hasnt requested to change password
          if (document === null) {
            return res.status(400).json({
              success: "false",
              msg: "Code has not been sent to the email.",
            });
          } else {
            const uniqueId = uuid();

            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                return res
                  .status(500)
                  .json({ success: false, msg: "Server Error" });
              }
              bcrypt.hash(uniqueId, salt, (err, hash) => {
                if (err) {
                  return res.status(500).json({ msg: "Server error" });
                }

                document.uuid = hash;

                document
                  .save()
                  .then(() => {
                    return res.json({ success: true });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({ success: false, msg: "Server Error" });
                  });
              });
            });

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                user: gmailId,
                pass: gmailPassword,
              },
            });

            const html = getResetPasswordWithCodeHTML(user, uniqueId);
            var mailOptions = {
              from: "gadhimart@gmail.com",
              to: email,
              subject: "Password reset",
              html: `
              <html>
                <head>
                  <style>
                    a {
                      padding: 1em 1.5em;
                      text-transform: uppercase;
                      background-color: #008CBA; /* blue */
                      border: none;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      margin: 4px 2px;
                      cursor: pointer;
                      color: white;
                    }
                    .center {
                      text-align: center;
                    }
              
                    .text-muted{
                      color: #999;
                    }
                    
                    ul#menu li {
                      display:inline;
                    }
                  </style>
                </head>
                <body>
                  <h2>Hello ${user.name},</h2> 
              
                  <h3><b>A request has been recieved to change the 
                  password of your Gadhimart account</b></h3> <br/>
              
                  <span>Your unique code is <b>${uniqueId}</b></span> <br/> <br/>
              
                  <div class="center">
                    <a href="#" style="color: white;">Reset</a>  
                  </div><br/><br/>
              
                  <small class="text-muted">Activation link is valid for 24 hours.</small> <br/>
              
                  <span class="text-muted">If you did not initiate this request, please login to 
                  your Gadhimart account</span> <br/> <br/>
              
                  <span class="text-muted">Thank you,</span> <br/>
                  <span class="text-muted">The Gadhimart Team</span>
              
                  <div class="center">
                    <h3>Gadhimart</h3>
                    <small>© Gadhimart</small>
                  </div>
                </body>
              </html>
              `,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ success: false, msg: "Server Error" });
              }
            });
          }
        }
      );
    }
  });
});

// @route   POST /api/users/resendEmail
// @desc    resend email confirm email
// @access  PUBLIC
router.post("/resendConfirmationEmail", (req, res) => {
  const { valid, email } = req.body;

  if (
    typeof valid !== "string" ||
    typeof email !== "string" ||
    valid !== config.API_KEY
  ) {
    return res.status(400).json({ success: false, msg: "Validation Error" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide a valid email" });
  }

  // Find the user woith the email
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ success: "false", msg: "Error finding the email" });
    }

    // If no such use exists then send response with error
    if (user === null) {
      return res
        .status(400)
        .json({ success: false, msg: "Email address doesn't exist." });
    } else {
      // Find a confirm email with given email
      ConfirmEmail.findOne({ email: email.toLowerCase() }, (err, document) => {
        if (err) {
          return res
            .status(500)
            .json({ success: "false", msg: "Server error" });
        }
        // If forgot password doesnt exists then user hasnt requested to change password
        if (document === null) {
          return res.status(400).json({
            success: "false",
            msg: "Code has not been sent to the email.",
          });
        } else {
          const uniqueId = uuid();

          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res
                .status(500)
                .json({ success: false, msg: "Server Error" });
            }
            bcrypt.hash(uniqueId, salt, (err, hash) => {
              if (err) {
                return res.status(500).json({ msg: "Server error" });
              }

              document.uuid = hash;

              document
                .save()
                .then(() => {
                  return res.json({ success: true });
                })
                .catch((err) => {
                  return res
                    .status(500)
                    .json({ success: false, msg: "Server Error" });
                });
            });
          });

          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: gmailId,
              pass: gmailPassword,
            },
          });

          var mailOptions = {
            from: "gadhimart@gmail.com",
            to: email,
            subject: "Password reset",
            html: `
            <html>
              <head>
                <style>
                  a {
                    padding: 1em 1.5em;
                    text-transform: uppercase;
                    background-color: #008CBA; /* blue */
                    border: none;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    color: white;
                  }
                  .center {
                    text-align: center;
                  }
            
                  .text-muted{
                    color: #999;
                  }
                  
                  ul#menu li {
                    display:inline;
                  }
                </style>
              </head>
              <body>
                <h2>Hello ${user.name},</h2> 
            
                <h3><b>Welcome to Gadhimart! In order to get started, you need to confirm your e-mail address.</b></h3> <br/>
            
                <span>Your unique code is <b>${uniqueId}</b></span> <br/> <br/>
            
                <div class="center">
                  <a href="#" style="color: white;">Confirm</a>  
                </div><br/><br/>
                
                <small class="text-muted">Activation link is valid for 24 hours.</small> <br/>
            
                <span class="text-muted">If you did not initiate this request, please ignore this email.</span> <br/> <br/>
            
                <span class="text-muted">Thank you,</span> <br/>
                <span class="text-muted">The Gadhimart Team</span>
            
                <div class="center">
                  <h3>Gadhimart</h3>
                  <small>© Gadhimart</small>
                </div>
              </body>
            </html>
            `,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({ success: false, msg: "Server Error" });
            }
          });
        }
      });
    }
  });
});

// @route   POST /api/users/get/:id
// @desc    Get user profile by public
// @access  PUBLIC
router.post("/get/:id", (req, res) => {
  const { valid } = req.body;

  if (valid !== config.API_KEY) {
    return res.status(400).json({ success: false });
  }

  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      console.log();
      return res.json({
        userDetail: {
          name: user.name,
          profilePicturePath: user.profilePicturePath,
          messageReadCanBeSeen: user.messageReadCanBeSeen,
        },
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/users/:id
// @desc    Get user profile by admin
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.json({
          data: {},
          success: false,
          err: "noUserError",
          msg: "Could not find such id.",
        });
      }
      return res.json({
        data: {
          date: user.registerDate,
          email: user.email,
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicturePath,
          streetAddress: user.streetAddress,
          phoneNumber: user.phoneNumber,
          messageReadCanBeSeen: user.messageReadCanBeSeen,
          getNews: user.getNews,
          confirmed: user.confirmed,
          blocked: user.blocked,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   GET /api/users/getTotal
// @desc    Get total number of the new users for the given date
// @access  ADMIN
router.post("/getTotal", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter } = req.query;

  const filterDetail = JSON.parse(filter);

  let date = null;
  if (typeof filterDetail.date !== "undefined") {
    date = filterDetail.date;
    delete filterDetail.date;
  }

  const getData = (documents) => {
    let total = 0;
    const incrementTotal = () => {
      total++;
    };

    // If date filter is given we need to check the date here
    // since its easier to check here
    if (date !== null) {
      let dateToCheck = new Date(date);
      documents.forEach((document) => {
        let documentDate = new Date(document.registerDate);

        if (
          dateToCheck.getFullYear() === documentDate.getFullYear() &&
          dateToCheck.getDate() === documentDate.getDate() &&
          dateToCheck.getMonth() === documentDate.getMonth()
        ) {
          incrementTotal();
        }
      });
    }

    return total;
  };

  // When admin needs multiple users then we send filters to the api
  User.find(filterDetail).exec((err, documents) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Error finding the document.",
      });
    }

    if (!documents.length) {
      return res.json({ data: [], success: true, total: documents.length });
    }

    // Getting the REST friendly datas
    let total = getData(documents);

    return res.json({ success: true, total });
  });
});

// @route   GET /api/users/
// @desc    Get all the user profiles
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  let filterDetail = JSON.parse(filter);

  // If id in filter is not valid send empty list back
  if (typeof filterDetail._id !== "undefined") {
    const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

    if (!isValid) {
      return res.json({ data: [], success: true, total: 0 });
    }
  }

  // For reference fields
  if (typeof filterDetail.id !== "undefined") {
    // Since mongoose only accepts _id
    filterDetail = { _id: filterDetail.id };
  }

  let registeredDate = null;
  if (typeof filterDetail.registeredDate !== "undefined") {
    registeredDate = filterDetail.registeredDate;
    // remove the registeredDate since we want to check the date
    // after getting the documents
    delete filterDetail.registeredDate;
  }

  let firstIndex = null;
  let lastIndex = null;

  if (typeof range !== "undefined") {
    const ranges = JSON.parse(range);
    firstIndex = ranges[0];
    lastIndex = ranges[1];
  }

  // If no sort is given we should pass empty string
  let sortAccordingTo = "";
  let sortDirection = "";

  if (typeof sort !== "undefined") {
    const sortDetail = JSON.parse(sort);
    switch (sortDetail[0]) {
      // If id or profile is used we use _id as id is placed as _id by mongoose
      case "id":
      case "profilePicture":
        sortAccordingTo = "_id";
        break;
      // We sent register date as date so when date is sent registerDate is used
      case "date":
        sortAccordingTo = "registerDate";
        break;
      default:
        sortAccordingTo = sortDetail[0];
        break;
    }

    sortDirection = sortDetail[1] === "ASC" ? "" : "-";
  }

  const getUsers = (documents) => {
    let users = [];

    const pushToData = (user) => {
      users.push({
        date: user.registerDate,
        email: user.email,
        id: user.id,
        name: user.name,
        profilePicture: user.profilePicturePath,
        streetAddress: user.streetAddress,
        phoneNumber: user.phoneNumber,
        messageReadCanBeSeen: user.messageReadCanBeSeen,
        getNews: user.getNews,
        confirmed: user.confirmed,
        blocked: user.blocked,
      });
    };

    // If date filter is given we need to check the date here
    // since its easier to check here
    if (registeredDate !== null) {
      let dateToCheck = new Date(registeredDate);
      documents.forEach((user) => {
        let documentDate = new Date(user.registerDate);

        if (
          dateToCheck.getFullYear() === documentDate.getFullYear() &&
          dateToCheck.getDate() === documentDate.getDate() &&
          dateToCheck.getMonth() === documentDate.getMonth()
        ) {
          pushToData(user);
        }
      });
    } else {
      documents.forEach((user) => {
        pushToData(user);
      });
    }

    return users;
  };

  // When admin needs multiple users then we send filters to the api
  User.find(filterDetail)
    .sort(`${sortDirection}${sortAccordingTo}`)
    .exec((err, documents) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "serverError",
          msg: "Error finding the user.",
        });
      }

      if (!documents.length) {
        return res.json({ data: [], success: true, total: documents.length });
      }

      let users = [];
      let total = null;

      // The indexes will only be given the list view
      // In reference view indexes will not be given so it will be null
      // So we dont splice the document
      if (firstIndex !== null && lastIndex !== null) {
        users = getUsers(documents);
        total = users.length;
        let splicedDocuments = users.slice(firstIndex, lastIndex + 1);
        users = splicedDocuments;
      } else {
        users = getUsers(documents);
        total = users.length;
      }
      return res.json({ data: users, success: true, total });
    });
});

// @route   POST /api/users/editProfile
// @desc    Update user profile
// @access  ADMIN
router.put("/:id", (req, res) => {
  const {
    date,
    email,
    id,
    name,
    profilePicture,
    streetAddress,
    phoneNumber,
    messageReadCanBeSeen,
    getNews,
    confirmed,
    valid,
    blocked,
  } = req.body.data;

  if (valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false });
  }

  if (name === "" || name === null || !name) {
    return res.status(400).json({ success: false });
  }

  if (streetAddress.length > 50) {
    return res.status(400).json({ success: false });
  }

  let phoneNumberRegex = /^\d{10}$/;

  if (typeof phoneNumber === "string" && phoneNumber !== "") {
    if (!phoneNumberRegex.test(phoneNumber) || isNaN(phoneNumber)) {
      return res.status(400).json({ success: false });
    }
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false });
  }

  if (
    typeof messageReadCanBeSeen !== "boolean" ||
    typeof getNews !== "boolean" ||
    typeof confirmed !== "boolean"
  ) {
    return res.status(400).json({ success: false });
  }

  User.findOne({ _id: id }).then((user) => {
    user.name = name;
    user.phoneNumber = phoneNumber;
    user.streetAddress = streetAddress;
    user.messageReadCanBeSeen = messageReadCanBeSeen;
    user.getNews = getNews;
    user.date = date;
    user.profilePicturePath = profilePicture;
    user.confirmed = confirmed;
    user.email = email;
    user.id = id;
    user.blocked = blocked;

    user
      .save()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: "Server Error", success: false });
      });
  });
});

// @route   DELETE /api/users/:id
// @desc    delete user profile
// @access  ADMIN
router.delete("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const id = req.params.id;

  //   Check the type and secret key
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      msg: "Please provide valid informations.",
    });
  }

  User.findOne({ _id: id }).then((user) => {
    const removeUser = () => {
      user
        .remove()
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Server eroor while deleting the quiz.",
          });
        });
    };

    try {
      let userProfilePicturePath = user.profilePicturePath;

      if (userProfilePicturePath === "/assets/images/default-profile.png") {
        return removeUser();
      }

      const profilePictureWholePath = `${
        path.join(__dirname, "../../") + userProfilePicturePath
      }`;

      fs.exists(profilePictureWholePath, function (exists) {
        if (exists) {
          fs.unlink(profilePictureWholePath, (err) => {
            if (err) {
              throw err;
            }

            return removeUser();
          });
        } else {
          console.log("File doesn't exist!");
          return res
            .status(400)
            .json({ msg: "File doesn't exist", success: false });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Server eroor while deleting the quiz.",
      });
    }
  });
});

// @route   DELETE /api/users?query
// @desc    delete user profiles in query
// @access  ADMIN
router.delete("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple users then we send filters to the body
  if (typeof req.query.filter !== "undefined") {
    const { filter } = req.query;
    const filterJSON = JSON.parse(filter);
    const { id } = filterJSON;

    User.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the user.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          try {
            let userProfilePicturePath = document.profilePicturePath;

            if (
              userProfilePicturePath === "/assets/images/default-profile.png"
            ) {
              promises.push(document.remove());
            } else {
              const profilePictureWholePath = `${
                path.join(__dirname, "../../") + userProfilePicturePath
              }`;

              fs.exists(profilePictureWholePath, function (exists) {
                if (exists) {
                  fs.unlink(profilePictureWholePath, (err) => {
                    if (err) {
                      throw err;
                    }

                    promises.push(document.remove());
                  });
                } else {
                  console.log("File doesn't exist!");
                  return res
                    .status(400)
                    .json({ msg: "File doesn't exist", success: false });
                }
              });
            }
          } catch (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Server eroor while deleting the quiz.",
            });
          }
        });

        // Deleting the users
        Promise.all(promises)
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              err: "serverError",
              msg: "Error deleting the users.",
            });
          });
      });
  }
});

// @route   GET /api/users/removeProfilePicture/:id
// @desc    Remove the profile picture of the user
// @access  ADMIN
router.put("/removeProfilePicture/:id", (req, res) => {
  const { valid } = req.body;

  if (valid !== config.ADMIN_KEY) {
    return res.status(400).json({ success: false });
  }

  const id = req.params.id;

  User.findOne({ _id: id }).then((user) => {
    try {
      let userProfilePicturePath = user.profilePicturePath;

      if (userProfilePicturePath === "/assets/images/default-profile.png") {
        return res.json({ success: true });
      }

      const profilePictureWholePath = `${
        path.join(__dirname, "../../") + userProfilePicturePath
      }`;

      fs.exists(profilePictureWholePath, function (exists) {
        if (exists) {
          fs.unlink(profilePictureWholePath, (err) => {
            if (err) {
              throw err;
            }
            user.profilePicturePath = "/assets/images/default-profile.png";
            user
              .save()
              .then(() => {
                return res.json({ success: true });
              })
              .catch((err) => {
                throw err;
              });
          });
        } else {
          console.log("File doesn't exist");
          return res
            .status(400)
            .json({ msg: "File doesn't exist", success: false });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Server Error", success: false });
    }
  });
});

module.exports = router;
