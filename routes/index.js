const express = require('express');
const Layout = require("../views/layout");
const Main = require("../views/main");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user);
  res.send(
    Layout.render(
      {
        title: 'index 페이지입니다.',
        body: Main.render(),
        styles: [`<link rel="stylesheet" type="text/css" href="/assets/main/style.css"/>`],
        scripts: [`<script type="module" src="/assets/main/index.js"></script>`]
      }
    )
  );
});

module.exports = router;
