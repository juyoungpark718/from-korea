const express = require('express');
const router = express.Router();

const googleLogin = () => {
  const query = [
    "response_type=code&",
    `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&`,
    "scope=openid%20profile%20email&",
    "redirect_uri=http%3a%2f%2flocalhost%3a3000%2foauth%2fgoogle%2fredirect&",
    // "state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2-login-demo.example.com%2FmyHome&0394852-3190485-2490358&",
  ]
  return `<a href="https://accounts.google.com/o/oauth2/v2/auth?${query.join("")}">구글 로그인</a>`
}

const fbLogin = () => {
  const query = [
    `client_id=${process.env.FB_OAUTH_CLIENT_ID}&`,
    `redirect_uri=http%3a%2f%2flocalhost%3a3000%2foauth%2ffacebook%2fredirect&`,
    `state=aewfap21j21fjiweofjaoj3foij3joij3afj&`,
    `granted_scopes=email`
  ]
  return `<a href="https://www.facebook.com/v10.0/dialog/oauth?${query.join("")}">페이스북 로그인</a>`
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user);
  res.send(
    "<div>"
    + googleLogin()
    + "</div><div>"
    + fbLogin()
    + "</div>"
  );
});

module.exports = router;
