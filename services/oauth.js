const _ = require("fxjs/Strict");
const fetch = require("node-fetch");
const userModel = require('../models/user');

const getAccessTokenGoogle = (code) => 
    fetch(`https://oauth2.googleapis.com/token`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
        code,
        "client_id": process.env.GOOGLE_OAUTH_CLIENT_ID,
        "client_secret": process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        "redirect_uri": "http://localhost:3000/oauth/google/redirect",
        "grant_type": "authorization_code"
      }),
    });
const decodeBase64 = (data) => JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

const getUserProfileGoogle = _.pipe(
  (req) => req.query.code,
  getAccessTokenGoogle,
  data => data.json(),
  ({id_token}) => id_token,
  data => data.split(".")[1],
  decodeBase64,
  _.pick(["email","name","picture"])
);

const loginUser = _.pipe(
  userModel.findUser,
  _.head,
  _.ifElse(
    u => u === undefined,
    () => userModel.createUser(idToken),
    _.identity
  ),
  _.pick(["id", "email", "name", "picture"]),
);


module.exports = {
  getUserProfileGoogle,
  loginUser
}