const express = require("express");
const router = express.Router();
const config = require("config");
const axios = require("axios");
const SECRET_KEY = config.get("G_RECAPTCHA_SECRET_KEY");
const API_KEY = config.get("API_KEY");

router.post("/verify", (req, res) => {
  const { valid, recaptchaToken } = req.body;

  if (
    typeof req.body.valid === "undefined" ||
    typeof recaptchaToken === "undefined" ||
    valid !== API_KEY
  ) {
    return res.status(400).json({ success: false });
  }

  var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${recaptchaToken}`;

  axios.post(VERIFY_URL).then((googleResponse) => {
    console.log(googleResponse.data);
    if (googleResponse.data.success) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  });
});

module.exports = router;
