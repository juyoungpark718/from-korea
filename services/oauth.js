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
        "redirect_uri": process.env.GOOGLE_OAUTH_REDIRECT_URI,
        "grant_type": "authorization_code"
      }),
    });

const decodeBase64 = (data) => JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

const getAccessTokenFB = (code) =>
    fetch(`https://graph.facebook.com/v10.0/oauth/access_token?`
      + `client_id=${process.env.FB_OAUTH_CLIENT_ID}&`
      + `redirect_uri=${encodeURI(process.env.FB_OAUTH_REDIRECT_URI)}&`
      + `client_secret=${process.env.FB_OAUTH_CLIENT_SECRET}&`
      + `code=${code}`
    );
const getUserInfoFB = (access_token) => 
    fetch(`https://graph.facebook.com/v10.0/me?fields=id,name,email,picture&access_token=${access_token}`);

const getUserProfileGoogle = _.pipe(
  (req) => req.query.code,
  getAccessTokenGoogle,
  data => data.json(),
  ({id_token}) => id_token,
  data => data.split(".")[1],
  decodeBase64,
  _.pick(["email","name","picture"])
);

const getUserProfileFB = _.pipe(
  (req) => req.query.code,
  getAccessTokenFB,
  data => data.json(),
  ({access_token}) => access_token,
  getUserInfoFB,
  data => data.json(),
  (user) => { 
    const { id:fbId, name, picture } = _.pick(["id", "name", "picture"], user);
    return { fbId, name, picture: picture.data.url };
  }
);

const loginUser = (userInfo) => _.go(
  userInfo,
  userModel.findUser,
  _.head,
  _.ifElse(
    u => u === undefined,
    async () => await userModel.createUser(userInfo),
    _.identity
  ),
  // _.pick(["id", "email", "name", "picture"]),
);

module.exports = {
  getUserProfileGoogle,
  getUserProfileFB,
  loginUser
}