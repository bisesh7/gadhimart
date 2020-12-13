// This used to displays confidential page safely. Some page need to be displayed only if user is logged in.
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ msg: "Please login first", success: false });
  },
};
