import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import AuthNavbar from "../AuthNavbar";
import {
  Container,
  Alert,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Button,
  Spinner,
  Card,
  CardImg,
  CardBody,
} from "reactstrap";
import { isEmpty, setAuthStatus } from "../../methods";
import { getMotorcycleMakeAndModels } from "../../Lists/motorcycleList";
import {
  getMotorcycleBodyType,
  getMotorcycleColors,
  getMotorcycleConditions,
  getMotorcycleFuelTypes,
} from "../../Lists/motorcycleFilters";
import Carousel from "@brainhubeu/react-carousel";
import ImageUploader from "../SellCarComponents/ImageUploader";
import PropagateLoader from "react-spinners/PropagateLoader";
import { uuid } from "uuidv4";
import { getProvincesWithDistricts } from "../../Lists/provinceWithDistricts";
import { AuthContext } from "../../Contexts/AuthContext";
import queryString from "query-string";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { SocketContext } from "../../Contexts/SocketContext";
import infoSVG from "../../icons/signs.svg";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";
import { getEndPoint } from "../../config";

// Backup if user refreshes the page
let socket = null;

const SellMotorcycleForm = (props) => {
  const { auth, dispatch } = useContext(AuthContext);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // If user is not logged in redirect to home
  useEffect(() => {
    setAuthStatus(auth, dispatch, props, setIsAuthenticated, setCheckingAuth);
  }, [auth]);

  const { socketDetail } = useContext(SocketContext);

  useEffect(() => {
    socket = socketDetail.socket;

    // If user refreshes the page socket will be
    if (socket === null) {
      socket = socketIOClient(getEndPoint());
    }

    // When component unmount socket will be off Important
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [auth]);

  // Motorcycle details lists
  const [bodyTypes, setBodyTypes] = useState([]);
  useEffect(() => {
    getMotorcycleBodyType(setBodyTypes);
  }, []);

  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    getMotorcycleConditions(setConditions);
  }, []);

  const [fuelTypes, setFuelTypes] = useState([]);
  useEffect(() => {
    getMotorcycleFuelTypes(setFuelTypes);
  }, []);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    getMotorcycleColors(setColors);
  }, []);

  // Reference points for each area of form
  const formAlertRef = useRef(null);
  const motorcycleDetailRef = useRef(null);
  const mediaRef = useRef(null);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const contactRef = useRef(null);

  //   Form
  const [formAlertVisible, setFormAlertVisible] = useState(false);
  const [formAlertMessage, setFormAlertMessage] = useState("");
  const [possibleErrors, setPossibleErrors] = useState({});
  const [featuresColLeftSize] = useState(4);
  const [editedForm, setEditedForm] = useState(false);
  const [formNumber, setFormNumber] = useState(null);
  const [saving, setSaving] = useState(false);
  const [featuresPaddingTop] = useState("pt-2");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    getMotorcycleMakeAndModels(setMotorcycles);
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

  //   Motorcycle Detail
  const [year, setYear] = useState("");
  const [makeOptions, setMakeOptions] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [bodyTypeSelected, setBodyTypeSelected] = useState("");
  const [bodyTypeOptions, setBodyTypeOptions] = useState([]);
  const [conditionSelected, setConditionSelected] = useState("");
  const [conditionOptions, setConditionOptions] = useState([]);
  const [kilometerInput, setKilometerInput] = useState("");
  const [ccInput, setCCInput] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [colorSelected, setColorSelected] = useState("");
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const [fuelTypeSelected, setFuelTypeSelected] = useState("");

  // Motocycle Features
  const [hasElectricStart, setHasElectricStart] = useState(false);
  const [hasAlloyWheels, setHasAlloyWheels] = useState(false);
  const [hasTubelessTyres, setHasTubelesssTyres] = useState(false);
  const [hasDigitalDisplayPanel, setHasDigitalDisplayPanel] = useState(false);
  const [hasProjectedHeadLight, setHasProjectedHeadLight] = useState(false);
  const [hasLedTailLight, setHasLedTailLight] = useState(false);
  const [hasFrontDiscBrake, setHasFrontDiscBrake] = useState(false);
  const [hasRearDiscBrake, setHasRearDiscBrake] = useState(false);
  const [hasAbs, setHasAbs] = useState(false);
  const [hasMonoSuspension, setHasMonoSuspension] = useState(false);
  const [hasSplitSeat, setHasSplitSeat] = useState(false);
  const [hasTripMeter, setHasTripMeter] = useState(false);

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
  const [priceInput, setPriceInput] = useState("");

  // Contact
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

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

  // set the phone number and email to the one set by the user
  useEffect(() => {
    setEmail(auth.user.email);
    setPhoneNumberInput(
      auth.user.phoneNumber === null ? "" : auth.user.phoneNumber
    );
    setUserId(auth.user.id);
  }, [auth]);

  // Generate motorcylce make options
  useEffect(() => {
    if (motorcycles.length) {
      // Make the list of options of motorcyle makes.
      let makeOptions = motorcycles.map((motorcycle, key) => (
        <option key={key} selected={motorcycle.make === make ? true : false}>
          {motorcycle.make}
        </option>
      ));

      // Add select option to the beginninng of the options
      makeOptions.splice(
        0,
        0,
        <option key="SelectMake" value="">
          Select
        </option>
      );

      setMakeOptions(makeOptions);
    }
  }, [motorcycles]);

  useEffect(() => {
    if (motorcycles.length) {
      let modelOptions = [];

      // Create the list of motorcyle models depending on the motorcyle make selected
      if (make !== "" && make !== "Select" && make !== "Other") {
        let makes = motorcycles.find((motorcyle) => motorcyle.make === make);
        modelOptions = makes.models.map((model, key) => {
          return <option key={key}>{model.model}</option>;
        });

        modelOptions.splice(
          0,
          0,
          <option key="SelectModel" value="">
            Select
          </option>
        );

        modelOptions.push(<option key="OtherModel">Other</option>);
      } else if (make === "" || make === "Select") {
        modelOptions.push(
          <option key="SelectModel" value="">
            Select
          </option>
        );
      } else if (make === "Other") {
        modelOptions.push(<option key="OtherModel">Other</option>);
      }

      setModelOptions(modelOptions);
    }
  }, [motorcycles, make]);

  // Generate body type options
  useEffect(() => {
    const bodyTypeOptions = bodyTypes.map((bodyType, key) => (
      <option key={key} selected={bodyType === bodyTypeSelected ? true : false}>
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

    setBodyTypeOptions(bodyTypeOptions);
  }, [bodyTypes]);

  // Generate condtion options
  useEffect(() => {
    const conditionOptions = conditions.map((condition, key) => (
      <option
        key={key}
        selected={condition === conditionSelected ? true : false}
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

    setConditionOptions(conditionOptions);
  }, [conditions]);

  // Generate color options
  useEffect(() => {
    const colorOptions = colors.map((color, key) => (
      <option key={key} selected={color === colorSelected ? true : false}>
        {color}
      </option>
    ));

    // Add select option to the beginninng of the options
    colorOptions.splice(
      0,
      0,
      <option key="SelectColor" value="">
        Select
      </option>
    );

    setColorOptions(colorOptions);
  }, [colors]);

  // Generate fuel type options
  useEffect(() => {
    const fuelTypeOptions = fuelTypes.map((fuelType, key) => (
      <option key={key} selected={fuelType === fuelTypeSelected ? true : false}>
        {fuelType}
      </option>
    ));

    // Add select option to the beginninng of the options
    fuelTypeOptions.splice(
      0,
      0,
      <option key="SelectFuelType" value="">
        Select
      </option>
    );

    setFuelTypeOptions(fuelTypeOptions);
  }, [fuelTypes]);

  // Generate province options
  useEffect(() => {
    if (provinceWithDistricts.length) {
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
    }
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

        // Getting the details from the session storage
        const lastFormDetail = JSON.parse(
          sessionStorage.getItem("previewMotorcycleDetails")
        );

        if (lastFormDetail === null) {
          return props.location.push("/");
        }
        console.log(lastFormDetail);

        setMake(lastFormDetail.make);
        setModel(lastFormDetail.model);
        setYear(lastFormDetail.year.toString());
        setCCInput(lastFormDetail.ccInput.toString());
        setBodyTypeSelected(lastFormDetail.bodyTypeSelected);
        setConditionSelected(lastFormDetail.conditionSelected);
        setKilometerInput(lastFormDetail.kilometerInput.toString());
        setColorSelected(lastFormDetail.colorSelected);
        setFuelTypeSelected(lastFormDetail.fuelTypeSelected);

        setHasElectricStart(lastFormDetail.hasElectricStart);
        setHasAlloyWheels(lastFormDetail.hasAlloyWheels);
        setHasTubelesssTyres(lastFormDetail.hasTubelessTyres);
        setHasDigitalDisplayPanel(lastFormDetail.hasDigitalDisplayPanel);
        setHasProjectedHeadLight(lastFormDetail.hasProjectedHeadLight);
        setHasLedTailLight(lastFormDetail.hasLedTailLight);
        setHasFrontDiscBrake(lastFormDetail.hasFrontDiscBrake);
        setHasRearDiscBrake(lastFormDetail.hasRearDiscBrake);
        setHasAbs(lastFormDetail.hasAbs);
        setHasMonoSuspension(lastFormDetail.hasMonoSuspension);
        setHasSplitSeat(lastFormDetail.hasSplitSeat);
        setHasTripMeter(lastFormDetail.hasTripMeter);

        setAdTitle(lastFormDetail.adTitle);
        setAdDescription(lastFormDetail.adDescription);

        setPicturesToBeUploadedMeta(lastFormDetail.picturesToBeUploadedMeta);
        setYoutubeLinkInput(lastFormDetail.youtubeLinkInput);
        setLastUploadedImages(lastFormDetail.picturesToBeUploadedMeta);
        setMainPicture(lastFormDetail.mainPicture);

        setProvinceSelected(lastFormDetail.provinceSelected);
        setDistrictSelected(lastFormDetail.districtSelected);
        setStreetAddressInput(lastFormDetail.streetAddressInput);

        setPriceType(lastFormDetail.priceType);
        setPriceInput(lastFormDetail.priceInput.toString());

        setPhoneNumberInput(lastFormDetail.phoneNumberInput);

        setUniqueId(lastFormDetail.uniqueId);
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

  const onFormAlertDismiss = () => {
    setFormAlertVisible(false);
    setFormAlertMessage("");
  };

  // Picture upload alert toggle
  const onPictureUploadAlertDismiss = () => {
    setPictureUploadAlertVisible(false);
    setPictureUploadAlertMessage("");
  };

  //  this methods checks the errors and returns the errors in the form
  const formulateErrors = () => {
    // All the possible errors
    let possibleErrors = {
      noYearError: true,
      noMakeError: true,
      noModelError: true,
      noBodyTypeError: true,
      noConditionError: true,
      noKilometersError: true,
      noColorError: true,
      noFuelTypeError: true,
      noCCError: true,
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
    we do not want year to be empty string and also not greater than the current year
    when year input is empty string it is equal to 1 and same case when it is greater than current year
    0 === 0 is true which means noYearError is true
    */
    if (year === "" || parseInt(year) > thisYear || year.length !== 4) {
      possibleErrors.noYearError = false;
    } else {
      possibleErrors.noYearError = true;
    }

    // Check whether the make selected is within the list.
    const makeSelectedIsWithinTheMakeList = () => {
      return motorcycles.some((motorcycle) => motorcycle.make === make);
    };

    // Car make
    possibleErrors.noMakeError = makeSelectedIsWithinTheMakeList();

    // Check whether the model selected is within the  list.
    const modelSelectedIsWithinTheModelList = () => {
      if (make.toLowerCase() === "other") {
        return true;
      }

      let motorcycleMake = motorcycles.find(
        (motorcycle) => motorcycle.make === make
      );

      if (model.toLowerCase() === "other") {
        return true;
      }

      return motorcycleMake.models.some(
        (motorcycleModel) => motorcycleModel.model === model
      );
    };

    // If  make is not selected, there will  make error.
    // There should be no  make error should before checking model error.
    if (possibleErrors.noMakeError) {
      possibleErrors.noModelError = modelSelectedIsWithinTheModelList();
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

    // Check if the given item in within the given list
    const checkIfTheItemIsWithinTheGivenList = (list, item) => {
      return list.some(
        (listItem) => listItem.toLowerCase() === item.toLowerCase()
      );
    };

    // Check body is empty
    possibleErrors.noBodyTypeError = checkIfTheItemIsWithinTheGivenList(
      bodyTypes,
      bodyTypeSelected
    );

    // Check condition is empty
    possibleErrors.noConditionError = checkIfTheItemIsWithinTheGivenList(
      conditions,
      conditionSelected
    );

    // Check kilometer is empty
    // params: kilometer input and maximum length
    possibleErrors.noKilometersError = checkInputError(kilometerInput, 20);

    // Check CC is empty
    // params: CC input and maximum length
    possibleErrors.noCCError = checkInputError(ccInput, 4);

    // Color
    possibleErrors.noColorError = checkIfTheItemIsWithinTheGivenList(
      colors,
      colorSelected
    );

    // // Fuel Type
    possibleErrors.noFuelTypeError = checkIfTheItemIsWithinTheGivenList(
      fuelTypes,
      fuelTypeSelected
    );

    // // List of all the checkbox button values
    const booleanCheckList = [
      hasElectricStart,
      hasAlloyWheels,
      hasTubelessTyres,
      hasDigitalDisplayPanel,
      hasProjectedHeadLight,
      hasLedTailLight,
      hasFrontDiscBrake,
      hasRearDiscBrake,
      hasAbs,
      hasMonoSuspension,
      hasSplitSeat,
      hasTripMeter,
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
      priceInput !== ""
    ) {
      possibleErrors.noPriceInputError = checkInputError(priceInput, 10);
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
      !possibleErrors.noBodyTypeError ||
      !possibleErrors.noConditionError ||
      !possibleErrors.noKilometersError ||
      !possibleErrors.noColorError ||
      !possibleErrors.noFuelTypeError ||
      !possibleErrors.noCheckBoxError ||
      !possibleErrors.noAdTitleError ||
      !possibleErrors.noAdDescriptionError ||
      !possibleErrors.noCCError
    ) {
      return motorcycleDetailRef.current.scrollIntoView({
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

  // Create motorcycle detail
  const createDetail = () => {
    const details = {
      make,
      model,
      year: parseFloat(year),
      bodyTypeSelected,
      conditionSelected,
      kilometerInput: parseFloat(kilometerInput),
      colorSelected,
      fuelTypeSelected,
      ccInput: parseFloat(ccInput),
      hasElectricStart,
      hasAlloyWheels,
      hasTubelessTyres,
      hasDigitalDisplayPanel,
      hasProjectedHeadLight,
      hasLedTailLight,
      hasFrontDiscBrake,
      hasRearDiscBrake,
      hasAbs,
      hasMonoSuspension,
      hasSplitSeat,
      hasTripMeter,
      adTitle,
      adDescription,
      youtubeLinkInput,
      provinceSelected,
      districtSelected,
      streetAddressInput,
      priceType,
      priceInput: parseFloat(priceInput),
      phoneNumberInput,
      email,
      userId,
      picturesToBeUploadedMeta,
      date: Date.now(),
      uniqueId,
      mainPicture,
    };
    return details;
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
          const details = createDetail();
          console.log(details);
          // Set the motorcycle details to the session storage and the redirect to preview page
          sessionStorage.setItem(
            "previewMotorcycleDetails",
            JSON.stringify(details)
          );

          if (props.location.search) {
            const parsedQueryStrings = queryString.parse(props.location.search);
            if (editedForm && formNumber === 2) {
              props.history.push(
                "/preview/motorcycle?posted=1&&lid=" + parsedQueryStrings.id
              );
            } else {
              props.history.push("/preview/motorcycle");
            }
          } else {
            props.history.push("/preview/motorcycle");
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

      const details = createDetail();
      axios({
        method: "post",
        url: "/api/motorcycle",
        data: {
          details,
          valid: "VaLID8973",
        },
      })
        .then((res) => {
          axios
            .post("/api/savedSearch/matchFiltersWithNewMotorcycle", {
              details,
              valid: res.data.success,
            })
            .then((res) => {
              console.log(res.data);
              const { userIds, matchedFilters } = res.data;
              if (userIds.length >= 1) {
                axios
                  .post("/api/notification/new", {
                    kind: "newMotorcyclesListed",
                    data: {
                      userIds,
                      savedSearches: matchedFilters,
                    },
                    valid: "VaLid223",
                  })
                  .then(() => {
                    socket.emit(
                      "newVehiclePosted",
                      {
                        userIds,
                        vehicleType: "Motorcycle",
                      },
                      (confirmation) => {
                        if (confirmation) {
                          setSaving(false);
                          props.history.push("/profile/listings/motorcycle");
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
                props.history.push("/profile/listings/motorcycle");
              }
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
        })
        .catch((err) => {
          setSaving(false);
          if (typeof err.response !== "undefined") {
            if (err.response.status === 400) {
              setFormAlertMessage(err.response.data.msg);
              setFormAlertVisible(true);
              return formAlertRef.current.scrollIntoView({
                behavior: "smooth",
              });
            } else if (err.response.status === 412) {
              console.log(err.response.data.possibleErrors);
              checkErrorAndSlideToThem(err.response.data.possibleErrors);
            } else {
              setFormAlertMessage(err.response.data.msg);
              setFormAlertVisible(true);
              return formAlertRef.current.scrollIntoView({
                behavior: "smooth",
              });
            }
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
        const details = createDetail();
        axios({
          method: "post",
          url: "/api/motorcycle/update",
          data: {
            details,
            valid: "VaLID8973",
            editNumber,
            databaseID,
          },
        })
          .then((res) => {
            // For check purpose only
            // axios
            //   .post("/api/savedSearch/matchFiltersWithNewMotorcycle", {
            //     details,
            //     valid: res.data.success,
            //   })
            //   .then((res) => {
            //     console.log(res.data);
            //     const { userIds, matchedFilters } = res.data;
            //     if (userIds.length >= 1) {
            //       axios
            //         .post("/api/notification/new", {
            //           kind: "newMotorcyclesListed",
            //           data: {
            //             userIds,
            //             savedSearches: matchedFilters,
            //           },
            //           valid: "VaLid223",
            //         })
            //         .then(() => {
            //           socket.emit(
            //             "newVehiclePosted",
            //             {
            //               userIds,
            //               vehicleType: "Motorcycle",
            //             },
            //             (confirmation) => {
            //               if (confirmation) {
            //                 setSaving(false);
            //                 props.history.push("/profile/listings/motorcycle");
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
            //       props.history.push("/profile/listings/motorcycle");
            //     }
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //     throw err;
            //   });
            setSaving(false);
            props.history.push("/profile/listings/motorcycle");
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
          <Container className="mt-5">
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

            {/* Motorcycle Detail */}
            <div
              ref={motorcycleDetailRef}
              className="mt-3 sell-form-component"
              id="sellFormDetails"
            >
              <Container>
                <h5 className="heading">1. Motorcycle Details</h5>
                <hr />

                <FormGroup id="details" className="pt-2">
                  <Row>
                    <Col md="6" lg="4">
                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Year</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setYear(e.target.value);
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
                            defaultValue={year}
                          />
                          <FormFeedback>Please give a valid year.</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Make</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            style={{ maxHeight: "40px" }}
                            onChange={(e) => {
                              setMake(e.target.value);
                              setModel("");

                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noMakeError: true,
                                });
                              }
                            }}
                            value={make}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noMakeError
                            }
                          >
                            {makeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid make.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Model</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            disabled={make === "" || make === "Select"}
                            onChange={(e) => {
                              setModel(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noModelError: true,
                                });
                              }
                            }}
                            value={model}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noModelError
                            }
                          >
                            {modelOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid model.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Body Type</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setBodyTypeSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noBodyTypeError: true,
                                });
                              }
                            }}
                            value={bodyTypeSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noBodyTypeError
                            }
                          >
                            {bodyTypeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid body type.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Kilometers</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setKilometerInput(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noKilometersError: true,
                                });
                              }
                            }}
                            value={kilometerInput}
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
                        <Label sm={featuresColLeftSize}>Condition</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setConditionSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noConditionError: true,
                                });
                              }
                            }}
                            value={conditionSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noConditionError
                            }
                          >
                            {conditionOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid condition.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Color</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setColorSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noColorError: true,
                                });
                              }
                            }}
                            value={colorSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noColorError
                            }
                          >
                            {colorOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid color.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>Fuel Type</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="select"
                            onChange={(e) => {
                              setFuelTypeSelected(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noFuelTypeError: true,
                                });
                              }
                            }}
                            value={fuelTypeSelected}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noFuelTypeError
                            }
                          >
                            {fuelTypeOptions}
                          </Input>
                          <FormFeedback>
                            Please choose a valid fuel type.
                          </FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm={featuresColLeftSize}>CC</Label>
                        <Col sm={12 - featuresColLeftSize}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setCCInput(e.target.value);
                              if (!isEmpty(possibleErrors)) {
                                setPossibleErrors({
                                  ...possibleErrors,
                                  noCCError: true,
                                });
                              }
                            }}
                            value={ccInput}
                            invalid={
                              !isEmpty(possibleErrors) &&
                              !possibleErrors.noCCError
                            }
                          />
                          <FormFeedback>Please give a valid CC.</FormFeedback>
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
                                  setHasElectricStart(e.target.checked);
                                }}
                                checked={hasElectricStart}
                              />{" "}
                              Electric start
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasAlloyWheels(e.target.checked);
                                }}
                                checked={hasAlloyWheels}
                              />{" "}
                              Alloy wheels
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasTubelesssTyres(e.target.checked);
                                }}
                                checked={hasTubelessTyres}
                              />{" "}
                              Tubeless tyres{" "}
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasDigitalDisplayPanel(e.target.checked);
                                }}
                                checked={hasDigitalDisplayPanel}
                              />{" "}
                              Digital display panel{" "}
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasProjectedHeadLight(e.target.checked);
                                }}
                                checked={hasProjectedHeadLight}
                              />{" "}
                              Projected headlight{" "}
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasLedTailLight(e.target.checked);
                                }}
                                checked={hasLedTailLight}
                              />{" "}
                              Led tail light{" "}
                            </Label>
                            <br />
                          </Col>
                          <Col md="6" lg="12" sm="12">
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasFrontDiscBrake(e.target.checked);
                                }}
                                checked={hasFrontDiscBrake}
                              />{" "}
                              Front disc brake
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasRearDiscBrake(e.target.checked);
                                }}
                                checked={hasRearDiscBrake}
                              />{" "}
                              Rear disc brake
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasAbs(e.target.checked);
                                }}
                                checked={hasAbs}
                              />{" "}
                              Anti-lock braking system (ABS)
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasMonoSuspension(e.target.checked);
                                }}
                                checked={hasMonoSuspension}
                              />{" "}
                              Mono suspension
                            </Label>
                            <br />
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasSplitSeat(e.target.checked);
                                }}
                                checked={hasSplitSeat}
                              />{" "}
                              Split seat
                            </Label>
                            <br />{" "}
                            <Label className={featuresPaddingTop} check>
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setHasTripMeter(e.target.checked);
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
                                checked={hasTripMeter}
                              />{" "}
                              Tripmeter
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
                    <Label className="heading" md={2}>
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
                </small>
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
                            setPriceInput(e.target.value);
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
                          value={priceInput}
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
                      <Label>
                        <Input
                          type="radio"
                          name="priceRadio"
                          defaultChecked={priceType === "free"}
                          onChange={(e) => {
                            setPriceType("free");
                            setPriceInput("");
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
                        Free
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="1"></Col>
                  <Col md="2">
                    <FormGroup className="float-left" check>
                      <Label>
                        <Input
                          type="radio"
                          name="priceRadio"
                          defaultChecked={priceType === "contact"}
                          onChange={(e) => {
                            setPriceType("contact");
                            setPriceInput("");
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
                        Please contact
                      </Label>
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
            <div className="my-5">
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

export default SellMotorcycleForm;
