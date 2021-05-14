const express = require("express");
const router = express.Router();
const Login = require("../views/login");

router.get("/", (req, res, next) => {
  if(req.session.user){
    res.redirect("/");
    return;
  }
  res.send(
    Login.render({
      title: "From. Korea | Log in",
      styles: [styleSheet`login/style.css`],
    })
  );
});

router.get("/logout", privateRouter, (req, res, next) => {
  delete req.session.user;
  res.redirect("/");
});

module.exports = router;
