const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../../config/auth");
const config = require("config");
const UserLoginDetail = require("../../models/UserLoginDetail");
// @route   POST /api/auth
// @desc    Authnticate the user and login
// @access  PUBLIC
router.post("/", (req, res, next) => {
  if (req.body.valid !== config.API_KEY) {
    return res
      .status(400)
      .json({ msg: "Incorrect credentials", success: false });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Incorrect credentials", success: false });
    }
    if (user.confirmed && !user.blocked) {
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        } else {
          const returnUserDetails = () => {
            return res.json({
              msg: "logged in",
              success: true,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicturePath: user.profilePicturePath,
                streetAddress: user.streetAddress,
                phoneNumber: user.phoneNumber,
                messageReadCanBeSeen: user.messageReadCanBeSeen,
                hideVisitCounter: user.hideVisitCounter,
                getNews: user.getNews,
              },
            });
          };
          UserLoginDetail.findOne({ userId: user.id }).then((document) => {
            if (document) {
              document.lastLoginDate = Date.now();
              document
                .save()
                .then(() => {
                  return returnUserDetails();
                })
                .catch((err) => {
                  return next(err);
                });
            } else {
              const userLoginDetail = new UserLoginDetail({
                userId: user.id,
                lastLoginDate: Date.now(),
              });
              userLoginDetail
                .save()
                .then(() => {
                  return returnUserDetails();
                })
                .catch((err) => {
                  return next(err);
                });
            }
          });
        }
      });
    } else if (user.blocked) {
      return res
        .status(401)
        .json({ success: false, msg: "You have been blocked by the admin." });
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "Please confirm your email." });
    }
  })(req, res, next);
});

// @route   POST /api/auth/checkauth
// @desc    Check if the user is authenticated
// @access  PUBLIC
router.post("/checkauth", (req, res) => {
  console.log("Check auth is called");
  if (typeof req.body.valid !== "string" || req.body.valid !== config.API_KEY) {
    console.log(req.body);
    return res
      .status(400)
      .json({ msg: "Incorrect credentials", success: false });
  }
  console.log("Validation passed");
  req.isAuthenticated()
    ? res.json({
        isAuthenticated: req.isAuthenticated(),
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          profilePicturePath: req.user.profilePicturePath,
          streetAddress: req.user.streetAddress,
          phoneNumber: req.user.phoneNumber,
          messageReadCanBeSeen: req.user.messageReadCanBeSeen,
          hideVisitCounter: req.user.hideVisitCounter,
          getNews: req.user.getNews,
        },
      })
    : res.json({
        isAuthenticated: req.isAuthenticated(),
      });
});

// @route   GET /api/auth
// @desc    Sign out the user
// @access  PRIVATE
router.get("/signout", ensureAuthenticated, (req, res) => {
  UserLoginDetail.findOne({ userId: req.user.id }).then((document) => {
    document.lastLogoutDate = Date.now();
    document
      .save()
      .then(() => {
        req.logout();
        res.json({ msg: "Logged out", success: true });
      })
      .catch((err) => {
        return next(err);
      });
  });
});

module.exports = router;
