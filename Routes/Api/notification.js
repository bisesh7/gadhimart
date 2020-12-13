const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const config = require("config");
const mongoose = require("mongoose");
const Notification = require("../../models/Notification");
const SavedVehicles = require("../../models/SavedVehicles");
const ChatSession = require("../../models/ChatSessions");
const Car = require("../../models/Car");
const Motorcycle = require("../../models/Motorcycle");
const moment = require("moment");

// @route   POST /api/notification/newMessage
// @desc    notification about the new message
// @access  Private
router.post("/newMessage", ensureAuthenticated, (req, res) => {
  const { message, valid } = req.body;
  // const to = message.reciever;
  // const senderName = message.senderName;
  const kind = "newMessage";

  console.log("New Message", message);
  const senderName = message.senderName;
  const adTitle = message.adTitle;
  const make = message.make;
  const model = message.model;

  if (
    typeof valid === "undefined" ||
    valid != "VaLid223" ||
    senderName === "" ||
    message === ""
  ) {
    return res
      .status(400)
      .json({ message: "Please be genuine!", success: false });
  }

  const newNotification = new Notification({
    kind,
    data: {
      senderName,
      message: message.messageDetail.message,
      adTitle,
      make,
      model,
    },
    user: [message.messageDetail.reciever],
  });

  newNotification
    .save()
    .then((savedDocument) => {
      return res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   POST /api/notification/new
// @desc    notification about the new message
// @access  Private
router.post("/new", ensureAuthenticated, (req, res) => {
  const { kind, data, valid } = req.body;

  const error = () => {
    console.log("called");
    return res.status(400).json({ message: "Error occured!", success: false });
  };

  if (
    typeof valid === "undefined" ||
    valid != "VaLid223" ||
    typeof kind === "undefined" ||
    kind === "" ||
    typeof data === "undefined"
  ) {
    return error();
  }

  switch (kind) {
    case "listedCarDeleted":
      if (
        typeof data.vehicleId === "undefined" ||
        data.vehicleId === "" ||
        typeof data.carTitle === "undefined" ||
        data.carTitle === "" ||
        typeof data.lister === "undefined" ||
        data.lister === "" ||
        typeof data.carMake === "undefined" ||
        data.carMake === "" ||
        typeof data.carModel === "undefined" ||
        (data.carMake !== "Other" && data.carModel === "") ||
        typeof data.listerName === "undefined" ||
        data.listerName === "" ||
        typeof data.vehicleType === "undefined" ||
        data.vehicleType === ""
      ) {
        return error();
      }

      const {
        vehicleId,
        carMake,
        carModel,
        lister,
        listerName,
        carTitle,
        vehicleType,
      } = data;

      const getNewNotification = (user, message) => {
        return new Notification({
          kind,
          data: {
            message,
            carMake,
            carModel,
            vehicleId,
            lister,
            listerName,
            carTitle,
          },
          user,
        });
      };

      SavedVehicles.findOne({ vehicleId, vehicleType }, (err, savedVehicle) => {
        if (err) {
          console.log("1", err);
          return res.status(500).json({ success: false });
        } else {
          ChatSession.find(
            { listingId: vehicleId, vehicleType },
            (err, chatSessions) => {
              if (err) {
                console.log("2", err);
                return res.status(500).json({ success: false });
              }

              if (chatSessions.length === 0) {
                // Vehicle is not saved by any user
                if (savedVehicle === null) {
                  return res.json({
                    success: true,
                    savedVehicleId: false,
                    noMessages: true,
                  });
                } else {
                  let usersWhoSavedTheVehicle = savedVehicle.userIds;

                  const newNotification = getNewNotification(
                    usersWhoSavedTheVehicle,
                    `${carMake} ${carModel} you saved was deleted by the lister.`
                  );

                  newNotification
                    .save()
                    .then(() => {
                      return res.json({
                        success: true,
                        savedVehicleId: savedVehicle._id,
                        noMessages: true,
                        users: usersWhoSavedTheVehicle,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(500).json({ success: false });
                    });
                }
              } else if (chatSessions.length >= 1) {
                // List containing users who sent chatSessions
                let usersWhoSentMessage = [];

                // add users to the usersWhoSentMessage list excludind duplicates
                chatSessions.forEach((chatSession) => {
                  chatSession.usersInvolved.forEach((user) => {
                    if (user !== lister) {
                      usersWhoSentMessage.push(user);
                    }
                  });
                });

                if (savedVehicle === null) {
                  const newNotification = getNewNotification(
                    usersWhoSentMessage,
                    `${carMake} ${carModel} was deleted by the lister. 
                    The messages you sent to the lister was deleted as well.`
                  );

                  newNotification
                    .save()
                    .then(() => {
                      return res.json({
                        success: true,
                        savedVehicleId: false,
                        noMessages: false,
                        users: usersWhoSentMessage,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(500).json({ success: false });
                    });
                } else {
                  let usersWhoSavedTheVehicle = savedVehicle.userIds;

                  // creating a new list of users
                  let users = [...usersWhoSentMessage];

                  // Adding to the user but excluding duplicates
                  usersWhoSavedTheVehicle.forEach((user) => {
                    if (!users.includes(user)) {
                      users.push(user);
                    }
                  });

                  const newNotification = getNewNotification(
                    users,
                    `${carMake} ${carModel} you saved was deleted by the lister.
                      The chatSessions you sent for this car has also been deleted.`
                  );

                  newNotification
                    .save()
                    .then(() => {
                      return res.json({
                        success: true,
                        savedVehicleId: savedVehicle._id,
                        noMessages: false,
                        users,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(500).json({ success: false });
                    });
                }
              }
            }
          );
        }
      });
      break;

    case "chatSessionDeleted":
      switch (data.vehicleType) {
        case "Car":
          Car.findOne({ _id: data.listingId }, (err, car) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Server Error", success: false });
            }

            let notifyTo = null;
            let notifyToName = null;

            if (data.usersInvolved["1"].currentUser) {
              notifyTo = data.usersInvolved["2"].id;
              notifyToName = data.usersInvolved["2"].name;
            } else {
              notifyTo = data.usersInvolved["1"].id;
              notifyToName = data.usersInvolved["1"].name;
            }

            let deletedBy = null;
            let lister = null;

            // if current user is lister
            if (car.userId === req.user.id) {
              lister = req.user.name;
              deletedBy = "lister";
            } else {
              lister = notifyToName;
              deletedBy = "user";
            }

            const newNotification = new Notification({
              kind,
              data: {
                message: `Chat session for ${car.carDetails.carMakeSelected} ${car.carDetails.carModelSelected} was deleted by the ${deletedBy}`,
                carMake: car.carDetails.carMakeSelected,
                carModel: car.carDetails.carModelSelected,
                vehicleId: data.listingId,
                lister,
                deletedBy: req.user.name,
                carTitle: data.adTitle,
              },
              user: notifyTo,
            });

            newNotification
              .save()
              .then(() => {
                return res.json({ success: true });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ success: false, message: "Server Error" });
              });
          });
          break;
        case "Motorcycle":
          Motorcycle.findOne({ _id: data.listingId }, (err, motorcycle) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Server Error", success: false });
            }

            let notifyTo = null;
            let notifyToName = null;

            if (data.usersInvolved["1"].currentUser) {
              notifyTo = data.usersInvolved["2"].id;
              notifyToName = data.usersInvolved["2"].name;
            } else {
              notifyTo = data.usersInvolved["1"].id;
              notifyToName = data.usersInvolved["1"].name;
            }

            let deletedBy = null;
            let lister = null;

            // if current user is lister
            if (motorcycle.userId === req.user.id) {
              lister = req.user.name;
              deletedBy = "lister";
            } else {
              lister = notifyToName;
              deletedBy = "user";
            }

            const newNotification = new Notification({
              kind,
              data: {
                message: `Chat session for ${motorcycle.details.make} ${motorcycle.details.model} was deleted by the ${deletedBy}`,
                carMake: motorcycle.details.make,
                carModel: motorcycle.details.model,
                vehicleId: data.listingId,
                lister,
                deletedBy: req.user.name,
                carTitle: data.adTitle,
              },
              user: notifyTo,
            });

            newNotification
              .save()
              .then(() => {
                return res.json({ success: true });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ success: false, message: "Server Error" });
              });
          });
          break;
      }

      break;

    case "newCarsListed":
      const { matchedFilters } = data;

      matchedFilters.forEach((filterDetail, index) => {
        const newNotification = new Notification({
          kind,
          data: {
            message: `New cars has been listed for your saved car searches.`,
            savedSearch: filterDetail._id,
            filters: filterDetail.filters,
          },
          user: filterDetail.userIds,
        });

        newNotification
          .save()
          .then(() => {
            if (index === matchedFilters.length - 1) {
              return res.json({ success: true });
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, message: "Server Error" });
          });
      });

      break;

    case "newMotorcyclesListed":
      const { savedSearches } = data;

      savedSearches.forEach((savedSearch, index) => {
        const newNotification = new Notification({
          kind,
          data: {
            message: `New motorcycles has been listed for your saved motorcycle searches.`,
            savedSearch: savedSearch._id,
            filters: savedSearch.filters,
          },
          user: savedSearch.userIds,
        });

        newNotification
          .save()
          .then(() => {
            if (index === savedSearches.length - 1) {
              return res.json({ success: true });
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, message: "Server Error" });
          });
      });

      break;

    case "listedMotorcycleDeleted":
      if (
        typeof data.motorcycleListingId === "undefined" ||
        data.motorcycleListingId === "" ||
        typeof data.adTitle === "undefined" ||
        data.adTitle === "" ||
        typeof data.motorcycleLister === "undefined" ||
        data.motorcycleLister === "" ||
        typeof data.make === "undefined" ||
        data.make === "" ||
        typeof data.model === "undefined" ||
        (data.make !== "Other" && data.model === "") ||
        typeof data.motorcycleListerName === "undefined" ||
        data.motorcycleListerName === ""
      ) {
        return error();
      }

      const {
        motorcycleListingId,
        make,
        model,
        motorcycleLister,
        motorcycleListerName,
        adTitle,
      } = data;

      console.log(motorcycleListingId);

      SavedVehicles.findOne(
        { vehicleId: motorcycleListingId, vehicleType: "Motorcycle" },
        (err, savedVehicle) => {
          if (err) {
            console.log("1", err);
            return res.status(500).json({ success: false });
          } else {
            console.log(savedVehicle);

            const getNewNotification = (user, message) => {
              return new Notification({
                kind,
                data: {
                  message,
                  make,
                  model,
                  motorcycleListingId,
                  motorcycleLister,
                  motorcycleListerName,
                  adTitle,
                },
                user,
              });
            };
            ChatSession.find(
              { listingId: motorcycleListingId, vehicleType: "Motorcycle" },
              (err, chatSessions) => {
                if (err) {
                  console.log("2", err);
                  return res.status(500).json({ success: false });
                }

                if (chatSessions.length === 0) {
                  // Vehicle is not saved by any user
                  if (savedVehicle === null) {
                    return res.json({
                      success: true,
                      savedVehicleId: false,
                      noMessages: true,
                    });
                  } else {
                    let usersWhoSavedTheVehicle = savedVehicle.userIds;

                    const newNotification = getNewNotification(
                      usersWhoSavedTheVehicle,
                      `${make} ${model} you saved was deleted by the lister.`
                    );

                    newNotification
                      .save()
                      .then(() => {
                        return res.json({
                          success: true,
                          savedVehicleId: savedVehicle._id,
                          noMessages: true,
                          users: usersWhoSavedTheVehicle,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(500).json({ success: false });
                      });
                  }
                } else if (chatSessions.length >= 1) {
                  // List containing users who sent chatSessions
                  let usersWhoSentMessage = [];

                  // add users to the usersWhoSentMessage list excluding duplicates
                  chatSessions.forEach((chatSession) => {
                    chatSession.usersInvolved.forEach((user) => {
                      if (user !== motorcycleLister) {
                        usersWhoSentMessage.push(user);
                      }
                    });
                  });

                  if (savedVehicle === null) {
                    const newNotification = getNewNotification(
                      usersWhoSentMessage,
                      `${make} ${model} was deleted by the lister. 
                    The messages you sent to the lister was deleted as well.`
                    );

                    newNotification
                      .save()
                      .then(() => {
                        return res.json({
                          success: true,
                          savedVehicleId: false,
                          noMessages: false,
                          users: usersWhoSentMessage,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(500).json({ success: false });
                      });
                  } else {
                    let usersWhoSavedTheVehicle = savedVehicle.userIds;

                    // creating a new list of users
                    let users = [...usersWhoSentMessage];

                    // Adding to the user but excluding duplicates
                    usersWhoSavedTheVehicle.forEach((user) => {
                      if (!users.includes(user)) {
                        users.push(user);
                      }
                    });

                    const newNotification = getNewNotification(
                      users,
                      `${make} ${model} you saved was deleted by the lister.
                      The chatSessions you sent for this motorcycle has also been deleted.`
                    );

                    newNotification
                      .save()
                      .then(() => {
                        return res.json({
                          success: true,
                          savedVehicleId: savedVehicle._id,
                          noMessages: false,
                          users,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(500).json({ success: false });
                      });
                  }
                }
              }
            );
          }
        }
      );
      break;
  }
});

// @route   POST /api/notification/getNotifications
// @desc    get all the notifications of a user
// @access  Private
router.post("/getNotifications", ensureAuthenticated, (req, res) => {
  const { userId, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof userId === "undefined" ||
    valid !== "ValID2334" ||
    userId === ""
  ) {
    return res.status(400).json({ message: "Error occrurred", success: false });
  }

  Notification.$where(`this.user.indexOf('${req.user._id}') > -1`).exec(
    (err, notifications) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }
      return res.json({ success: true, notifications });
    }
  );
});

// @route   POST /api/notification/delete
// @desc    delete a particular notification of a user
// @access  Private
router.post("/delete", ensureAuthenticated, (req, res) => {
  const { id, valid } = req.body;

  if (
    valid !== "ValID2334" ||
    typeof valid === "undefined" ||
    id === "" ||
    typeof id === "undefined"
  ) {
    return res
      .status(400)
      .json({ message: "Please be genuine", success: false });
  }

  Notification.findOne({ _id: id }, (err, document) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error", success: false });
    }

    if (document.user.indexOf(req.user.id) > -1) {
      if (document.user.length === 1) {
        document.remove().then(() => {
          return res.json({ success: true });
        });
      } else {
        document.user = document.user.filter((e) => e !== req.user.id);
        document
          .save()
          .then(() => {
            return res.json({ success: true });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ message: "Server Error", success: false });
          });
      }
    }
  });
});

