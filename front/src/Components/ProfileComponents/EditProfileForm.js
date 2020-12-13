import React, { Component } from "react";
import {
  Form,
  Label,
  Input,
  FormGroup,
  Button,
  FormFeedback,
  Alert,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import incorrectSVG from "../../icons/criss-cross.svg";
import correctSVG from "../../icons/correct.svg";

class EditProfileForm extends Component {
  static contextType = AuthContext;

  state = {
    name: "",
    streetAddress: "",
    phoneNumber: "",
    messageReadCanBeSeen: "",
    getNews: "",
    password: "",
    passwordInvalid: false,
    phoneNumberInvalid: false,
    emailInvalid: false,
    nameInvalid: false,
    streetAddressInvalid: false,
    checkBoxInvalid: false,
    defaultPhoneNumber: "",
    visible: false,
    message: "",
    alertColor: "",
    currentPassword: "",
    newPassword: "",
    currentPasswordInvalid: true,
    newPasswordInvalid: true,
    passwordType: "password",
    lowercaseLetter: false,
    uppercaseLetter: false,
    number: false,
    eightCharacters: false,
    changePasswordAlertColor: "info",
    changePasswordAlertVisible: false,
    changePasswordAlertMessage: "Demo",
  };

  // Alert dismiss
  onDismiss = () => this.setState({ visible: false });

  onChangePasswordAlertDismiss = () => {
    this.setState({ changePasswordAlertVisible: false });
  };

  handleSaveChanges = (e) => {
    const { dispatch } = this.context;

    e.preventDefault();

    let name = this.state.name;
    let nameValid = name !== "" && name !== null ? true : false;

    let streetAddress = this.state.streetAddress;
    let streetAddressValid = streetAddress !== null ? true : false;

    let phoneNumber = this.state.phoneNumber;
    let phoneNumberRegex = /^\d{10}$/;

    let phoneNumberValid =
      phoneNumber === null || phoneNumber === ""
        ? true
        : phoneNumberRegex.test(phoneNumber)
        ? true
        : false;

    let messageReadCanBeSeen = this.state.messageReadCanBeSeen;
    let messageReadCanBeSeenValid =
      typeof messageReadCanBeSeen === "boolean" ? true : false;

    let getNews = this.state.getNews;
    let getNewsValid = typeof getNews === "boolean" ? true : false;

    let password = this.state.password;
    let passwordValid = password !== "" && password !== null ? true : false;

    if (
      passwordValid &&
      nameValid &&
      streetAddressValid &&
      phoneNumberValid &&
      messageReadCanBeSeenValid &&
      messageReadCanBeSeenValid &&
      getNewsValid
    ) {
      console.log(
        this.state.name,
        this.state.streetAddress,
        this.state.phoneNumber,
        this.state.messageReadCanBeSeen,
        this.state.getNews,
        this.state.password
      );
      axios({
        method: "post",
        url: "/api/users/editProfile",
        data: {
          name,
          password,
          streetAddress,
          phoneNumber,
          messageReadCanBeSeen,
          getNews,
        },
      })
        .then((res) => {
          dispatch({ type: "PROFILE_EDITED", user: res.data.user });
          this.setState({
            visible: true,
            message: res.data.msg,
            alertColor: "success",
            password: "",
          });
          window.scrollTo(0, 0);
          console.log(res.data.msg);
        })
        .catch((err) => {
          this.setState({
            visible: true,
            message: err.response.data.msg,
            alertColor: "danger",
            password: "",
          });
          window.scrollTo(0, 0);
          console.log(err.response.data.msg);
        });
    } else {
      if (!passwordValid) {
        this.setState({
          passwordInvalid: true,
        });
      }
      if (!phoneNumberValid) {
        this.setState({
          phoneNumberInvalid: true,
        });
      }

      if (!nameValid) {
        this.setState({
          nameInvalid: true,
        });
      }
      if (!streetAddressValid) {
        this.setState({
          streetAddressInvalid: true,
        });
      }
      if (!messageReadCanBeSeenValid || !getNews) {
        this.setState({
          checkBoxInvalid: true,
        });
      }
    }
  };

  componentDidMount() {
    const { auth } = this.context;

    if (!auth.isAuthenticated) {
      window.location.replace("/");
    }

    const user = auth.user;

    this.setState({
      name: user.name,
      streetAddress: user.streetAddress,
      phoneNumber: user.phoneNumber,
      messageReadCanBeSeen: user.messageReadCanBeSeen,
      hideVisitCounter: user.hideVisitCounter,
      getNews: user.getNews,
    });
  }

  showHidePassword = () => {
    this.setState({
      passwordType: this.state.passwordType === "text" ? "password" : "text",
    });
  };

  getPasswordValidity = (password) => {
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

    return {
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    };
  };

  handleCurrentPasswordChange = (e) => {
    this.setState({
      currentPassword: e.target.value,
    });

    const {
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    } = this.getPasswordValidity(e.target.value);

    if (lowercaseLetter && uppercaseLetter && number && eightCharacters) {
      if (this.state.newPassword === e.target.value) {
        this.setState({
          changePasswordAlertColor: "danger",
          changePasswordAlertMessage: "Choose a new password",
          changePasswordAlertVisible: true,
          currentPasswordInvalid: true,
        });
      } else {
        this.setState({
          changePasswordAlertColor: "info",
          changePasswordAlertMessage: "",
          changePasswordAlertVisible: false,
          currentPasswordInvalid: false,
        });
      }
    } else {
      this.setState({
        currentPasswordInvalid: true,
      });
    }
  };

  // Check password
  handleNewPasswordChange = (e) => {
    this.setState({
      newPassword: e.target.value,
    });

    const {
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    } = this.getPasswordValidity(e.target.value);

    if (lowercaseLetter && uppercaseLetter && number && eightCharacters) {
      if (this.state.currentPassword === e.target.value) {
        this.setState({
          changePasswordAlertColor: "danger",
          changePasswordAlertMessage: "Choose a new password",
          changePasswordAlertVisible: true,
          newPasswordInvalid: true,
        });
      } else {
        this.setState({
          changePasswordAlertColor: "info",
          changePasswordAlertMessage: "",
          changePasswordAlertVisible: false,
          newPasswordInvalid: false,
        });
      }
    } else {
      this.setState({
        newPasswordInvalid: true,
      });
    }

    this.setState({
      lowercaseLetter,
      uppercaseLetter,
      number,
      eightCharacters,
    });
  };

  handleChangePassword = () => {
    if (this.state.currentPasswordInvalid && this.state.newPasswordInvalid) {
      this.setState({
        changePasswordAlertColor: "danger",
        changePasswordAlertMessage:
          "Please give valid current password and new password.",
        changePasswordAlertVisible: true,
      });
    } else {
      axios
        .post("/api/users/changePassword", {
          valid: "ValID32",
          currentPassword: this.state.currentPassword,
          newPassword: this.state.newPassword,
        })
        .then((res) => {
          this.setState({
            changePasswordAlertColor: "success",
            changePasswordAlertMessage: "Password changed.",
            changePasswordAlertVisible: true,
            currentPassword: "",
            newPassword: "",
          });
        })
        .catch((err) => {
          if (typeof err.response !== "undefined") {
            if (err.response.status === 500) {
              this.setState({
                changePasswordAlertColor: "danger",
                changePasswordAlertMessage: "Server Error.",
                changePasswordAlertVisible: true,
                currentPassword: "",
                newPassword: "",
              });
            } else if (err.response.status === 400) {
              this.setState({
                changePasswordAlertColor: "danger",
                changePasswordAlertMessage: err.response.data.msg,
                changePasswordAlertVisible: true,
                currentPassword: "",
                newPassword: "",
              });
            }
          } else {
            console.log(err);
          }
        });
    }
  };

  render() {
    return (
      <Form>
        <FormGroup className="edit-profile-details">
          <Alert
            color={this.state.alertColor}
            isOpen={this.state.visible}
            toggle={this.onDismiss}
          >
            {this.state.message}
          </Alert>
          <span className="text-muted">
            <b>Details</b> <br />
          </span>
          <Label className="mt-2">Name</Label>
          <Input
            type="text"
            defaultValue={this.state.name}
            onChange={(e) => {
              this.setState({
                name: e.target.value,
                nameInvalid: false,
                password: "",
              });
            }}
            invalid={this.state.nameInvalid}
          />
          <FormFeedback>Please input your name.</FormFeedback>
          <Label className="mt-2">Street address (optional) </Label>
          <Input
            type="text"
            defaultValue={this.state.streetAddress}
            onChange={(e) => {
              this.setState({
                streetAddress: e.target.value,
                streetAddressInvalid: false,
                password: "",
              });
            }}
            invalid={this.state.streetAddressInvalid}
          />
          <FormFeedback>Please input your street address.</FormFeedback>
          <Label className="mt-2">Phone number (optional)</Label>
          <Input
            type="text"
            pattern="[0-9]*"
            value={this.state.phoneNumber}
            onChange={(e) => {
              const phoneNumber = e.target.validity.valid
                ? e.target.value
                : this.state.defaultPhoneNumber;
              this.setState({
                phoneNumber,
                phoneNumberInvalid: false,
                password: "",
              });
            }}
            invalid={this.state.phoneNumberInvalid}
          />
          <FormFeedback>
            Please input correct 10 digits phone number.
          </FormFeedback>

          <FormGroup className="mt-3">
            <span className="text-muted ">
              <b>Preferences</b>
            </span>
            <FormGroup className="mt-2" check>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={(e) => {
                    this.setState({
                      messageReadCanBeSeen: e.target.checked,
                      password: "",
                    });
                  }}
                  checked={this.state.messageReadCanBeSeen}
                  invalid={this.state.checkBoxInvalid}
                />
                Others will see when I've read their message.
                <FormFeedback>Please input correct credential.</FormFeedback>
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={(e) => {
                    this.setState({ getNews: e.target.checked, password: "" });
                  }}
                  checked={this.state.getNews}
                  invalid={this.state.checkBoxInvalid}
                />{" "}
                I would like to get events news, new features and promotional
                informations.
                <FormFeedback>Please input correct credential.</FormFeedback>
              </Label>
            </FormGroup>
          </FormGroup>

          <Label className="mt-3">Verify your password to save changes</Label>
          <Input
            type="password"
            onChange={(e) => {
              this.setState({
                password: e.target.value,
                passwordInvalid: false,
              });
            }}
            invalid={this.state.passwordInvalid}
            value={this.state.password}
          />
          <FormFeedback>Please input valid current password</FormFeedback>

          <FormGroup className="mt-3">
            <Button
              type="button"
              color="primary"
              onClick={this.handleSaveChanges}
            >
              Save changes
            </Button>
          </FormGroup>
        </FormGroup>

        <FormGroup className="edit-profile-details mt-4">
          <span className="text-muted">
            <b>Change Password</b>
          </span>{" "}
          <br />
          <Alert
            color={this.state.changePasswordAlertColor}
            isOpen={this.state.changePasswordAlertVisible}
            toggle={this.onChangePasswordAlertDismiss}
            className="mt-3"
          >
            {this.state.changePasswordAlertMessage}
          </Alert>
          <Label className="mt-2">Current Password</Label>
          <Input
            type="password"
            onChange={(e) => {
              this.handleCurrentPasswordChange(e);
            }}
            invalid={this.state.currentPasswordInvalid}
            value={this.state.currentPassword}
          />
          <FormFeedback>Please input valid current password</FormFeedback>
          <Label className="mt-2">New Password</Label>
          <InputGroup>
            <Input
              type={this.state.passwordType}
              onChange={(e) => {
                this.handleNewPasswordChange(e);
              }}
              invalid={this.state.newPasswordInvalid}
              valid={!this.state.newPasswordInvalid}
              value={this.state.newPassword}
            />
            <InputGroupAddon className="show" addonType="append">
              <Button type="button" onClick={this.showHidePassword}>
                {this.state.passwordType === "text" ? "Hide" : "Show"}
              </Button>
            </InputGroupAddon>
            <FormFeedback valid>Looks good!</FormFeedback>
            <FormFeedback>Please input valid new password</FormFeedback>
          </InputGroup>
          {/* Validity  */}
          <FormGroup className="message mt-3">
            <small className="text-muted">
              {!this.state.lowercaseLetter ? (
                <img width="18" src={incorrectSVG} alt="" />
              ) : (
                <img width="18" src={correctSVG} alt="" />
              )}{" "}
              1 <b>lowercase</b> letter{" "}
            </small>{" "}
            <br />
            <small className="text-muted">
              {!this.state.uppercaseLetter ? (
                <img width="18" src={incorrectSVG} alt="" />
              ) : (
                <img width="18" src={correctSVG} alt="" />
              )}{" "}
              1 <b>capital (uppercase)</b> letter{" "}
            </small>{" "}
            <br />
            <small className="text-muted">
              {!this.state.number ? (
                <img width="18" src={incorrectSVG} alt="" />
              ) : (
                <img width="18" src={correctSVG} alt="" />
              )}{" "}
              1 <b>number </b>{" "}
            </small>{" "}
            <br />
            <small className="text-muted">
              {!this.state.eightCharacters ? (
                <img width="18" src={incorrectSVG} alt="" />
              ) : (
                <img width="18" src={correctSVG} alt="" />
              )}{" "}
              Minimum <b>8 characters </b>{" "}
            </small>{" "}
            <br />
          </FormGroup>
          {/* Change Password */}
          <FormGroup className="mt-3">
            <Button
              type="button"
              color="primary"
              onClick={this.handleChangePassword}
              disabled={
                this.state.newPasswordInvalid ||
                this.state.currentPasswordInvalid
              }
            >
              Change Password
            </Button>
          </FormGroup>
        </FormGroup>
      </Form>
    );
  }
}

export default EditProfileForm;
