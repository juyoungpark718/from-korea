const express = require('express');
const router = express.Router();
const oauthService = require("../services/oauth");
const _ = require("fxjs/Strict");

router.get('/google/redirect', async (req, res, next) => {
  await _.go(
    req,
    oauthService.getUserProfileGoogle,
    oauthService.loginUser,
    (user) => req.session.user = user,
  );
  res.redirect("/")
});

router.get('/facebook/redirect', async (req, res, next) => {
  await _.go(
    req,
    oauthService.getUserProfileFB,
    oauthService.loginUser,
    (user) => req.session.user = user,
  );
  res.redirect("/");
});

module.exports = router;
