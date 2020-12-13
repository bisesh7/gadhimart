const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const { uuid, isUuid } = require("uuidv4");
const config = require("config");

//Message Model
const ChatSession = require("../../models/ChatSessions");

// @route   POST /api/message
// @desc    Send message from the user to lister
// @access  Private
router.post("/", ensureAuthenticated, (req, res) => {
  const {
    message,
    uniqueId,
    from,
    to,
    valid,
    listingId,
    vehicleType,
  } = req.body;

  const checkUndefined = (candidate) => {
    return typeof candidate === "undefined" ? true : false;
  };

  const responseIsUndefined = () => {
    if (
      checkUndefined(from) ||
      checkUndefined(to) ||
      checkUndefined(message) ||
      checkUndefined(listingId) ||
      checkUndefined(uniqueId) ||
      checkUndefined(vehicleType)
    ) {
      return true;
    }
  };

  const responseIsEmpty = () => {
    if (
      from === "" ||
      to === "" ||
      message === "" ||
      listingId === "" ||
      uniqueId === "" ||
      vehicleType === ""
    ) {
      return true;
    }
  };

  if (
    valid !== "VaLid123@4" ||
    responseIsUndefined() ||
    responseIsEmpty() ||
    req.user._id.toString() !== from.toString() ||
    !isUuid(uniqueId)
  ) {
    console.log(responseIsEmpty());
    console.log(responseIsUndefined());
    return res.status(400).json({
      msg: "Please give valid credentials",
      success: false,
    });
  }

  const createNewChatSession = (uniqueId) => {
    const newChatSession = new ChatSession({
      vehicleType,
      listingId,
      uniqueId,
      usersInvolved: [from, to],
      messages: [
        {
          sender: from,
          reciever: to,
          date: new Date(),
          seenDetail: { date: null, seen: false },
          message: message,
          id: uuid(),
        },
      ],
    });

    newChatSession
      .save()
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: "Server Error", success: false });
      });
  };

  ChatSession.$where(
    `this.listingId === '${listingId}' &&
    this.usersInvolved.indexOf('${from}') > '-1' &&
    this.usersInvolved.indexOf('${to}') > '-1'`
  ).exec((err, listings) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    if (listings.length === 0) {
      // if chatSession is null, this is the first message ever so we use the uniqueid
      // sent from client
      createNewChatSession(uniqueId);
    } else if (listings.length === 1) {
      listings[0].messages.push({
        sender: from,
        reciever: to,
        date: new Date(),
        seenDetail: { date: null, seen: false },
        message: message,
        id: uuid(),
      });
      listings[0]
        .save()
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ success: false });
        });
    }
  });
});

// @route   POST /api/message/getAllMessages
// @desc    get messages in which user is involved
// @access  Private
router.post("/getAllMessages", ensureAuthenticated, (req, res) => {
  const { valid } = req.body;

  if (valid !== "VaLid@2342") {
    return res
      .status(400)
      .json({ msg: "Please provide valid credentials", success: false });
  }

  ChatSession.$where(
    `this.usersInvolved.indexOf('${req.user._id}') > '-1'`
  ).exec((err, chatSessions) => {
    if (err) {
      return res.status(500).json({ msg: "Server error", success: false });
    }

    return res.json({ chatSessions, success: true });
  });
});

// @route   POST /api/message/getMessage
// @desc    get messages in which user is involved with particular unique id
// @access  Private
router.post("/getMessage", ensureAuthenticated, (req, res) => {
  const { valid, uniqueId } = req.body;

  if (
    typeof valid === "undefined" ||
    valid !== "VaLid@2342" ||
    typeof uniqueId === "undefined" ||
    !isUuid(uniqueId)
  ) {
    console.log("Invalid credentials", req.body);
    return res
      .status(400)
      .json({ msg: "Please provide valid credentials", success: false });
  }

  ChatSession.findOne({ uniqueId }, (err, chatSession) => {
    if (err) {
      return res.status(500).json({ msg: "Server error", success: false });
    }

    const currentUserId = req.user.id;

    const currentUserIdRecieverMessages = chatSession.messages.filter(
      (m) => m.reciever === currentUserId
    );

    if (currentUserIdRecieverMessages.length >= 1) {
      const latestMessage = currentUserIdRecieverMessages.reduce(function (
        r,
        a
      ) {
        return r.date > a.date ? r : a;
      });

      const latestId = latestMessage.id;

      const messages = chatSession.messages;
      messages.forEach((message) => {
        if (message.id === latestId) {
          message.seenDetail.date = Date.now();
          message.seenDetail.seen = true;
        }
      });

      chatSession.messages = [];
      chatSession
        .save()
        .then(() => {
          chatSession.messages = [...messages];
          chatSession.save().then((savedChatSession) => {
            return res.json({ success: true, chatSession: savedChatSession });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ msg: "Server error", success: false });
        });
    } else {
      return res.json({ success: true, chatSession });
    }
  });
});

// @route   POST /api/message/delete
// @desc    delete messages in with the given unique id
// @access  Private
router.post("/delete", ensureAuthenticated, (req, res) => {
  const { uniqueId, valid } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof uniqueId === "undefined" ||
    valid !== "ValId256" ||
    uniqueId === ""
  ) {
    return res
      .status(400)
      .json({ message: "Please be genuine", success: false });
  }

  ChatSession.findOne({ uniqueId }, (err, document) => {
    if (err) {
      return res.status(500).json({ success: false });
    }
    if (document === null) {
      return res.json({ success: true });
    } else {
      document
        .remove()
        .then(() => {
          return res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

// @route   POST /api/message/deleteCarMessages
// @desc    delete all chat sessions for given vehicle id
// Wen user deletes his listing  then all of the chatsessions for this listing
// needs to be deleted
// @access  Private
router.post("/deleteMessages", ensureAuthenticated, (req, res) => {
  const { listingId, valid, vehicleType } = req.body;

  if (
    typeof valid === "undefined" ||
    typeof listingId === "undefined" ||
    typeof vehicleType === "undefined" ||
    valid !== "ValId256" ||
    listingId === ""
  ) {
    console.log("Invalid");
    return res
      .status(400)
      .json({ message: "Please be genuine", success: false });
  }

  ChatSession.deleteMany({ listingId, vehicleType }, (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Error while deleting message", success: false });
    }
    return res.json({ success: true });
  });
});

// @route   GET /api/message/getTotal
// @desc    Get total number of the coversations for the given date
// @access  ADMIN
router.get("/getTotal", (req, res) => {
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
        let documentDate = new Date(document.date);

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
  ChatSession.find(filterDetail).exec((err, documents) => {
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

// @route   GET /api/message/
// @desc    Get all the conversations
// @access  ADMIN
router.get("/", (req, res) => {
  if (req.header("authorization") !== config.ADMIN_KEY) {
    return res.status(401).json({ msg: "Unauthorized request." });
  }

  // When admin needs multiple chat sessions then we send filters to the api
  ChatSession.find({}).exec((err, documents) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "serverError",
        msg: "Error finding the chat sessions.",
      });
    }

    if (!documents.length) {
      return res.json({ data: [], success: true });
    }

    return res.json({ data: documents, success: true });
  });
});

module.exports = router;