// @route   POST /api/notification/deleteAll
// @desc    delete all notification of a given user
// @access  Private
router.post("/deleteAll", ensureAuthenticated, (req, res) => {
  const { userId, valid } = req.body;

  if (
    valid !== "ValID2334" ||
    typeof valid === "undefined" ||
    userId === "" ||
    typeof userId === "undefined"
  ) {
    return res.status(400).json({ message: "Error Occurred", success: false });
  }

  Notification.$where(`this.user.indexOf('${req.user._id}') > -1`).exec(
    (err, notifications) => {
      if (err || notifications.length === 0) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }

      notifications.forEach((notification, index) => {
        if (notification.user.indexOf(req.user.id) > -1) {
          // Only return json if the index is last
          // Because it will cause error is respose is returned after it has been sent
          if (notification.user.length === 1) {
            if (index === notifications.length - 1) {
              notification.remove().then(() => {
                return res.json({ success: true });
              });
            } else {
              notification.remove();
            }
          } else {
            notification.user = notification.user.filter(
              (e) => e !== req.user.id
            );
            if (index === notifications.length - 1) {
              notification.save().then(() => {
                return res.json({ success: true });
              });
            } else {
              notification.save();
            }
          }
        }
      });
    }
  );
});

// @route   GET /api/notification/
// @desc    Get all the notifications
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { filter, range, sort } = req.query;

  const filterDetail = JSON.parse(filter);

  // If id in filter is not valid send empty list back
  if (typeof filterDetail._id !== "undefined") {
    const isValid = mongoose.Types.ObjectId.isValid(filterDetail._id);

    if (!isValid) {
      return res.json({ data: [], success: true, total: 0 });
    }
  }

  let date = null;
  if (typeof filterDetail.date !== "undefined") {
    date = filterDetail.date;
    delete filterDetail.date;
  }
  let beforeDate = null;
  let afterDate = null;
  if (typeof filterDetail.beforeDate !== "undefined") {
    beforeDate = filterDetail.beforeDate;
    delete filterDetail.beforeDate;
  }
  if (typeof filterDetail.afterDate !== "undefined") {
    afterDate = filterDetail.afterDate;
    delete filterDetail.afterDate;
  }

  const ranges = JSON.parse(range);
  const firstIndex = ranges[0];
  const lastIndex = ranges[1];

  const sortDetail = JSON.parse(sort);
  let sortAccordingTo = "";
  switch (sortDetail[0]) {
    // If id or profile is used we use _id as id is placed as _id by mongoose
    case "id":
      sortAccordingTo = "_id";
      break;
    default:
      sortAccordingTo = sortDetail[0];
      break;
  }

  const sortDirection = sortDetail[1] === "ASC" ? "" : "-";

  const getData = (documents) => {
    let data = [];
    const pushToData = (document) => {
      data.push({
        kind: document.kind,
        id: document.id,
        date: document.date,
        user: document.user,
      });
    };

    // If date filter is given we need to check the date here
    // since its easier to check here
    if (date !== null) {
      let dateToCheck = new Date(date);
      documents.forEach((document) => {
        let documentDate = new Date(document.date);

        if (
          dateToCheck.getFullYear() === documentDate.getFullYear() &&
          dateToCheck.getDate() === documentDate.getDate() &&
          dateToCheck.getMonth() === documentDate.getMonth()
        ) {
          pushToData(document);
        }
      });
    } else {
      if (beforeDate !== null && afterDate === null) {
        beforeDate = new Date(beforeDate);
        documents.forEach((document) => {
          let documentDate = new Date(document.date);

          if (documentDate < beforeDate) {
            pushToData(document);
          }
        });
      } else if (afterDate !== null && beforeDate === null) {
        afterDate = new Date(afterDate);
        documents.forEach((document) => {
          let documentDate = new Date(document.date);

          if (documentDate > afterDate) {
            pushToData(document);
          }
        });
      } else if (afterDate !== null && beforeDate !== null) {
        beforeDate = new Date(beforeDate);
        afterDate = new Date(afterDate);
        documents.forEach((document) => {
          let documentDate = new Date(document.date);

          if (documentDate < beforeDate && documentDate > afterDate) {
            pushToData(document);
          }
        });
      } else {
        documents.forEach((document) => {
          pushToData(document);
        });
      }
    }

    return data;
  };

  // When admin needs multiple users then we send filters to the api
  Notification.find(filterDetail)
    .sort(`${sortDirection}${sortAccordingTo}`)
    .exec((err, documents) => {
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
      let data = getData(documents);
      //  Getting the total
      let total = data.length;
      // Pagination in front end
      let splicedDocuments = data.slice(firstIndex, lastIndex + 1);
      // setting the data to spliced documents
      data = splicedDocuments;

      return res.json({ data, success: true, total });
    });
});

