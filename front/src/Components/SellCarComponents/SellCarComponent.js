import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import {
  Container,
  FormGroup,
  Row,
  Alert,
  Col,
  Label,
  Input,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Spinner,
  Button,
  FormFeedback,
  Card,
  CardImg,
  CardBody,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import { getCarMakeAndModels } from "../../Lists/carList";
import {
  getCarTransmission,
  getCarBodyType,
  getCarConditions,
  getFuelTypes,
  getDrivetrains,
  getColors,
  getSeats,
  getDoors,
} from "../../Lists/filters";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import queryString from "query-string";
import axios from "axios";
import Carousel from "@brainhubeu/react-carousel";
import { isEmpty, setAuthStatus } from "../../methods";
import { uuid } from "uuidv4";
import PropagateLoader from "react-spinners/PropagateLoader";
import { AuthContext } from "../../Contexts/AuthContext";
import { SocketContext } from "../../Contexts/SocketContext";
import socketIOClient from "socket.io-client";
import ImageUploader from "./ImageUploader";
import infoSVG from "../../icons/signs.svg";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";
import { getEndPoint } from "../../config";

let socket;

const SellCarComponent = (props) => {
  // Get auth details
  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // If user is not logged in redirect to home
  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  // Get socket
  const { socketDetail } = useContext(SocketContext);

  useEffect(() => {
    socket = socketDetail.socket;

    // When client restarts the page, socketcontext get defaulted
    // So reassigning socket here.
    if (socket === null) {
      socket = socketIOClient(getEndPoint());
    }

    // Turn off socket after unmounting the component
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socketDetail]);

  // Car Details Lists
  const [transmissions, setTransmssions] = useState([]);
  useEffect(() => {
    getCarTransmission(setTransmssions);
  }, []);
  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getCarBodyType(setBodyTypes);
  }, []);
  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getCarConditions(setConditions);
  }, []);
  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getFuelTypes(setFuelTypes);
  }, []);
  const [drivetrains, setDrivetrains] = useState([]);
  useEffect(() => {
    getDrivetrains(setDrivetrains);
  }, []);
  const [colors, setColors] = useState([]);
  useEffect(() => {
    getColors(setColors);
  }, []);
  const [seats, setSeats] = useState([]);
  useEffect(() => {
    getSeats(setSeats);
  }, []);
  const [doors, setDoors] = useState([]);
  useEffect(() => {
    getDoors(setDoors);
  }, []);

  // Form
  const [editedForm, setEditedForm] = useState(false);
  const [formNumber, setFormNumber] = useState(null);
  const [saving, setSaving] = useState(false);
  const [possibleErrors, setPossibleErrors] = useState({});
  const [formAlertVisible, setFormAlertVisible] = useState(false);
  const [formAlertMessage, setFormAlertMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCarMakeAndModels(setCars);
  }, []);

  const [provinceWithDistricts, setProvinceWithDistricts] = useState([]);

  useEffect(() => {
    getProvincesWithDistricts(setProvinceWithDistricts);
  }, []);

  // update the size of the window to check for small device
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Adding event listener to the resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 992) {
      setWindowSize("large");
    } else if (windowWidth < 992 && windowWidth >= 768) {
      setWindowSize("medium");
    } else if (windowWidth < 768 && windowWidth >= 600) {
      setWindowSize("small");
    } else if (windowWidth < 600) {
      setWindowSize("extraSmall");
    }
  }, [windowWidth]);

  // Reference points for each area of form
  const formAlertRef = useRef(null);
  const carDetailRef = useRef(null);
  const mediaRef = useRef(null);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const contactRef = useRef(null);

  // States for car details
  const [carFeaturesColLeftSize] = useState(4);
  const [carYearInput, setCarYearInput] = useState("");
  const [carMakeSelected, setCarMakeSelected] = useState("");
  const [carModelSelected, setCarModelSelected] = useState("");
  const [carMakeOptions, setCarMakeOptions] = useState([]);
  const [carModelOptions, setCarModelOptions] = useState([]);
  const [carTrimInput, setCarTrimInput] = useState("");
  const [carBodyTypeSelected, setCarBodyTypeSelected] = useState("");
  const [carBodyTypeOptions, setCarBodyTypeOptions] = useState("");
  const [carConditionSelected, setCarConditionSelected] = useState("");
  const [carConditionOptions, setCarConditionOptions] = useState("");
  const [carKiloMetersInput, setCarKiloMetersInput] = useState("");
  const [carTransmissionSelected, setCarTransmissionSelected] = useState("");
  const [carTransmissionOptions, setCarTransmissionOptions] = useState("");
  const [carDrivetrainSelected, setCarDrivetrainSelected] = useState("");
  const [carDrivetrainOptions, setCarDrivetrainOptions] = useState("");
  const [carColorSelected, setCarColorSelected] = useState("");
  const [carColorOptions, setCarColorOptions] = useState("");
  const [carFuelTypeSelected, setCarFuelTypeSelected] = useState("");
  const [carFuelTypeOptions, setCarFuelTypeOptions] = useState("");
  const [carDoorsSelected, setCarDoorsSelected] = useState("");
  const [carDoorsOptions, setCarDoorsOptions] = useState("");
  const [carSeatsSelected, setCarSeatsSelected] = useState("");
  const [carSeatsOptions, setCarSeatsOptions] = useState("");

  // cars features padding
  const [carFeaturesPaddingTop] = useState("pt-2");
  const [carHasSunRoof, setCarHasSunRoof] = useState(false);
  const [carHasAlloyWheels, setCarHasAlloyWheels] = useState(false);
  const [carHasNavigationSystem, setCarHasNavigationSystem] = useState(false);
  const [carHasBluetooth, setCarHasBluetooth] = useState(false);
  const [carHasPushStart, setCarHasPushStart] = useState(false);
  const [carHasParkingAssistant, setCarHasParkingAssistant] = useState(false);
  const [carHasCruiseControl, setCarHasCruiseControl] = useState(false);
  const [carHasAirConditioning, setCarHasAirConditioning] = useState(false);
  const [carHasPowerSteering, setCarHasPowerSteering] = useState(false);
  const [carHasPowerWindow, setCarHasPowerWindow] = useState(false);
  const [carHasKeylessEntry, setCarHasKeylessEntry] = useState(false);
  const [carHasAbs, setCarHasAbs] = useState(false);
  const [carHasCarplay, setCarHasCarplay] = useState(false);
  const [carHasAndroidAuto, setCarHasAndroidAuto] = useState(false);

  // Ad title
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");

  // Location
  const [provinceSelected, setProvinceSelected] = useState("");
  const [provinceOptions, setProvinceOptions] = useState([]);

  const [districtSelected, setDistrictSelected] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);

  const [streetAddressInput, setStreetAddressInput] = useState("");

  // Price
  const [priceType, setPriceType] = useState("notFree");
  const [carPriceInput, setCarPriceInput] = useState("");

  // Contact
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  // set the phone number and email to the one set by the user
  useEffect(() => {
    setEmail(auth.user.email);
    setPhoneNumberInput(
      auth.user.phoneNumber === null ? "" : auth.user.phoneNumber
    );
    setUserId(auth.user.id);
  }, [auth]);

  // Picture upload
  const [lastUploadedPicturesCards, setLastUploadedPicturesCards] = useState(
    []
  );
  const [pictureUploadAlertVisible, setPictureUploadAlertVisible] = useState(
    false
  );
  const [pictureUploadAlertMessage, setPictureUploadAlertMessage] = useState(
    ""
  );
  const [uploading, setUploading] = useState(false);
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [toBeSubmitted, setToBeSubmitted] = useState(false);
  const [picturesToBeUploadedMeta, setPicturesToBeUploadedMeta] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [lastUploadedImages, setLastUploadedImages] = useState([]);

  // Generate unique id of the picture directory
  useEffect(() => {
    setUniqueId(uuid());
  }, [uuid]);

  // Generate car make options
  useEffect(() => {
    // Make the list of options of car makes.
    let carMakeOptions = cars.map((car, key) => (
      <option key={key} selected={car.make === carMakeSelected ? true : false}>
        {car.make}
      </option>
    ));

    // Add select option to the beginninng of the options
    carMakeOptions.splice(
      0,
      0,
      <option key="SelectMake" value="">
        Select
      </option>
    );

    setCarMakeOptions(carMakeOptions);
  }, [cars]);

  // Generate car model options
  useEffect(() => {
    if (cars.length) {
      let carModelOptions = [];

      // Create the list of car models depending on the car make selected
      if (
        carMakeSelected !== "" &&
        carMakeSelected !== "Select" &&
        carMakeSelected !== "Other"
      ) {
        let carMakeObject = cars.find((car) => car.make === carMakeSelected);
        carModelOptions = carMakeObject.models.map((model, key) => {
          return <option key={key}>{model.model}</option>;
        });

        carModelOptions.splice(
          0,
          0,
          <option key="SelectModel" value="">
            Select
          </option>
        );

        carModelOptions.push(<option key="OtherModel">Other</option>);
      } else if (carMakeSelected === "" || carMakeSelected === "Select") {
        carModelOptions.push(
          <option key="SelectModel" value="">
            Select
          </option>
        );
      } else if (carMakeSelected === "Other") {
        carModelOptions.push(<option key="OtherModel">Other</option>);
      }

      setCarModelOptions(carModelOptions);
    }
  }, [cars, carMakeSelected]);

  // Generate body type options
  useEffect(() => {
    const bodyTypeOptions = bodyTypes.map((bodyType, key) => (
      <option
        key={key}
        selected={bodyType === carBodyTypeSelected ? true : false}
      >
        {bodyType}
      </option>
    ));

    // Add select option to the beginninng of the options
    bodyTypeOptions.splice(
      0,
      0,
      <option key="SelectBodyType" value="">
        Select
      </option>
    );

    setCarBodyTypeOptions(bodyTypeOptions);
  }, [bodyTypes]);

  // Generate condtion options
  useEffect(() => {
    const conditionOptions = conditions.map((condition, key) => (
      <option
        key={key}
        selected={condition === carConditionSelected ? true : false}
      >
        {condition}
      </option>
    ));

    // Add select option to the beginninng of the options
    conditionOptions.splice(
      0,
      0,
      <option key="SelectCondition" value="">
        Select
      </option>
    );

    setCarConditionOptions(conditionOptions);
  }, [conditions]);

  // Generate transmissions options
  useEffect(() => {
    const carTransmissionOptions = transmissions.map((transmission, key) => (
      <option
        key={key}
        selected={transmission === carTransmissionSelected ? true : false}
      >
        {transmission}
      </option>
    ));

    // Add select option to the beginninng of the options
    carTransmissionOptions.splice(
      0,
      0,
      <option key="SelectTransmission" value="">
        Select
      </option>
    );

    setCarTransmissionOptions(carTransmissionOptions);
  }, [transmissions]);

  // Generate drivetrain options
  useEffect(() => {
    const carDrivetrainOptions = drivetrains.map((driveTrain, key) => (
      <option
        key={key}
        selected={driveTrain === carDrivetrainSelected ? true : false}
      >
        {driveTrain}
      </option>
    ));

    // Add select option to the beginninng of the options
    carDrivetrainOptions.splice(
      0,
      0,
      <option key="SelectDrivetrain" value="">
        Select
      </option>
    );

    setCarDrivetrainOptions(carDrivetrainOptions);
  }, [drivetrains]);

  // Generate colors options
  useEffect(() => {
    const carColorOptions = colors.map((color, key) => (
      <option key={key} selected={color === carColorSelected ? true : false}>
        {color}
      </option>
    ));

    // Add select option to the beginninng of the options
    carColorOptions.splice(
      0,
      0,
      <option key="SelectColor" value="">
        Select
      </option>
    );

    setCarColorOptions(carColorOptions);
  }, [colors]);

  // Generate fuel type options
  useEffect(() => {
    const carFuelTypeOptions = fuelTypes.map((fuelType, key) => (
      <option
        key={key}
        selected={fuelType === carFuelTypeSelected ? true : false}
      >
        {fuelType}
      </option>
    ));

    // Add select option to the beginninng of the options
    carFuelTypeOptions.splice(
      0,
      0,
      <option key="SelectFuelType" value="">
        Select
      </option>
    );

    setCarFuelTypeOptions(carFuelTypeOptions);
  }, [fuelTypes]);

  // Generate doors options
  useEffect(() => {
    const carDoorsOptions = doors.map((door, key) => (
      <option key={key} selected={door === carDoorsSelected ? true : false}>
        {door}
      </option>
    ));

    // Add select option to the beginninng of the options
    carDoorsOptions.splice(
      0,
      0,
      <option key="SelectDoors" value="">
        Select
      </option>
    );

    setCarDoorsOptions(carDoorsOptions);
  }, [doors]);

  // Generate seats options
  useEffect(() => {
    const carSeatsOptions = seats.map((seat, key) => (
      <option key={key} selected={seat === carSeatsSelected ? true : false}>
        {seat}
      </option>
    ));

    // Add select option to the beginninng of the options
    carSeatsOptions.splice(
      0,
      0,
      <option key="SelectSeats" value="">
        Select
      </option>
    );

    setCarSeatsOptions(carSeatsOptions);
  }, [seats]);

  // Generate province options
  useEffect(() => {
    // Create a list of options of the province
    let provinceOptions = provinceWithDistricts.map((province) => {
      return (
        <option key={province.key}>
          {province.name !== "" ? province.name : province.province}
        </option>
      );
    });

    // Add select option to the province options
    provinceOptions.splice(
      0,
      0,
      <option key="provinceSelect" value="">
        Select
      </option>
    );

    setProvinceOptions(provinceOptions);
  }, [provinceWithDistricts]);

  // Generate distict options
  useEffect(() => {
    if (provinceWithDistricts.length) {
      let districtOptions = [];

      // Create the list of districts
      if (provinceSelected !== "" && provinceSelected !== "Select") {
        let proviceObject = provinceWithDistricts.find(
          (province) =>
            province.name === provinceSelected ||
            province.province === provinceSelected
        );

        districtOptions = proviceObject.districts.map((district) => {
          return <option key={district.key}>{district.district}</option>;
        });

        districtOptions.splice(
          0,
          0,
          <option key="districtSelect" value="">
            Select
          </option>
        );
      } else {
        districtOptions.push(
          <option key="districtSelect" value="">
            Select
          </option>
        );
      }

      setDistrictOptions(districtOptions);
    }
  }, [provinceSelected, provinceWithDistricts]);

  // Generate form details if it is edited form
  useEffect(() => {
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      if (
        parsedQueryStrings.continueEditing &&
        (parsedQueryStrings.continueEditing === "1" ||
          parsedQueryStrings.continueEditing === "2")
      ) {
        setEditedForm(true);

        // There need to be id in qs if the car is saved and is edited
        if (parsedQueryStrings.continueEditing === "2") {
          if (
            parsedQueryStrings.id === null ||
            parsedQueryStrings.id === "" ||
            typeof parsedQueryStrings.id === "undefined"
          ) {
            return props.location.push("/");
          } else {
            setFormNumber(2);
          }
        } else if (parsedQueryStrings.continueEditing === "1") {
          setFormNumber(1);
        }

        // Getting the carDetails from the session storage
        const lastFormDetail = JSON.parse(
          sessionStorage.getItem("previewCarDetails")
        );

        if (lastFormDetail === null) {
          return props.location.push("/");
        }

        setPicturesToBeUploadedMeta(lastFormDetail.picturesToBeUploadedMeta);
        setCarMakeSelected(lastFormDetail.carMakeSelected);
        setCarModelSelected(lastFormDetail.carModelSelected);
        setCarYearInput(lastFormDetail.carYearInput.toString());
        setCarTrimInput(lastFormDetail.carTrimInput);
        setCarBodyTypeSelected(lastFormDetail.carBodyTypeSelected);
        setCarConditionSelected(lastFormDetail.carConditionSelected);
        setCarKiloMetersInput(lastFormDetail.carKiloMetersInput.toString());
        setCarTransmissionSelected(lastFormDetail.carTransmissionSelected);
        setCarDrivetrainSelected(lastFormDetail.carDrivetrainSelected);
        setCarColorSelected(lastFormDetail.carColorSelected);
        setCarFuelTypeSelected(lastFormDetail.carFuelTypeSelected);
        setCarDoorsSelected(lastFormDetail.carDoorsSelected);
        setCarSeatsSelected(lastFormDetail.carSeatsSelected);
        setCarHasSunRoof(lastFormDetail.carHasSunRoof);
        setCarHasAlloyWheels(lastFormDetail.carHasAlloyWheels);
        setCarHasNavigationSystem(lastFormDetail.carHasNavigationSystem);
        setCarHasBluetooth(lastFormDetail.carHasBluetooth);
        setCarHasPushStart(lastFormDetail.carHasPushStart);
        setCarHasParkingAssistant(lastFormDetail.carHasParkingAssistant);
        setCarHasCruiseControl(lastFormDetail.carHasCruiseControl);
        setCarHasAirConditioning(lastFormDetail.carHasAirConditioning);
        setCarHasPowerSteering(lastFormDetail.carHasPowerSteering);
        setCarHasPowerWindow(lastFormDetail.carHasPowerWindow);
        setCarHasKeylessEntry(lastFormDetail.carHasKeylessEntry);
        setCarHasAbs(lastFormDetail.carHasAbs);
        setCarHasCarplay(lastFormDetail.carHasCarplay);
        setCarHasAndroidAuto(lastFormDetail.carHasAndroidAuto);
        setAdTitle(lastFormDetail.adTitle);
        setAdDescription(lastFormDetail.adDescription);
        setYoutubeLinkInput(lastFormDetail.youtubeLinkInput);
        setProvinceSelected(lastFormDetail.provinceSelected);
        setDistrictSelected(lastFormDetail.districtSelected);
        setStreetAddressInput(lastFormDetail.streetAddressInput);
        setPriceType(lastFormDetail.priceType);
        setCarPriceInput(lastFormDetail.carPriceInput.toString());
        setPhoneNumberInput(lastFormDetail.phoneNumberInput);
        setEmail(lastFormDetail.email);
        setUserId(lastFormDetail.userId);
        setUniqueId(lastFormDetail.uniqueId);
        setLastUploadedImages(lastFormDetail.picturesToBeUploadedMeta);
        setMainPicture(lastFormDetail.mainPicture);
      }
    }
  }, []);

  useEffect(() => {
    if (lastUploadedImages.length >= 1) {
      let lastUploadedPicturesCards = [];
      lastUploadedImages.forEach((meta, key) => {
        lastUploadedPicturesCards.push({
          key,
          card: (
            <Card key={key}>
              <CardImg
                top
                width="100%"
                src={meta.fileUrl}
                height="110"
                style={{ objectFit: "cover" }}
                alt="Car Image"
              />
              <CardBody className="text-center ">
                {formNumber === 2 &&
                (picturesToBeUploadedMeta.length <= 2 ||
                  lastUploadedImages.length <= 2) ? null : (
                  <Button
                    className={formNumber === 2 ? "float-left" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      const deletePictureInFrontEnd = () => {
                        // Finding the index of the removed picture in the current list with the help of the meta id
                        const index = picturesToBeUploadedMeta.findIndex(
                          (x) => x.id === meta.id
                        );
                        let newPicturesToBeUploadedMeta = [
                          ...picturesToBeUploadedMeta,
                        ];
                        // Removing from the list
                        newPicturesToBeUploadedMeta.splice(index, 1);
                        // Updating the state
                        setPicturesToBeUploadedMeta(
                          newPicturesToBeUploadedMeta
                        );

                        const lastUploadedImagesIndex = lastUploadedImages.findIndex(
                          (x) => x.id === meta.id
                        );
                        let newLastUploadedImages = [...lastUploadedImages];
                        newLastUploadedImages.splice(
                          lastUploadedImagesIndex,
                          1
                        );
                        setLastUploadedImages(newLastUploadedImages);

                        lastUploadedPicturesCards = lastUploadedPicturesCards.filter(
                          (lUPC) => lUPC.key !== key
                        );
                        setLastUploadedPicturesCards(lastUploadedPicturesCards);
                      };

                      // Delete the image in the backend as well
                      if (formNumber === 1) {
                        console.log("form number 1 delete called");
                        axios({
                          method: "post",
                          url: "/api/upload/removeCarImage",
                          data: {
                            fileUrl: meta.fileUrl,
                            sentFrom: "thisIsValid",
                            formNumber,
                          },
                        })
                          .then((res) => {
                            deletePictureInFrontEnd();
                          })
                          .catch((err) => {
                            if (err.status === "500") {
                              console.log(err.response.data.msg);
                            } else if (err.status === "400") {
                              console.log(err.response.data.msg);
                            }
                          });
                      } else if (formNumber === 2) {
                        // If edit number is 2 only delete when the picture is in temp folder
                        if (meta.fileUrl.includes("/assets/uploads/temp/")) {
                          axios({
                            method: "post",
                            url: "/api/upload/removeCarImage",
                            data: {
                              fileUrl: meta.fileUrl,
                              sentFrom: "thisIsValid",
                              formNumber,
                            },
                          })
                            .then((res) => {
                              deletePictureInFrontEnd();
                            })
                            .catch((err) => {
                              if (err.status === "500") {
                                console.log(err.response.data.msg);
                              } else if (err.status === "400") {
                                console.log(err.response.data.msg);
                              }
                            });
                        } else {
                          deletePictureInFrontEnd();
                        }
                      }
                    }}
                    color="link"
                    type="button"
                  >
                    <img
                      alt="Remove"
                      width="26"
                      src="/assets/icons/criss-cross.svg"
                    />
                  </Button>
                )}

                {formNumber === 2 ? (
                  <Label check className="mt-2">
                    <Input
                      onClick={() => {
                        setMainPicture(meta.fileUrl);
                      }}
                      defaultChecked={meta.fileUrl === mainPicture}
                      type="radio"
                      name="radio1"
                    />{" "}
                    Main
                  </Label>
                ) : null}
              </CardBody>
            </Card>
          ),
        });
      });

      setLastUploadedPicturesCards(lastUploadedPicturesCards);
    }
  }, [lastUploadedImages, picturesToBeUploadedMeta, mainPicture]);

  useEffect(() => {
    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      if (
        parsedQueryStrings.continueEditing &&
        (parsedQueryStrings.continueEditing === "1" ||
          parsedQueryStrings.continueEditing === "2")
      ) {
        // If continue editing is 1 meta file url will not contain
        // /assets/upload rather it will contain /assets/temp
        // in other words client is messing with the url
        if (parsedQueryStrings.continueEditing === "1") {
          picturesToBeUploadedMeta.forEach((meta) => {
            if (
              typeof meta.fileUrl !== "undefined" &&
              meta.fileUrl.includes("/assets/uploads/carImages/")
            ) {
              return props.location.push("/");
            }
          });
        }
      }
    }
  }, [picturesToBeUploadedMeta]);

  // Picture upload alert toggle
  const onPictureUploadAlertDismiss = () => {
    setPictureUploadAlertVisible(false);
    setPictureUploadAlertMessage("");
  };

  const onFormAlertDismiss = () => {
    setFormAlertVisible(false);
    setFormAlertMessage("");
  };

  //  this methods checks the errors and returns the errors in the form
  const formulateErrors = () => {
    // All the possible errors
    let possibleErrors = {
      noYearError: true,
      noMakeError: true,
      noModelError: true,
      noTrimError: true,
      noBodyTypeError: true,
      noConditionError: true,
      noKilometersError: true,
      noTransmissionError: true,
      noDriveTrainError: true,
      noColorError: true,
      noFuelTypeError: true,
      noDoorsError: true,
      noSeatsError: true,
      noCheckBoxError: true,
      noAdTitleError: true,
      noAdDescriptionError: true,
      noPicturesError: true,
      noYoutubeLinkError: true,
      noProvinceError: true,
      noDistrictError: true,
      noStreetAddressError: true,
      noPriceTypeError: true,
      noPriceInputError: true,
      noPhoneNumberError: true,
      noEmailError: true,
    };

    const thisYear = new Date().getFullYear();
    /* 
    or is used here because [0 | 0 = 0]; [0 | 1 = 1]; [1 | 1 = 1] 0 is F and 1 is T
    we do not want carYearInput to be empty string and also not greater than the current year
    when car year input is empty string it is equal to 1 and same case when it is greater than current year
    0 === 0 is true which means noYearError is true 
    */
    if (
      carYearInput === "" ||
      parseInt(carYearInput) > thisYear ||
      carYearInput.length !== 4
    ) {
      possibleErrors.noYearError = false;
    } else {
      possibleErrors.noYearError = true;
    }

    // Check whether the make selected is within the car list.
    const makeSelectedIsWithinTheCarList = () => {
      return cars.some((car) => car.make === carMakeSelected);
    };

    // cars make
    possibleErrors.noMakeError = makeSelectedIsWithinTheCarList();

    // Check whether the model selected is within the car list.
    const modelSelectedIsWithinTheCarList = () => {
      if (carMakeSelected.toLowerCase() === "other") {
        return true;
      }

      let carMakeObject = cars.find((car) => car.make === carMakeSelected);

      if (carModelSelected.toLowerCase() === "other") {
        return true;
      }

      return carMakeObject.models.some(
        (carModel) => carModel.model === carModelSelected
      );
    };

    // If car make is not selected, there will car make error.
    // There should be no car make error should before checking model error.
    if (possibleErrors.noMakeError) {
      possibleErrors.noModelError = modelSelectedIsWithinTheCarList();
    } else {
      possibleErrors.noModelError = false;
    }

    // Check if the user given input is not empty
    const checkInputError = (input, length) => {
      if (input !== "" && input.length <= length) {
        return true;
      } else {
        return false;
      }
    };

    // Car trim
    if (carTrimInput !== "") {
      possibleErrors.noTrimError = carTrimInput.length > 50 ? false : true;
    } else {
      possibleErrors.noTrimError = true;
    }

    // Check if the given item in within the given list
    const checkIfTheItemIsWithinTheGivenList = (list, item) => {
      return list.some(
        (listItem) => listItem.toLowerCase() === item.toLowerCase()
      );
    };

    // Check body is empty
    possibleErrors.noBodyTypeError = checkIfTheItemIsWithinTheGivenList(
      bodyTypes,
      carBodyTypeSelected
    );

    // Check condition is empty
    possibleErrors.noConditionError = checkIfTheItemIsWithinTheGivenList(
      conditions,
      carConditionSelected
    );

    // Check kilometer is empty
    // params: kilometer input and maximum length
    possibleErrors.noKilometersError = checkInputError(carKiloMetersInput, 20);

    // Transmission
    possibleErrors.noTransmissionError = checkIfTheItemIsWithinTheGivenList(
      transmissions,
      carTransmissionSelected
    );

    // Drivetrain
    possibleErrors.noDriveTrainError = checkIfTheItemIsWithinTheGivenList(
      drivetrains,
      carDrivetrainSelected
    );

    // Color
    possibleErrors.noColorError = checkIfTheItemIsWithinTheGivenList(
      colors,
      carColorSelected
    );

    // Fuel Type
    possibleErrors.noFuelTypeError = checkIfTheItemIsWithinTheGivenList(
      fuelTypes,
      carFuelTypeSelected
    );

    // Door
    possibleErrors.noDoorsError = checkIfTheItemIsWithinTheGivenList(
      doors,
      carDoorsSelected
    );

    // Seats
    possibleErrors.noSeatsError = checkIfTheItemIsWithinTheGivenList(
      seats,
      carSeatsSelected
    );

    // List of all the checkbox button values
    const booleanCheckList = [
      carHasSunRoof,
      carHasAlloyWheels,
      carHasNavigationSystem,
      carHasBluetooth,
      carHasPushStart,
      carHasParkingAssistant,
      carHasCruiseControl,
      carHasAirConditioning,
      carHasPowerSteering,
      carHasPowerWindow,
      carHasKeylessEntry,
      carHasAbs,
      carHasCarplay,
      carHasAndroidAuto,
    ];

    // Checking the type of every checkbox value to be boolean
    booleanCheckList.some((check) => {
      if (typeof check !== "boolean") {
        possibleErrors.noCheckBoxError = false;
        return true;
      } else {
        return false;
      }
    });

    // Check ad title is empty
    // params: ad title input and maximum length
    possibleErrors.noAdTitleError = checkInputError(adTitle, 150);

    possibleErrors.noAdDescriptionError = checkInputError(adDescription, 2000);

    if (props.location.search) {
      const parsedQueryStrings = queryString.parse(props.location.search);
      if (
        parsedQueryStrings.continueEditing &&
        (parsedQueryStrings.continueEditing == 1 ||
          parsedQueryStrings.continueEditing == 2)
      ) {
        if (
          picturesToBeUploadedMeta.length > 10 ||
          picturesToBeUploadedMeta.length < 2 ||
          uploading === true ||
          toBeSubmitted === true
        ) {
          possibleErrors.noPicturesError = false;
        } else {
          possibleErrors.noPicturesError = true;
        }
      }
    } else if (
      picturesToBeUploadedMeta.length < 2 ||
      picturesToBeUploadedMeta.length > 10 ||
      uploading === true ||
      toBeSubmitted === true
    ) {
      possibleErrors.noPicturesError = false;
    } else {
      possibleErrors.noPicturesError = true;
    }

    // Youtube link
    if (youtubeLinkInput !== "") {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = youtubeLinkInput.match(regExp);
      if (match && match[2].length === 11) {
        possibleErrors.noYoutubeLinkError = true;
      } else {
        possibleErrors.noYoutubeLinkError = false;
      }
    } else {
      possibleErrors.noYoutubeLinkError = true;
    }

    // Check whether the province selected is within the province list.
    const provinceSelectedIsWithinTheProvinceList = () => {
      let exists;

      if (provinceSelected === "" || provinceSelected === "Select") {
        return false;
      }

      let found = false;

      found = provinceWithDistricts.find(
        (province) =>
          (province.province.toLowerCase() === provinceSelected.toLowerCase()) |
          (province.name.toLowerCase() === provinceSelected.toLowerCase())
      );

      // If the province in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }

      return exists ? true : false;
    };

    // check for province error
    possibleErrors.noProvinceError = provinceSelectedIsWithinTheProvinceList();

    // Check whether the district selected is within the district list.
    const districtSelectedIsWithinTheDistrictList = () => {
      let exists;
      let provinceObject = provinceWithDistricts.find(
        (province) =>
          province.name === provinceSelected ||
          province.province === provinceSelected
      );

      let found = false;

      found = provinceObject.districts.find(
        (district) =>
          district.district.toLowerCase() === districtSelected.toLowerCase()
      );

      // If the district in valid found is assigned that province
      if (typeof found === "object") {
        exists = true;
      }

      return exists ? true : false;
    };

    if (possibleErrors.noProvinceError) {
      possibleErrors.noDistrictError = districtSelectedIsWithinTheDistrictList();
    } else {
      possibleErrors.noDistrictError = false;
    }

    // Check for district error only if there is no province error
    if (possibleErrors.noDistrictError && possibleErrors.noProvinceError) {
      possibleErrors.noStreetAddressError = checkInputError(
        streetAddressInput,
        100
      );
    } else {
      possibleErrors.noStreetAddressError = false;
    }

    // Checks if the price type selected is valid
    const priceTypeSelectedIsWithinThePriceTypeList = () => {
      const priceTypeList = ["notFree", "free", "contact"];

      return checkIfTheItemIsWithinTheGivenList(priceTypeList, priceType);
    };

    possibleErrors.noPriceTypeError = priceTypeSelectedIsWithinThePriceTypeList();

    // Check for price input if it is not free and price type is valid
    // If price type is free or contact then price input is valid.
    if (
      possibleErrors.noPriceTypeError &&
      priceType === "notFree" &&
      carPriceInput !== ""
    ) {
      possibleErrors.noPriceInputError = checkInputError(carPriceInput, 10);
    } else if (possibleErrors.noPriceTypeError && priceType !== "notFree") {
      possibleErrors.noPriceInputError = true;
    } else {
      possibleErrors.noPriceInputError = false;
    }

    // Checks the phone number input
    // Phone number should be 10 digits and landline number should be 7 digits or empty
    const phoneNumberIsValid = (phoneNumber) => {
      var mobileNoRegex = /^\d{10}$/;
      var landLineNoRegex = /^\d{7}$/;

      if (
        mobileNoRegex.test(phoneNumber) ||
        landLineNoRegex.test(phoneNumber)
      ) {
        return true;
      } else {
        return false;
      }
    };

    if (phoneNumberInput !== "" && phoneNumberInput !== null) {
      possibleErrors.noPhoneNumberError = phoneNumberIsValid(phoneNumberInput);
    } else {
      if (phoneNumberInput === null) {
        setPhoneNumberInput("");
      }
      possibleErrors.noPhoneNumberError = true;
    }

    const emailIsValid = (mail) => {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(String(mail).toLowerCase());
    };

    possibleErrors.noEmailError = emailIsValid(email);

    return possibleErrors;
  };

  // checks if any of the keys in object is false, returns true if so
  const hasErrors = (obj) => {
    for (var o in obj) if (!obj[o]) return true;

    return false;
  };

  // This function checks all the errors and then slides to the error
  const checkErrorAndSlideToThem = (possibleErrors) => {
    setPossibleErrors(possibleErrors);

    // If therre is picture error check which error it is
    if (!possibleErrors.noPicturesError) {
      if (uploading) {
        setPictureUploadAlertMessage("The images are uploading, please wait.");
        setPictureUploadAlertVisible(true);
      }
      if (picturesToBeUploadedMeta.length < 2) {
        setPictureUploadAlertMessage(
          "Please submit at least 2 pictures and at most 10 pictures."
        );
        setPictureUploadAlertVisible(true);
      }
      if (toBeSubmitted) {
        setPictureUploadAlertMessage("Please submit the pictures.");
        setPictureUploadAlertVisible(true);
      }
    }

    if (
      !possibleErrors.noYearError ||
      !possibleErrors.noMakeError ||
      !possibleErrors.noModelError ||
      !possibleErrors.noTrimError ||
      !possibleErrors.noBodyTypeError ||
      !possibleErrors.noConditionError ||
      !possibleErrors.noKilometersError ||
      !possibleErrors.noTransmissionError ||
      !possibleErrors.noDriveTrainError ||
      !possibleErrors.noColorError ||
      !possibleErrors.noFuelTypeError ||
      !possibleErrors.noDoorsError ||
      !possibleErrors.noSeatsError ||
      !possibleErrors.noCheckBoxError ||
      !possibleErrors.noAdTitleError ||
      !possibleErrors.noAdDescriptionError
    ) {
      return carDetailRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      !possibleErrors.noPicturesError ||
      !possibleErrors.noYoutubeLinkError
    ) {
      return mediaRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      !possibleErrors.noProvinceError ||
      !possibleErrors.noDistrictError ||
      !possibleErrors.noStreetAddressError
    ) {
      return locationRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      !possibleErrors.noPriceInputError ||
      !possibleErrors.noPriceTypeError
    ) {
      return priceRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      !possibleErrors.noPhoneNumberError ||
      !possibleErrors.noEmailError
    ) {
      return contactRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // Create car detail
  const createCarDetail = () => {
    const carDetails = {
      carMakeSelected,
      carModelSelected,
      carYearInput: parseFloat(carYearInput),
      carTrimInput,
      carBodyTypeSelected,
      carConditionSelected,
      carKiloMetersInput: parseFloat(carKiloMetersInput),
      carTransmissionSelected,
      carDrivetrainSelected,
      carColorSelected,
      carFuelTypeSelected,
      carDoorsSelected,
      carSeatsSelected,
      carHasSunRoof,
      carHasAlloyWheels,
      carHasNavigationSystem,
      carHasBluetooth,
      carHasPushStart,
      carHasParkingAssistant,
      carHasCruiseControl,
      carHasAirConditioning,
      carHasPowerSteering,
      carHasPowerWindow,
      carHasKeylessEntry,
      carHasAbs,
      carHasCarplay,
      carHasAndroidAuto,
      adTitle,
      adDescription,
      youtubeLinkInput,
      provinceSelected,
      districtSelected,
      streetAddressInput,
      priceType,
      carPriceInput: parseFloat(carPriceInput),
      phoneNumberInput,
      email,
      userId,
      picturesToBeUploadedMeta,
      date: Date.now(),
      uniqueId,
      mainPicture,
    };
    return carDetails;
  };

  // handle preview button
  const handlePreviewClick = () => {
    if (!uploading) {
      const possibleErrors = formulateErrors();

      try {
        if (hasErrors(possibleErrors)) {
          console.log(possibleErrors);
          checkErrorAndSlideToThem(possibleErrors);
        } else {
          console.log("Form is valid");
          const carDetails = createCarDetail();
          console.log(carDetails);
          // Set the car details to the session storage and the redirect to preview page
          sessionStorage.setItem(
            "previewCarDetails",
            JSON.stringify(carDetails)
          );

          if (props.location.search) {
            const parsedQueryStrings = queryString.parse(props.location.search);
            if (
              parsedQueryStrings.continueEditing &&
              parsedQueryStrings.continueEditing == 2 &&
              parsedQueryStrings.id
            ) {
              props.history.push(
                "/preview/car?posted=1&&lid=" + parsedQueryStrings.id
              );
            } else {
              props.history.push("/preview/car");
            }
          } else {
            props.history.push("/preview/car");
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setPictureUploadAlertMessage("The images are uploading, please wait.");
      setPictureUploadAlertVisible(true);
    }
  };

  //  handle post ad button
  const handlePostAdClick = () => {
    const possibleErrors = formulateErrors();

    if (hasErrors(possibleErrors)) {
      checkErrorAndSlideToThem(possibleErrors);
    } else {
      setSaving(true);

      const carDetails = createCarDetail();

      axios({
        method: "post",
        url: "/api/car",
        data: {
          carDetails,
        },
      })
        .then((res) => {
          axios
            .post("/api/savedSearch/matchFiltersWithNewCar", {
              carDetails,
              valid: res.data.success,
            })
            .then((res) => {
              console.log("match filter finished");
              const { userIds, matchedFilters } = res.data;
              if (userIds.length >= 1) {
                axios
                  .post("/api/notification/new", {
                    kind: "newCarsListed",
                    data: {
                      userIds,
                      matchedFilters,
                    },
                    valid: "VaLid223",
                  })
                  .then(() => {
                    console.log("notification is set");
                    socket.emit(
                      "newVehiclePosted",
                      {
                        userIds,
                        vehicleType: "Car",
                      },
                      (confirmation) => {
                        if (confirmation) {
                          setSaving(false);
                          props.history.push("/profile/listings/car");
                        }
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    throw err;
                  });
              } else {
                setSaving(false);
                props.history.push("/profile/listings/car");
              }
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
        })
        .catch((err) => {
          setSaving(false);

          if (err.response.status === 400) {
            setFormAlertMessage(err.response.data.msg);
            setFormAlertVisible(true);
            return formAlertRef.current.scrollIntoView({
              behavior: "smooth",
            });
          } else if (err.response.status === 412) {
            checkErrorAndSlideToThem(err.response.data.possibleErrors);
          } else {
            setFormAlertMessage(err.response.data.msg);
            setFormAlertVisible(true);
            return formAlertRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }
        });
    }
  };

  // Handle finish editing
  const handleFinishEditing = () => {
    const possibleErrors = formulateErrors();

    if (hasErrors(possibleErrors)) {
      checkErrorAndSlideToThem(possibleErrors);
    } else {
      setSaving(true);

      let editNumber;
      let databaseID;
      let error = false;

      // Validation
      try {
        const parsedQueryStrings = queryString.parse(props.location.search);
        editNumber = parsedQueryStrings.continueEditing;
        databaseID = parsedQueryStrings.id;
        error = false;
      } catch (err) {
        error = true;
        setFormAlertMessage("Please enter the form correctly!");
        setFormAlertVisible(true);
        setSaving(false);

        return formAlertRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }

      if (!error) {
        const carDetails = createCarDetail();
        axios({
          method: "post",
          url: "/api/car/update",
          data: {
            carDetails,
            valid: "VaLiD123",
            editNumber,
            databaseID,
          },
        })
          .then((res) => {
            // For checking purpose only
            // axios
            //   .post("/api/savedSearch/matchFiltersWithNewCar", {
            //     carDetails,
            //     valid: res.data.success,
            //   })
            //   .then((res) => {
            //     console.log("match filter finished");
            //     const { userIds, matchedFilters } = res.data;
            //     if (userIds.length >= 1) {
            //       axios
            //         .post("/api/notification/new", {
            //           kind: "newCarsListed",
            //           data: {
            //             userIds,
            //             matchedFilters,
            //           },
            //           valid: "VaLid223",
            //         })
            //         .then(() => {
            //           console.log("notification is set");
            //           socket.emit(
            //             "newVehiclePosted",
            //             {
            //               userIds,
            //               vehicleType: "Car",
            //             },
            //             (confirmation) => {
            //               if (confirmation) {
            //                 setSaving(false);
            //                 props.history.push("/profile/listings/car");
            //               }
            //             }
            //           );
            //         })
            //         .catch((err) => {
            //           console.log(err);
            //           throw err;
            //         });
            //     } else {
            //       setSaving(false);
            //       props.history.push("/profile/listings/car");
            //     }
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //     throw err;
            //   });
            setSaving(false);
            props.history.push("/profile/listings/car");
          })
          .catch((err) => {
            setSaving(false);

            if (typeof err.response !== "undefined") {
              if (err.response.status === 400) {
                setFormAlertMessage(err.response.data.msg);
                setFormAlertVisible(true);
                setSaving(false);

                return formAlertRef.current.scrollIntoView({
                  behavior: "smooth",
                });
              } else if (err.response.status === 412) {
                checkErrorAndSlideToThem(err.response.data.possibleErrors);
              } else if (err.response.status === 500) {
                setFormAlertMessage("Server Error");
                setFormAlertVisible(true);
                setSaving(false);

                return formAlertRef.current.scrollIntoView({
                  behavior: "smooth",
                });
              }
            } else {
              console.log(err);
            }
          });
      }
    }
  };

  return (
    <Fragment>
      {!isAuthenticated || checkingAuth ? null : (
        <div>
          <AuthNavbar history={props.history} location={props.location} />

          <Container className="my-5">
            <div ref={formAlertRef}>
              <Alert
                className="mt-3"
                color="info"
                isOpen={formAlertVisible}
                toggle={onFormAlertDismiss}
              >
                {formAlertMessage}
              </Alert>
            </div>

            {/* Car Detail */}
            <div
              ref={carDetailRef}
              className="mt-3 sell-form-component"
              id="sellFormDetails"
            >
              <Container>
                <h5 className="heading">1. Car Details</h5>
                <hr />

                <FormGroup id="carDetails" className="pt-2">
                  <Row>
                    <Col md="6" lg="4">
                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Year</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setCarYearInput(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noYearError: true,
                                });
                              }
                            }}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noYearError
                            }
                            defaultValue={carYearInput}
                          />
                          <FormFeedback>Please give a valid year.</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Make</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            style={{ maxHeight: "40px" }}
                            onChange={(e) => {
                              setCarMakeSelected(e.target.value);
                              setCarModelSelected("");

                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noMakeError: true,
                                });
                              }
                            }}
                            value={carMakeSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noMakeError
                            }
                          >
                            {carMakeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid make.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Model</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            disabled={
                              carMakeSelected === "" ||
                              carMakeSelected === "Select"
                            }
                            onChange={(e) => {
                              setCarModelSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noModelError: true,
                                });
                              }
                            }}
                            value={carModelSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noModelError
                            }
                          >
                            {carModelOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid model.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>
                          Trim{" "}
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                            href="trim"
                            style={{ cursor: "pointer" }}
                            id="trimPopover"
                          >
                            <img src={infoSVG} alt="" width="17" />
                          </a>
                          <br />{" "}
                          <small className="text-muted">(Optional)</small>{" "}
                          <UncontrolledPopover
                            trigger="legacy"
                            placement="bottom"
                            target="trimPopover"
                          >
                            <PopoverHeader>What is a trim?</PopoverHeader>
                            <PopoverBody>
                              A trim level (also sometimes referred to as a trim
                              package) is a version of a vehicle model that
                              comes equipped with a set combination of features.
                              Higher trim levels come with more/better features
                              at a higher price, while an entry-level trim comes
                              with just the basics at a lower overall cost. To
                              differentiate trim levels, each package is given a
                              moniker that follows the model name (example: the
                              Toyota Camry XLE).
                              <br /> <br />
                              Where to find the trim level? <br /> • Decal or
                              emblem on the back of your vehicle <br /> • The
                              owner's manual <br /> • Your vehicle's sales
                              invoice
                            </PopoverBody>
                          </UncontrolledPopover>
                        </Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="text"
                            onChange={(e) => {
                              setCarTrimInput(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noTrimError: true,
                                });
                              }
                            }}
                            value={carTrimInput}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noTrimError
                            }
                          />
                          <FormFeedback>Please give a valid trim.</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Body Type</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            name="carBodyTypeSelected"
                            onChange={(e) => {
                              setCarBodyTypeSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noBodyTypeError: true,
                                });
                              }
                            }}
                            value={carBodyTypeSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noBodyTypeError
                            }
                          >
                            {carBodyTypeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid body type.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Condition</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarConditionSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noConditionError: true,
                                });
                              }
                            }}
                            value={carConditionSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noConditionError
                            }
                          >
                            {carConditionOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid condition.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Kilometers</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setCarKiloMetersInput(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noKilometersError: true,
                                });
                              }
                            }}
                            value={carKiloMetersInput}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noKilometersError
                            }
                          />
                          <FormFeedback>
                            Please give a valid kilometer.
                          </FormFeedback>
                        </Col>
                      </FormGroup>
                    </Col>

                    <Col md="6" lg="4">
                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Transmission</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarTransmissionSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noTransmissionError: true,
                                });
                              }
                            }}
                            value={carTransmissionSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noTransmissionError
                            }
                          >
                            {carTransmissionOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid transmission.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Drivetrain</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarDrivetrainSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noDriveTrainError: true,
                                });
                              }
                            }}
                            value={carDrivetrainSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noDriveTrainError
                            }
                          >
                            {carDrivetrainOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid drivetrain.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Color</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarColorSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noColorError: true,
                                });
                              }
                            }}
                            value={carColorSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noColorError
                            }
                          >
                            {carColorOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid color.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Fuel Type</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarFuelTypeSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noFuelTypeError: true,
                                });
                              }
                            }}
                            value={carFuelTypeSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noFuelTypeError
                            }
                          >
                            {carFuelTypeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid fuel type.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Doors</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarDoorsSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noDoorsError: true,
                                });
                              }
                            }}
                            value={carDoorsSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noDoorsError
                            }
                          >
                            {carDoorsOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid door.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={carFeaturesColLeftSize}>Seats</Label>
                        <Col sm={12 - carFeaturesColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setCarSeatsSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noSeatsError: true,
                                });
                              }
                            }}
                            value={carSeatsSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noSeatsError
                            }
                          >
                            {carSeatsOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid seat.
                          </FormFeedback>
                        </Col>
                      </FormGroup>
                    </Col>

                    <Col md="12" lg="4">
                      <FormGroup check>
                        <Row>
                          <Col md="6" lg="12" sm="12">
                            <Label check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasSunRoof(e.target.checked);
                                }}
                                checked={carHasSunRoof}
                              />{" "}
                              Sunroof
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasAlloyWheels(e.target.checked);
                                }}
                                checked={carHasAlloyWheels}
                              />{" "}
                              Alloy wheels{" "}
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasNavigationSystem(e.target.checked);
                                }}
                                checked={carHasNavigationSystem}
                              />{" "}
                              Navigation system{" "}
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasBluetooth(e.target.checked);
                                }}
                                checked={carHasBluetooth}
                              />{" "}
                              Bluetooth{" "}
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasPushStart(e.target.checked);
                                }}
                                checked={carHasPushStart}
                              />{" "}
                              Push start button{" "}
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasParkingAssistant(e.target.checked);
                                }}
                                checked={carHasParkingAssistant}
                              />{" "}
                              Parking assistant{" "}
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasCruiseControl(e.target.checked);
                                }}
                                checked={carHasCruiseControl}
                              />{" "}
                              Cruise control
                            </Label>
                            <br />
                          </Col>
                          <Col md="6" lg="12" sm="12">
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasAirConditioning(e.target.checked);
                                }}
                                checked={carHasAirConditioning}
                              />{" "}
                              Air conditioning
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasPowerSteering(e.target.checked);
                                }}
                                checked={carHasPowerSteering}
                              />{" "}
                              Power steering
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasPowerWindow(e.target.checked);
                                }}
                                checked={carHasPowerWindow}
                              />{" "}
                              Power window
                            </Label>
                            <br />
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasKeylessEntry(e.target.checked);
                                }}
                                checked={carHasKeylessEntry}
                              />{" "}
                              Key-less remote entry
                            </Label>
                            <br />{" "}
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasAbs(e.target.checked);
                                }}
                                checked={carHasAbs}
                              />{" "}
                              Anti-lock braking system (ABS)
                            </Label>
                            <br />{" "}
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasCarplay(e.target.checked);
                                }}
                                checked={carHasCarplay}
                              />{" "}
                              Apple Carplay
                            </Label>
                            <br />{" "}
                            <Label className={carFeaturesPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setCarHasAndroidAuto(e.target.checked);
                                  if (!isEmpty(possibleErrors)) {
                                    setPossibleErrors({
                                      ...possibleErrors,
                                      noCheckBoxError: true,
                                    });
                                  }
                                }}
                                invalid={
                                  !isEmpty(possibleErrors) &&
                                  !possibleErrors.noCheckBoxError
                                }
                                checked={carHasAndroidAuto}
                              />{" "}
                              Android Auto
                              <FormFeedback>
                                Please select valid options.
                              </FormFeedback>
                            </Label>
                            <br />{" "}
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </FormGroup>
                <hr />
                <FormGroup className="pt-2">
                  <small className="text-muted">
                    Please submit ad title with at most 150 characters and
                    description with at most 2000 characters
                  </small>
                  <FormGroup className="mt-2" row>
                    <Label className="heading" md="2">
                      Ad Title
                    </Label>
                    <Col md={8}>
                      <InputGroup>
                        <Input
                          type="text"
                          onChange={(e) => {
                            setAdTitle(e.target.value);
                            if (!isEmpty(possibleErrors)) {
                              setPossibleErrors({
                                ...possibleErrors,
                                noAdTitleError: true,
                              });
                            }
                          }}
                          invalid={
                            !isEmpty(possibleErrors) &&
                            !possibleErrors.noAdTitleError
                          }
                          value={adTitle}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>{adTitle.length}</InputGroupText>
                        </InputGroupAddon>
                        <FormFeedback>
                          Please give a valid ad title with no more than 150
                          characters.
                        </FormFeedback>
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label md={2} className="heading">
                      Description
                    </Label>

                    <Col md={10}>
                      <Input
                        type="textarea"
                        rows="4"
                        onChange={(e) => {
                          setAdDescription(e.target.value);
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noAdDescriptionError: true,
                            });
                          }
                        }}
                        invalid={
                          !isEmpty(possibleErrors) &&
                          !possibleErrors.noAdDescriptionError
                        }
                        value={adDescription}
                      />
                      <FormFeedback>
                        Please give a valid ad description with no more than
                        2000 characters
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <div className="d-flex justify-content-end">
                    {adDescription.length}/2000
                  </div>
                </FormGroup>
              </Container>
            </div>

            {/* Media */}
            <div
              ref={mediaRef}
              className="mt-5 sell-form-component"
              id="sellFormMedia"
            >
              <Container>
                <h5 className="heading">2. Media</h5>
                <hr />
                <span className="heading">
                  Add photos to attract interest to your ad
                </span>{" "}
                <br />
                <small className="text-muted pb-4">
                  Include photos with different angles and details. You can
                  upload maximum of 10 pictures that are at least 300px wide or
                  tall.
                  <br /> Max file size is 2 mb. Min pictures is 2. Allowed
                  Extensions: .png | .jpg | .jpeg
                </small>{" "}
                <span className="heading pt-3" hidden={!editedForm}>
                  <br />
                  <br />
                  Previously uploaded pictures
                </span>
                <div className="mt-2" hidden={!editedForm}>
                  <Carousel
                    arrowLeft={
                      <img
                        className="slider-arrow"
                        src={backButtonSVG}
                        width="20"
                        alt=""
                      />
                    }
                    arrowRight={
                      <img
                        className="slider-arrow"
                        src={nextButtonSVG}
                        width="20"
                        alt=""
                      />
                    }
                    slidesPerPage={
                      windowSize === "large"
                        ? 5
                        : windowSize === "medium"
                        ? 4
                        : windowSize === "small"
                        ? 3
                        : windowSize === "extraSmall"
                        ? 2
                        : null
                    }
                    arrows
                    dots
                    addArrowClickHandler
                  >
                    {lastUploadedPicturesCards.map((lUPC) => lUPC.card)}
                  </Carousel>
                </div>
                <Alert
                  className="mt-3"
                  color="danger"
                  isOpen={pictureUploadAlertVisible}
                  toggle={onPictureUploadAlertDismiss}
                >
                  {pictureUploadAlertMessage}
                </Alert>{" "}
                {pictureUploadAlertVisible ? null : (
                  <div>
                    <br />
                  </div>
                )}
                <ImageUploader
                  setPictureUploadAlertVisible={setPictureUploadAlertVisible}
                  setPictureUploadAlertMessage={setPictureUploadAlertMessage}
                  setUploading={setUploading}
                  uniqueId={uniqueId}
                  setPicturesToBeUploadedMeta={setPicturesToBeUploadedMeta}
                  toBeSubmitted={toBeSubmitted}
                  setToBeSubmitted={setToBeSubmitted}
                  lastUploadedImages={lastUploadedImages}
                  editedForm={editedForm}
                />
                {uploading ? (
                  <div className="d-flex justify-content-center mt-4">
                    <PropagateLoader
                      size={15}
                      color={"#1881d8"}
                      loading={true}
                    />
                    <br />
                  </div>
                ) : null}
                <FormGroup row className="mt-4">
                  <Label className="heading pt-2" md={2}>
                    Youtube Video{" "}
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      href="notAHref"
                      style={{ cursor: "pointer" }}
                      id="youtubePopover"
                    >
                      <img src={infoSVG} alt="" width="17" />
                    </a>
                    <br /> <small className="text-muted">(optional)</small>{" "}
                    <UncontrolledPopover
                      trigger="legacy"
                      placement="bottom"
                      target="youtubePopover"
                    >
                      <PopoverHeader>Youtube video</PopoverHeader>
                      <PopoverBody>
                        Add a youtube video to your ad. This is optional field.
                        For eg: http://www.youtube.com/watch?v=(your video id)
                      </PopoverBody>
                    </UncontrolledPopover>
                  </Label>
                  <Col md={8}>
                    <Input
                      type="url"
                      onChange={(e) => {
                        setYoutubeLinkInput(e.target.value);
                        if (!isEmpty(possibleErrors)) {
                          setPossibleErrors({
                            ...possibleErrors,
                            noYoutubeLinkError: true,
                          });
                        }
                      }}
                      value={youtubeLinkInput}
                      invalid={
                        !isEmpty(possibleErrors) &&
                        !possibleErrors.noYoutubeLinkError
                      }
                    />
                    <FormFeedback>
                      Please give a valid youtube link
                    </FormFeedback>
                  </Col>
                </FormGroup>
              </Container>
            </div>

            {/* Location */}
            <div
              ref={locationRef}
              className="mt-5 sell-form-component"
              id="sellFormLocation"
            >
              <Container>
                <h5 className="heading">3. Location</h5>
                <hr />
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Province</Label>
                      <Input
                        type="select"
                        onChange={(e) => {
                          setProvinceSelected(e.target.value);
                          setDistrictSelected("");
                          setStreetAddressInput("");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noProvinceError: true,
                            });
                          }
                        }}
                        invalid={
                          !isEmpty(possibleErrors) &&
                          !possibleErrors.noProvinceError
                        }
                        value={provinceSelected}
                      >
                        {provinceOptions}
                      </Input>
                      <FormFeedback>
                        Please choose a valid province.
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>District</Label>
                      <Input
                        type="select"
                        value={districtSelected}
                        onChange={(e) => {
                          setDistrictSelected(e.target.value);
                          setStreetAddressInput("");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noDistrictError: true,
                            });
                          }
                        }}
                        invalid={
                          !isEmpty(possibleErrors) &&
                          !possibleErrors.noDistrictError
                        }
                        disabled={
                          provinceSelected === "" ||
                          provinceSelected === "Select"
                        }
                      >
                        {districtOptions}
                      </Input>
                      <FormFeedback>
                        Please choose a valid district.
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Street Address</Label>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setStreetAddressInput(e.target.value);
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noStreetAddressError: true,
                            });
                          }
                        }}
                        invalid={
                          !isEmpty(possibleErrors) &&
                          !possibleErrors.noStreetAddressError
                        }
                        disabled={
                          districtSelected === "" ||
                          districtSelected === "Select"
                        }
                        value={streetAddressInput}
                      />
                      <FormFeedback>
                        Please choose a valid street address.
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </div>

            {/* Price */}
            <div
              ref={priceRef}
              className="mt-5 sell-form-component"
              id="sellFormPrice"
            >
              <Container>
                <h5 className="heading">4. Price</h5>
                <hr />
                <Row>
                  <Col md="1">
                    <Label style={{ paddingTop: "6px" }}>Price:</Label>
                  </Col>
                  <Col md="3">
                    <FormGroup className="float-left" check>
                      <Input
                        type="radio"
                        name="priceRadio"
                        defaultChecked={priceType === "notFree"}
                        onChange={(e) => {
                          setPriceType("notFree");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noPriceInputError: true,
                              noPriceTypeError: true,
                            });
                          }
                        }}
                        style={{ marginTop: "13px" }}
                      />{" "}
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Rs</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          disabled={priceType !== "notFree"}
                          onChange={(e) => {
                            setCarPriceInput(e.target.value);
                            if (!isEmpty(possibleErrors)) {
                              setPossibleErrors({
                                ...possibleErrors,
                                noPriceInputError: true,
                                noPriceTypeError: true,
                              });
                            }
                          }}
                          invalid={
                            !isEmpty(possibleErrors) &&
                            (!possibleErrors.noPriceInputError ||
                              !possibleErrors.noPriceTypeError)
                          }
                          value={carPriceInput}
                        />
                        <FormFeedback>Please give a valid price.</FormFeedback>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col md="1"></Col>
                  <Col md="2">
                    <FormGroup className="float-left" check>
                      <Input
                        type="radio"
                        name="priceRadio"
                        defaultChecked={priceType === "free"}
                        onChange={(e) => {
                          setPriceType("free");
                          setCarPriceInput("");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noPriceInputError: true,
                              noPriceTypeError: true,
                            });
                          }
                        }}
                        className="mt-2"
                      />{" "}
                      <Label>Free</Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="1"></Col>
                  <Col md="2">
                    <FormGroup className="float-left" check>
                      <Input
                        type="radio"
                        name="priceRadio"
                        defaultChecked={priceType === "contact"}
                        onChange={(e) => {
                          setPriceType("contact");
                          setCarPriceInput("");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noPriceInputError: true,
                              noPriceTypeError: true,
                            });
                          }
                        }}
                        className="mt-2"
                      />{" "}
                      <Label>Please contact</Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </div>

            {/* Contact */}
            <div
              ref={contactRef}
              className="mt-5 sell-form-component"
              id="sellFormContact"
            >
              <Container>
                <h5 className="heading">5. Contact information</h5>
                <hr />
                <Row>
                  <Col md="2">
                    <Label>Phone Number: </Label>
                    <small className="text-muted">(optional)</small>
                  </Col>
                  <Col md="4">
                    <Input
                      type="number"
                      onChange={(e) => {
                        setPhoneNumberInput(e.target.value);
                        if (!isEmpty(possibleErrors)) {
                          setPossibleErrors({
                            ...possibleErrors,
                            noPhoneNumberError: true,
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" || e.key === "Delete") {
                          setPhoneNumberInput("");
                          if (!isEmpty(possibleErrors)) {
                            setPossibleErrors({
                              ...possibleErrors,
                              noPhoneNumberError: true,
                            });
                          }
                        }
                      }}
                      value={phoneNumberInput}
                      invalid={
                        !isEmpty(possibleErrors) &&
                        !possibleErrors.noPhoneNumberError
                      }
                    />
                    <FormFeedback>
                      Please give a valid phone number.
                    </FormFeedback>
                    <small className="text-muted">
                      Your phone number will show up in your Ad.
                    </small>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md="2">
                    <Label>Email: </Label>
                  </Col>
                  <Col md="4">
                    <span className="text-muted">{email}</span> <br />
                    <small className="text-muted">
                      Your email address will not be shared with others.
                    </small>
                  </Col>
                </Row>
              </Container>
            </div>

            {/* Sumbit, Preview */}
            <div className="mt-5">
              <Row>
                <Col sm="11">
                  <Button
                    color="primary"
                    type="button"
                    onClick={
                      formNumber === 2
                        ? (e) => {
                            e.preventDefault();
                            handleFinishEditing();
                          }
                        : (e) => {
                            e.preventDefault();
                            handlePostAdClick();
                          }
                    }
                  >
                    {formNumber === 2 ? "Finish Editing" : "Post Your Ad"}
                  </Button>

                  <Button
                    color="info"
                    outline
                    className="ml-5"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviewClick();
                    }}
                  >
                    Preview
                  </Button>
                </Col>
                <Col sm="1" className="mt-3 mt-sm-0">
                  {saving ? <Spinner type="grow" color="primary" /> : null}
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default SellCarComponent;
