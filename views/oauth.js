const googleLogin = () => {
  const query = [
    "response_type=code&",
    `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&`,
    "scope=openid%20profile%20email&",
    `redirect_uri=${encodeURI(process.env.GOOGLE_OAUTH_REDIRECT_URI)}&`,
    // "state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2-login-demo.example.com%2FmyHome&0394852-3190485-2490358&",
  ]
  return `
  <a href="https://accounts.google.com/o/oauth2/v2/auth?${query.join("")}">
    <div class="oauth__btn oauth__btn--google">Log in with Google</div>
  </a>`
}

const fbLogin = () => {
  const query = [
    `client_id=${process.env.FB_OAUTH_CLIENT_ID}&`,
    `redirect_uri=${encodeURI(process.env.FB_OAUTH_REDIRECT_URI)}&`,
    `state=aewfap21j21fjiweofjaoj3foij3joij3afj&`,
    `granted_scopes=email`
  ]
  return `
  <a href="https://www.facebook.com/v10.0/dialog/oauth?${query.join("")}">
    <div class="oauth__btn oauth__btn--fb">Log in with Facebook</div>
  </a>`
}

module.exports = {
  googleLogin,
  fbLogin
}