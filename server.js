const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const http = require("http");
const socket = require("socket.io");
const { uuid } = require("uuidv4");
const path = require("path");
const users = require("./Routes/Api/users");
const car = require("./Routes/Api/car");
const auth = require("./Routes/Api/auth");
const upload = require("./Routes/Api/upload");
const message = require("./Routes/Api/message");
const notification = require("./Routes/Api/notification");
const savedVehicles = require("./Routes/Api/savedVehicle");
const savedSearch = require("./Routes/Api/savedSearch");
const tempFolders = require("./Routes/Api/tempFolders");
const motorcycle = require("./Routes/Api/motorcycle");
const views = require("./Routes/Api/views");
const reportListing = require("./Routes/Api/reportListing");
const reportUser = require("./Routes/Api/reportUser");
const blockUser = require("./Routes/Api/blockUser");
const confirmEmail = require("./Routes/Api/confirmEmail");
const forgotPassword = require("./Routes/Api/forgotPassword");
const motorcycleView = require("./Routes/Api/motorcycleView");
const carView = require("./Routes/Api/carView");
const reportMotorcycleListing = require("./Routes/Api/reportMotorcycleListing");
const reportCarListing = require("./Routes/Api/reportCarListing");
const savedCar = require("./Routes/Api/savedCars");
const savedMotorcycle = require("./Routes/Api/savedMotorcycles");
const motorcycleChatSessions = require("./Routes/Api/motorcycleChatSessions");
const carChatSessions = require("./Routes/Api/carChatSessions");
const reportUserMotorcycles = require("./Routes/Api/reportUserMotorcycles");
const reportUserCars = require("./Routes/Api/reportUserCars");
const userLoginDetails = require("./Routes/Api/userLoginDetail");
const admin = require("./Routes/Api/admin");
const carMakesAndModels = require("./Routes/Api/carMakesAndModels");
const motorcycleMakesAndModels = require("./Routes/Api/motorcycleMakesAndModels");
const provinceWithDistricts = require("./Routes/Api/provinceWithDistricts");
const filters = require("./Routes/Api/filters");
// For socketio chat
const ChatSession = require("./models/ChatSessions");

const session = require("express-session");
const passport = require("passport");

const app = express();

// Need to create server for socket io
const server = http.createServer(app);
const io = socket(server);

// Passport config
require("./config/passport")(passport);

const cors = require("cors");
app.use(cors());

// Body parser
app.use(express.json());

// get the mongouri from config
const db = config.get("mongoURI");