// @route   GET /api/notification/:id
// @desc    Get a notification wih given id
// @access  ADMIN
router.get("/:id", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  const { id } = req.params;

  Notification.findById(id)
    .then((document) => {
      if (!document) {
        return res.json({
          data: {},
          success: false,
          err: "noUserError",
          msg: "Could not find such id.",
        });
      }
      return res.json({
        data: {
          kind: document.kind,
          id: document.id,
          date: document.date,
          user: document.user,
          data: document.data,
        },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false });
    });
});

// @route   DELETE /api/notification?query
// @desc    Delete notifications in query
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

    // Delete all the notification with id in id list.
    Notification.find()
      .where("_id")
      .in(id)
      .exec((err, documents) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: "serverError",
            msg: "Error finding the notifications.",
          });
        }

        let promises = [];

        // Adding all the promise to delete
        documents.forEach((document) => {
          promises.push(document.remove());
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

// @route   DELETE /api/notification/deleteNotificationsOlderThan25Days
// @desc    Delete notifications older than 25 days
// @access  PRIVATE
router.post(
  "/deleteNotificationsOlderThan25Days",
  ensureAuthenticated,
  (req, res) => {
    Notification.find({})
      .then((documents) => {
        let promises = [];
        documents.forEach((document) => {
          const date = new Date(document.date);
          const today = new Date(Date.now());

          let dateMoment = moment([
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          ]);
          let todayMoment = moment([
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          ]);
          const numberOfDays = todayMoment.diff(dateMoment, "days");
          if (numberOfDays > 25) {
            promises.push(document.remove());
          }
        });
        if (promises.length) {
          Promise.all(promises)
            .then(() => {
              return res.json({ success: true });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ success: false });
            });
        } else {
          return res.json({ success: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

module.exports = router;
