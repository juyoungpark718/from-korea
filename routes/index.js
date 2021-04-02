const express = require('express');
const router = express.Router();
const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");

const googleLogin = () => {
  const query = [
    "response_type=code&",
    "client_id=856547300679-mjhaa8kc9udb19p790j0vhbljdlk98uc.apps.googleusercontent.com&",
    "scope=openid%20profile%20email&",
    "redirect_uri=http%3a%2f%2flocalhost%3a3000%2foauth%2fgoogle%2fredirect&",
    // "state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2-login-demo.example.com%2FmyHome&0394852-3190485-2490358&",
  ]
  return `<a href="https://accounts.google.com/o/oauth2/v2/auth?${query.join("")}">구글 로그인</a>`
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(googleLogin());
});

module.exports = router;
