const createUser = (req, path) => {
  let profilePicturePath;
  if (path) {
    profilePicturePath = path;
  } else {
    profilePicturePath = req.profilePicturePath;
  }
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profilePicturePath,
    streetAddress: req.user.streetAddress,
    phoneNumber: req.user.phoneNumber,
    messageReadCanBeSeen: req.user.messageReadCanBeSeen,
    hideVisitCounter: req.user.hideVisitCounter,
    getNews: req.user.getNews,
  };
  return user;
};

module.exports = createUser;
