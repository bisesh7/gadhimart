import React, { useState, useEffect, Fragment } from "react";
import Dropzone from "react-dropzone";
import { Card, CardImg, CardBody, Button } from "reactstrap";
import Carousel from "@brainhubeu/react-carousel";
import { uuid } from "uuidv4";
import axios from "axios";
import path from "path";
import backButtonSVG from "../../icons/back.svg";
import nextButtonSVG from "../../icons/next.svg";
import deleteButtonSVG from "../../icons/criss-cross.svg";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "125px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#6c757d",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#6c757d",
  outline: "none",
  transition: "border .24s ease-in-out",
  minHeight: "250px",
  cursor: "pointer",
};

const baseStyleExtraSmall = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "60px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#6c757d",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#6c757d",
  outline: "none",
  transition: "border .24s ease-in-out",
  minHeight: "140x",
  cursor: "pointer",
};

const ImageUploader = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowSize, setWindowSize] = useState(null);
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
      setStyle(baseStyleExtraSmall);
      setWindowSize("extraSmall");
    }
  }, [windowWidth]);

  const [style, setStyle] = useState(
    windowSize === "extraSmall" ? baseStyleExtraSmall : baseStyle
  );

  const [files, setFiles] = useState([]);
  const [pictureCards, setPictureCards] = useState([]);

  // Run when files are dropped or selected
  const onDrop = (acceptedFiles) => {
    // If 10 pictures are already selected then do not run
    // Also run only when selected pictures are less than 10
    if (
      files.length + props.lastUploadedImages.length !== 10 &&
      acceptedFiles.length <= 10
    ) {
      // If the user selects more than 10 files or sum of selected files
      // and already selected file is more than 10 then we
      // trim the selected pictures such that selected pictures is always 10
      if (
        acceptedFiles.length + files.length + props.lastUploadedImages.length >
        10
      ) {
        const total =
          acceptedFiles.length + files.length + props.lastUploadedImages.length;
        const toTrim = total - 10;
        const toSelect = acceptedFiles.length - toTrim;
        let newAcceptedFiles = [];
        for (let i = 0; i < toSelect; i++) {
          newAcceptedFiles.push(acceptedFiles[i]);
        }
        acceptedFiles = newAcceptedFiles;
      }

      let newFiles = [];
      // Create a new file with unique name so that we can know the particular
      // file when server has uploaded and server file name is set to the file meta
      acceptedFiles.forEach((file) => {
        const uniqueId = uuid();
        const blob = file.slice(0, file.size, file.type);
        const newFile = new File(
          [blob],
          uniqueId + path.extname(file.name).toLowerCase(),
          { type: file.type }
        );
        newFiles.push({ key: uniqueId, file: newFile });
      });

      // Creating a preivew file
      newFiles.forEach((fileDetail) => {
        for (const key in fileDetail) {
          if (key === "file") {
            Object.assign(fileDetail[key], {
              preview: URL.createObjectURL(fileDetail[key]),
            });
          }
        }
      });
      setFiles([...files, ...newFiles]);
      props.setToBeSubmitted(true);
    }
  };

  // Handle rejected files
  const onDropRejected = (rejectedFiles) => {
    let rejectedReason = "";
    rejectedFiles.forEach((file) => {
      file.errors.forEach((error) => {
        if (error.code === "file-too-large") {
          rejectedReason = `Some files uploaded has size larger than 2 mb.`;
        }
        if (error.code === "file-invalid-type") {
          rejectedReason = `Only jpeg, jpg and png are allowed.`;
        }
      });
    });
    // Show the message to the user in front end
    props.setPictureUploadAlertMessage(rejectedReason);
    props.setPictureUploadAlertVisible(true);
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // Make picture cards of the pictures uploaded and to be uploaded
  useEffect(() => {
    if (files.length >= 1) {
      let pictureCards = [];
      files.forEach((file) => {
        const card = (
          <Card key={file.key}>
            <CardImg
              top
              width="100%"
              src={file.file.preview}
              height="110"
              style={{ objectFit: "cover" }}
              alt="Car Image"
            />
            <CardBody className="text-center">
              <a
                href="remove"
                onClick={(e) => {
                  e.preventDefault();

                  // If file.fileUrl is undefined this picture has not been uploaded to the server so
                  // only remove from front end
                  // since fileUrl is pushed to file only after the upload
                  if (
                    typeof file.file.fileUrl === "undefined" &&
                    typeof file.file.serverName === "undefined" &&
                    typeof file.file.serverFileName === "undefined"
                  ) {
                    const newFiles = files.filter((f) => f.key !== file.key);
                    pictureCards = pictureCards.filter(
                      (pc) => pc.key !== file.key
                    );
                    setPictureCards(pictureCards);
                    makePicturesToBeUploadedMeta(newFiles);
                    setFiles(newFiles);
                  } else {
                    axios({
                      method: "post",
                      url: "/api/upload/removeCarImage",
                      data: {
                        fileUrl: file.file.fileUrl,
                        sentFrom: "thisIsValid",
                      },
                    })
                      .then((res) => {
                        const newFiles = files.filter(
                          (f) => f.key !== file.key
                        );
                        pictureCards = pictureCards.filter(
                          (pc) => pc.key !== file.key
                        );
                        setPictureCards(pictureCards);
                        makePicturesToBeUploadedMeta(newFiles);
                        setFiles(newFiles);
                      })
                      .catch((err) => {
                        if (err.status === "500") {
                          props.setPictureUploadAlertMessage(
                            "Error deleting the file"
                          );
                          props.setPictureUploadAlertVisible(true);
                          console.log(err.response.data.msg);
                        } else if (err.status === "400") {
                          props.setPictureUploadAlertMessage("Error Occurred");
                          props.setPictureUploadAlertVisible(true);
                          console.log(err.response.data.msg);
                        }
                      });
                  }
                }}
              >
                <img alt="Remove" width="26" src={deleteButtonSVG} />
              </a>
            </CardBody>
          </Card>
        );
        pictureCards.push({ key: file.key, card });
      });

      setPictureCards(pictureCards);
    }
  }, [files]);

  // Change the color to blue when inside box
  const onDragEnter = (data) => {
    setStyle({ ...style, borderColor: "#2196f3" });
  };

  // Revert back to black color when out of the box
  const onDragLeave = () => {
    setStyle({ ...style, borderColor: "#6c757d" });
  };

  const makePicturesToBeUploadedMeta = (files) => {
    let newPicturesToBeUploadedMeta = [];

    //  If the form is contine editing form the we will have to work along with the previosly uploaded pictures

    if (props.editedForm) {
      // Adding the previusly uploaded imgaes to the pictures uploadeed list since they are already uploaded
      newPicturesToBeUploadedMeta.push.apply(
        newPicturesToBeUploadedMeta,
        props.lastUploadedImages
      );
    }

    files.forEach((file) => {
      newPicturesToBeUploadedMeta.push({
        fileUrl: file.file.fileUrl,
        serverFileName: file.file.serverFileName,
        serverName: file.file.serverName,
        id: file.key,
        lastModified: file.file.lastModified,
        lastModifiedDate: file.file.lastModifiedDate,
        type: file.file.type,
        size: file.file.size,
      });
    });

    // update the state
    props.setPicturesToBeUploadedMeta(newPicturesToBeUploadedMeta);
  };

  const onSumbit = () => {
    props.setToBeSubmitted(false);
    props.setUploading(true);

    const formData = new FormData();

    files.forEach((file) => {
      if (
        typeof file.file.fileUrl === "undefined" &&
        typeof file.file.serverName === "undefined" &&
        typeof file.file.serverFileName === "undefined"
      ) {
        formData.append("carImage", file.file);
      }
    });

    // Upload the image to the server
    axios
      .post("/api/upload/carImage", formData, {
        headers: {
          "content-type": "multipart/form-data",
          "unique-ID": props.uniqueId,
          files,
        },
      })
      .then((response) => {
        const uploadFolder = `/assets/uploads/temp/${props.uniqueId}`;
        // Make a temp new files since we cannot directly change files
        // and later make this permanent new files
        let newFiles = [...files];

        // Add the properties fileUrl, serverName to the files uploaded
        files.forEach((file, x) => {
          response.data.files.forEach((responseFile, y) => {
            if (responseFile.originalname === file.file.name) {
              // We use the same key
              const key = file.key;
              let newFile = { ...file.file };

              newFile.lastModified = file.file.lastModified;
              newFile.lastModifiedDate = file.file.lastModifiedDate;
              newFile.type = file.file.type;
              newFile.size = file.file.size;
              newFile.fileUrl = uploadFolder + "/" + responseFile.filename;
              newFile.serverFileName = responseFile.filename;
              newFile.serverName = responseFile.filename;

              newFiles = newFiles.filter((f) => f.key !== file.key);
              newFiles.push({ key, file: newFile });
            }
          });
        });

        setFiles(newFiles);

        makePicturesToBeUploadedMeta(newFiles);
        props.setUploading(false);
      })
      .catch((err) => {
        if (typeof err.response !== "undefined" && err.response.data.msg) {
          props.setPictureUploadAlertMessage(err.response.data.msg);
          props.setPictureUploadAlertVisible(true);
          props.setUploading(false);
        }
      });
  };

  return (
    <Fragment>
      <Dropzone
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        accept="image/jpeg, image/png, image/jpg"
        disabled={
          props.editedForm
            ? props.lastUploadedImages.length + files.length === 10
            : files.length === 10
        }
        maxSize="2097152"
        onDropRejected={onDropRejected}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <p>
                {props.editedForm
                  ? props.lastUploadedImages.length + files.length === 10
                    ? "Maximum FIles reached."
                    : `Click here or Drop ${
                        10 - (props.lastUploadedImages.length + files.length)
                      } files`
                  : files.length === 10
                  ? "Maximum Files reached."
                  : `Click here or Drop ${10 - files.length} files`}
              </p>
            </div>
          </section>
        )}
      </Dropzone>

      {pictureCards.length >= 1 ? (
        <div className="mt-2">
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
            {pictureCards.length >= 1
              ? pictureCards.map((pc) => pc.card)
              : null}
          </Carousel>
        </div>
      ) : null}

      <div className="d-flex justify-content-center mt-3">
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            onSumbit();
          }}
          disabled={
            props.editedForm
              ? props.lastUploadedImages.length + files.length < 2 ||
                props.lastUploadedImages.length + files.length > 10 ||
                !props.toBeSubmitted
              : files.length < 2 || files.length > 10 || !props.toBeSubmitted
          }
        >
          Submit
        </Button>
      </div>
    </Fragment>
  );
};

export default ImageUploader;
