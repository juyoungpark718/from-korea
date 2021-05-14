const express = require("express");
const router = express.Router();
const Login = require("../views/login");

router.get("/", (req, res, next) => {
  res.send(
    Login.render({
      title: "FromKorea | Log in",
      styles: [styleSheet`login/style.css`],
    })
  );
});

router.get("/logout", privateRouter, (req, res, next) => {
  delete req.session.user;
  res.redirect("/");
});

module.exports = router;