// Connect to mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log("mongo db connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(
  session({
    secret: config.get("secret"),
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes for /api/users
app.use("/api/users", users);
// Routes for /api/auth
app.use("/api/auth", auth);
// Routes for /api/upload
app.use("/api/upload", upload);
// Routes for /api/car
app.use("/api/car", car);
// ROutes for /api/message
app.use("/api/message", message);
// Routes for /api/notification
app.use("/api/notification", notification);
// Routes for /api/savedVehicles
app.use("/api/savedVehicles", savedVehicles);
// Routes for /api/savedSearch
app.use("/api/savedSearch", savedSearch);
// Routes for /api/tempFolders
app.use("/api/tempFolders", tempFolders);
// Routes for /api/motorcycle
app.use("/api/motorcycle", motorcycle);
// Routes for /api/views
app.use("/api/views", views);
// Routes for /api/reportListing
app.use("/api/reportListing", reportListing);
// Routes for /api/reportUser
app.use("/api/reportUser", reportUser);
// Routes for /api/blockUser
app.use("/api/blockUser", blockUser);
// Routes for /api/confirmEmails
app.use("/api/confirmEmails", confirmEmail);
// Routes for /api/forgotPasswords
app.use("/api/forgotPasswords", forgotPassword);
// Routes for /api/motorcycleViews
app.use("/api/motorcycleViews", motorcycleView);
// Routes for /api/carViews
app.use("/api/carViews", carView);
// Routes for /api/reportMotorcycleListings
app.use("/api/reportMotorcycleListings", reportMotorcycleListing);
// Routes for /api/reportCarListings
app.use("/api/reportCarListings", reportCarListing);
// Routes for /api/savedCars
app.use("/api/savedCars", savedCar);
// Routes for /api/savedMotorcycles
app.use("/api/savedMotorcycles", savedMotorcycle);
// Routes for /api/motorcycleChatSessions
app.use("/api/motorcycleChatSessions", motorcycleChatSessions);
// Routes for /api/carChatSessions
app.use("/api/carChatSessions", carChatSessions);
// Routes for /api/reportUserMotorcycles
app.use("/api/reportUserMotorcycles", reportUserMotorcycles);
// Routes for /api/reportUserCars
app.use("/api/reportUserCars", reportUserCars);
// Routes for /api/userLoginDetails
app.use("/api/userLoginDetails", userLoginDetails);
// Routes for /api/admin
app.use("/api/admin", admin);
// Routes for /api/carMakesAndModels
app.use("/api/carMakesAndModels", carMakesAndModels);
// Routes for /api/motorcycleMakesAndModels
app.use("/api/motorcycleMakesAndModels", motorcycleMakesAndModels);
// Routes for /api/provinceWithDistricts
app.use("/api/provinceWithDistricts", provinceWithDistricts);
// Routes for /api/filters
app.use("/api/filters", filters);
// Serve the assets files from assets folder
app.use("/assets", express.static("assets"));

io.on("connection", (socket) => {
  socket.on("connection", () => {
    console.log("Connected");
  });
  // To listen for the chat messages
  // Chat messages needs to be in socket io as it needs to real time
  socket.on("messageFromChat", (data) => {
    let {
      uniqueId,
      sender,
      reciever,
      message,
      senderName,
      adTitle,
      make,
      model,
    } = data;

    if (
      typeof sender === undefined ||
      typeof uniqueId === undefined ||
      typeof reciever === undefined ||
      typeof message === undefined ||
      sender === "" ||
      uniqueId === "" ||
      reciever === "" ||
      message === ""
    ) {
      socket.emit("status", "Please give required credentials");
    } else {
      ChatSession.findOne({ uniqueId }, (err, chatSession) => {
        if (err) {
          console.log(err);
          socket.emit("status", "Please give required credentials");
        }

        const res = {
          sender,
          reciever,
          date: Date.now(),
          seenDetail: { date: null, seen: false },
          message: message,
          id: uuid(),
        };

        chatSession.messages.push(res);

        chatSession
          .save()
          .then(() => {
            // send to all clients including sender
            io.emit(uniqueId, { success: true, res });

            // Notification for the other user for the toast notification
            // Send to all client excluding sender
            socket.broadcast.emit(res.reciever + "newMessage", res);

            // Notification for the database set by the sender
            // send to sender only
            socket.emit(res.sender + "newMessageNotification", {
              messageDetail: res,
              senderName,
              adTitle,
              make,
              model,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ success: false });
          });
      });
    }
  });

  // This is the socket to listen for message sent from car detail view
  socket.on("newMessage", function (data, fn) {
    const { to, message, title, senderName, from, make, model } = data;
    // We will not send message to chat box here because we will need to get the unique id
    // From the messages document. Also it is not necessary to sen to chat box here
    // When new message is recieved, if reciever is online toast notification
    // needs to be displayed on his session.

    socket.broadcast.emit(to + "newMessage", { title, message, senderName });

    // Notification for the database which is set by the sender
    socket.emit(from + "newMessageNotification", {
      messageDetail: { message, reciever: to },
      senderName,
      make,
      model,
      adTitle: title,
    });

    // Callback which is in the client side
    fn(true);
  });

  socket.on("chatSessionDeleted", function (data, fn) {
    const { deletedBy, to } = data;

    socket.broadcast.emit(to + "newToastNotification", {
      message: `Your recent chat session with ${deletedBy} has been deleted by him.`,
    });

    // Callback which is in the client side
    fn(true);
  });

  socket.on("listingDeleted", function (data, fn) {
    const { to, make, model, situation, vehicleType } = data;

    switch (situation) {
      case "onlySavedCar":
        socket.broadcast.emit("newToastNotification", {
          message: `${make} ${model} you saved was deleted by the lister.`,
          to,
        });
        break;
      case "both":
        socket.broadcast.emit("newToastNotification", {
          message: `${make} ${model} you saved was deleted by the lister.
          The messages you sent for this ${vehicleType} has also been deleted.`,
          to,
        });
        break;
      case "onlyChatSession":
        socket.broadcast.emit("newToastNotification", {
          message: `Your recent chat session for ${make} ${model} has been deleted by lister.`,
          to,
        });
        break;
    }

    // Callback which is in the client side
    fn(true);
  });

  socket.on("newVehiclePosted", function (data, fn) {
    const { userIds, vehicleType } = data;

    if (vehicleType === "Car") {
      socket.broadcast.emit("newToastNotification", {
        message: `New car has been posted for the search filter you saved.`,
        to: userIds,
      });
    } else if (vehicleType === "Motorcycle") {
      socket.broadcast.emit("newToastNotification", {
        message: `New motorcycle has been posted for the search filter you saved.`,
        to: userIds,
      });
    }

    // Callback which is in the client side
    fn(true);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

// port number
const port = process.env.PORT || 5000;

// Serve static if in Production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "front/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front", "build", "index.html"));
  });
}

// creating the server and listening
server.listen(port, "0.0.0.0", () =>
  console.log(`Server started at port ${port}`)
);
