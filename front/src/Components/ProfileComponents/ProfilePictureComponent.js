import React, {
  useState,
  useCallback,
  Fragment,
  useContext,
  useEffect,
} from "react";
import {
  Button,
  Card,
  CardImg,
  CardBody,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import ImageUploader from "react-images-upload";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext";

const ProfilePictureComponent = (props) => {
  const { auth, dispatch } = useContext(AuthContext);
  const { user } = auth;

  useEffect(() => {
    console.log(user.profilePicturePath);
  }, []);

  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px", // default, can be 'px' or '%'
    x: 130,
    y: 50,
    width: 400,
    height: 400,
    aspect: 1 / 1,
    keepSelection: true,
  });
  const [croppedImage, setCroppedImage] = useState();
  const [uploading, setUploading] = useState(false);

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const createCropImage = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, "newFile.jpeg");
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        const ext = extractImageFileExtensionFromBase64(upImg);
        setCroppedImage(blobToFile(blob, "profilePic." + ext));
      }, "image/jpeg");
    });
  };

  // Extract an Base64 Image's File Extension
  const extractImageFileExtensionFromBase64 = (base64Data) => {
    return base64Data.substring(
      "data:image/".length,
      base64Data.indexOf(";base64")
    );
  };

  // Convert the blob genrated to the file
  const blobToFile = (theBlob, fileName) => {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    var file = new File([theBlob], fileName, { type: theBlob.type });
    return file;
  };

  const onDrop = (picture) => {
    // setPictures([...pictures, picture]);
    if (picture.length !== 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(picture[0]);
      toggle();
    } else {
      // to remove the image in the modal
      setUpImg(undefined);
    }
  };

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    if (modal === true) {
      setCroppedImage(undefined);
      setUpImg(undefined);
    }
  };

  const handleRemoveClicked = () => {
    axios
      .get("/api/upload/removeProfilePicture")
      .then((res) => {
        if (res.data.success && typeof res.data.user !== "undefined") {
          dispatch({
            type: "PROFILE_PICTURE_SET",
            user: res.data.user,
          });

          console.log("removed profile picture");
        }
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePic", croppedImage);
    axios
      .post("/api/upload/profilepicture", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          // Do whatever you want with the native progress event
          if (progressEvent.loaded !== progressEvent.total) {
            setUploading(true);
          }
          console.log(progressEvent.loaded, "/", progressEvent.total);
        },
      })
      .then((res) => {
        if (res.data.success && typeof res.data.user !== "undefined") {
          setUploading(false);

          dispatch({
            type: "PROFILE_PICTURE_SET",
            user: res.data.user,
          });

          console.log("uploaded");
        }

        toggle();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 500) {
            console.log("Server error");
          } else if (err.response.status === 400) {
            console.log(err.response.data.msg);
          }
        }
        console.log(err.request);
      });
  };

  return (
    <Fragment>
      <Modal isOpen={modal} toggle={toggle} className="modal-lg">
        <ModalHeader toggle={toggle}>
          Position and crop your picture.
        </ModalHeader>
        <ModalBody>
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={createCropImage}
            fixed={true}
            minWidth="250"
            maxWidth="400"
            keepSelection={true}
          />
        </ModalBody>
        <ModalFooter>
          {typeof croppedImage !== "undefined" ? (
            <Button type="button" color="success" onClick={handleUpload}>
              <b>Upload</b>
            </Button>
          ) : (
            <Button type="button" color="success" disabled>
              <b>Upload</b>
            </Button>
          )}{" "}
          <Button type="button" color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Card>
        <CardImg
          top
          src={user.profilePicturePath}
          className="profile-picture mx-auto"
          alt="Profile picture"
        />
        <CardBody>
          <CardSubtitle className="text-center">
            {uploading ? (
              <Spinner style={{ width: "3rem", height: "3rem" }} />
            ) : null}

            <Button
              type="button"
              color="link"
              onClick={handleRemoveClicked}
              hidden={
                user.profilePicturePath === "/assets/images/default-profile.png"
                  ? true
                  : false
              }
            >
              <b>Remove</b>
            </Button>

            <ImageUploader
              {...props}
              withIcon={false}
              onChange={onDrop}
              imgExtension={[".jpg", ".png"]}
              maxFileSize={5242880}
              fileSizeError="File size is too big."
              fileTypeError="File extension is not supported."
              buttonText="Choose picture"
              singleImage={true}
              label="Max file size: 5 mb, extentions: .jpg | .png"
            />
          </CardSubtitle>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default ProfilePictureComponent;
